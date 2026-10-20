import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Car, Defs, leverTip, Rail, Rope, Shaft, SpeedDial} from '../art';
import {C, FONT_BODY, ramp} from '../theme';
import {FPS, S} from '../timeline';
import {Backdrop, Caption, Chip, Glow, Headline, Hi, Panel, SvgGlow, SvgLabel} from '../ui';
import {dims, SceneProps} from './opening';

/** Integrate a speed function (px/s) from t0 to t on the 30 fps grid: deterministic per frame. */
export const travel = (t0: number, t: number, v: (x: number) => number) => {
	let d = 0;
	const step = 1 / FPS;
	for (let x = t0; x < t; x += step) d += v(x) * step;
	return d;
};

/** Cross-section of a 6-strand steel wire rope. */
const RopeSection: React.FC<{x: number; y: number; r: number; a: number; spin: number}> = ({x, y, r, a, spin}) => {
	const sr = r * 0.32;
	return (
		<g transform={`translate(${x} ${y}) rotate(${spin})`} opacity={a}>
			<circle r={r * 1.04} fill="#0B1838" stroke={C.cyan} strokeWidth={3} />
			<circle r={sr} fill="#C9A46A" stroke="#1A2C52" strokeWidth={2} />
			{[0, 1, 2, 3, 4, 5].map((i) => {
				const ang = (i * Math.PI) / 3;
				const cx = Math.cos(ang) * (r - sr - 4);
				const cy = Math.sin(ang) * (r - sr - 4);
				return (
					<g key={i} transform={`translate(${cx} ${cy})`}>
						<circle r={sr} fill="#2B4675" stroke="#AFC2E2" strokeWidth={2} />
						<circle r={sr * 0.33} fill="#DCE6F8" />
						{[0, 1, 2, 3, 4, 5].map((k) => (
							<circle key={k} cx={Math.cos((k * Math.PI) / 3) * sr * 0.64} cy={Math.sin((k * Math.PI) / 3) * sr * 0.64} r={sr * 0.3} fill="#B8C8E2" stroke="#1A2C52" strokeWidth={1} />
						))}
					</g>
				);
			})}
		</g>
	);
};

