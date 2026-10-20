import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Arrow, Car, Defs, Governor, leverTip, Rail, Rope, SafetyDetail, Shaft, SpeedDial, TensionSheave} from '../art';
import {C, FONT_BODY, lerp, ramp, rand} from '../theme';
import {S} from '../timeline';
import {Backdrop, Chip, Glow, Headline, Hi, Panel, SvgGlow, SvgLabel} from '../ui';
import {dims, SceneProps} from './opening';
import {travel} from './ropes';

/* Governor timing: normal speed, overspeed ramp, trip, rope grip. */
const OVER0 = S.trips + 0.45;
const TRIP = S.trips + 3.35;
const GRIP = S.trips + 4.2;
const govSpeed = (x: number) => {
	const up = ramp(x, OVER0, TRIP);
	const stop = ramp(x, TRIP + 0.05, GRIP + 0.2);
	return (1 + up * 1.4) * (1 - stop);
};

/** Mini shaft schematic: governor loop, car, tension sheave. */
const Schematic: React.FC<{x: number; y: number; h: number; d: number; rope: number; hot: number; a: number}> = ({x, y, h, d, rope, hot, a}) => {
	const top = y + 40;
	const bot = y + h - 40;
	const rL = x;
	const rR = x + 64;
	const carH = h * 0.2;
	const carY = lerp(top + 70, bot - carH - 40, Math.min(1, d));
	const col = hot > 0.5 ? C.orange : C.cyan;
	return (
		<g opacity={a}>
			<rect x={x - 190} y={top - 30} width={300} height={bot - top + 60} rx={10} fill="#0A1736" stroke="#22417A" strokeWidth={2} />
			<line x1={rL} y1={top} x2={rL} y2={bot} stroke={col} strokeWidth={4} strokeDasharray="10 8" strokeDashoffset={-rope} />
			<line x1={rR} y1={top} x2={rR} y2={bot} stroke={col} strokeWidth={4} strokeDasharray="10 8" strokeDashoffset={rope} />
			<circle cx={(rL + rR) / 2} cy={top} r={34} fill="#16305F" stroke={col} strokeWidth={4} />
			<line x1={(rL + rR) / 2} y1={top} x2={(rL + rR) / 2 + Math.cos(rope / 20) * 26} y2={top + Math.sin(rope / 20) * 26} stroke={col} strokeWidth={4} />
			<circle cx={(rL + rR) / 2} cy={bot} r={26} fill="#16305F" stroke="#6E8CC0" strokeWidth={3} />
			<rect x={x - 150} y={carY} width={110} height={carH} rx={8} fill="#24447F" stroke="#AFC2E2" strokeWidth={3} />
			<line x1={x - 40} y1={carY + 8} x2={rL} y2={carY + 8} stroke="#AFC2E2" strokeWidth={4} />
			<circle cx={rL} cy={carY + 8} r={7} fill={col} />
			<text x={(rL + rR) / 2} y={top - 46} textAnchor="middle" fill={C.mute} fontFamily={FONT_BODY} fontWeight={700} fontSize={18} letterSpacing={2}>
				GOVERNOR
			</text>
			<text x={x - 95} y={carY + carH / 2 + 7} textAnchor="middle" fill={C.white} fontFamily={FONT_BODY} fontWeight={700} fontSize={18} letterSpacing={2}>
				CAR
			</text>
			<text x={(rL + rR) / 2} y={bot + 56} textAnchor="middle" fill={C.mute} fontFamily={FONT_BODY} fontWeight={700} fontSize={16} letterSpacing={2}>
				TENSION SHEAVE
			</text>
		</g>
	);
};

