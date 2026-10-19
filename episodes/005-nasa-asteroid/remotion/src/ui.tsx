import React from 'react';
import {C, FONT, prog, useTime, window01} from './theme';

/** "Hello *world*" → orange highlight on starred words. */
const spans = (line: string) =>
	line.split(/(\*[^*]+\*)/).filter(Boolean).map((part, i) =>
		part.startsWith('*') ? (
			<tspan key={i} fill={C.orange}>
				{part.slice(1, -1)}
			</tspan>
		) : (
			<tspan key={i}>{part}</tspan>
		),
	);

type HeadlineProps = {
	x: number;
	y: number;
	lines: string[];
	size: number;
	at: number;
	until?: number;
	anchor?: 'start' | 'middle' | 'end';
	weight?: number;
	color?: string;
	lineHeight?: number;
};

/** Bold white headline; each line rises in with a short stagger. */
export const Headline: React.FC<HeadlineProps> = ({x, y, lines, size, at, until = 9999, anchor = 'start', weight = 800, color = C.white, lineHeight = 1.08}) => {
	const t = useTime();
	const out = 1 - prog(t, until - 0.3, 0.3);
	if (t < at - 0.05 || out <= 0) return null;
	return (
		<g>
			{lines.map((ln, i) => {
				const k = prog(t, at + i * 0.12, 0.55);
				return (
					<text
						key={i}
						x={x}
						y={y + i * size * lineHeight + (1 - k) * size * 0.35}
						fontFamily={FONT}
						fontWeight={weight}
						fontSize={size}
						fill={color}
						textAnchor={anchor}
						letterSpacing={-size * 0.02}
						opacity={k * out}
						style={{paintOrder: 'stroke'}}
						stroke={C.navyDeep}
						strokeOpacity={0.35}
						strokeWidth={size * 0.06}
					>
						{spans(ln)}
					</text>
				);
			})}
		</g>
	);
};

export const Kicker: React.FC<{x: number; y: number; text: string; at: number; until?: number; anchor?: 'start' | 'middle'; size?: number; color?: string}> = ({
	x,
	y,
	text,
	at,
	until = 9999,
	anchor = 'start',
	size = 26,
	color = C.cyan,
}) => {
	const t = useTime();
	const k = window01(t, at, until);
	if (k <= 0) return null;
	const barX = anchor === 'middle' ? x - text.length * size * 0.36 - 40 : x;
	const tx = anchor === 'middle' ? x + 20 : x + 44;
	return (
		<g opacity={k}>
			<rect x={barX} y={y - size * 0.45} width={30 * k} height={4} fill={color} />
			<text x={tx} y={y} fontFamily={FONT} fontWeight={700} fontSize={size} letterSpacing={size * 0.22} fill={color} textAnchor={anchor}>
				{text}
			</text>
		</g>
	);
};

/** Rounded label chip. */
export const Chip: React.FC<{x: number; y: number; text: string; at: number; until?: number; size?: number; color?: string; filled?: boolean; anchor?: 'start' | 'middle'}> = ({
	x,
	y,
	text,
	at,
	until = 9999,
	size = 28,
	color = C.orange,
	filled = false,
	anchor = 'start',
}) => {
	const t = useTime();
	const k = window01(t, at, until);
	if (k <= 0) return null;
	const w = text.length * size * 0.74 + size * 1.6;
	const h = size * 1.9;
	const x0 = anchor === 'middle' ? x - w / 2 : x;
	return (
		<g opacity={k} transform={`translate(0,${(1 - k) * 12})`}>
			<rect x={x0} y={y - h / 2} width={w} height={h} rx={h / 2} fill={filled ? color : 'rgba(8,19,47,0.78)'} stroke={color} strokeWidth={2.5} />
			<text
				x={x0 + w / 2}
				y={y + size * 0.36}
				fontFamily={FONT}
				fontWeight={800}
				fontSize={size}
				letterSpacing={size * 0.06}
				fill={filled ? C.navy : color}
				textAnchor="middle"
			>
				{text}
			</text>
		</g>
	);
};

/** Small explanatory text (muted). */
export const Note: React.FC<{x: number; y: number; text: string; at: number; until?: number; size?: number; anchor?: 'start' | 'middle' | 'end'; color?: string; weight?: number}> = ({
	x,
	y,
	text,
	at,
	until = 9999,
	size = 24,
	anchor = 'start',
	color = C.muted,
	weight = 500,
}) => {
	const t = useTime();
	const k = window01(t, at, until);
	if (k <= 0) return null;
	return (
		<text x={x} y={y} fontFamily={FONT} fontWeight={weight} fontSize={size} fill={color} textAnchor={anchor} opacity={k}>
			{spans(text)}
		</text>
	);
};

/** Path drawn on progressively (0..1). */
export const DrawPath: React.FC<{d: string; k: number; stroke: string; width: number; dash?: string; marker?: string; opacity?: number; len?: number}> = ({
	d,
	k,
	stroke,
	width,
	dash,
	marker,
	opacity = 1,
	len = 3000,
}) => {
	if (k <= 0) return null;
	if (dash) {
		return (
			<g>
				<defs>
					<mask id={`m${d.length}${len}${stroke.slice(1)}`}>
						<path d={d} stroke="#fff" strokeWidth={width * 3} fill="none" strokeDasharray={`${len * k} ${len}`} />
					</mask>
				</defs>
				<path
					d={d}
					stroke={stroke}
					strokeWidth={width}
					fill="none"
					strokeDasharray={dash}
					opacity={opacity}
					strokeLinecap="round"
					mask={`url(#m${d.length}${len}${stroke.slice(1)})`}
				/>
			</g>
		);
	}
	return (
		<path
			d={d}
			stroke={stroke}
			strokeWidth={width}
			fill="none"
			strokeDasharray={`${len * k} ${len}`}
			opacity={opacity}
			strokeLinecap="round"
			markerEnd={k > 0.98 && marker ? `url(#${marker})` : undefined}
		/>
	);
};

/** Straight arrow that grows from (x1,y1) to (x2,y2). */
export const Arrow: React.FC<{x1: number; y1: number; x2: number; y2: number; k: number; color: string; width?: number}> = ({x1, y1, x2, y2, k, color, width = 10}) => {
	if (k <= 0) return null;
	const ex = x1 + (x2 - x1) * k;
	const ey = y1 + (y2 - y1) * k;
	const a = Math.atan2(y2 - y1, x2 - x1);
	const hl = width * 2.6;
	const hw = width * 1.6;
	const bx = ex - Math.cos(a) * hl;
	const by = ey - Math.sin(a) * hl;
	return (
		<g>
			<line x1={x1} y1={y1} x2={bx} y2={by} stroke={color} strokeWidth={width} strokeLinecap="round" />
			<path
				d={`M${ex},${ey} L${bx - Math.sin(a) * hw},${by + Math.cos(a) * hw} L${bx + Math.sin(a) * hw},${by - Math.cos(a) * hw} Z`}
				fill={color}
			/>
		</g>
	);
};

/** Scene wrapper: cross-fades between neighbouring scenes. */
export const Scene: React.FC<{from: number; to: number; children: React.ReactNode; fade?: number}> = ({from, to, children, fade = 0.4}) => {
	const t = useTime();
	if (t < from - fade || t > to + fade) return null;
	const k = from <= 0 ? Math.min(1, 1 - prog(t, to, fade)) : window01(t, from - fade / 2, to + fade / 2, fade);
	return <g opacity={k}>{children}</g>;
};
