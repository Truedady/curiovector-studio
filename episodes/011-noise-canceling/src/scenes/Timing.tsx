import React from 'react';
import {AbsoluteFill} from 'remotion';
import {curve, edge, mix, ramp, rampIO, win} from '../anim';
import {Glow, Headline, Kicker, Tag} from '../components/ui';
import {C, Fmt, FONT, SIZE} from '../theme';
import {T} from '../timeline';

const steady = (u: number) => Math.sin(Math.PI * 2 * 1.3 * u);
// irregular bursts (a voice-like syllable train + sharp clicks), repeating every 3 s
const sudden = (u: number) => {
	const m = ((u % 3) + 3) % 3;
	const voice = Math.exp(-(((m - 0.7) / 0.22) ** 2)) * Math.sin(Math.PI * 2 * 5.5 * m) * (0.7 + 0.3 * Math.sin(m * 21));
	const click1 = Math.exp(-(((m - 1.7) / 0.035) ** 2)) * 1.25;
	const click2 = -Math.exp(-(((m - 2.35) / 0.03) ** 2)) * 1.1;
	const voice2 = Math.exp(-(((m - 2.0) / 0.12) ** 2)) * Math.sin(Math.PI * 2 * 8 * m) * 0.8;
	return voice + click1 + click2 + voice2;
};

/** One comparison panel: noise, late/early anti-noise and what is left. */
const Panel: React.FC<{
	x: number;
	y: number;
	w: number;
	h: number;
	t: number;
	o: number;
	kind: 'steady' | 'sudden';
	fs: number;
}> = ({x, y, w, h, t, o, kind, fs}) => {
	const fn = kind === 'steady' ? steady : sudden;
	const lag = kind === 'steady' ? 0 : 0.09; // the system reacts a bit late to surprises
	const gain = kind === 'steady' ? 0.9 : 0.8;
	const gx0 = x + 40;
	const gx1 = x + w - 40;
	const pxs = (gx1 - gx0) / 3; // 3 seconds across
	const uAt = (xx: number) => t - (gx1 - xx) / pxs;
	const amp = h * 0.13;
	const yN = y + h * 0.42;
	const yR = y + h * 0.78;
	const e = (xx: number) => edge(xx, gx0, gx1, 40);
	const n = curve(gx0, gx1, (xx) => yN - amp * e(xx) * fn(uAt(xx)), 220);
	const a = curve(gx0, gx1, (xx) => yN + amp * gain * e(xx) * fn(uAt(xx) - lag), 220);
	const r = curve(gx0, gx1, (xx) => yR - amp * e(xx) * (fn(uAt(xx)) - gain * fn(uAt(xx) - lag)), 220);
	const good = kind === 'steady';
	return (
		<g opacity={o}>
			<rect x={x} y={y} width={w} height={h} rx={30} fill="#0C1840" stroke={good ? C.cyan : C.orange} strokeWidth={3} />
			<text x={x + 40} y={y + 62} fill={C.white} fontFamily={FONT} fontWeight={800} fontSize={fs} letterSpacing={3}>
				{good ? 'STEADY HUM' : 'SUDDEN SOUNDS'}
			</text>
			<text x={x + 40} y={y + 62 + fs * 1.15} fill={C.mute} fontFamily={FONT} fontWeight={600} fontSize={fs * 0.62}>
				{good ? 'engines · air conditioning' : 'voices · sharp clicks · surprises'}
			</text>
			<text x={x + w - 40} y={y + 62} fill={good ? C.cyan : C.orange} fontFamily={FONT} fontWeight={800} fontSize={fs} letterSpacing={3} textAnchor="end">
				{good ? 'EASIER' : 'HARDER'}
			</text>
			<path d={n} stroke={C.orange} strokeWidth={5} fill="none" />
			<path d={a} stroke={C.cyan} strokeWidth={4} fill="none" opacity={0.85} />
			<line x1={gx0} y1={yR} x2={gx1} y2={yR} stroke="#2E4180" strokeWidth={2} strokeDasharray="5 9" />
			<path d={r} stroke={C.white} strokeWidth={5} fill="none" strokeLinecap="round" />
			<Tag x={gx0} y={yR - amp - 14} text="left over at your ear" size={fs * 0.55} color={C.white} opacity={0.8} />
		</g>
	);
};

