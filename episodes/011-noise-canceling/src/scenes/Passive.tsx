import React from 'react';
import {AbsoluteFill} from 'remotion';
import {clamp, curve, edge, mix, ramp, rampIO, win} from '../anim';
import {CUP, Earcup} from '../components/Earcup';
import {Glow, Headline, Kicker} from '../components/ui';
import {C, Fmt, FONT, SIZE} from '../theme';
import {T} from '../timeline';

/** Beat 7: pads + seal block what ANC handles poorly; ANC is not total silence. */
export const Passive: React.FC<{fmt: Fmt; t: number}> = ({fmt, t}) => {
	const {w, h} = SIZE[fmt];
	const land = fmt === 'land';
	const pads = ramp(t, T.padding + 0.3, 0.6);
	const block = ramp(t, T.block, 0.6);
	const enter = rampIO(t, T.padding - 0.3, 1.0);
	const place = land ? {x: 340, y: 250, s: 0.95} : {x: 90, y: 600, s: 0.95};
	const sc = place.s * mix(0.9, 1, enter);

	// High, sharp sounds: short wavelengths that die out in the cushion/seal.
	const kH = (Math.PI * 2) / 34;
	const WH = Math.PI * 2 * 3;
	const hiPath = (y: number, ph: number) =>
		curve(-300, 600, (x) => y + 22 * edge(x, -300, 620, 60) * clamp((560 - x) / 120) ** (0.4 + block) * Math.sin(kH * x - WH * t + ph), 260);
	// Low, steady hum: long wave leaks in; ANC (cyan) cancels much of it inside.
	const kL = (Math.PI * 2) / 260;
	const WL = Math.PI * 2 * 0.8;
	const lowOut = curve(-300, 120, (x) => CUP.canalY + 60 * edge(x, -300, 140, 80) * Math.sin(kL * x - WL * t), 90);
	const lowIn = curve(505, 895, (x) => CUP.canalY + 36 * edge(x, 505, 905, 40) * Math.sin(kL * x - WL * t), 80);
	const antiIn = curve(505, 895, (x) => CUP.canalY - 30 * edge(x, 505, 905, 40) * Math.sin(kL * x - WL * t), 80);
	const resid = curve(505, 895, (x) => CUP.canalY + 6 * edge(x, 505, 905, 40) * Math.sin(kL * x - WL * t), 80);

	const rows = [
		{h: 'Pads + seal', s: 'physically block higher, sharper sounds', c: C.orange, o: pads},
		{h: 'Active cancelling', s: 'best on low, steady hum', c: C.cyan, o: ramp(t, T.block + 0.8, 0.5)},
		{h: 'Together', s: 'much quieter — not total silence', c: C.white, o: ramp(t, T.block + 2.2, 0.5)},
	];

	return (
		<AbsoluteFill>
			<svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{position: 'absolute'}}>
				<g transform={`translate(${place.x} ${place.y}) scale(${sc})`}>
					<Glow color="orange" cx={551} cy={120} r={190} opacity={0.5 * pads} />
					<Glow color="orange" cx={551} cy={600} r={190} opacity={0.5 * pads} />
					<Earcup id={`pv${fmt}`} t={t} chip={0.6} driver={1} pads={pads} driverMove={-5 * Math.sin(-WL * t + kL * 495)} labelScale={land ? 1 : 1.25} />
					<path d={hiPath(110, 0)} stroke={C.orange} strokeWidth={4} fill="none" />
					<path d={hiPath(610, 1.4)} stroke={C.orange} strokeWidth={4} fill="none" />
					<path d={lowOut} stroke={C.orange} strokeWidth={8} fill="none" strokeLinecap="round" />
					<path d={lowIn} stroke={C.orange} strokeWidth={3} fill="none" opacity={0.5} />
					<path d={antiIn} stroke={C.cyan} strokeWidth={3} fill="none" opacity={0.6} />
					<path d={resid} stroke={C.white} strokeWidth={6} fill="none" strokeLinecap="round" />
					<text x={land ? -250 : 0} y={60} fill={C.orange} fontFamily={FONT} fontWeight={800} fontSize={land ? 24 : 30} letterSpacing={3} opacity={block}>
						HIGH / SHARP
					</text>
					<text x={land ? -250 : 0} y={CUP.canalY - 90} fill={C.orange} fontFamily={FONT} fontWeight={800} fontSize={land ? 24 : 30} letterSpacing={3} opacity={block}>
						LOW HUM
					</text>
				</g>
			</svg>
			{land ? (
				<>
					<Kicker x={100} y={78} text="The quiet partner" size={28} opacity={ramp(t, T.padding, 0.4)} />
					<Headline x={96} y={118} size={62} width={1700} opacity={win(t, T.padding, T.block, 0.4)} lines={[['The ', {hi: 'padding'}, ' still matters']]} />
					<Headline x={96} y={118} size={62} width={1700} opacity={ramp(t, T.block, 0.4)} lines={[[{hi: 'Passive'}, ' + ', {hi: 'active', color: C.cyan}, ' work together']]} />
					{rows.map((r, i) => (
						<div key={r.h} style={{position: 'absolute', left: 1380, top: 360 + i * 170, width: 440, opacity: r.o, fontFamily: FONT, transform: `translateX(${(1 - r.o) * 30}px)`}}>
							<div style={{color: r.c, fontSize: 40, fontWeight: 800, textTransform: 'uppercase', lineHeight: 1.05}}>{r.h}</div>
							<div style={{color: C.mute, fontSize: 28, fontWeight: 600, lineHeight: 1.25}}>{r.s}</div>
						</div>
					))}
				</>
			) : (
				<>
					<Kicker x={540} y={210} text="The quiet partner" size={36} align="center" width={900} opacity={ramp(t, T.padding, 0.4)} />
					<Headline x={540} y={265} size={82} width={900} align="center" opacity={win(t, T.padding, T.block, 0.4)} lines={[['The ', {hi: 'padding'}], ['still matters']]} />
					<Headline x={540} y={265} size={82} width={900} align="center" opacity={ramp(t, T.block, 0.4)} lines={[[{hi: 'Passive'}, ' + ', {hi: 'active', color: C.cyan}], ['together']]} />
					{rows.map((r, i) => (
						<div key={r.h} style={{position: 'absolute', left: 100, top: 1340 + i * 76, width: 900, opacity: r.o, fontFamily: FONT, display: 'flex', gap: 18, alignItems: 'baseline'}}>
							<div style={{color: r.c, fontSize: 38, fontWeight: 800, textTransform: 'uppercase', whiteSpace: 'nowrap'}}>{r.h}</div>
							<div style={{color: C.mute, fontSize: 28, fontWeight: 600}}>{r.s}</div>
						</div>
					))}
				</>
			)}
		</AbsoluteFill>
	);
};
