import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {C, FONT_BODY, FONT_HEAD, Layout, ramp} from './theme';

export const Backdrop: React.FC<{layout: Layout; grid?: number}> = ({layout, grid = 1}) => (
	<AbsoluteFill>
		<Img src={staticFile(layout === 'landscape' ? 'bg_landscape.jpg' : 'bg_portrait.jpg')} style={{width: '100%', height: '100%'}} />
		{grid > 0 ? (
			<Img
				src={staticFile(layout === 'landscape' ? 'grid_landscape.png' : 'grid_portrait.png')}
				style={{position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: grid}}
			/>
		) : null}
	</AbsoluteFill>
);

/** Pre-rasterized soft light sprite, animated only by transform/opacity. */
export const Glow: React.FC<{
	x: number;
	y: number;
	size: number;
	color?: 'cyan' | 'orange' | 'white';
	opacity?: number;
	sx?: number;
}> = ({x, y, size, color = 'cyan', opacity = 1, sx = 1}) => (
	<Img
		src={staticFile(`glow_${color}.png`)}
		style={{
			position: 'absolute',
			left: x - size / 2,
			top: y - size / 2,
			width: size,
			height: size,
			opacity,
			transform: `scaleX(${sx})`,
			pointerEvents: 'none',
		}}
	/>
);

/** SVG-space glow (image inside an <svg>) so it follows camera transforms. */
export const SvgGlow: React.FC<{x: number; y: number; r: number; color?: 'cyan' | 'orange' | 'white'; opacity?: number}> = ({
	x,
	y,
	r,
	color = 'cyan',
	opacity = 1,
}) => <image href={staticFile(`glow_${color}.png`)} x={x - r} y={y - r} width={r * 2} height={r * 2} opacity={opacity} />;

/** Headline block: kicker + title with one highlighted (orange) phrase. */
export const Headline: React.FC<{
	t: number;
	at: number;
	out?: number;
	kicker?: string;
	title: React.ReactNode;
	layout: Layout;
	align?: 'left' | 'center';
	x?: number;
	y?: number;
	width?: number;
	size?: number;
}> = ({t, at, out, kicker, title, layout, align, x, y, width, size}) => {
	const pin = ramp(t, at, at + 0.5);
	const pout = out === undefined ? 0 : ramp(t, out - 0.35, out);
	const a = pin * (1 - pout);
	if (a <= 0.001) return null;
	const L = layout === 'landscape';
	const al = align ?? (L ? 'left' : 'center');
	const fs = size ?? (L ? 64 : 74);
	return (
		<div
			style={{
				position: 'absolute',
				left: x ?? (L ? 110 : 70),
				top: y ?? (L ? 88 : 210),
				width: width ?? (L ? 820 : 940),
				textAlign: al,
				opacity: a,
				transform: `translateY(${(1 - pin) * 26}px)`,
			}}
		>
			{/* soft local scrim keeps type readable over artwork (plain gradient, no blur) */}
			<div
				style={{
					position: 'absolute',
					left: -70,
					right: -70,
					top: -50,
					bottom: -50,
					background: 'radial-gradient(ellipse at center, rgba(6,14,36,0.78) 0%, rgba(6,14,36,0.5) 45%, rgba(6,14,36,0) 72%)',
					zIndex: -1,
				}}
			/>
			{kicker ? (
				<div
					style={{
						fontFamily: FONT_BODY,
						fontWeight: 700,
						fontSize: L ? 24 : 30,
						letterSpacing: 5,
						color: C.cyan,
						textTransform: 'uppercase',
						marginBottom: L ? 14 : 18,
					}}
				>
					{kicker}
				</div>
			) : null}
			<div
				style={{
					fontFamily: FONT_HEAD,
					fontWeight: 800,
					fontSize: fs,
					lineHeight: 1.08,
					color: C.white,
					letterSpacing: -0.5,
					textShadow: '0 4px 18px rgba(4,10,26,0.85)',
				}}
			>
				{title}
			</div>
		</div>
	);
};

export const Hi: React.FC<{children: React.ReactNode; c?: string}> = ({children, c = C.orange}) => (
	<span style={{color: c}}>{children}</span>
);

