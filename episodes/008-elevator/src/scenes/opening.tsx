import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Car, Defs, Governor, Rail, Rope, Shaft} from '../art';
import {C, FONT_BODY, FONT_HEAD, Layout, ramp, rand} from '../theme';
import {S} from '../timeline';
import {Backdrop, Caption, Glow, Headline, Hi, SvgGlow, SvgLabel} from '../ui';

export type SceneProps = {t: number; layout: Layout};
export const dims = (layout: Layout) => (layout === 'landscape' ? {L: true, W: 1920, H: 1080} : {L: false, W: 1080, H: 1920});

/* 1 — HOOK: hypothetical cable snap, the camera drops with the car, sudden stop-frame. */
export const HookScene: React.FC<SceneProps> = ({t, layout}) => {
	const {L, W, H} = dims(layout);
	const id = `hk-${layout}`;
	const cx = L ? 1210 : 540;
	const s = L ? 1.0 : 1.25;
	const baseY = L ? 330 : 700;
	const snapT = 1.1;
	const stopT = 3.45;
	const ft = Math.max(0, Math.min(t, stopT) - snapT);
	const drop = 0.5 * 2400 * ft * ft;
	const speed = 2400 * ft;
	const stopped = t >= stopT;
	const st = t - stopT;
	const jolt = stopped ? Math.exp(-st * 8) * Math.sin(st * 38) * 16 : 0;
	const lag = ramp(t, snapT, snapT + 1.0) * (L ? 90 : 150) - (stopped ? ramp(t, stopT, stopT + 0.25) * 30 : 0);
	const carY = baseY + lag + jolt;
	const shakeAmp = stopped ? Math.max(0, 1 - st * 4) * 14 : Math.min(speed / 5600, 1) * 7;
	const fr = Math.floor(t * 30);
	const sx = (rand(fr) - 0.5) * shakeAmp;
	const sy = (rand(fr + 99) - 0.5) * shakeAmp;
	const breakY = baseY - 250 * s;
	const recoil = ramp(t, snapT, snapT + 0.6) * 520;
	const ropeX = cx;
	const hang = Math.sin(t * 2.3) * 4 * (1 - ramp(t, snapT - 0.2, snapT));
	const flash = stopped ? Math.max(0, 1 - st * 3.2) : 0;
	const sparks = t > snapT ? Math.max(0, 1 - (t - snapT) * 2.2) : 0;
	const engage = stopped ? 1 : 0;
	return (
		<AbsoluteFill>
			<Backdrop layout={layout} grid={0.4} />
			<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute'}}>
				<Defs id={id} />
				<g transform={`translate(${sx} ${sy})`}>
					<Shaft id={id} x={cx - 300 * s} w={600 * s} y1={-40} y2={H + 40} scroll={-drop + 140} floorGap={L ? 560 : 640} streak={stopped ? 0 : Math.min(speed / 3000, 1)} />
					<Rail id={id} x={cx - 200 * s} y1={-40} y2={H + 40} />
					<Rail id={id} x={cx + 200 * s} y1={-40} y2={H + 40} />
					{/* rope: intact, then a whipping upper end and a slack tail riding down with the car */}
					{t < snapT ? (
						<Rope x1={ropeX} y1={-40} x2={ropeX + hang} y2={carY - 18 * s} w={16} />
					) : (
						<g>
							<path
								d={`M ${ropeX} -40 Q ${ropeX + 40 + Math.sin(t * 14) * 30 * (1 - ramp(t, snapT, snapT + 1.4))} ${(breakY - recoil) * 0.5} ${ropeX - 30} ${breakY - recoil}`}
								fill="none"
								stroke="#AFC2E2"
								strokeWidth={16}
								strokeLinecap="round"
							/>
							<path
								d={`M ${ropeX} ${carY - 18 * s} Q ${ropeX - 50} ${carY - 140 * s} ${ropeX + 20 + Math.sin(t * 11) * 25} ${carY - 250 * s}`}
								fill="none"
								stroke="#AFC2E2"
								strokeWidth={16}
								strokeLinecap="round"
							/>
							{/* frayed ends */}
							{[-1, 0, 1].map((k) => (
								<line key={k} x1={ropeX - 30} y1={breakY - recoil} x2={ropeX - 30 + k * 14} y2={breakY - recoil + 26} stroke={C.orange} strokeWidth={4} strokeLinecap="round" />
							))}
						</g>
					)}
					{sparks > 0 ? (
						<g opacity={sparks}>
							<SvgGlow x={ropeX} y={breakY} r={220 * (1.4 - sparks * 0.4)} color="orange" />
							{Array.from({length: 14}).map((_, i) => {
								const a = rand(i) * Math.PI * 2;
								const r0 = 30 + (1 - sparks) * 260 * (0.5 + rand(i + 7));
								return (
									<line
										key={i}
										x1={ropeX + Math.cos(a) * r0}
										y1={breakY + Math.sin(a) * r0}
										x2={ropeX + Math.cos(a) * (r0 + 36)}
										y2={breakY + Math.sin(a) * (r0 + 36)}
										stroke={i % 3 ? C.orange : C.white}
										strokeWidth={4}
										strokeLinecap="round"
									/>
								);
							})}
						</g>
					) : null}
					<Car id={id} x={cx} y={carY} s={s} engage={engage} showLinkage={false} />
					{stopped
						? [-1, 1].map((d) => <SvgGlow key={d} x={cx + d * 200 * s} y={carY + 432 * s} r={150 * (1 + flash)} color="orange" opacity={0.9} />)
						: null}
				</g>
			</svg>
			{/* stop-frame: flash + frame brackets */}
			{flash > 0 ? <AbsoluteFill style={{background: C.white, opacity: flash * 0.55}} /> : null}
			{stopped ? <StopFrame W={W} H={H} a={ramp(t, stopT, stopT + 0.2)} /> : null}
			<Headline t={t} at={0.1} out={S.whatStops - 0.05} layout={layout} kicker="Hypothetical" title={<>The cable <Hi>snaps.</Hi></>} size={L ? 80 : 84} />
			<Headline t={t} at={S.whatStops} layout={layout} kicker="Hypothetical" title={<>What stops the car from <Hi>falling?</Hi></>} width={L ? 700 : 940} size={L ? 80 : 84} />
		</AbsoluteFill>
	);
};

