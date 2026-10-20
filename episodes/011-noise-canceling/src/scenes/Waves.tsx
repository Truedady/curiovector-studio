import React from 'react';
import {AbsoluteFill} from 'remotion';
import {curve, edge, mix, ramp, win} from '../anim';
import {Glow, Headline, Kicker, Tag} from '../components/ui';
import {C, Fmt, FONT, SIZE} from '../theme';
import {T} from '../timeline';

/** Pinna glyph marking "your ear" at the end of the sum row. */
const EarGlyph: React.FC<{x: number; y: number; s: number; o: number}> = ({x, y, s, o}) => (
	<g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
		<path d="M-10 -60 C 40 -70 60 -20 40 10 C 25 30 20 40 25 60 C 28 80 0 85 -10 70" fill="none" stroke={C.skin} strokeWidth={12} strokeLinecap="round" />
		<path d="M5 -30 C 25 -30 30 -5 15 5" fill="none" stroke={C.skin} strokeWidth={8} strokeLinecap="round" />
	</g>
);

/** Beat 4: pressure wave, its opposite, and their partial cancellation at the ear. */
export const Waves: React.FC<{fmt: Fmt; t: number}> = ({fmt, t}) => {
	const {w, h} = SIZE[fmt];
	const land = fmt === 'land';
	const L = land
		? {x0: 150, x1: 1480, rows: [360, 610, 860], amp: 82, lambda: 300, earX: 1600}
		: {x0: 90, x1: 990, rows: [650, 900, 0], amp: 72, lambda: 260, earX: 0};
	const K = (Math.PI * 2) / L.lambda;
	const W = Math.PI * 2 * 0.45;
	const ph = (x: number) => K * x - W * t;
	const env = (x: number) => edge(x, L.x0, L.x1, 70);

	const a1 = ramp(t, T.pressure, 0.7);
	const a2 = ramp(t, T.opposite, 0.8);
	const up = ramp(t, T.pushesUp, 0.4);
	const down = ramp(t, T.pullsDown, 0.4);
	const sumIn = ramp(t, T.atEar, 0.6);
	const cancel = ramp(t, T.atEar + 0.8, 2.4); // anti-noise reaching ~85 %
	const named = ramp(t, T.destructive, 0.6);

	const noise = curve(L.x0, L.x1, (x) => L.rows[0] - L.amp * a1 * env(x) * Math.sin(ph(x)));
	const anti = curve(L.x0, L.x1, (x) => L.rows[1] + L.amp * a2 * env(x) * Math.sin(ph(x)));

	// a crest of the noise wave nearest the centre (follows the travelling wave)
	const mid = (L.x0 + L.x1) / 2;
	const crest0 = (Math.PI / 2 + W * t) / K;
	const crest = crest0 + Math.round((mid - crest0) / L.lambda) * L.lambda;

	// air "particles": displacement ∝ cos so density peaks where pressure (sin) peaks
	const dots: React.ReactNode[] = [];
	for (let i = 0; i <= 54; i++) {
		const x = L.x0 + ((L.x1 - L.x0) * i) / 54;
		const dx = 13 * Math.cos(ph(x)) * env(x);
		for (let r = 0; r < 3; r++) {
			const y = L.rows[0] - (land ? 165 : 150) + r * 22;
			dots.push(<circle key={`${i}-${r}`} cx={x + dx} cy={y} r={4.5} fill={C.white} opacity={0.65 * a1} />);
		}
	}

	const label = (x: number, y: number, text: string, color: string, o: number) => (
		<Tag x={x} y={y} text={text} color={color} size={land ? 26 : 30} opacity={o} />
	);

	// ---- landscape sum row / shorts comparison
	const sumRow = (y: number, x0: number, x1: number, amp: number, k: number, residual: number, constructive = false) => {
		const e = (x: number) => edge(x, x0, x1, 60);
		const p = (x: number) => k * x - W * t;
		const n = curve(x0, x1, (x) => y - amp * e(x) * Math.sin(p(x)), 100);
		const a = curve(x0, x1, (x) => y - (constructive ? 1 : -1) * amp * residual * e(x) * Math.sin(p(x)), 100);
		const s = curve(x0, x1, (x) => y - amp * (constructive ? 2 : 1 - residual) * e(x) * Math.sin(p(x)) * 0.9, 100);
		return (
			<g>
				<path d={n} stroke={C.orange} strokeWidth={3} fill="none" opacity={0.45} />
				<path d={a} stroke={constructive ? C.orange : C.cyan} strokeWidth={3} fill="none" opacity={0.45} />
				<path d={s} stroke={C.white} strokeWidth={7} fill="none" strokeLinecap="round" />
			</g>
		);
	};

	return (
		<AbsoluteFill>
			<svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{position: 'absolute'}}>
				{/* axes */}
				{L.rows.slice(0, land ? 3 : 2).map((y, i) => (
					<line key={i} x1={L.x0} y1={y} x2={L.x1} y2={y} stroke="#2E4180" strokeWidth={2} strokeDasharray="6 10" opacity={i === 2 ? sumIn : i === 1 ? a2 : a1} />
				))}
				{dots}
				<path d={noise} stroke={C.orange} strokeWidth={22} fill="none" opacity={0.15} />
				<path d={noise} stroke={C.orange} strokeWidth={9} fill="none" strokeLinecap="round" />
				<g opacity={a2}>
					<path d={anti} stroke={C.cyan} strokeWidth={22} fill="none" opacity={0.15} />
					<path d={anti} stroke={C.cyan} strokeWidth={9} fill="none" strokeLinecap="round" />
				</g>
				{label(L.x0, L.rows[0] - (land ? 205 : 190), 'noise · air pressure', C.orange, a1)}
				{label(L.x0, L.rows[1] - (land ? 115 : 105), 'anti-noise · the opposite', C.cyan, a2)}
				{/* pushes up / pulls down markers on a moving crest */}
				<g opacity={up}>
					<line x1={crest} y1={L.rows[0] - L.amp - 20} x2={crest} y2={L.rows[1] + L.amp + 20} stroke={C.white} strokeWidth={2} strokeDasharray="4 8" opacity={0.7 * down + 0.3} />
					<circle cx={crest} cy={L.rows[0] - L.amp} r={12} fill={C.orange} />
					<path d={`M${crest + 30} ${L.rows[0] - L.amp + 20} l0 -46 m-14 14 l14 -14 l14 14`} stroke={C.orange} strokeWidth={5} fill="none" strokeLinecap="round" />
					<text x={crest + 60} y={L.rows[0] - L.amp - 2} fill={C.orange} fontFamily={FONT} fontWeight={800} fontSize={land ? 30 : 32} letterSpacing={3}>
						PUSHES UP
					</text>
				</g>
				<g opacity={down}>
					<circle cx={crest} cy={L.rows[1] + L.amp * a2} r={12} fill={C.cyan} />
					<path d={`M${crest + 30} ${L.rows[1] + L.amp - 20} l0 46 m-14 -14 l14 14 l14 -14`} stroke={C.cyan} strokeWidth={5} fill="none" strokeLinecap="round" />
					<text x={crest + 60} y={L.rows[1] + L.amp + 12} fill={C.cyan} fontFamily={FONT} fontWeight={800} fontSize={land ? 30 : 32} letterSpacing={3}>
						PULLS DOWN
					</text>
				</g>
				{land ? (
					<g opacity={sumIn}>
						<Glow color="cyan" cx={L.earX} cy={L.rows[2]} r={200} opacity={0.4 * cancel} />
						{sumRow(L.rows[2], L.x0, L.x1, L.amp, K, mix(0, 0.85, cancel))}
						<EarGlyph x={L.earX + 40} y={L.rows[2]} s={1.3} o={1} />
						{label(L.x0, L.rows[2] - 120, 'at your ear: noise + anti-noise', C.white, 1)}
						<text x={L.x1 + 20} y={L.rows[0] + 12} fill={C.mute} fontFamily={FONT} fontWeight={800} fontSize={56}>+</text>
						<text x={L.x1 + 20} y={L.rows[1] + 110} fill={C.mute} fontFamily={FONT} fontWeight={800} fontSize={56}>=</text>
						<text x={L.earX - 10} y={L.rows[2] + 140} fill={C.cyan} fontFamily={FONT} fontWeight={800} fontSize={28} letterSpacing={3} textAnchor="middle" opacity={cancel}>
							QUIETER
						</text>
					</g>
				) : (
					<g opacity={sumIn}>
						{/* stacked comparison: in step vs opposite */}
						<rect x={60} y={1070} width={960} height={210} rx={28} fill="#0E1A3E" stroke="#2E4180" strokeWidth={2} opacity={0.9} />
						<text x={100} y={1122} fill={C.mute} fontFamily={FONT} fontWeight={800} fontSize={30} letterSpacing={3}>
							IN STEP → LOUDER
						</text>
						<g opacity={0.6}>{sumRow(1205, 110, 970, 28, (Math.PI * 2) / 200, 1, true)}</g>
						<rect x={60} y={1300} width={960} height={230} rx={28} fill="#0E1A3E" stroke={C.cyan} strokeWidth={3} />
						<Glow color="cyan" cx={540} cy={1420} r={330} ry={140} opacity={0.25 * cancel} />
						<text x={100} y={1352} fill={C.cyan} fontFamily={FONT} fontWeight={800} fontSize={30} letterSpacing={3}>
							OPPOSITE → QUIETER AT YOUR EAR
						</text>
						{sumRow(1440, 110, 970, 56, (Math.PI * 2) / 200, mix(0, 0.85, cancel))}
					</g>
				)}
			</svg>
			{land ? (
				<>
					<Kicker x={100} y={60} text="Picture the air" size={28} opacity={win(t, T.pressure, T.destructive, 0.4)} />
					<Headline x={96} y={98} size={60} width={1700} opacity={win(t, T.pressure, T.opposite, 0.4)} lines={[['Sound = air pressure going ', {hi: 'up'}, ' and down']]} />
					<Headline x={96} y={98} size={60} width={1700} opacity={win(t, T.opposite, T.atEar, 0.4)} lines={[['Now add the ', {hi: 'exact opposite', color: C.cyan}]]} />
					<Headline x={96} y={98} size={60} width={1700} opacity={win(t, T.atEar, T.destructive, 0.4)} lines={[['They ', {hi: 'partly cancel', color: C.cyan}, ' at your ear']]} />
					<Kicker x={100} y={60} text="That's called" size={28} opacity={named} />
					<Headline x={96} y={98} size={72} width={1700} opacity={named} lines={[[{hi: 'Destructive'}, ' interference']]} />
				</>
			) : (
				<>
					<Kicker x={540} y={200} text="Picture the air" size={36} align="center" width={900} opacity={win(t, T.pressure, T.destructive, 0.4)} />
					<Headline x={540} y={255} size={74} width={900} align="center" opacity={win(t, T.pressure, T.opposite, 0.4)} lines={[['Pressure goes'], [{hi: 'up'}, ' and down']]} />
					<Headline x={540} y={255} size={74} width={900} align="center" opacity={win(t, T.opposite, T.atEar, 0.4)} lines={[['Now add the'], [{hi: 'exact opposite', color: C.cyan}]]} />
					<Headline x={540} y={255} size={74} width={900} align="center" opacity={win(t, T.atEar, T.destructive, 0.4)} lines={[['They ', {hi: 'partly', color: C.cyan}], [{hi: 'cancel', color: C.cyan}, ' at your ear']]} />
					<Kicker x={540} y={200} text="That's called" size={36} align="center" width={900} opacity={named} />
					<Headline x={540} y={255} size={84} width={900} align="center" opacity={named} lines={[[{hi: 'Destructive'}], ['interference']]} />
				</>
			)}
		</AbsoluteFill>
	);
};