/** Small status pill. */
export const Chip: React.FC<{
	t: number;
	at: number;
	out?: number;
	x: number;
	y: number;
	text: string;
	color?: string;
	size?: number;
	anchor?: 'left' | 'center';
}> = ({t, at, out, x, y, text, color = C.cyan, size = 26, anchor = 'left'}) => {
	const pin = ramp(t, at, at + 0.4);
	const pout = out === undefined ? 0 : ramp(t, out - 0.3, out);
	const a = pin * (1 - pout);
	if (a <= 0.001) return null;
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				transform: `translate(${anchor === 'center' ? '-50%' : '0'}, ${(1 - pin) * 12}px) scale(${0.9 + pin * 0.1})`,
				transformOrigin: 'left center',
				opacity: a,
				padding: `${size * 0.42}px ${size * 0.8}px`,
				borderRadius: 999,
				border: `2px solid ${color}`,
				background: 'rgba(8,19,47,0.82)',
				color,
				fontFamily: FONT_BODY,
				fontWeight: 700,
				fontSize: size,
				letterSpacing: 2.5,
				textTransform: 'uppercase',
				whiteSpace: 'nowrap',
			}}
		>
			{text}
		</div>
	);
};

/** Short caption line (the one key fact on screen). */
export const Caption: React.FC<{
	t: number;
	at: number;
	out?: number;
	x: number;
	y: number;
	width: number;
	children: React.ReactNode;
	size?: number;
	align?: 'left' | 'center';
}> = ({t, at, out, x, y, width, children, size = 36, align = 'left'}) => {
	const pin = ramp(t, at, at + 0.45);
	const pout = out === undefined ? 0 : ramp(t, out - 0.3, out);
	const a = pin * (1 - pout);
	if (a <= 0.001) return null;
	return (
		<div
			style={{
				position: 'absolute',
				left: x,
				top: y,
				width,
				opacity: a,
				transform: `translateY(${(1 - pin) * 16}px)`,
				fontFamily: FONT_BODY,
				fontWeight: 600,
				fontSize: size,
				lineHeight: 1.3,
				color: C.white,
				textAlign: align,
				textShadow: '0 3px 12px rgba(4,10,26,0.9)',
			}}
		>
			{children}
		</div>
	);
};

/** SVG callout label with leader line, drawn in SVG coordinates. */
export const SvgLabel: React.FC<{
	t: number;
	at: number;
	out?: number;
	from: [number, number];
	to: [number, number];
	text: string;
	color?: string;
	size?: number;
	anchor?: 'start' | 'end' | 'middle';
}> = ({t, at, out, from, to, text, color = C.cyan, size = 28, anchor = 'start'}) => {
	const pin = ramp(t, at, at + 0.5);
	const pout = out === undefined ? 0 : ramp(t, out - 0.3, out);
	const a = pin * (1 - pout);
	if (a <= 0.001) return null;
	const [x1, y1] = from;
	const [x2, y2] = to;
	const len = Math.hypot(x2 - x1, y2 - y1);
	const dx = anchor === 'end' ? -12 : anchor === 'middle' ? 0 : 12;
	return (
		<g opacity={a}>
			<circle cx={x1} cy={y1} r={7} fill={color} />
			<circle cx={x1} cy={y1} r={13} fill="none" stroke={color} strokeWidth={2} opacity={0.5} />
			<line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={2.5} strokeDasharray={len} strokeDashoffset={len * (1 - pin)} />
			<text
				x={x2 + dx}
				y={y2 + size * 0.35}
				fill={C.white}
				fontFamily={FONT_BODY}
				fontWeight={700}
				fontSize={size}
				letterSpacing={2}
				textAnchor={anchor}
				style={{textTransform: 'uppercase'}}
				stroke={C.navy}
				strokeWidth={6}
				paintOrder="stroke"
			>
				{text}
			</text>
		</g>
	);
};

/** Thin cinematic panel with a rim light, for insets. */
export const Panel: React.FC<{x: number; y: number; w: number; h: number; title?: string; a?: number; color?: string}> = ({
	x,
	y,
	w,
	h,
	title,
	a = 1,
	color = C.cyan,
}) => (
	<g opacity={a}>
		<rect x={x} y={y} width={w} height={h} rx={26} fill="rgba(6,14,36,0.9)" stroke={color} strokeOpacity={0.55} strokeWidth={2.5} />
		<rect x={x + 10} y={y + 10} width={w - 20} height={h - 20} rx={18} fill="none" stroke={color} strokeOpacity={0.12} strokeWidth={1.5} />
		{title ? (
			<text x={x + 30} y={y + 46} fill={color} fontFamily={FONT_BODY} fontWeight={700} fontSize={22} letterSpacing={4}>
				{title.toUpperCase()}
			</text>
		) : null}
	</g>
);