/* 6 — Overspeed governor: name, speed detector, rope loop, normal speed, overspeed trip. */
export const GovernorScene: React.FC<SceneProps> = ({t, layout}) => {
	const {L, W, H} = dims(layout);
	const id = `gv-${layout}`;
	const gx = L ? 1340 : 540;
	const gy = L ? 440 : 820;
	const gs = 1.2;
	const t0 = S.governorName - 0.3;
	const spin = travel(t0, t, (x) => 120 * govSpeed(x));
	const ropePhase = (spin * Math.PI * 150) / 180;
	const fly = 0.04 + ramp(t, OVER0 + 0.3, TRIP - 0.1) * 0.96;
	const trip = ramp(t, TRIP, TRIP + 0.25);
	const clamp = ramp(t, GRIP - 0.2, GRIP + 0.15);
	const intro = ramp(t, S.governorName - 0.2, S.governorName + 1.2);
	const zoom = 0.92 + intro * 0.08 + ramp(t, S.trips, TRIP) * 0.05;
	const ropeFocus = ramp(t, S.separateRope, S.separateRope + 0.8) * (1 - ramp(t, S.normalSpeed, S.normalSpeed + 0.6));
	const flash = t > TRIP ? Math.max(0, 1 - (t - TRIP) * 2.5) : 0;
	const gripFlash = t > GRIP ? Math.max(0, 1 - (t - GRIP) * 2) : 0;
	const carTravel = travel(S.governorName, t, (x) => 0.022 * govSpeed(x) + 0.02 * ramp(x, OVER0, TRIP));
	const vNorm = 0.42 + ramp(t, OVER0, TRIP) * 0.5 - ramp(t, GRIP, GRIP + 1) * 0.0;
	const hot = Math.max(trip, ramp(t, TRIP - 1.2, TRIP));
	const panel = L ? {x: 110, y: 330, w: 560, h: 680} : {x: 90, y: 1400, w: 900, h: 320};
	const pa = ramp(t, S.speedDetector - 0.2, S.speedDetector + 0.4);
	const cfa = ramp(t, OVER0 + 0.6, OVER0 + 1.1) * (1 - ramp(t, TRIP, TRIP + 0.3));
	return (
		<AbsoluteFill>
			<Backdrop layout={layout} grid={0.55} />
			<Glow x={gx} y={gy} size={L ? 900 : 1000} color={hot > 0.5 ? 'orange' : 'cyan'} opacity={0.3 + 0.15 * Math.sin(t * 2)} />
			<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute'}}>
				<Defs id={id} />
				<g transform={`translate(${gx} ${gy}) scale(${zoom}) translate(${-gx} ${-gy})`}>
					<Governor id={id} x={gx} y={gy} s={gs} spin={spin} fly={fly} trip={trip} clamp={clamp} ropePhase={ropePhase} ropeLen={420} hot={hot} />
					{ropeFocus > 0 ? <rect x={gx + 150 * gs - 14} y={gy} width={28} height={420 * gs} rx={14} fill="none" stroke={C.cyan} strokeWidth={4} opacity={ropeFocus} /> : null}
					{/* centrifugal force arrows */}
					{cfa > 0
						? [30, 150, 210, 330].map((a) => {
								const r0 = 110 * gs;
								const r1 = 190 * gs;
								const rad = (a * Math.PI) / 180;
								return (
									<Arrow key={a} x1={gx + Math.cos(rad) * r0} y1={gy + Math.sin(rad) * r0} x2={gx + Math.cos(rad) * r1} y2={gy + Math.sin(rad) * r1} a={cfa} w={6} />
								);
						  })
						: null}
					{flash > 0 ? <SvgGlow x={gx + 184 * gs} y={gy - 130 * gs} r={200 * (1.5 - flash * 0.5)} color="orange" opacity={flash} /> : null}
					{gripFlash > 0 ? <SvgGlow x={gx + 150 * gs} y={gy + 220 * gs} r={180} color="orange" opacity={gripFlash} /> : null}
				</g>
				<SvgLabel t={t} at={S.governorName + 0.6} out={S.speedDetector} from={[gx, gy - 160 * gs]} to={[gx, gy - 160 * gs - 70]} text="Overspeed governor" color={C.orange} anchor="middle" size={L ? 32 : 32} />
				<SvgLabel t={t} at={S.speedDetector + 0.8} out={S.trips} from={[gx - 70 * gs, gy - 50 * gs]} to={L ? [gx - 330, gy + 70] : [200, gy + 250]} text="Flyweights" anchor={L ? 'end' : 'middle'} />
				<SvgLabel t={t} at={S.separateRope + 0.3} out={S.normalSpeed} from={[gx + 150 * gs, gy + 380 * gs]} to={L ? [gx + 250, gy + 470] : [gx + 250, gy + 400]} text="Governor rope" anchor={L ? 'start' : 'middle'} />
				<SvgLabel t={t} at={OVER0 + 0.6} out={TRIP} from={[gx + 110 * gs, gy - 90 * gs]} to={L ? [gx + 260, gy - 250] : [gx + 250, gy - 260]} text="Weights swing out" color={C.orange} anchor={L ? 'start' : 'middle'} size={L ? 28 : 28} />
				<SvgLabel t={t} at={TRIP} from={[gx + 184 * gs, gy - 130 * gs]} to={L ? [gx + 290, gy - 250] : [gx + 260, gy - 262]} text="Trip!" color={C.orange} anchor="middle" size={36} />
				<SvgLabel t={t} at={GRIP} from={[gx + 150 * gs + 50, gy + 220 * gs]} to={L ? [gx + 290, gy + 330] : [gx + 270, gy + 380]} text="Rope gripped" color={C.orange} anchor="middle" size={L ? 30 : 30} />
				{pa > 0 ? (
					<g>
						<Panel x={panel.x} y={panel.y} w={panel.w} h={panel.h} title={L ? 'Speed check' : undefined} a={pa} />
						{L ? (
							<>
								<g opacity={pa}>
									<SpeedDial x={panel.x + 170} y={panel.y + 260} s={0.88} v={Math.min(vNorm, 0.97)} />
								</g>
								<Schematic x={panel.x + 430} y={panel.y + 70} h={panel.h - 110} d={carTravel} rope={ropePhase * 0.35} hot={hot} a={pa} />
								<text x={panel.x + 170} y={panel.y + 480} textAnchor="middle" fill={C.mute} fontFamily={FONT_BODY} fontWeight={600} fontSize={24} opacity={pa}>
									<tspan x={panel.x + 170} dy={0}>Rope speed =</tspan>
									<tspan x={panel.x + 170} dy={32}>car speed</tspan>
								</text>
							</>
						) : (
							<>
								<g opacity={pa}>
									<SpeedDial x={panel.x + 180} y={panel.y + 170} s={0.95} v={Math.min(vNorm, 0.97)} />
								</g>
								<g transform={`translate(${panel.x + 600} ${panel.y}) rotate(0)`}>
									<Schematic x={70} y={-6} h={panel.h + 12} d={carTravel} rope={ropePhase * 0.35} hot={hot} a={pa} />
								</g>
								<text x={panel.x + 780} y={panel.y + 150} fill={C.mute} fontFamily={FONT_BODY} fontWeight={600} fontSize={24} opacity={pa}>
									<tspan x={panel.x + 760} dy={0}>Rope</tspan>
									<tspan x={panel.x + 760} dy={30}>moves</tspan>
									<tspan x={panel.x + 760} dy={30}>with</tspan>
									<tspan x={panel.x + 760} dy={30}>the car</tspan>
								</text>
							</>
						)}
					</g>
				) : null}
			</svg>
			<Headline t={t} at={S.governorName} out={S.speedDetector - 0.05} layout={layout} kicker="Hidden above the shaft" title={<>The <Hi>overspeed governor.</Hi></>} width={L ? 820 : 940} />
			<Headline t={t} at={S.speedDetector} out={S.separateRope - 0.05} layout={layout} kicker="Think of it as" title={<>A mechanical <Hi>speed detector.</Hi></>} width={L ? 820 : 940} />
			<Headline t={t} at={S.separateRope} out={S.normalSpeed - 0.05} layout={layout} kicker="A separate rope" title={<>It moves <Hi>with the car</Hi>, spinning the wheel.</>} width={L ? 820 : 940} size={L ? 58 : 66} />
			<Headline t={t} at={S.normalSpeed} out={S.trips - 0.05} layout={layout} kicker="Normal speed" title={<>Nothing <Hi c={C.cyan}>happens.</Hi></>} width={L ? 820 : 940} />
			<Headline t={t} at={S.trips} layout={layout} kicker="Past the speed limit" title={<>The governor <Hi>trips</Hi> and grabs the rope.</>} width={L ? 820 : 940} size={L ? 60 : 68} />
			<Chip t={t} at={S.normalSpeed + 0.3} out={S.trips + 0.3} x={L ? gx : 540} y={L ? 975 : 1320} anchor="center" text="Normal speed · no action" color={C.cyan} size={L ? 26 : 28} />
			<Chip t={t} at={S.trips + 0.4} out={TRIP} x={L ? gx : 540} y={L ? 975 : 1320} anchor="center" text="Overspeed" color={C.orange} size={L ? 26 : 28} />
			<Chip t={t} at={GRIP + 0.1} x={L ? gx : 540} y={L ? 975 : 1320} anchor="center" text="Rope held → safeties pulled" color={C.orange} size={L ? 26 : 28} />
		</AbsoluteFill>
	);
};

