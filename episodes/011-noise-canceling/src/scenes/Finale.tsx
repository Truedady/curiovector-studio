import React from 'react';
import {AbsoluteFill} from 'remotion';
import {mix, ramp, rampIO, win} from '../anim';
import {Cabin, Seat} from '../components/Cabin';
import {Passenger} from '../components/Passenger';
import {Glow, Headline} from '../components/ui';
import {C, Fmt, FONT, SIZE} from '../theme';
import {T} from '../timeline';
import {earPos, EngineRings, NoiseToEar, stage} from './Hook';

/** Beat 8: not turning sound off — turning another sound on. Hero close. */
export const Finale: React.FC<{fmt: Fmt; t: number}> = ({fmt, t}) => {
	const {w, h} = SIZE[fmt];
	const land = fmt === 'land';
	const s = stage(fmt);
	const ear = earPos(fmt);
	const anti = ramp(t, T.anotherOn + 0.3, 0.8);
	const hero = ramp(t, T.designed, 0.8);
	const push = mix(1.0, 1.08, rampIO(t, T.notOff, T.end - T.notOff));
	const sw = land ? {x: 1060, y: 520, s: 1} : {x: 160, y: 560, s: 1.1};

	const toggle = (y: number, label: string, on: boolean, o: number, color: string, struck: number) => (
		<g opacity={o} transform={`translate(${sw.x} ${sw.y + y}) scale(${sw.s})`}>
			<rect width={660} height={96} rx={48} fill="#0B1638" stroke={on ? color : '#3A4C80'} strokeWidth={3} />
			<rect x={16} y={16} width={120} height={64} rx={32} fill={on ? color : '#2A375F'} />
			<circle cx={on ? 104 : 48} cy={48} r={26} fill={C.white} />
			<text x={170} y={62} fill={C.white} fontFamily={FONT} fontWeight={800} fontSize={40} letterSpacing={3}>
				{label}
			</text>
			<line x1={160} y1={50} x2={160 + 470 * struck} y2={50} stroke={C.orange} strokeWidth={8} strokeLinecap="round" />
		</g>
	);

	return (
		<AbsoluteFill>
			<svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{position: 'absolute'}}>
				<g transform={`translate(${ear.x} ${ear.y}) scale(${push}) translate(${-ear.x} ${-ear.y})`}>
					<Cabin id={`fn${fmt}`} w={w} h={h} windows={s.windows} t={t} floorY={s.floorY} />
					<EngineRings x={s.windows[0].x + 10} y={s.windows[0].y + 60} t={t} hum={1} />
					<Glow color="orange" cx={s.windows[0].x} cy={s.windows[0].y + 40} r={land ? 300 : 360} opacity={0.35} />
					<Seat x={s.seat.x} y={s.seat.y} s={s.seat.s} />
					<g transform={`translate(${s.px} ${s.py}) scale(${s.ps})`}>
						<Passenger id={`fn${fmt}p`} ancOn={1} cupGlow={0.4 + 0.5 * anti} />
					</g>
					<Glow color="cyan" cx={ear.x} cy={ear.y} r={(land ? 240 : 300) * (1 + 0.25 * hero)} opacity={0.4 + 0.4 * anti} />
					<NoiseToEar fmt={fmt} t={t} amp={land ? 78 : 84} ear={ear} cancel={0.4 + 0.6 * anti} anti={0.25 + 0.75 * anti} startX={s.windows[0].x + 40} />
					<Glow color="white" cx={ear.x - (land ? 140 : 130)} cy={ear.y} r={land ? 120 : 140} opacity={0.45 * hero * (0.7 + 0.3 * Math.sin(t * 5))} />
				</g>
				{toggle(-200, 'SOUND OFF?', false, win(t, T.notOff + 0.2, T.designed, 0.4), C.orange, ramp(t, T.notOff + 2.4, 0.5))}
				{toggle(-60, 'ANOTHER SOUND ON', anti > 0.5, win(t, T.anotherOn, T.designed, 0.4), C.cyan, 0)}
			</svg>
			{land ? (
				<>
					<Headline x={1040} y={150} size={70} width={780} opacity={win(t, T.notOff, T.designed, 0.4)} lines={[['Not turning'], ['sound ', {hi: 'off'}]]} />
					<Headline x={1040} y={170} size={104} width={780} opacity={hero} rise={(1 - hero) * 30} lines={[['More sound.'], [{hi: 'Less noise.'}]]} />
					<div style={{position: 'absolute', left: 1046, top: 420, width: 740, fontFamily: FONT, color: C.mute, fontSize: 30, fontWeight: 600, opacity: ramp(t, T.designed + 1.2, 0.6)}}>
						Anti-noise, timed to meet the noise at your ear.
					</div>
				</>
			) : (
				<>
					<Headline x={540} y={230} size={92} width={900} align="center" opacity={win(t, T.notOff, T.designed, 0.4)} lines={[['Not turning'], ['sound ', {hi: 'off'}]]} />
					<Headline x={540} y={210} size={118} width={900} align="center" opacity={hero} rise={(1 - hero) * 30} lines={[['More sound.'], [{hi: 'Less noise.'}]]} />
					<div style={{position: 'absolute', left: 90, top: 480, width: 900, textAlign: 'center', fontFamily: FONT, color: C.mute, fontSize: 36, fontWeight: 600, opacity: ramp(t, T.designed + 1.2, 0.6)}}>
						Anti-noise, timed to meet the noise at your ear.
					</div>
				</>
			)}
		</AbsoluteFill>
	);
};

