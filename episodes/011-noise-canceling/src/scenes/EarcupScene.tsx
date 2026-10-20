import React from 'react';
import {AbsoluteFill} from 'remotion';
import {curve, edge, mix, ramp, rampIO, win} from '../anim';
import {CUP, Earcup} from '../components/Earcup';
import {Glow, Headline, Kicker} from '../components/ui';
import {C, Fmt, FONT, SIZE} from '../theme';
import {T} from '../timeline';

const K = (Math.PI * 2) / 120;
const W = Math.PI * 2 * 1.1;

/** Beat 3: microphones listen, processor computes, speaker plays anti-noise. */
export const EarcupScene: React.FC<{fmt: Fmt; t: number}> = ({fmt, t}) => {
	const {w, h} = SIZE[fmt];
	const land = fmt === 'land';
	const outMic = ramp(t, T.mics + 0.3, 0.6);
	const inMic = ramp(t, T.micsBoth + 0.4, 0.6);
	const chip = ramp(t, T.processor, 0.6);
	const play = ramp(t, T.calculates, 0.8);
	const timing = ramp(t, T.timing, 0.6);
	const enter = rampIO(t, T.mics - 0.2, 1.0);

	const base = (x: number) => Math.sin(K * x - W * t);
	const outside = curve(-320, 120, (x) => CUP.canalY + 70 * edge(x, -320, 140, 120) * base(x), 90);
	// leaked noise inside the cup + anti-noise from the speaker (opposite sign)
	const leak = curve(505, 895, (x) => CUP.canalY + 34 * edge(x, 505, 905, 40) * base(x), 80);
	const anti = curve(505, 895, (x) => CUP.canalY - 30 * play * edge(x, 505, 905, 40) * base(x), 80);
	const driverMove = -6 * play * Math.sin(-W * t + K * 495);

	const place = land ? {x: 330, y: 250, s: 0.95} : {x: 90, y: 600, s: 0.95};
	const sc = place.s * mix(1.25, 1, enter);

	const steps = [
		{n: '01', a: 'Listen', b: 'mics sample the noise', at: T.mics, c: C.orange},
		{n: '02', a: 'Calculate', b: 'a matching opposite wave', at: T.processor, c: C.cyan},
		{n: '03', a: 'Play it', b: 'through the speaker', at: T.calculates, c: C.cyan},
	];

	return (
		<AbsoluteFill>
			<svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{position: 'absolute'}}>
				<g transform={`translate(${place.x} ${place.y}) scale(${sc})`}>
					<Glow color="cyan" cx={CUP.chip.x} cy={CUP.chip.y} r={260} opacity={0.35 * chip} />
					<Glow color="orange" cx={0} cy={CUP.canalY} r={320} opacity={0.28} />
					<Earcup
						id={`ec${fmt}`}
						t={t}
						outMic={outMic}
						inMic={inMic}
						chip={chip}
						driver={play}
						driverMove={driverMove}
						labelScale={land ? 1 : 1.25}
						drumLabel={0.9 * ramp(t, T.mics + 0.6, 0.4)}
						pulses={{
							outToChip: chip > 0.01 ? (t * 0.9) % 1 : undefined,
							inToChip: chip > 0.01 && inMic > 0.5 ? (t * 0.9 + 0.5) % 1 : undefined,
							chipToDriver: play > 0.01 ? (t * 1.2) % 1 : undefined,
						}}
					/>
					<path d={outside} stroke={C.orange} strokeWidth={8} fill="none" strokeLinecap="round" />
					<path d={leak} stroke={C.orange} strokeWidth={5} fill="none" opacity={0.9} />
					<path d={anti} stroke={C.cyan} strokeWidth={5} fill="none" opacity={play} />
					{/* timing stopwatch on the chip */}
					<g opacity={timing} transform={`translate(${CUP.chip.x} ${CUP.chip.y - 130})`}>
						<circle r={46} fill="#0B1433" stroke={C.orange} strokeWidth={5} />
						<rect x={-10} y={-62} width={20} height={12} rx={3} fill={C.orange} />
						<line x1={0} y1={0} x2={34 * Math.sin(t * 5)} y2={-34 * Math.cos(t * 5)} stroke={C.white} strokeWidth={5} strokeLinecap="round" />
						<circle r={6} fill={C.white} />
					</g>
				</g>
			</svg>
			{land ? (
				<>
					<Kicker x={100} y={78} text="Inside the earcup" size={28} opacity={ramp(t, T.mics, 0.5)} />
					<Headline x={96} y={118} size={64} width={1100} opacity={win(t, T.mics, T.timing, 0.4)} lines={[['Microphones ', {hi: 'listen'}, ' first']]} />
					<Headline x={96} y={118} size={64} width={1100} opacity={ramp(t, T.timing, 0.4)} lines={[['The key is ', {hi: 'timing'}]]} />
					{steps.map((s, i) => {
						const o = ramp(t, s.at, 0.5);
						return (
							<div key={s.n} style={{position: 'absolute', left: 1360, top: 330 + i * 170, opacity: 0.25 + 0.75 * o, fontFamily: FONT, transform: `translateX(${(1 - o) * 30}px)`}}>
								<div style={{color: s.c, fontSize: 30, fontWeight: 800, letterSpacing: 4}}>{s.n}</div>
								<div style={{color: C.white, fontSize: 52, fontWeight: 800, textTransform: 'uppercase', lineHeight: 1.05}}>{s.a}</div>
								<div style={{color: C.mute, fontSize: 28, fontWeight: 600}}>{s.b}</div>
							</div>
						);
					})}
				</>
			) : (
				<>
					<Kicker x={540} y={210} text="Inside the earcup" size={36} align="center" width={900} opacity={ramp(t, T.mics, 0.5)} />
					<Headline x={540} y={265} size={84} width={900} align="center" opacity={win(t, T.mics, T.timing, 0.4)} lines={[['Microphones'], [{hi: 'listen'}, ' first']]} />
					<Headline x={540} y={265} size={84} width={900} align="center" opacity={ramp(t, T.timing, 0.4)} lines={[['The key is'], [{hi: 'timing'}]]} />
					{steps.map((s, i) => {
						const o = ramp(t, s.at, 0.5);
						return (
							<div key={s.n} style={{position: 'absolute', left: 90 + i * 310, top: 1370, width: 290, opacity: 0.25 + 0.75 * o, fontFamily: FONT, textAlign: 'left'}}>
								<div style={{color: s.c, fontSize: 32, fontWeight: 800, letterSpacing: 4}}>{s.n}</div>
								<div style={{color: C.white, fontSize: 50, fontWeight: 800, textTransform: 'uppercase', lineHeight: 1.05}}>{s.a}</div>
								<div style={{color: C.mute, fontSize: 28, fontWeight: 600, lineHeight: 1.2}}>{s.b}</div>
							</div>
						);
					})}
				</>
			)}
		</AbsoluteFill>
	);
};
