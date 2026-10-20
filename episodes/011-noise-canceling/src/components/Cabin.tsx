import React from 'react';
import {staticFile} from 'remotion';
import {C} from '../theme';

/**
 * Airplane-cabin side wall with windows. All static except the slow engine
 * shimmer; light shafts are pre-baked PNGs.
 */
export const Cabin: React.FC<{
	id: string;
	w: number;
	h: number;
	windows: {x: number; y: number; s: number; engine?: boolean}[];
	t: number;
	floorY: number;
}> = ({id, w, h, windows, t, floorY}) => {
	const g = (n: string) => `${id}-${n}`;
	return (
		<g>
			<defs>
				<linearGradient id={g('wall')} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#1A2A58" />
					<stop offset="0.6" stopColor="#101C42" />
					<stop offset="1" stopColor="#09122E" />
				</linearGradient>
				<linearGradient id={g('sky')} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#7FD3F7" />
					<stop offset="0.6" stopColor="#CDEBFA" />
					<stop offset="1" stopColor="#FFD9B0" />
				</linearGradient>
				<linearGradient id={g('nacelle')} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0" stopColor="#D5DCEB" />
					<stop offset="0.5" stopColor="#8E9BB8" />
					<stop offset="1" stopColor="#4A5779" />
				</linearGradient>
			</defs>
			{/* curved cabin wall */}
			<path d={`M0 ${h * 0.06} Q ${w / 2} ${-h * 0.04} ${w} ${h * 0.06} L ${w} ${floorY} L 0 ${floorY} Z`} fill={`url(#${g('wall')})`} opacity={0.92} />
			<rect x={0} y={floorY} width={w} height={h - floorY} fill="#050C22" opacity={0.9} />
			{/* overhead bin line */}
			<path d={`M0 ${h * 0.16} Q ${w / 2} ${h * 0.12} ${w} ${h * 0.16}`} stroke="#2B3F78" strokeWidth={6} fill="none" />
			<path d={`M0 ${h * 0.17} Q ${w / 2} ${h * 0.13} ${w} ${h * 0.17}`} stroke={C.cyan} strokeWidth={2} fill="none" opacity={0.35} />
			{windows.map((wd, i) => {
				const ww = 150 * wd.s;
				const wh = 210 * wd.s;
				return (
					<g key={i}>
						<rect x={wd.x - ww / 2 - 18 * wd.s} y={wd.y - wh / 2 - 18 * wd.s} width={ww + 36 * wd.s} height={wh + 36 * wd.s} rx={ww * 0.5} fill="#22356A" />
						<rect x={wd.x - ww / 2} y={wd.y - wh / 2} width={ww} height={wh} rx={ww * 0.46} fill={`url(#${g('sky')})`} />
						{/* cloud bands drifting */}
						<g opacity={0.7}>
							<ellipse cx={wd.x - ww * 0.2 + ((t * 18 * wd.s) % ww)} cy={wd.y + wh * 0.22} rx={ww * 0.5} ry={wh * 0.06} fill="#FFFFFF" opacity={0.65} />
						</g>
						{wd.engine ? (
							<g>
								{/* wing + engine nacelle seen through the window */}
								<path d={`M${wd.x - ww / 2} ${wd.y + wh * 0.18} L ${wd.x + ww / 2} ${wd.y + wh * 0.05} L ${wd.x + ww / 2} ${wd.y + wh * 0.13} L ${wd.x - ww / 2} ${wd.y + wh * 0.28} Z`} fill="#B9C3D9" />
								<rect x={wd.x - ww * 0.32} y={wd.y + wh * 0.2} width={ww * 0.62} height={wh * 0.2} rx={wh * 0.1} fill={`url(#${g('nacelle')})`} />
								<ellipse cx={wd.x - ww * 0.32} cy={wd.y + wh * 0.3} rx={ww * 0.06} ry={wh * 0.1} fill="#2B3654" />
							</g>
						) : null}
						<rect x={wd.x - ww / 2} y={wd.y - wh / 2} width={ww} height={wh} rx={ww * 0.46} fill="none" stroke="#0B1433" strokeWidth={8 * wd.s} />
						<image href={staticFile('beam_warm.png')} x={wd.x - ww * 1.2} y={wd.y - wh * 0.1} width={ww * 2.4} height={wh * 2.6} opacity={0.35} />
					</g>
				);
			})}
		</g>
	);
};

/** Seat back silhouette (for depth behind / in front of the passenger). */
export const Seat: React.FC<{x: number; y: number; s: number; tone?: string}> = ({x, y, s, tone = '#14224A'}) => (
	<g transform={`translate(${x} ${y}) scale(${s})`}>
		<path d="M0 0 C 0 -60 30 -90 80 -90 L 140 -90 C 190 -90 210 -60 210 0 L 230 560 L -20 560 Z" fill={tone} />
		<rect x={20} y={-70} width={170} height={110} rx={40} fill="#1D2E5E" />
		<path d="M30 60 L 190 60" stroke="#2C4280" strokeWidth={4} />
	</g>
);
