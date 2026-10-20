import React from 'react';
import {Img, staticFile} from 'remotion';
import {C, FONT} from '../theme';

type Part = string | {hi: string; color?: string};

/** Big editorial headline; `{hi}` parts are highlighted (orange by default). */
export const Headline: React.FC<{
	lines: Part[][];
	x: number;
	y: number;
	size: number;
	opacity?: number;
	align?: 'left' | 'center';
	width?: number;
	rise?: number;
}> = ({lines, x, y, size, opacity = 1, align = 'left', width = 1600, rise = 0}) => (
	<div
		style={{
			position: 'absolute',
			left: align === 'center' ? x - width / 2 : x,
			top: y,
			width,
			textAlign: align,
			fontFamily: FONT,
			fontWeight: 800,
			fontSize: size,
			lineHeight: 1.04,
			letterSpacing: -0.01 * size,
			color: C.white,
			opacity,
			transform: `translateY(${rise}px)`,
			textTransform: 'uppercase',
		}}
	>
		{lines.map((line, i) => (
			<div key={i}>
				{line.map((p, j) =>
					typeof p === 'string' ? (
						<span key={j}>{p}</span>
					) : (
						<span key={j} style={{color: p.color ?? C.orange}}>
							{p.hi}
						</span>
					),
				)}
			</div>
		))}
	</div>
);

/** Small tracked label above a headline. */
export const Kicker: React.FC<{
	text: string;
	x: number;
	y: number;
	size?: number;
	color?: string;
	opacity?: number;
	align?: 'left' | 'center';
	width?: number;
}> = ({text, x, y, size = 30, color = C.cyan, opacity = 1, align = 'left', width = 1200}) => (
	<div
		style={{
			position: 'absolute',
			left: align === 'center' ? x - width / 2 : x,
			top: y,
			width,
			textAlign: align,
			fontFamily: FONT,
			fontWeight: 700,
			fontSize: size,
			letterSpacing: 0.18 * size,
			color,
			opacity,
			textTransform: 'uppercase',
		}}
	>
		{text}
	</div>
);

/** Pre-rasterized glow sprite as an SVG <image>. */
export const Glow: React.FC<{
	color: 'cyan' | 'orange' | 'white';
	cx: number;
	cy: number;
	r: number;
	opacity?: number;
	ry?: number;
}> = ({color, cx, cy, r, opacity = 1, ry}) => (
	<image
		href={staticFile(`glow_${color}.png`)}
		x={cx - r}
		y={cy - (ry ?? r)}
		width={r * 2}
		height={(ry ?? r) * 2}
		opacity={opacity}
		preserveAspectRatio="none"
	/>
);

export const Background: React.FC<{fmt: 'land' | 'short'}> = ({fmt}) => (
	<Img
		src={staticFile(fmt === 'land' ? 'bg_landscape.jpg' : 'bg_shorts.jpg')}
		style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}
	/>
);

/** SVG label: text with an optional leader line. */
export const Tag: React.FC<{
	x: number;
	y: number;
	text: string;
	color?: string;
	size?: number;
	opacity?: number;
	anchor?: 'start' | 'middle' | 'end';
	line?: [number, number];
	weight?: number;
}> = ({x, y, text, color = C.white, size = 26, opacity = 1, anchor = 'start', line, weight = 700}) => (
	<g opacity={opacity}>
		{line ? (
			<>
				<line x1={x} y1={y + size * 0.35} x2={line[0]} y2={line[1]} stroke={color} strokeWidth={2} strokeOpacity={0.7} />
				<circle cx={line[0]} cy={line[1]} r={5} fill={color} />
			</>
		) : null}
		<text
			x={x}
			y={y}
			fill={color}
			fontFamily={FONT}
			fontWeight={weight}
			fontSize={size}
			letterSpacing={size * 0.12}
			textAnchor={anchor}
		>
			{text.toUpperCase()}
		</text>
	</g>
);
