import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Arrow, Car, Defs, Governor, SafetyDetail, SpeedDial, TractionMachine} from '../art';
import {C, FONT_BODY, ramp} from '../theme';
import {S} from '../timeline';
import {Backdrop, Caption, Glow, Headline, Hi, SvgGlow, SvgLabel} from '../ui';
import {dims, SceneProps} from './opening';

/* 8 — The clever part: a purely mechanical chain, no electricity needed. */
export const MechanicalScene: React.FC<SceneProps> = ({t, layout}) => {
	const {L, W, H} = dims(layout);
	const id = `mc-${layout}`;
	const r = L ? 120 : 108;
	const nodes = L
		? [330, 750, 1170, 1590].map((x) => ({x, y: 560}))
		: [640, 900, 1160, 1420].map((y) => ({x: 250, y}));
	const t0 = S.noElectricity + 0.4;
	const at = (i: number) => t0 + i * 0.85;
	const labels = [
		['Too fast'],
		['Governor', 'grips its rope'],
		['Rope pulls', 'lever & rods'],
		['Wedges grip', 'the guide rails'],
	];
	const pulse = (t - t0) / 0.85;
	const power = ramp(t, S.noElectricity + 3.6, S.noElectricity + 4.2);
	const q = ramp(t, S.cleverPart, S.cleverPart + 0.4) * (1 - ramp(t, S.noElectricity - 0.1, S.noElectricity + 0.3));
	return (
		<AbsoluteFill>
			<Backdrop layout={layout} grid={0.5} />
			<Glow x={W / 2} y={H / 2} size={L ? 1400 : 1500} color="cyan" opacity={0.22} />
			{q > 0 ? (
				<div
					style={{
						position: 'absolute',
						inset: 0,
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						flexDirection: 'column',
						opacity: q,
						transform: `scale(${0.94 + q * 0.06})`,
					}}
				>
					<div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: L ? 120 : 130, color: C.white, textAlign: 'center', lineHeight: 1.05}}>
						And the
						<br />
						<span style={{color: C.orange}}>clever part?</span>
					</div>
				</div>
			) : null}
			<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute'}}>
				<Defs id={id} />
				{nodes.map((n, i) => {
					const a = ramp(t, at(i), at(i) + 0.45);
					if (a <= 0) return null;
					const active = pulse >= i && pulse < i + 1.4;
					const next = nodes[i + 1];
					return (
						<g key={i} opacity={a}>
							{next ? (
								<g opacity={ramp(t, at(i) + 0.4, at(i) + 0.8)}>
									<Arrow
										x1={L ? n.x + r + 14 : n.x}
										y1={L ? n.y : n.y + r + 8}
										x2={L ? next.x - r - 14 : next.x}
										y2={L ? next.y : next.y - r - 8}
										color={C.cyan}
										w={5}
									/>
								</g>
							) : null}
							{active ? <SvgGlow x={n.x} y={n.y} r={r * 2.1} color="orange" opacity={0.65} /> : null}
							<circle cx={n.x} cy={n.y} r={r} fill="rgba(6,14,36,0.95)" stroke={active ? C.orange : C.cyan} strokeWidth={4} />
							<g>
								{i === 0 ? <SpeedDial x={n.x} y={n.y + 6} s={r / 160} v={0.92} label="" /> : null}
								{i === 1 ? (
									<Governor id={id} x={n.x - 4} y={n.y - 8} s={r / 330} spin={30} fly={1} trip={1} clamp={1} ropePhase={0} ropeLen={190} hot={1} />
								) : null}
								{i === 2 ? <Car id={id} x={n.x - 6} y={n.y - 50} s={r / 470} lever={1} engage={1} interior={false} /> : null}
								{i === 3 ? <SafetyDetail id={id} x={n.x} y={n.y - 4} s={r / 330} engage={1} /> : null}
							</g>
							<text
								x={L ? n.x : n.x + r + 40}
								y={L ? n.y + r + 54 : n.y - 6}
								textAnchor={L ? 'middle' : 'start'}
								fill={C.white}
								fontFamily={FONT_BODY}
								fontWeight={700}
								fontSize={L ? 30 : 36}
							>
								{labels[i].map((l, k) => (
									<tspan key={k} x={L ? n.x : n.x + r + 40} dy={k === 0 ? 0 : L ? 38 : 44}>
										{l}
									</tspan>
								))}
							</text>
						</g>
					);
				})}
				{/* no-power badge */}
				{power > 0 ? (
					<g transform={`translate(${L ? 700 : 190} ${L ? 900 : 1660}) scale(${0.9 + power * 0.1})`} opacity={power}>
						<circle r={46} fill="rgba(6,14,36,0.95)" stroke={C.orange} strokeWidth={4} />
						<path d="M 6 -30 L -16 4 L 0 4 L -6 30 L 18 -6 L 2 -6 Z" fill={C.cyan} />
						<line x1={-30} y1={30} x2={30} y2={-30} stroke={C.orange} strokeWidth={7} strokeLinecap="round" />
					</g>
				) : null}
			</svg>
			<Headline t={t} at={S.noElectricity} layout={layout} kicker="The clever part" title={<>It works <Hi>mechanically.</Hi></>} width={L ? 1200 : 940} />
			<Caption t={t} at={S.noElectricity + 3.6} x={L ? 770 : 270} y={L ? 872 : 1625} width={L ? 900 : 700} size={L ? 38 : 38}>
				No building electricity <span style={{color: C.orange}}>needed</span> to trigger it.
			</Caption>
		</AbsoluteFill>
	);
};

