import React from 'react';
import {AbsoluteFill} from 'remotion';
import {clamp, curve, edge, mix, ramp, win} from '../anim';
import {Cabin, Seat} from '../components/Cabin';
import {EAR, Passenger} from '../components/Passenger';
import {Glow, Headline, Kicker, Tag} from '../components/ui';
import {C, Fmt, FONT, SIZE} from '../theme';
import {T} from '../timeline';

// Shared staging for the cabin + passenger beats (scenes 1 and 2).
export const stage = (fmt: Fmt) =>
	fmt === 'land'
		? {
				px: 330,
				py: 190,
				ps: 1.0,
				windows: [
					{x: 170, y: 470, s: 1.1, engine: true},
					{x: 1830, y: 760, s: 0.55},
				],
				floorY: 1000,
				seat: {x: 395, y: 470, s: 0.85},
			}
		: {
				px: 70,
				py: 690,
				ps: 1.3,
				windows: [
					{x: 170, y: 720, s: 1.2, engine: true},
					{x: 930, y: 1440, s: 0.75},
				],
				floorY: 1840,
				seat: {x: 260, y: 1010, s: 1.0},
			};

export const earPos = (fmt: Fmt) => {
	const s = stage(fmt);
	return {x: s.px + EAR.x * s.ps, y: s.py + EAR.y * s.ps};
};

/** Engine noise travelling from the window to the ear; quieter at the ear once ANC is on. */
export const NoiseToEar: React.FC<{
	fmt: Fmt;
	t: number;
	amp: number;
	ear: {x: number; y: number};
	cancel: number; // 0..1 how much is cancelled near the ear
	anti: number; // 0..1 cyan anti-noise visibility
	startX: number;
}> = ({fmt, t, amp, ear, cancel, anti, startX}) => {
	const k = (Math.PI * 2) / (fmt === 'land' ? 150 : 130);
	const w = Math.PI * 2 * 1.1;
	const x1 = ear.x - 70;
	const zone = fmt === 'land' ? 260 : 230;
	const near = (x: number) => clamp((x - (x1 - zone)) / zone);
	const base = (x: number) => Math.sin(k * x - w * t);
	const noiseAmp = (x: number) => amp * edge(x, startX, x1 + 40, 120) * (1 - 0.78 * cancel * near(x));
	const noise = curve(startX, x1, (x) => ear.y + noiseAmp(x) * base(x));
	const antiAmp = (x: number) => amp * 0.8 * near(x) * edge(x, x1 - zone, x1 + 40, 60);
	const antiPath = curve(x1 - zone, x1, (x) => ear.y - antiAmp(x) * base(x), 60);
	const strands = [-1, 1].map((o) =>
		curve(startX, x1, (x) => ear.y + o * 34 + 0.55 * noiseAmp(x) * Math.sin(k * x - w * t + o * 0.9), 90),
	);
	return (
		<g>
			{strands.map((d, i) => (
				<path key={i} d={d} stroke={C.orange} strokeWidth={3} fill="none" opacity={0.35} />
			))}
			<path d={noise} stroke={C.orange} strokeWidth={fmt === 'land' ? 9 : 10} fill="none" strokeLinecap="round" opacity={0.95} />
			<path d={noise} stroke={C.orange} strokeWidth={26} fill="none" opacity={0.16} />
			{anti > 0.01 ? (
				<g opacity={anti}>
					<path d={antiPath} stroke={C.cyan} strokeWidth={8} fill="none" strokeLinecap="round" />
					<path d={antiPath} stroke={C.cyan} strokeWidth={24} fill="none" opacity={0.18} />
				</g>
			) : null}
		</g>
	);
};

/** Expanding pressure rings around the engine (cheap stroked circles). */
export const EngineRings: React.FC<{x: number; y: number; t: number; hum: number}> = ({x, y, t, hum}) => (
	<g>
		{[0, 1, 2, 3].map((i) => {
			const p = (t * 0.9 + i / 4) % 1;
			return <circle key={i} cx={x} cy={y} r={40 + p * 330} fill="none" stroke={C.orange} strokeWidth={5 - 3 * p} opacity={(1 - p) * 0.55 * hum} />;
		})}
	</g>
);

