import React from 'react';
import {AbsoluteFill} from 'remotion';
import {curve, edge, ramp, rampIO, mix, win} from '../anim';
import {Cabin, Seat} from '../components/Cabin';
import {EAR, Passenger} from '../components/Passenger';
import {Glow, Headline, Kicker, Tag} from '../components/ui';
import {C, Fmt, SIZE} from '../theme';
import {T} from '../timeline';
import {EngineRings} from './Hook';

/** Beat 5: the cancellation is local — the cabin is still full of noise. */
export const Local: React.FC<{fmt: Fmt; t: number}> = ({fmt, t}) => {
	const {w, h} = SIZE[fmt];
	const land = fmt === 'land';
	const P = land ? {px: 700, py: 360, ps: 0.72} : {px: 150, py: 820, ps: 0.9};
	const ear = {x: P.px + EAR.x * P.ps, y: P.py + EAR.y * P.ps};
	const windows = land
		? [
				{x: 170, y: 470, s: 0.9, engine: true},
				{x: 560, y: 470, s: 0.8},
				{x: 1360, y: 470, s: 0.8},
				{x: 1760, y: 470, s: 0.8},
			]
		: [
				{x: 170, y: 760, s: 0.95, engine: true},
				{x: 900, y: 760, s: 0.85},
			];
	const pull = rampIO(t, T.notVanished - 0.3, 1.6);
	const sc = mix(1.18, 1, pull);
	const inset = ramp(t, T.lessReaching, 0.6);
	const K = (Math.PI * 2) / (land ? 170 : 150);
	const Wv = Math.PI * 2 * 1.1;
	const strands = [-90, 0, 90].map((o, i) =>
		curve(0, w, (x) => ear.y + o + (i === 1 ? 62 : 34) * edge(x, 120, w, 140) * Math.sin(K * x - Wv * t + i), 160),
	);
	// inset: what reaches the eardrum
	const I = land ? {x: 1530, y: 790, r: 170} : {x: 540, y: 1420, r: 150};
	const smallWave = curve(I.x - I.r + 30, I.x + I.r - 30, (x) => I.y + 14 * Math.sin(K * 2 * x - Wv * t), 60);
	const bigGhost = curve(I.x - I.r + 30, I.x + I.r - 30, (x) => I.y + 60 * Math.sin(K * 2 * x - Wv * t), 60);

	return (
		<AbsoluteFill>
			<svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{position: 'absolute'}}>
				<g transform={`translate(${ear.x} ${ear.y}) scale(${sc}) translate(${-ear.x} ${-ear.y})`}>
					<Cabin id={`lc${fmt}`} w={w} h={h} windows={windows} t={t} floorY={land ? 1000 : 1840} />
					<EngineRings x={windows[0].x} y={windows[0].y + 50} t={t} hum={1} />
					{strands.map((d, i) => (
						<path key={i} d={d} stroke={C.orange} strokeWidth={i === 1 ? 8 : 4} fill="none" opacity={i === 1 ? 0.95 : 0.45} />
					))}
					<Seat x={P.px + 80 * P.ps} y={P.py + 300 * P.ps} s={0.85 * P.ps} />
					{land ? <Seat x={1250} y={620} s={0.62} tone="#111D42" /> : null}
					<g transform={`translate(${P.px} ${P.py}) scale(${P.ps})`}>
						<Passenger id={`lc${fmt}p`} ancOn={1} cupGlow={0.7} />
					</g>
					<Glow color="cyan" cx={ear.x} cy={ear.y} r={land ? 150 : 180} opacity={0.75} />
					<circle cx={ear.x} cy={ear.y} r={land ? 118 : 140} fill="none" stroke={C.cyan} strokeWidth={3} strokeDasharray="8 10" opacity={0.8} />
					<Tag x={ear.x} y={ear.y - (land ? 140 : 165)} text="quiet zone" anchor="middle" color={C.cyan} size={land ? 24 : 30} />
					<Tag x={land ? 1300 : 760} y={ear.y - (land ? 120 : 330)} text="noise still here" anchor="middle" color={C.orange} size={land ? 26 : 32} opacity={ramp(t, T.notVanished + 0.6, 0.5)} />
				</g>
				{/* inset: at the eardrum */}
				<g opacity={inset}>
					<line x1={ear.x + 40} y1={ear.y + 60} x2={I.x - I.r * 0.7} y2={I.y - I.r * 0.7} stroke={C.cyan} strokeWidth={3} opacity={0.7} />
					<circle cx={I.x} cy={I.y} r={I.r} fill="#0B1638" stroke={C.cyan} strokeWidth={4} />
					<path d={bigGhost} stroke={C.orange} strokeWidth={3} fill="none" opacity={0.3} strokeDasharray="6 8" />
					<path d={smallWave} stroke={C.white} strokeWidth={7} fill="none" strokeLinecap="round" />
					<Tag x={I.x} y={I.y + I.r + 46} text="at your eardrum" anchor="middle" color={C.white} size={land ? 26 : 30} />
				</g>
			</svg>
			{land ? (
				<>
					<Kicker x={100} y={78} text="Zoom out" size={28} opacity={ramp(t, T.notVanished, 0.4)} />
					<Headline x={96} y={118} size={62} width={1600} opacity={win(t, T.notVanished, T.lessReaching, 0.4)} lines={[['The cabin is still ', {hi: 'full of noise'}]]} />
					<Headline x={96} y={118} size={62} width={1600} opacity={ramp(t, T.lessReaching, 0.4)} lines={[['Just ', {hi: 'less of it', color: C.cyan}, ' reaches your eardrum']]} />
				</>
			) : (
				<>
					<Kicker x={540} y={200} text="Zoom out" size={36} align="center" width={900} opacity={ramp(t, T.notVanished, 0.4)} />
					<Headline x={540} y={255} size={80} width={900} align="center" opacity={win(t, T.notVanished, T.lessReaching, 0.4)} lines={[['The cabin is still'], [{hi: 'full of noise'}]]} />
					<Headline x={540} y={255} size={80} width={900} align="center" opacity={ramp(t, T.lessReaching, 0.4)} lines={[['Just ', {hi: 'less of it', color: C.cyan}], ['reaches your ear']]} />
				</>
			)}
		</AbsoluteFill>
	);
};