/* 9 — Other layers: the machine brake (power-loss) vs the overspeed safety. */
export const LayersScene: React.FC<SceneProps> = ({t, layout}) => {
	const {L, W, H} = dims(layout);
	const id = `ly-${layout}`;
	const mx = L ? 1250 : 590;
	const my = L ? 500 : 860;
	const ms = L ? 1.25 : 1.1;
	const brakeLabel = S.otherLayers + 2.8;
	const powerOff = S.otherLayers + 4.2;
	const brake = ramp(t, powerOff + 0.1, powerOff + 0.45);
	const power = t < powerOff ? 1 : 0;
	const spinV = (x: number) => 50 * (1 - ramp(x, powerOff + 0.1, powerOff + 0.6));
	let spin = 0;
	for (let x = S.otherLayers - 0.4; x < t; x += 1 / 30) spin += spinV(x) / 30;
	const flash = t > powerOff + 0.3 ? Math.max(0, 1 - (t - powerOff - 0.3) * 2) : 0;
	const cards = [
		{text: 'Several hoist ropes', at: S.otherLayers + 0.5},
		{text: 'Machine brake', at: S.otherLayers + 1.0},
		{text: 'Governor + safety gear', at: S.otherLayers + 1.5},
	];
	const card = L ? {x: 110, y: 340, w: 600, h: 96, gap: 22} : {x: 90, y: 1240, w: 900, h: 92, gap: 18};
	const hiCard = ramp(t, brakeLabel, brakeLabel + 0.4);
	return (
		<AbsoluteFill>
			<Backdrop layout={layout} grid={0.5} />
			<Glow x={mx - 10 * ms} y={my} size={L ? 900 : 900} color={brake > 0.5 ? 'orange' : 'cyan'} opacity={0.3} />
			<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute'}}>
				<Defs id={id} />
				<TractionMachine id={id} x={mx} y={my} s={ms} spin={spin} brake={brake} power={power} />
				{flash > 0 ? <SvgGlow x={mx - 10 * ms} y={my} r={260} color="orange" opacity={flash} /> : null}
				<SvgLabel t={t} at={S.otherLayers + 0.8} from={[mx - 170 * ms, my - 118 * ms]} to={L ? [mx - 170 * ms, my - 118 * ms - 80] : [mx - 170 * ms, my - 118 * ms - 70]} text="Drive sheave" anchor="middle" />
				<SvgLabel t={t} at={brakeLabel} from={[mx - 10 * ms, my + 90 * ms]} to={L ? [mx + 40, my + 300] : [mx + 60, my + 260]} text="Machine brake" color={C.orange} anchor="middle" size={L ? 32 : 32} />
				<SvgLabel t={t} at={S.otherLayers + 1.2} from={[mx + 290 * ms, my - 70 * ms]} to={L ? [mx + 330, my - 220] : [mx + 230, my - 220]} text={power ? 'Power on' : 'Power lost'} color={power ? C.cyan : C.orange} anchor="middle" size={26} />
				{cards.map((c, i) => {
					const a = ramp(t, c.at, c.at + 0.4);
					if (a <= 0) return null;
					const y = card.y + i * (card.h + card.gap);
					const hi = i === 1 ? hiCard : 0;
					const col = hi > 0.5 ? C.orange : C.cyan;
					return (
						<g key={i} opacity={a} transform={`translate(${(1 - a) * -30} 0)`}>
							<rect x={card.x} y={y} width={card.w} height={card.h} rx={18} fill="rgba(6,14,36,0.9)" stroke={col} strokeWidth={hi > 0.5 ? 4 : 2} strokeOpacity={hi > 0.5 ? 1 : 0.6} />
							<text x={card.x + 34} y={y + card.h / 2 + 12} fill={col} fontFamily={FONT_BODY} fontWeight={800} fontSize={34}>
								{i + 1}
							</text>
							<text x={card.x + 84} y={y + card.h / 2 + 12} fill={C.white} fontFamily={FONT_BODY} fontWeight={700} fontSize={L ? 32 : 36}>
								{c.text}
							</text>
						</g>
					);
				})}
			</svg>
			<Headline t={t} at={S.otherLayers} layout={layout} kicker="Defense in depth" title={<>Other layers of <Hi>protection.</Hi></>} width={L ? 820 : 940} />
			<Caption t={t} at={powerOff + 0.4} x={L ? 110 : 60} y={L ? 740 : 1600} width={L ? 640 : 960} size={L ? 32 : 34} align={L ? 'left' : 'center'}>
				Spring-applied: it <span style={{color: C.orange}}>clamps when power is lost</span> — a separate system from the overspeed safety.
			</Caption>
		</AbsoluteFill>
	);
};