export const Hook: React.FC<{fmt: Fmt; t: number}> = ({fmt, t}) => {
	const {w, h} = SIZE[fmt];
	const s = stage(fmt);
	const ear = earPos(fmt);
	const land = fmt === 'land';
	const ancOn = ramp(t, T.switchOn + 0.6, 0.5);
	const cancel = ramp(t, T.fades - 0.2, 2.0);
	const hum = 0.65 + 0.35 * ramp(t, T.engines, 1.2);
	const amp = (land ? 78 : 84) * hum;
	const level = mix(0.86 + 0.06 * Math.sin(t * 9), 0.3 + 0.03 * Math.sin(t * 7), cancel);
	const push = 1 + 0.03 * clamp(t / 14);
	const startX = s.windows[0].x + 40;

	const h1 = win(t, -1, T.plane, 0.4);
	const h2 = win(t, T.backwards, T.plane, 0.35);
	const h3 = win(t, T.plane, T.switchOn, 0.4);
	const h4 = win(t, T.switchOn, T.fades, 0.4);
	const h5 = win(t, T.fades, 15, 0.4);

	const meter = land ? {x: 1100, y: 890, w: 640} : {x: 150, y: 640, w: 780};
	const pill = land ? {x: ear.x + 110, y: ear.y - 250} : {x: ear.x + 120, y: ear.y - 330};

	return (
		<AbsoluteFill>
			<svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{position: 'absolute'}}>
				<g transform={`translate(${ear.x} ${ear.y}) scale(${push}) translate(${-ear.x} ${-ear.y})`}>
					<Cabin id={`hk${fmt}`} w={w} h={h} windows={s.windows} t={t} floorY={s.floorY} />
					<EngineRings x={s.windows[0].x + 10} y={s.windows[0].y + 60} t={t} hum={hum} />
					<Glow color="orange" cx={s.windows[0].x} cy={s.windows[0].y + 40} r={land ? 300 : 360} opacity={0.35 * hum} />
					<Seat x={s.seat.x} y={s.seat.y} s={s.seat.s} />
					<g transform={`translate(${s.px} ${s.py}) scale(${s.ps})`}>
						<Passenger id={`hk${fmt}p`} ancOn={ancOn} cupGlow={0.8 * ancOn * (0.6 + 0.4 * Math.sin(t * 4))} />
					</g>
					<Glow color="cyan" cx={ear.x} cy={ear.y} r={land ? 220 : 280} opacity={0.55 * ancOn} />
					<NoiseToEar fmt={fmt} t={t} amp={amp} ear={ear} cancel={cancel} anti={ancOn} startX={startX} />
					<Tag x={land ? 130 : 120} y={s.windows[0].y - (land ? 150 : 185)} text="engine hum" color={C.orange} size={land ? 28 : 34} opacity={ramp(t, T.engines, 0.5)} />
				</g>
				{/* ANC switch pill */}
				<g opacity={ramp(t, T.switchOn, 0.4)} transform={`translate(${pill.x} ${pill.y})`}>
					<rect x={0} y={0} width={land ? 330 : 390} height={land ? 74 : 86} rx={40} fill="#0B1638" stroke={ancOn > 0.5 ? C.cyan : '#3A4C80'} strokeWidth={3} />
					<rect x={land ? 14 : 16} y={land ? 12 : 14} width={land ? 92 : 108} height={land ? 50 : 58} rx={26} fill={ancOn > 0.5 ? C.cyan : '#2A375F'} />
					<circle cx={mix(land ? 40 : 46, land ? 80 : 94, ancOn)} cy={land ? 37 : 43} r={land ? 20 : 24} fill={C.white} />
					<text x={land ? 124 : 144} y={land ? 48 : 56} fill={C.white} fontFamily={FONT} fontWeight={800} fontSize={land ? 30 : 36} letterSpacing={3}>
						ANC {ancOn > 0.5 ? 'ON' : 'OFF'}
					</text>
				</g>
				{/* noise-at-ear meter */}
				<g opacity={ramp(t, T.engines, 0.6)}>
					<text x={meter.x} y={meter.y - 22} fill={C.mute} fontFamily={FONT} fontWeight={700} fontSize={land ? 24 : 32} letterSpacing={4}>
						NOISE REACHING YOUR EAR
					</text>
					<rect x={meter.x} y={meter.y} width={meter.w} height={land ? 22 : 28} rx={12} fill="#16244C" />
					<rect x={meter.x} y={meter.y} width={meter.w * level} height={land ? 22 : 28} rx={12} fill={cancel > 0.5 ? C.cyan : C.orange} />
				</g>
			</svg>
			{land ? (
				<>
					<Headline x={1040} y={150} size={92} width={780} opacity={h1} lines={[['Your headphones'], ['make ', {hi: 'noise'}], ['to create ', {hi: 'silence', color: C.cyan}]]} />
					<Kicker x={1044} y={510} text="Sounds backwards, right?" size={34} color={C.orange} opacity={h2} />
					<Headline x={1040} y={190} size={74} width={780} opacity={h3} lines={[['Cruising altitude.'], ['The engines ', {hi: 'hum.'}]]} />
					<Headline x={1040} y={190} size={74} width={780} opacity={h4} lines={[['Switch on'], [{hi: 'noise cancelling', color: C.cyan}]]} />
					<Headline x={1040} y={190} size={74} width={780} opacity={h5} lines={[['…and the low'], ['roar ', {hi: 'fades', color: C.cyan}]]} />
				</>
			) : (
				<>
					<Headline x={540} y={190} size={84} width={900} align="center" opacity={h1} lines={[['Your headphones'], ['make ', {hi: 'noise'}], ['to create ', {hi: 'silence', color: C.cyan}]]} />
					<Kicker x={540} y={540} text="Sounds backwards, right?" size={40} color={C.orange} opacity={h2} align="center" width={900} />
					<Headline x={540} y={230} size={84} width={900} align="center" opacity={h3} lines={[['Cruising altitude.'], ['The engines ', {hi: 'hum.'}]]} />
					<Headline x={540} y={230} size={84} width={900} align="center" opacity={h4} lines={[['Switch on'], [{hi: 'noise cancelling', color: C.cyan}]]} />
					<Headline x={540} y={230} size={84} width={900} align="center" opacity={h5} lines={[['…and the low'], ['roar ', {hi: 'fades', color: C.cyan}]]} />
				</>
			)}
		</AbsoluteFill>
	);
};