/* 7 — Safety gear: wedges grip the guide rails and stop the car. */
const BRAKE0 = S.activates + 1.9;
const STOP = S.gripRails + 1.4;
const safetySpeed = (x: number) => {
	if (x < BRAKE0) return 950;
	return 950 * Math.pow(1 - ramp(x, BRAKE0, STOP, (p) => p), 1.6);
};

const Steps: React.FC<{t: number; x: number; y: number; size: number; lh: number; items: {at: number; lines: string[]; color?: string}[]}> = ({
	t,
	x,
	y,
	size,
	lh,
	items,
}) => {
	let yy = y;
	return (
		<g>
			{items.map((it, i) => {
				const a = ramp(t, it.at, it.at + 0.5);
				const y0 = yy;
				yy += it.lines.length * lh + lh * 0.7;
				return (
					<g key={i} opacity={a} transform={`translate(${(1 - a) * 20} 0)`}>
						<circle cx={x + 16} cy={y0 - size * 0.35} r={16} fill={it.color ?? C.orange} />
						<text x={x + 16} y={y0 - size * 0.35 + 7} textAnchor="middle" fill={C.navy} fontFamily={FONT_BODY} fontWeight={800} fontSize={20}>
							{i + 1}
						</text>
						<text x={x + 48} y={y0} fill={C.white} fontFamily={FONT_BODY} fontWeight={600} fontSize={size}>
							{it.lines.map((l, k) => (
								<tspan key={k} x={x + 48} dy={k === 0 ? 0 : lh}>
									{l}
								</tspan>
							))}
						</text>
					</g>
				);
			})}
		</g>
	);
};