/* 4 — Several steel ropes + safety margins. */
export const RopesScene: React.FC<SceneProps> = ({t, layout}) => {
	const {L, W, H} = dims(layout);
	const id = `rp-${layout}`;
	const cx = L ? 1180 : 420;
	const s = L ? 0.95 : 1.0;
	const R = L ? 130 : 120;
	const shY = L ? 190 : 580;
	const carY = L ? 560 : 980;
	const cwY = L ? 620 : 1020;
	const zoom = 1.06 - ramp(t, S.firstRealize, S.severalRopes + 1) * 0.06;
	const spread = ramp(t, S.severalRopes + 0.2, S.severalRopes + 1.6) * (L ? 13 : 12);
	const n = 6;
	const dmg = ramp(t, S.safetyMargins + 0.3, S.safetyMargins + 1.0);
	const brk = ramp(t, S.safetyMargins + 1.4, S.safetyMargins + 2.4);
	const breakY = (shY + carY) / 2 + 30;
	const dip = Math.sin(ramp(t, S.safetyMargins + 1.4, S.safetyMargins + 2.0) * Math.PI) * 5;
	const share = ramp(t, S.safetyMargins + 2.2, S.safetyMargins + 3.0);
	const spin = Math.sin(t * 0.8) * 6;
	const inset = L ? {x: 110, y: 470, w: 560, h: 470} : {x: 90, y: 1450, w: 900, h: 270};
	const ia = ramp(t, S.severalRopes + 1.6, S.severalRopes + 2.2) * (1 - ramp(t, S.safetyMargins + 2.6, S.safetyMargins + 3.0));
	return (
		<AbsoluteFill>
			<Backdrop layout={layout} grid={0.5} />
			<Glow x={cx + R} y={shY} size={L ? 760 : 820} color="cyan" opacity={0.35} />
			<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute'}}>
				<Defs id={id} />
				<g transform={`translate(${cx} ${H / 2}) scale(${zoom}) translate(${-cx} ${-H / 2})`}>
					<Shaft id={id} x={cx - 270 * s} w={(270 + 2 * R + 90) * s + 20} y1={shY + 150} y2={H + 60} scroll={shY + 150 + 640} floorGap={640} />
					<Rail id={id} x={cx - 200 * s} y1={shY + 150} y2={H + 60} />
					<Rail id={id} x={cx + 200 * s} y1={shY + 150} y2={H + 60} />
					{/* machine room floor */}
					<rect x={0} y={shY + 130} width={W} height={24} fill="#132A55" />
					<rect x={0} y={shY + 130} width={W} height={4} fill="#2C4A80" />
					{/* motor housing */}
					<rect x={cx + 2 * R + 40} y={shY - 80} width={L ? 230 : 150} height={180} rx={24} fill="#1A3366" stroke="#6E8CC0" strokeWidth={3} />
					<rect x={cx + R - 10} y={shY - 12} width={R + 60} height={24} fill="#3E5683" />
					{/* counterweight */}
					<g transform={`translate(${cx + 2 * R} ${cwY})`}>
						<rect x={-44} y={0} width={88} height={300} rx={8} fill="#1F3664" stroke="#6E8CC0" strokeWidth={3} />
						{[0, 1, 2, 3, 4, 5].map((i) => (
							<line key={i} x1={-44} x2={44} y1={40 + i * 44} y2={40 + i * 44} stroke="#3E5A8C" strokeWidth={3} />
						))}
					</g>
					{/* ropes: car side and counterweight side */}
					{Array.from({length: n}).map((_, i) => {
						const off = (i - (n - 1) / 2) * spread;
						const isD = i === 1;
						const col = isD && dmg > 0 ? C.orange : share > 0 ? '#BFE8FB' : '#AFC2E2';
						const fall = brk * 160;
						return (
							<g key={i}>
								<Rope x1={cx + 2 * R + off} y1={shY} x2={cx + 2 * R + off} y2={cwY} w={L ? 6 : 6} />
								{isD && brk > 0 ? (
									<g>
										<Rope x1={cx + off} y1={shY} x2={cx + off} y2={breakY - brk * 60} w={6} color={col} />
										<Rope x1={cx + off - brk * 20} y1={breakY + 30 + fall * 0.2} x2={cx + off} y2={carY + dip - 18 * s} w={6} color={col} opacity={1 - brk * 0.5} />
									</g>
								) : (
									<Rope x1={cx + off} y1={shY} x2={cx + off} y2={carY + dip - 18 * s} w={6} color={col} />
								)}
							</g>
						);
					})}
					{/* drive (traction) sheave */}
					<circle cx={cx + R} cy={shY} r={R + 6} fill="none" stroke="#AFC2E2" strokeWidth={10} />
					<circle cx={cx + R} cy={shY} r={R - 4} fill="#16305F" stroke="#2C4A80" strokeWidth={4} />
					{[0, 72, 144, 216, 288].map((a) => (
						<rect key={a} x={cx + R - 6} y={shY - R + 20} width={12} height={R - 36} rx={5} fill="#2E4C83" transform={`rotate(${a + t * 4} ${cx + R} ${shY})`} />
					))}
					<circle cx={cx + R} cy={shY} r={24} fill="#AFC2E2" />
					<Car id={id} x={cx} y={carY + dip} s={s} />
					{dmg > 0 ? <SvgGlow x={cx - 1.5 * spread} y={breakY} r={130} color="orange" opacity={dmg * (1 - brk * 0.6)} /> : null}
				</g>
				<SvgLabel t={t} at={S.severalRopes + 0.9} out={S.safetyMargins} from={[cx, (shY + carY) / 2 - 60]} to={[L ? cx - 330 : cx + 300, L ? (shY + carY) / 2 - 120 : (shY + carY) / 2 + 30]} text="Steel ropes" anchor={L ? 'end' : 'start'} />
				<SvgLabel t={t} at={S.severalRopes + 2.2} out={S.safetyMargins} from={[cx + R, shY]} to={[L ? cx + R + 150 : cx + R + 110, shY - (L ? 130 : 110)]} text="Traction sheave" />
				<SvgLabel t={t} at={S.severalRopes + 3.2} out={S.tooFast} from={[cx + 2 * R, cwY + 150]} to={[cx + 2 * R + (L ? 150 : 90), cwY + (L ? 230 : 330)]} text="Counterweight" size={L ? 28 : 26} />
				{ia > 0 ? (
					<g>
						<Panel x={inset.x} y={inset.y} w={inset.w} h={inset.h} title="Steel wire rope · cross-section" a={ia} />
						<RopeSection x={inset.x + (L ? inset.w / 2 : 190)} y={inset.y + (L ? 255 : 150)} r={L ? 150 : 92} a={ia} spin={t * 6 + spin} />
						<text
							x={L ? inset.x + inset.w / 2 : inset.x + 360}
							y={L ? inset.y + inset.h - 32 : inset.y + 140}
							textAnchor={L ? 'middle' : 'start'}
							fill={C.mute}
							fontFamily={FONT_BODY}
							fontWeight={600}
							fontSize={L ? 24 : 28}
							opacity={ia}
						>
							Many wires → strands → rope
						</text>
					</g>
				) : null}
			</svg>
			<Headline t={t} at={S.firstRealize + 0.05} out={S.severalRopes - 0.05} layout={layout} kicker="Traction elevator" title={<>Here&apos;s what most people <Hi>don&apos;t realize.</Hi></>} width={L ? 760 : 940} />
			<Headline t={t} at={S.severalRopes} out={S.safetyMargins - 0.05} layout={layout} kicker="Traction elevator" title={<>It hangs from <Hi>several</Hi> steel ropes, not one.</>} width={L ? 760 : 940} />
			<Headline t={t} at={S.safetyMargins} layout={layout} kicker="Designed with" title={<>Safety <Hi>margins.</Hi></>} width={L ? 760 : 940} />
			<Chip t={t} at={S.safetyMargins + 2.6} x={L ? 110 : 540} y={L ? 470 : 1500} anchor={L ? 'left' : 'center'} text="Other ropes share the load" color={C.cyan} size={L ? 28 : 30} />
			<Caption t={t} at={S.safetyMargins + 3.3} x={L ? 110 : 60} y={L ? 560 : 1600} width={L ? 720 : 960} size={L ? 52 : 52} align={L ? 'left' : 'center'}>
				One damaged rope <span style={{color: C.orange}}>≠</span> free fall.
			</Caption>
		</AbsoluteFill>
	);
};