/** Beat 6: measure → predict → play, and why steady sounds are easier. */
export const Timing: React.FC<{fmt: Fmt; t: number}> = ({fmt, t}) => {
	const {w, h} = SIZE[fmt];
	const land = fmt === 'land';
	const nodes = [
		{label: 'MEASURE', at: T.measure, c: C.orange},
		{label: 'PREDICT', at: T.predict, c: C.cyan},
		{label: 'PLAY', at: T.play, c: C.cyan},
	];
	const lift = rampIO(t, T.steady - 0.4, 0.9);
	const N = land
		? {y: mix(420, 250, lift), xs: [500, 960, 1420], r: mix(86, 62, lift)}
		: {y: 600, xs: [210, 540, 870], r: 78};
	const pulse = (t * 0.8) % 1;

	// timing strip before the panels: anti-noise slides from late to on-time
	const strip = win(t, T.measure + 0.2, T.steady, 0.5);
	const align = rampIO(t, T.play + 0.3, 1.4);
	const S = land ? {x0: 360, x1: 1560, y: 720, amp: 80} : {x0: 110, x1: 970, y: 1050, amp: 80};
	const lamS = land ? 280 : 240;
	const k = (Math.PI * 2) / lamS;
	const off = mix(lamS * 0.32, 0, align);
	const sN = curve(S.x0, S.x1, (x) => S.y - S.amp * edge(x, S.x0, S.x1, 60) * Math.sin(k * x - t * 3), 120);
	const sA = curve(S.x0, S.x1, (x) => S.y + S.amp * edge(x, S.x0, S.x1, 60) * Math.sin(k * (x - off) - t * 3), 120);
	const sR = curve(S.x0, S.x1, (x) => S.y + (land ? 230 : 230) - S.amp * edge(x, S.x0, S.x1, 60) * (Math.sin(k * x - t * 3) - Math.sin(k * (x - off) - t * 3)) * 0.6, 120);

	const p1 = ramp(t, T.steady, 0.6);
	const p2 = ramp(t, T.sudden, 0.6);

	const icon = (i: number, x: number, y: number, s: number, c: string) => {
		if (i === 0)
			return (
				<g stroke={c} strokeWidth={6} fill="none" strokeLinecap="round">
					<rect x={x - 14 * s} y={y - 30 * s} width={28 * s} height={44 * s} rx={14 * s} />
					<path d={`M${x - 26 * s} ${y} C ${x - 26 * s} ${y + 30 * s} ${x + 26 * s} ${y + 30 * s} ${x + 26 * s} ${y}`} />
					<line x1={x} y1={y + 24 * s} x2={x} y2={y + 36 * s} />
				</g>
			);
		if (i === 1)
			return (
				<g stroke={c} strokeWidth={6} fill="none" strokeLinecap="round">
					<path d={`M${x - 34 * s} ${y + 6 * s} C ${x - 20 * s} ${y - 30 * s} ${x - 6 * s} ${y - 30 * s} ${x + 4 * s} ${y + 6 * s}`} />
					<path d={`M${x + 4 * s} ${y + 6 * s} C ${x + 12 * s} ${y + 30 * s} ${x + 24 * s} ${y + 30 * s} ${x + 34 * s} ${y + 2 * s}`} strokeDasharray={`${6 * s} ${8 * s}`} />
				</g>
			);
		return (
			<g stroke={c} strokeWidth={6} fill="none" strokeLinejoin="round" strokeLinecap="round">
				<path d={`M${x - 30 * s} ${y - 12 * s} L${x - 14 * s} ${y - 12 * s} L${x + 6 * s} ${y - 30 * s} L${x + 6 * s} ${y + 30 * s} L${x - 14 * s} ${y + 12 * s} L${x - 30 * s} ${y + 12 * s} Z`} />
				<path d={`M${x + 18 * s} ${y - 14 * s} C ${x + 28 * s} ${y - 4 * s} ${x + 28 * s} ${y + 4 * s} ${x + 18 * s} ${y + 14 * s}`} />
			</g>
		);
	};

	return (
		<AbsoluteFill>
			<svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{position: 'absolute'}}>
				{/* pipeline */}
				{nodes.map((n, i) => {
					const o = ramp(t, n.at, 0.5);
					const x = N.xs[i];
					return (
						<g key={n.label}>
							{i < 2 ? (
								<g>
									<line x1={x + N.r + 10} y1={N.y} x2={N.xs[i + 1] - N.r - 10} y2={N.y} stroke="#2E4180" strokeWidth={5} />
									{ramp(t, nodes[i + 1].at, 0.3) > 0.5 ? (
										<circle cx={mix(x + N.r + 10, N.xs[i + 1] - N.r - 10, pulse)} cy={N.y} r={9} fill={nodes[i + 1].c} opacity={Math.sin(Math.PI * pulse)} />
									) : null}
								</g>
							) : null}
							<Glow color={i === 0 ? 'orange' : 'cyan'} cx={x} cy={N.y} r={N.r * 2.2} opacity={0.45 * o} />
							<circle cx={x} cy={N.y} r={N.r} fill="#0B1638" stroke={o > 0.3 ? n.c : '#2E4180'} strokeWidth={5} />
							{icon(i, x, N.y, N.r / 86, o > 0.3 ? n.c : '#4A5E9C')}
							<text x={x} y={N.y + N.r + (land ? 50 : 52)} fill={o > 0.3 ? C.white : C.mute} opacity={0.35 + 0.65 * o} fontFamily={FONT} fontWeight={800} fontSize={land ? 32 : 36} letterSpacing={4} textAnchor="middle">
								{n.label}
							</text>
						</g>
					);
				})}
				{/* timing strip */}
				<g opacity={strip * ramp(t, T.measure + 0.6, 0.5)}>
					<path d={sN} stroke={C.orange} strokeWidth={7} fill="none" />
					<path d={sA} stroke={C.cyan} strokeWidth={7} fill="none" />
					<path d={sR} stroke={C.white} strokeWidth={6} fill="none" />
					<Tag x={S.x0} y={S.y - S.amp - 40} text={align > 0.5 ? 'on time: they cancel' : 'too late: they don’t'} size={land ? 30 : 34} color={align > 0.5 ? C.cyan : C.orange} />
					<Tag x={S.x0} y={S.y + 150} text="left over" size={land ? 24 : 28} color={C.mute} />
				</g>
				{land ? (
					<>
						<Panel x={100} y={440} w={840} h={540} t={t} o={p1} kind="steady" fs={38} />
						<Panel x={980} y={440} w={840} h={540} t={t} o={p2} kind="sudden" fs={38} />
					</>
				) : (
					<>
						<Panel x={60} y={790} w={960} h={360} t={t} o={p1} kind="steady" fs={38} />
						<Panel x={60} y={1180} w={960} h={360} t={t} o={p2} kind="sudden" fs={38} />
					</>
				)}
			</svg>
			{land ? (
				<>
					<Kicker x={100} y={60} text="Here's the hard part" size={28} opacity={ramp(t, T.interesting, 0.4)} />
					<Headline x={96} y={98} size={60} width={1700} opacity={win(t, T.interesting, T.steady, 0.4)} lines={[['Exactly the ', {hi: 'right moment'}]]} />
					<Headline x={96} y={98} size={60} width={1700} opacity={win(t, T.steady, T.sudden, 0.4)} lines={[[{hi: 'Steady', color: C.cyan}, ' sounds are easier']]} />
					<Headline x={96} y={98} size={60} width={1700} opacity={ramp(t, T.sudden, 0.4)} lines={[[{hi: 'Sudden'}, ' sounds slip through']]} />
				</>
			) : (
				<>
					<Kicker x={540} y={200} text="Here's the hard part" size={36} align="center" width={900} opacity={ramp(t, T.interesting, 0.4)} />
					<Headline x={540} y={255} size={80} width={900} align="center" opacity={win(t, T.interesting, T.steady, 0.4)} lines={[['Exactly the'], [{hi: 'right moment'}]]} />
					<Headline x={540} y={255} size={80} width={900} align="center" opacity={win(t, T.steady, T.sudden, 0.4)} lines={[[{hi: 'Steady', color: C.cyan}, ' sounds'], ['are easier']]} />
					<Headline x={540} y={255} size={80} width={900} align="center" opacity={ramp(t, T.sudden, 0.4)} lines={[[{hi: 'Sudden'}, ' sounds'], ['slip through']]} />
				</>
			)}
		</AbsoluteFill>
	);
};