const StopFrame: React.FC<{W: number; H: number; a: number}> = ({W, H, a}) => {
	const m = 44;
	const l = 90;
	const corner = (x: number, y: number, dx: number, dy: number) => (
		<path d={`M ${x} ${y + dy * l} L ${x} ${y} L ${x + dx * l} ${y}`} fill="none" stroke={C.orange} strokeWidth={6} />
	);
	return (
		<svg width={W} height={H} style={{position: 'absolute', opacity: a}}>
			{corner(m, m, 1, 1)}
			{corner(W - m, m, -1, 1)}
			{corner(m, H - m, 1, -1)}
			{corner(W - m, H - m, -1, -1)}
		</svg>
	);
};

/* 2 — Not a giant cushion. */
export const CushionScene: React.FC<SceneProps> = ({t, layout}) => {
	const {L, W, H} = dims(layout);
	const id = `cu-${layout}`;
	const cx = L ? 1210 : 540;
	const s = L ? 1.0 : 1.25;
	const pitY = L ? 900 : 1540;
	const pan = (1 - ramp(t, S.notCushion - 0.2, S.notCushion + 0.9)) * (L ? 500 : 700);
	const puff = 1 + Math.sin(t * 3) * 0.015;
	const xA = ramp(t, 5.55, 5.85);
	const xB = ramp(t, 5.75, 6.05);
	const deflate = ramp(t, 6.2, 7.2);
	return (
		<AbsoluteFill>
			<Backdrop layout={layout} grid={0.4} />
			<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute'}}>
				<Defs id={id} />
				<g transform={`translate(0 ${-pan})`}>
					<Shaft id={id} x={cx - 300 * s} w={600 * s} y1={-800} y2={pitY + 400} scroll={pitY - 30} floorGap={L ? 560 : 640} />
					<Rail id={id} x={cx - 200 * s} y1={-800} y2={pitY} />
					<Rail id={id} x={cx + 200 * s} y1={-800} y2={pitY} />
					<rect x={cx - 300 * s} y={pitY} width={600 * s} height={400} fill="#0A1736" />
					<rect x={cx - 300 * s} y={pitY} width={600 * s} height={8} fill="#2C4A80" />
					<Car id={id} x={cx} y={L ? -230 : -60} s={s} showLinkage={false} engage={1} />
					{/* the imagined giant cushion */}
					<g transform={`translate(${cx} ${pitY}) scale(${puff} ${puff * (1 - deflate * 0.55)})`} opacity={1 - deflate * 0.6}>
						<path
							d={`M ${-270 * s} 0 C ${-300 * s} ${-130 * s} ${-200 * s} ${-230 * s} 0 ${-215 * s} C ${200 * s} ${-230 * s} ${300 * s} ${-130 * s} ${270 * s} 0 Z`}
							fill="#F3D9C0"
							stroke={C.white}
							strokeWidth={4}
						/>
						<path d={`M ${-150 * s} ${-120 * s} Q 0 ${-70 * s} ${150 * s} ${-120 * s}`} fill="none" stroke="#C8A88C" strokeWidth={5} />
						<path d={`M ${-200 * s} ${-60 * s} Q 0 ${-20 * s} ${200 * s} ${-60 * s}`} fill="none" stroke="#C8A88C" strokeWidth={5} />
						<circle cx={0} cy={-150 * s} r={9} fill="#C8A88C" />
					</g>
					<SvgLabel t={t} at={4.9} out={6.3} from={[cx + 160 * s, pitY - 150 * s]} to={[cx + (L ? 360 : 140) * s, pitY - (L ? 300 : 330) * s]} text="Giant cushion?" color={C.mute} />
					{/* strike-through X */}
					<g stroke={C.orange} strokeWidth={22} strokeLinecap="round" opacity={xA > 0 ? 1 : 0}>
						<line x1={cx - 230 * s} y1={pitY - 260 * s} x2={cx - 230 * s + 460 * s * xA} y2={pitY - 260 * s + 280 * s * xA} />
						<line x1={cx + 230 * s} y1={pitY - 260 * s} x2={cx + 230 * s - 460 * s * xB} y2={pitY - 260 * s + 280 * s * xB} />
					</g>
				</g>
			</svg>
			<Headline t={t} at={S.notCushion + 0.1} layout={layout} title={<>The answer <Hi>isn&apos;t</Hi> a giant cushion.</>} width={L ? 640 : 940} />
		</AbsoluteFill>
	);
};