/* 5 — Too fast → a second system takes over (governor rope revealed). */
const tooFastSpeed = (x: number) => 380 + ramp(x, S.tooFast + 0.6, S.tooFast + 3.8) * 1500;

export const TooFastScene: React.FC<SceneProps> = ({t, layout}) => {
	const {L, W, H} = dims(layout);
	const id = `tf-${layout}`;
	const cx = L ? 1020 : 470;
	const s = L ? 0.9 : 1.1;
	const carY = L ? 330 : 640;
	const d = travel(S.tooFast - 0.3, t, tooFastSpeed);
	const v = tooFastSpeed(t);
	const vNorm = 0.32 + ((v - 380) / 1500) * 0.6;
	const shake = Math.sin(t * 61) * ramp(t, S.tooFast + 2.5, S.tooFast + 4) * 3;
	const [lx, ly] = leverTip(0);
	const rx = cx + lx * s;
	const rTip = carY + ly * s;
	const rx2 = rx + 70;
	const reveal = ramp(t, S.secondSystem + 0.1, S.secondSystem + 1.4);
	const glowRope = ramp(t, S.secondSystem + 0.6, S.secondSystem + 1.6);
	const dial = L ? {x: 1610, y: 560, s: 1.15} : {x: 540, y: 1560, s: 0.95};
	return (
		<AbsoluteFill>
			<Backdrop layout={layout} grid={0.4} />
			<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute'}}>
				<Defs id={id} />
				<g transform={`translate(${shake} 0)`}>
					<Shaft id={id} x={cx - 280 * s} w={(560 + 130) * s} y1={-40} y2={H + 40} scroll={-d} floorGap={L ? 560 : 640} streak={ramp(t, S.tooFast + 2, S.tooFast + 4)} />
					<Rail id={id} x={cx - 200 * s} y1={-40} y2={H + 40} />
					<Rail id={id} x={cx + 200 * s} y1={-40} y2={H + 40} />
					{/* hoist ropes */}
					{[-2, -1, 0, 1, 2].map((k) => (
						<Rope key={k} x1={cx + k * 11} y1={-40} x2={cx + k * 11} y2={carY - 18 * s} w={6} phase={d} />
					))}
					{/* governor rope loop: attached side (moves with car) + return side */}
					<g opacity={reveal}>
						<Rope x1={rx} y1={-40} x2={rx} y2={rTip} w={7} phase={d} color="#BFE8FB" />
						<Rope x1={rx} y1={rTip} x2={rx} y2={H + 40} w={7} phase={d} color="#BFE8FB" />
						<Rope x1={rx2} y1={-40} x2={rx2} y2={H + 40} w={7} phase={-d} color="#BFE8FB" />
						<line x1={rx} y1={-40} x2={rx} y2={H + 40} stroke={C.cyan} strokeWidth={14} opacity={glowRope * 0.25} />
						<line x1={rx2} y1={-40} x2={rx2} y2={H + 40} stroke={C.cyan} strokeWidth={14} opacity={glowRope * 0.25} />
					</g>
					<Car id={id} x={cx} y={carY} s={s} />
				</g>
				<SvgLabel
					t={t}
					at={S.secondSystem + 0.9}
					from={[rx2, L ? 220 : 560]}
					to={[L ? rx2 + 150 : rx2 - 20, L ? 140 : 500]}
					text="Governor rope"
					color={C.cyan}
					anchor={L ? 'start' : 'end'}
				/>
				<g opacity={1 - reveal * 0.25}>
					<SpeedDial x={dial.x} y={dial.y} s={dial.s} v={Math.min(vNorm, 0.98)} />
				</g>
				{vNorm > 0.75 ? <SvgGlow x={dial.x} y={dial.y} r={260 * dial.s} color="orange" opacity={0.3 + Math.sin(t * 12) * 0.12} /> : null}
			</svg>
			<Headline t={t} at={S.tooFast + 0.05} out={S.secondSystem - 0.05} layout={layout} kicker="But what if…" title={<>The car starts moving <Hi>too fast?</Hi></>} width={L ? 640 : 940} />
			<Headline t={t} at={S.secondSystem} layout={layout} kicker="Safety layer two" title={<>A <Hi>second system</Hi> takes over.</>} width={L ? 640 : 940} />
		</AbsoluteFill>
	);
};