export const SafetyScene: React.FC<SceneProps> = ({t, layout}) => {
	const {L, W, H} = dims(layout);
	const id = `sf-${layout}`;
	const cx = L ? 560 : 540;
	const s = L ? 1.3 : 1.15;
	const carY = L ? 240 : 470;
	const d = travel(S.activates - 0.4, t, safetySpeed);
	const v = safetySpeed(t);
	const lever = ramp(t, S.activates + 0.4, S.activates + 1.6);
	const engage = ramp(t, S.activates + 1.4, BRAKE0 + 0.5);
	const braking = t > BRAKE0 && v > 20;
	const stopped = t >= STOP;
	const fr = Math.floor(t * 30);
	const shake = braking ? (rand(fr) - 0.5) * 6 * (v / 950) : 0;
	const [lx, ly] = leverTip(lever);
	const rx = cx + lx * s;
	const ry = carY + ly * s;
	const settle = stopped ? Math.exp(-(t - STOP) * 6) * Math.sin((t - STOP) * 25) * 5 : 0;
	const gearY = carY + 432 * s;
	const panel = L ? {x: 1090, y: 290, w: 740, h: 720} : {x: 70, y: 1170, w: 940, h: 560};
	const detail = L ? {x: 1290, y: 650, s: 0.95} : {x: 300, y: 1460, s: 0.78};
	const pa = ramp(t, S.activates + 0.8, S.activates + 1.4);
	const steps = L ? {x: 1510, y: 450, size: 27, lh: 36} : {x: 540, y: 1290, size: 28, lh: 36};
	const arrowA = ramp(t, BRAKE0 - 0.3, BRAKE0 + 0.2);
	const sq = ramp(t, S.gripRails - 0.2, S.gripRails + 0.4);
	return (
		<AbsoluteFill>
			<Backdrop layout={layout} grid={0.45} />
			<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute'}}>
				<Defs id={id} />
				<g transform={`translate(${shake} ${settle})`}>
					<Shaft id={id} x={cx - 380 * s} w={760 * s} y1={-40} y2={H + 40} scroll={-d} floorGap={L ? 620 : 700} streak={Math.min(1, v / 950) * 0.6} />
					<Rail id={id} x={cx - 200 * s} y1={-40} y2={H + 40} glow={ramp(t, S.gripRails, S.gripRails + 0.5)} />
					<Rail id={id} x={cx + 200 * s} y1={-40} y2={H + 40} glow={ramp(t, S.gripRails, S.gripRails + 0.5)} />
					{[-2, -1, 0, 1, 2].map((k) => (
						<Rope key={k} x1={cx + k * 12} y1={-40} x2={cx + k * 12} y2={carY - 18 * s} w={7} phase={d} />
					))}
					{/* governor rope: held still by the governor, so its lay pattern does not move */}
					<Rope x1={rx} y1={-40} x2={rx} y2={ry} w={8} phase={0} color="#FFC79A" />
					<Car id={id} x={cx} y={carY} s={s} lever={lever} engage={engage} />
					{braking || (engage > 0.5 && !stopped)
						? [-1, 1].map((k) => (
								<g key={k}>
									<SvgGlow x={cx + k * 200 * s} y={gearY} r={170} color="orange" opacity={0.6 + rand(fr + k) * 0.4} />
									{Array.from({length: 7}).map((_, i) => {
										const sx = cx + k * 200 * s + (rand(fr * 7 + i + k) - 0.5) * 30;
										const len = 30 + rand(fr * 3 + i) * 70;
										return <line key={i} x1={sx} y1={gearY - 30} x2={sx + (rand(i + fr) - 0.5) * 60} y2={gearY - 30 - len} stroke={i % 2 ? C.orange : C.white} strokeWidth={3} strokeLinecap="round" />;
									})}
								</g>
						  ))
						: null}
					{stopped ? [-1, 1].map((k) => <SvgGlow key={k} x={cx + k * 200 * s} y={gearY} r={120} color="orange" opacity={0.55} />) : null}
				</g>
				<SvgLabel t={t} at={S.activates + 0.3} out={S.cleverPart} from={[rx, L ? 140 : 300]} to={[rx - 40, L ? 90 : 250]} text="Rope held" color={C.orange} anchor="end" size={26} />
				<SvgLabel t={t} at={BRAKE0} from={[cx - 200 * s, gearY + 10]} to={L ? [200, gearY + 150] : [180, gearY + 130]} text="Safety gear" color={C.orange} anchor="middle" size={L ? 28 : 28} />
				<SvgLabel t={t} at={S.gripRails + 0.2} from={[cx + 200 * s, gearY + 120]} to={L ? [cx + 360, gearY + 200] : [860, gearY + 130]} text="Guide rail" color={C.cyan} anchor="middle" size={L ? 28 : 28} />
				{pa > 0 ? (
					<g>
						<Panel x={panel.x} y={panel.y} w={panel.w} h={panel.h} title="Inside the safety gear" a={pa} color={C.orange} />
						<SafetyDetail id={id} x={detail.x} y={detail.y} s={detail.s} engage={engage} slide={-d * 0.25} a={pa} />
						<g opacity={pa}>
							<Arrow x1={detail.x - 70 * detail.s} y1={detail.y + 230 * detail.s} x2={detail.x - 70 * detail.s} y2={detail.y + 150 * detail.s} a={arrowA} color={C.orange} />
							<Arrow x1={detail.x + 70 * detail.s} y1={detail.y + 230 * detail.s} x2={detail.x + 70 * detail.s} y2={detail.y + 150 * detail.s} a={arrowA} color={C.orange} />
							<Arrow x1={detail.x - 210 * detail.s} y1={detail.y} x2={detail.x - 120 * detail.s} y2={detail.y} a={sq} color={C.cyan} />
							<Arrow x1={detail.x + 210 * detail.s} y1={detail.y} x2={detail.x + 120 * detail.s} y2={detail.y} a={sq} color={C.cyan} />
						</g>
						<Steps
							t={t}
							x={steps.x}
							y={steps.y}
							size={steps.size}
							lh={steps.lh}
							items={[
								{at: S.activates + 1.4, lines: ['Held rope lifts', 'the lever & rods']},
								{at: BRAKE0, lines: ['Wedges ride up', 'the tapered block']},
								{at: S.gripRails + 0.3, lines: ['They squeeze the', 'guide rail', '(both sides)'], color: C.cyan},
								{at: STOP - 0.2, lines: ['Friction stops', 'the car']},
							]}
						/>
					</g>
				) : null}
			</svg>
			<Headline t={t} at={S.activates} out={S.gripRails - 0.05} layout={layout} kicker="Governor trips →" title={<>Safety brakes <Hi>on the car</Hi> activate.</>} x={L ? 1090 : undefined} y={L ? 70 : undefined} width={L ? 760 : 940} size={L ? 52 : 66} />
			<Headline t={t} at={S.gripRails} layout={layout} kicker="Not the hoist rope —" title={<>They grip the <Hi>guide rails.</Hi></>} x={L ? 1090 : undefined} y={L ? 70 : undefined} width={L ? 760 : 940} size={L ? 52 : 66} />
			<Chip t={t} at={STOP + 0.1} x={cx} y={L ? 960 : 1090} anchor="center" text="Car stopped" color={C.orange} size={L ? 30 : 30} />
		</AbsoluteFill>
	);
};