/* 3 — A hidden machine, protecting elevators for 170+ years. */
export const HiddenScene: React.FC<SceneProps> = ({t, layout}) => {
	const {L, W, H} = dims(layout);
	const id = `hd-${layout}`;
	const gx = L ? 1290 : 540;
	const gy = L ? 500 : 930;
	const gs = L ? 1.15 : 1.3;
	const tilt = (1 - ramp(t, S.hiddenMachine - 0.2, S.hiddenMachine + 1.6)) * 700;
	const reveal = ramp(t, 8.0, 9.6);
	const sweep = Math.sin((t - 7.5) * 0.9) * 140;
	const years = Math.round(ramp(t, 10.0, 11.8) * 170);
	const plus = ramp(t, 11.8, 12.1);
	const counterY = L ? 610 : 1530;
	return (
		<AbsoluteFill>
			<Backdrop layout={layout} grid={0.5} />
			<Glow x={gx + sweep} y={gy - 60 - tilt} size={(L ? 900 : 1000) * (0.6 + reveal * 0.5)} color="cyan" opacity={0.25 + reveal * 0.45} />
			<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute'}}>
				<Defs id={id} />
				<g transform={`translate(0 ${-tilt})`}>
					{/* machine-room floor above the shaft */}
					<rect x={0} y={gy + 270 * gs} width={W} height={40} fill="#132A55" />
					<rect x={0} y={gy + 270 * gs} width={W} height={5} fill="#2C4A80" />
					<rect x={gx + 120 * gs} y={gy + 300 * gs} width={60 * gs} height={900} fill="#06102A" />
					<g opacity={0.25 + reveal * 0.75}>
						<Governor id={id} x={gx} y={gy} s={gs} spin={t * 40} fly={0} trip={0} clamp={0} ropePhase={t * 60} ropeLen={420} />
					</g>
					<rect x={gx - 260 * gs} y={gy - 200 * gs} width={600 * gs} height={500 * gs} fill={C.navy} opacity={(1 - reveal) * 0.55} />
				</g>
				<SvgLabel t={t} at={9.0} out={13.6} from={[gx, gy - 150 * gs]} to={[gx, gy - 250 * gs - 20]} text="Hidden machine" color={C.cyan} anchor="middle" />
			</svg>
			<Headline t={t} at={S.hiddenMachine + 0.1} layout={layout} title={<>A <Hi>hidden machine</Hi> above the shaft.</>} width={L ? 700 : 940} />
			{years > 0 ? (
				<div
					style={{
						position: 'absolute',
						left: L ? 110 : 0,
						width: L ? 1000 : W,
						top: counterY,
						textAlign: L ? 'left' : 'center',
						opacity: ramp(t, 9.9, 10.3),
					}}
				>
					<div style={{fontFamily: FONT_HEAD, fontWeight: 900, fontSize: L ? 170 : 190, color: C.orange, lineHeight: 1}}>
						{years}
						<span style={{opacity: plus}}>+</span>
					</div>
					<div style={{fontFamily: FONT_BODY, fontWeight: 700, fontSize: L ? 34 : 38, letterSpacing: 6, color: C.white, marginTop: 8}}>
						YEARS PROTECTING ELEVATORS
					</div>
				</div>
			) : null}
			<Caption t={t} at={11.0} x={L ? 110 : 0} y={counterY + (L ? 250 : 270)} width={L ? 700 : W} align={L ? 'left' : 'center'} size={L ? 30 : 34}>
				<span style={{color: C.mute}}>1854 → today</span>
			</Caption>
		</AbsoluteFill>
	);
};
