import React from 'react';
import {Asteroid, Dart, Earth, Ejecta, ImpactFlash, Sun} from './art';
import {FINALE_HIT, HOOK_IMPACT, L, S, TEST_IMPACT} from './timeline';
import {C, FONT, easeInOut, lerp, pick, prog, useLayout, useTime, window01} from './theme';
import {Arrow, Chip, DrawPath, Headline, Kicker, Note, Scene} from './ui';

const deg = (a: number) => (a * Math.PI) / 180;

/** Small label with a title and sub-line. */
const Label: React.FC<{x: number; y: number; title: string; sub?: string; at: number; until?: number; anchor?: 'start' | 'middle' | 'end'; color?: string; size?: number}> = ({
	x,
	y,
	title,
	sub,
	at,
	until = 9999,
	anchor = 'middle',
	color = C.white,
	size = 30,
}) => {
	const t = useTime();
	const k = window01(t, at, until);
	if (k <= 0) return null;
	return (
		<g opacity={k}>
			<text x={x} y={y} fontFamily={FONT} fontWeight={800} fontSize={size} letterSpacing={size * 0.14} fill={color} textAnchor={anchor}>
				{title}
			</text>
			{sub ? (
				<text x={x} y={y + size * 1.2} fontFamily={FONT} fontWeight={500} fontSize={size * 0.8} fill={C.muted} textAnchor={anchor}>
					{sub}
				</text>
			) : null}
		</g>
	);
};

/* ================================================================== */
/* 1. HOOK — DART slams into Dimorphos                                 */
/* ================================================================== */
export const HookScene: React.FC = () => {
	const l = useLayout();
	const t = useTime();
	const dimo = pick(l, {x: 1330, y: 610, r: 250}, {x: 600, y: 1240, r: 330});
	const didy = pick(l, {x: 1760, y: 250, r: 200}, {x: 880, y: 780, r: 190});
	const dirA = deg(pick(l, 6, 55));
	const dir = {x: Math.cos(dirA), y: Math.sin(dirA)};
	const ip = {x: dimo.x - dir.x * dimo.r * 0.86, y: dimo.y - dir.y * dimo.r * 0.86};
	const approach = prog(t, -0.6, HOOK_IMPACT + 0.6, (x) => x);
	const dist = pick(l, 1250, 820);
	const dx = ip.x - dir.x * dist * (1 - approach);
	const dy = ip.y - dir.y * dist * (1 - approach);
	const dt = t - HOOK_IMPACT;
	const shakeAmp = dt > 0 && dt < 0.6 ? 14 * (1 - dt / 0.6) : 0;
	const shx = Math.sin(t * 97) * shakeAmp;
	const shy = Math.cos(t * 83) * shakeAmp;
	const zoom = 1 + 0.07 * prog(t, 0, HOOK_IMPACT, easeInOut) - 0.03 * prog(t, HOOK_IMPACT, 2);
	const nudge = prog(t, HOOK_IMPACT, 1.2) * 10;

	// Orbit arcs around Didymos: old (dashed) vs new (tighter) path.
	const R0 = Math.hypot(dimo.x - didy.x, dimo.y - didy.y);
	const a0 = Math.atan2(dimo.y - didy.y, dimo.x - didy.x);
	const arc = (rad: number, sweep: number) => {
		const ex = didy.x + Math.cos(a0 + sweep) * rad;
		const ey = didy.y + Math.sin(a0 + sweep) * rad;
		return `M${didy.x + Math.cos(a0) * rad},${didy.y + Math.sin(a0) * rad} A${rad},${rad} 0 0 1 ${ex},${ey}`;
	};
	const sweep = pick(l, 0.75, 0.9);
	const pk = prog(t, L.changedPath + 0.2, 1.6, easeInOut);

	const cx = l.W / 2;
	const cy = l.H / 2;
	return (
		<Scene from={S.hook[0]} to={S.hook[1]}>
			<g transform={`translate(${cx + shx},${cy + shy}) scale(${zoom}) translate(${-cx},${-cy})`}>
				<Asteroid id="hk-didy" kind="didymos" cx={didy.x} cy={didy.y} r={didy.r} seed={21} spin={t * 0.5} />
				<g opacity={pk}>
					<DrawPath d={arc(R0, sweep)} k={pk} stroke={C.cyan} width={4} dash="14 14" opacity={0.75} />
					<DrawPath d={arc(R0 * 0.9, sweep)} k={pk} stroke={C.orange} width={5} />
				</g>
				<g transform={`translate(${dir.x * nudge},${dir.y * nudge})`}>
					<Asteroid id="hk-dimo" kind="dimorphos" cx={dimo.x} cy={dimo.y} r={dimo.r} seed={8} spin={-t * 3} />
				</g>
				<Ejecta x={ip.x} y={ip.y} axis={(dirA * 180) / Math.PI + 180} dt={dt} scale={pick(l, 640, 600)} />
				{dt < 0 ? <Dart x={dx} y={dy} s={pick(l, 1.5, 1.35)} rot={(dirA * 180) / Math.PI} streak={1} t={t} /> : null}
				<ImpactFlash x={ip.x} y={ip.y} dt={dt} size={pick(l, 260, 280)} />
			</g>
			{l.v ? (
				<g>
					<Headline x={540} y={300} anchor="middle" size={86} at={-0.3} until={L.changedPath} lines={['NASA crashed', 'a spacecraft into', 'an *asteroid*.']} />
					<Headline x={540} y={330} anchor="middle" size={86} at={L.changedPath} until={L.sciFi} lines={['And it actually', 'changed its *path*.']} />
					<Headline x={540} y={360} anchor="middle" size={90} at={L.sciFi} until={L.happened} lines={['Science fiction?']} />
					<Headline x={540} y={360} anchor="middle" size={90} at={L.happened} lines={['It *really* happened.']} />
					<Chip x={540} y={480} anchor="middle" text="DART IMPACT — 2022" at={L.happened + 0.3} size={34} />
				</g>
			) : (
				<g>
					<Headline x={110} y={190} size={84} at={-0.3} until={L.changedPath} lines={['NASA crashed a spacecraft', 'into an *asteroid*.']} />
					<Headline x={110} y={190} size={84} at={L.changedPath} until={L.sciFi} lines={['And it actually', 'changed its *path*.']} />
					<Headline x={110} y={190} size={84} at={L.sciFi} until={L.happened} lines={['Science fiction?']} />
					<Headline x={110} y={190} size={84} at={L.happened} lines={['It *really* happened.']} />
					<Chip x={110} y={300} text="DART IMPACT — 2022" at={L.happened + 0.3} size={32} />
				</g>
			)}
		</Scene>
	);
};

/* ================================================================== */
/* 2. MISSION — what DART stands for                                   */
/* ================================================================== */
export const MissionScene: React.FC = () => {
	const l = useLayout();
	const t = useTime();
	const k = prog(t, S.mission[0] - 0.3, 1.2);
	const bob = Math.sin(t * 0.8) * 8;
	const big = (x: number, y: number, size: number, anchor: 'start' | 'middle') => (
		<text x={x} y={y} fontFamily={FONT} fontWeight={900} fontSize={size} fill={C.white} textAnchor={anchor} letterSpacing={size * 0.06} opacity={k}>
			DART
		</text>
	);
	return (
		<Scene from={S.mission[0]} to={S.mission[1]}>
			{l.v ? (
				<g>
					<Kicker x={540} y={300} anchor="middle" text="THE MISSION" at={S.mission[0]} />
					{big(540, 520, 220, 'middle')}
					<Headline x={540} y={620} anchor="middle" size={56} weight={700} at={L.dartName} lines={['*D*ouble *A*steroid', '*R*edirection *T*est']} />
					<Dart x={540 + bob * 0.5} y={1110 - (t - S.mission[0]) * 14} s={2.5} rot={-90} t={t} />
					<Chip x={540} y={1420} anchor="middle" text="DART IMPACT — 2022" at={L.launched + 0.5} size={32} />
					<Note x={540} y={1500} anchor="middle" size={26} text="Launched Nov. 24, 2021 · Impact Sept. 26, 2022" at={L.launched + 0.9} />
				</g>
			) : (
				<g>
					<Kicker x={115} y={250} text="THE MISSION" at={S.mission[0]} />
					{big(105, 470, 230, 'start')}
					<Headline x={115} y={580} size={62} weight={700} at={L.dartName} lines={['*D*ouble *A*steroid', '*R*edirection *T*est']} />
					<Chip x={115} y={820} text="DART IMPACT — 2022" at={L.launched + 0.5} size={32} />
					<Note x={115} y={905} size={26} text="Launched Nov. 24, 2021 · Impact Sept. 26, 2022" at={L.launched + 0.9} />
					<Dart x={1380 + (t - S.mission[0]) * 10} y={540 + bob} s={3.0} rot={-14 + Math.sin(t * 0.5) * 3} t={t} />
				</g>
			)}
		</Scene>
	);
};

/* ================================================================== */
/* 3. BINARY — Didymos and its moonlet Dimorphos                       */
/* ================================================================== */
const Binary: React.FC<{cx: number; cy: number; r: number; rx: number; ry: number; mr: number; t: number; showOrbit: number; id: string; ring: number}> = ({
	cx,
	cy,
	r,
	rx,
	ry,
	mr,
	t,
	showOrbit,
	id,
	ring,
}) => {
	const th = 2.4 + t * 0.32;
	const mx = cx + rx * Math.cos(th);
	const my = cy + ry * Math.sin(th);
	const front = Math.sin(th) > 0;
	const moon = (
		<g>
			<Asteroid id={`${id}-m`} kind="dimorphos" cx={mx} cy={my} r={mr} seed={8} spin={t * 10} />
			{ring > 0 ? <circle cx={mx} cy={my} r={mr * (1.6 + 0.6 * (1 - ring))} fill="none" stroke={C.orange} strokeWidth={4} opacity={ring} /> : null}
		</g>
	);
	return (
		<g>
			<ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke={C.cyan} strokeWidth={2.5} strokeDasharray="10 12" opacity={0.25 + 0.45 * showOrbit} />
			{!front && moon}
			<Asteroid id={`${id}-d`} kind="didymos" cx={cx} cy={cy} r={r} seed={21} spin={t * 0.5} />
			{front && moon}
		</g>
	);
};

export const BinaryScene: React.FC = () => {
	const l = useLayout();
	const t = useTime();
	const ring = prog(t, L.dimorphos, 0.6);
	const orbitK = prog(t, L.moonlet, 1);
	const g = pick(l, {cx: 640, cy: 590, r: 230, rx: 520, ry: 125, mr: 50}, {cx: 540, cy: 1060, r: 205, rx: 420, ry: 110, mr: 44});
	const th = 2.4 + t * 0.32;
	const mx = g.cx + g.rx * Math.cos(th);
	const my = g.cy + g.ry * Math.sin(th);
	return (
		<Scene from={S.binary[0]} to={S.binary[1]}>
			<Binary id="bn" {...g} t={t} showOrbit={orbitK} ring={ring} />
			<Label x={mx} y={my - g.mr * 1.6 - 70} title="DIMORPHOS" sub="≈ 160 m wide" at={L.dimorphos} color={C.orange} size={pick(l, 28, 28)} />
			<Label x={g.cx} y={g.cy + g.r + pick(l, 80, 75)} title="DIDYMOS" sub="≈ 780 m wide" at={L.moonlet + 0.4} size={28} />
			{l.v ? (
				<g>
					<Kicker x={540} y={280} anchor="middle" text="THE TARGET" at={S.binary[0]} />
					<Headline x={540} y={390} anchor="middle" size={84} at={L.target} until={L.dimorphos} lines={['Not a', '*planet-killer*.']} />
					<Headline x={540} y={390} anchor="middle" size={74} at={L.dimorphos} lines={['A tiny *moonlet*', 'orbiting a bigger', 'asteroid.']} />
					<Chip x={540} y={1490} anchor="middle" color={C.cyan} text="NEITHER THREATENS EARTH" at={L.target + 1.4} size={28} />
				</g>
			) : (
				<g>
					<Kicker x={1220} y={250} text="THE TARGET" at={S.binary[0]} />
					<Headline x={1220} y={350} size={84} at={L.target} until={L.dimorphos} lines={['Not a', '*planet-killer*.']} />
					<Headline x={1220} y={350} size={68} at={L.dimorphos} lines={['A tiny *moonlet*', 'orbiting a bigger', 'asteroid.']} />
					<Chip x={1220} y={640} color={C.cyan} text="NEITHER THREATENS EARTH" at={L.target + 1.4} size={26} />
					<Note x={1220} y={720} size={22} text="Sizes approximate (NASA)" at={L.target + 2} />
				</g>
			)}
		</Scene>
	);
};

/* ================================================================== */
/* 4. HIT IT — targeting reticle                                       */
/* ================================================================== */
export const HitScene: React.FC = () => {
	const l = useLayout();
	const t = useTime();
	const d = pick(l, {x: 1380, y: 560, r: 340}, {x: 540, y: 1180, r: 350});
	const lock = prog(t, L.hitIt, 0.45);
	const rr = d.r * (1.75 - 0.55 * lock);
	const col = lock > 0.6 ? C.orange : C.cyan;
	const rot = t * 25;
	return (
		<Scene from={S.hit[0]} to={S.hit[1]}>
			<Asteroid id="hit-dimo" kind="dimorphos" cx={d.x} cy={d.y} r={d.r} seed={8} spin={t * 4} />
			<g opacity={prog(t, L.goal + 0.3, 0.6)}>
				<circle cx={d.x} cy={d.y} r={rr} fill="none" stroke={col} strokeWidth={3} strokeDasharray="40 22" transform={`rotate(${rot} ${d.x} ${d.y})`} />
				<circle cx={d.x} cy={d.y} r={rr * 0.12} fill="none" stroke={col} strokeWidth={3} />
				{[0, 90, 180, 270].map((a) => (
					<line
						key={a}
						x1={d.x + Math.cos(deg(a)) * rr * 0.82}
						y1={d.y + Math.sin(deg(a)) * rr * 0.82}
						x2={d.x + Math.cos(deg(a)) * rr * 1.12}
						y2={d.y + Math.sin(deg(a)) * rr * 1.12}
						stroke={col}
						strokeWidth={5}
					/>
				))}
			</g>
			{l.v ? (
				<g>
					<Headline x={540} y={340} anchor="middle" size={84} at={L.goal} until={L.hitIt} lines={["NASA's goal was", '*simple*.']} />
					<Headline x={540} y={430} anchor="middle" size={150} weight={900} at={L.hitIt} until={L.why} lines={['*Hit* it.']} />
					<Headline x={540} y={560} anchor="middle" size={84} at={L.onPurpose} until={L.why} lines={['On purpose.']} />
					<Headline x={540} y={480} anchor="middle" size={210} weight={900} at={L.why} lines={['*Why?*']} />
				</g>
			) : (
				<g>
					<Headline x={120} y={460} size={84} at={L.goal} until={L.hitIt} lines={["NASA's goal was", '*simple*.']} />
					<Headline x={115} y={520} size={160} weight={900} at={L.hitIt} until={L.why} lines={['*Hit* it.']} />
					<Headline x={120} y={650} size={84} at={L.onPurpose} until={L.why} lines={['On purpose.']} />
					<Headline x={110} y={620} size={230} weight={900} at={L.why} lines={['*Why?*']} />
				</g>
			)}
		</Scene>
	);
};

/* ================================================================== */
/* 5. DEFENSE IDEA — a small early nudge becomes a big miss            */
/* ================================================================== */
const Burst: React.FC<{x: number; y: number; r: number; k: number}> = ({x, y, r, k}) => {
	if (k <= 0) return null;
	const pts: string[] = [];
	for (let i = 0; i < 16; i++) {
		const a = (i / 16) * Math.PI * 2;
		const rr = i % 2 ? r * 0.45 : r;
		pts.push(`${x + Math.cos(a) * rr},${y + Math.sin(a) * rr}`);
	}
	return (
		<g opacity={k}>
			<polygon points={pts.join(' ')} fill={C.orange} opacity={0.85} />
			<line x1={x - r * 1.1} y1={y + r * 1.1} x2={x + r * 1.1} y2={y - r * 1.1} stroke={C.white} strokeWidth={r * 0.16} strokeLinecap="round" />
		</g>
	);
};

export const DefenseScene: React.FC = () => {
	const l = useLayout();
	const t = useTime();
	const A = pick(l, {x: 210, y: 800}, {x: 190, y: 1430});
	const E = pick(l, {x: 1560, y: 470, r: 140}, {x: 760, y: 880, r: 170});
	const miss = pick(l, 290, 250);
	const len = Math.hypot(E.x - A.x, E.y - A.y);
	const a0 = Math.atan2(E.y - A.y, E.x - A.x);
	const delta = -Math.asin(miss / len);
	const far = len * 1.22;
	const newEnd = {x: A.x + Math.cos(a0 + delta) * far, y: A.y + Math.sin(a0 + delta) * far};
	const nearE = {x: A.x + Math.cos(a0 + delta) * len, y: A.y + Math.sin(a0 + delta) * len};
	const kOld = prog(t, L.headed + 0.4, 2.2, easeInOut);
	const kNudge = prog(t, L.nudge, 0.5);
	const kNew = prog(t, L.nudge + 0.4, 2.0, easeInOut);
	const kMiss = prog(t, L.nudge + 2.2, 0.6);
	const perp = {x: Math.cos(a0 + delta - Math.PI / 2), y: Math.sin(a0 + delta - Math.PI / 2)};
	const burstPos = pick(l, {x: A.x + 40, y: A.y - 170}, {x: A.x + 60, y: A.y - 180});
	return (
		<Scene from={S.defense[0]} to={S.defense[1]}>
			<Earth id="df-earth" cx={E.x} cy={E.y} r={E.r} t={t} />
			<DrawPath d={`M${A.x},${A.y} L${E.x - Math.cos(a0) * E.r},${E.y - Math.sin(a0) * E.r}`} k={kOld} stroke={C.orange} width={5} dash="16 14" opacity={1 - 0.55 * kNew} />
			<DrawPath d={`M${A.x},${A.y} L${newEnd.x},${newEnd.y}`} k={kNew} stroke={C.cyan} width={6} marker="arrowCyan" />
			{kMiss > 0 ? (
				<g opacity={kMiss}>
					<line x1={nearE.x} y1={nearE.y} x2={E.x + (nearE.x - E.x) * (E.r / miss)} y2={E.y + (nearE.y - E.y) * (E.r / miss)} stroke={C.white} strokeWidth={3} strokeDasharray="6 8" />
					<Note x={nearE.x + perp.x * 30} y={nearE.y + perp.y * 30 - 14} size={28} weight={800} color={C.white} anchor="middle" text="MISS" at={L.nudge + 2.2} />
				</g>
			) : null}
			<Asteroid id="df-ast" kind="generic" cx={A.x} cy={A.y} r={pick(l, 46, 42)} seed={41} spin={t * 20} />
			<Arrow
				x1={A.x + perp.x * 110}
				y1={A.y + perp.y * 110}
				x2={A.x + perp.x * 58}
				y2={A.y + perp.y * 58}
				k={kNudge}
				color={C.cyan}
				width={8}
			/>
			<Burst x={burstPos.x} y={burstPos.y} r={44} k={window01(t, L.destroy + 0.3, L.nudge)} />
			{l.v ? (
				<g>
					<Headline x={540} y={300} anchor="middle" size={76} at={L.headed} until={L.destroy} lines={['What if one is', 'headed for *Earth*?']} />
					<Headline x={540} y={300} anchor="middle" size={76} at={L.destroy} until={L.nudge} lines={['Found early, we may', 'not need to *destroy* it.']} />
					<Headline x={540} y={320} anchor="middle" size={100} at={L.nudge} lines={['Just *nudge* it.']} />
					<Note x={A.x + 70} y={A.y + 85} size={26} text="Tiny nudge, years early" color={C.cyan} weight={700} at={L.nudge + 0.6} />
					<Note x={540} y={1560} anchor="middle" size={22} text="Hypothetical asteroid · angles exaggerated" at={L.headed + 1} />
				</g>
			) : (
				<g>
					<Headline x={110} y={170} size={80} at={L.headed} until={L.destroy} lines={['What if one is headed', 'for *Earth*?']} />
					<Headline x={110} y={170} size={80} at={L.destroy} until={L.nudge} lines={['Found early, we may not', 'need to *destroy* it.']} />
					<Headline x={110} y={190} size={110} at={L.nudge} lines={['Just *nudge* it.']} />
					<Note x={A.x - 20} y={A.y + 100} size={28} text="Tiny nudge, years early" color={C.cyan} weight={700} at={L.nudge + 0.6} />
					<Note x={E.x} y={E.y + E.r + 70} size={28} anchor="middle" text="Big miss later" color={C.white} weight={700} at={L.nudge + 2.4} />
					<Note x={1840} y={1040} anchor="end" size={22} text="Hypothetical asteroid · angles exaggerated" at={L.headed + 1} />
				</g>
			)}
			{l.v ? <Note x={E.x} y={E.y + E.r + 70} size={26} anchor="middle" text="Big miss later" color={C.white} weight={700} at={L.nudge + 2.4} /> : null}
		</Scene>
	);
};

/* ================================================================== */
/* 6. TEST — kinetic impactor, mass × velocity, "YES"                  */
/* ================================================================== */
export const TestScene: React.FC = () => {
	const l = useLayout();
	const t = useTime();
	const D = pick(l, {x: 1490, y: 610, r: 170}, {x: 770, y: 1040, r: 165});
	const ip = {x: D.x - D.r * 0.9, y: D.y};
	const startX = pick(l, -150, -120);
	const k = prog(t, S.test[0] - 0.4, TEST_IMPACT - S.test[0] + 0.4, (x) => x);
	const dx = lerp(startX, ip.x, k);
	const dt = t - TEST_IMPACT;
	const push = prog(t, TEST_IMPACT, 1.5) * 8;
	const s = pick(l, 1.35, 1.1);
	const vk = prog(t, L.could + 0.5, 0.6);
	return (
		<Scene from={S.test[0]} to={S.test[1]}>
			<g transform={`translate(${push},0)`}>
				<Asteroid id="ts-dimo" kind="dimorphos" cx={D.x} cy={D.y} r={D.r} seed={8} spin={t * 4} />
			</g>
			<Ejecta x={ip.x} y={ip.y} axis={180} dt={dt} scale={pick(l, 330, 300)} count={120} seed={4} />
			{dt < 0 ? (
				<g>
					<Dart x={dx} y={D.y} s={s} t={t} streak={0.8} />
					{vk > 0 ? (
						<g opacity={vk}>
							<Arrow x1={dx + 40} y1={D.y - 150 * s} x2={dx + 40 + 180} y2={D.y - 150 * s} k={1} color={C.cyan} width={6} />
							<text x={dx + 40} y={D.y - 150 * s - 26} fontFamily={FONT} fontWeight={700} fontSize={pick(l, 28, 26)} fill={C.cyan}>
								mass × velocity = momentum
							</text>
						</g>
					) : null}
				</g>
			) : null}
			<ImpactFlash x={ip.x} y={ip.y} dt={dt} size={120} />
			{l.v ? (
				<g>
					<Kicker x={540} y={270} anchor="middle" text="PLANETARY DEFENSE TEST" at={S.test[0]} />
					<Headline x={540} y={380} anchor="middle" size={76} at={L.tested} until={L.could} lines={['One of the most', '*important* ideas']} />
					<Headline x={540} y={380} anchor="middle" size={72} at={L.could} until={L.yes} lines={['Can a spacecraft', "change an asteroid's", '*motion*?']} />
					<Headline x={540} y={560} anchor="middle" size={250} weight={900} at={L.yes} lines={['*YES.*']} />
					<Chip x={540} y={1330} anchor="middle" color={C.cyan} text="IMPACT AT ≈ 6 KM/S" at={L.tested + 1.0} size={28} />
					<Chip x={540} y={1415} anchor="middle" color={C.cyan} text="NO EXPLOSIVES" at={L.tested + 1.6} size={28} />
					<Chip x={540} y={1500} anchor="middle" color={C.cyan} text="JUST MOMENTUM" at={L.tested + 2.2} size={28} />
				</g>
			) : (
				<g>
					<Kicker x={115} y={150} text="PLANETARY DEFENSE TEST" at={S.test[0]} />
					<Headline x={110} y={250} size={78} at={L.tested} until={L.could} lines={['One of the most *important*', 'ideas in planetary defense']} />
					<Headline x={110} y={250} size={78} at={L.could} until={L.yes} lines={['Can a spacecraft change', "an asteroid's *motion*?"]} />
					<Headline x={110} y={470} size={240} weight={900} at={L.yes} lines={['*YES.*']} />
					<Chip x={115} y={960} color={C.cyan} text="IMPACT AT ≈ 6 KM/S" at={L.tested + 1.0} size={26} />
					<Chip x={560} y={960} color={C.cyan} text="NO EXPLOSIVES" at={L.tested + 1.6} size={26} />
					<Chip x={895} y={960} color={C.cyan} text="JUST MOMENTUM" at={L.tested + 2.2} size={26} />
				</g>
			)}
		</Scene>
	);
};

/* ================================================================== */
/* 7. ORBIT REVEAL — 11 h 55 min → 11 h 22 min around Didymos          */
/* ================================================================== */
export const OrbitScene: React.FC = () => {
	const l = useLayout();
	const t = useTime();
	const g = pick(l, {cx: 540, cy: 590, r: 145, rx: 440, ry: 195}, {cx: 540, cy: 770, r: 130, rx: 430, ry: 175});
	const shrink = 0.92;
	const sk = prog(t, L.after, 1.4, easeInOut);
	const rx = g.rx * lerp(1, shrink, sk);
	const ry = g.ry * lerp(1, shrink, sk);
	// Angle integrates a slightly faster rate after the impact.
	const base = 0.45;
	const th = 1.2 + (t - S.orbit[0]) * base + Math.max(0, t - L.after) * base * 0.05;
	const mx = g.cx + rx * Math.cos(th);
	const my = g.cy + ry * Math.sin(th);
	const front = Math.sin(th) > 0;
	const moon = <Asteroid id="ob-m" kind="dimorphos" cx={mx} cy={my} r={pick(l, 34, 30)} seed={8} spin={t * 10} />;
	const kAfter = prog(t, L.after, 0.8);

	const bars = (x0: number, y0: number, maxW: number, gap: number, size: number) => {
		const kb = prog(t, L.bigger, 0.6);
		const kb2 = prog(t, L.bigger + 0.8, 1.4, easeInOut);
		if (kb <= 0) return null;
		const w73 = Math.max(6, (73 / 1980) * maxW);
		return (
			<g opacity={kb}>
				<text x={x0} y={y0} fontFamily={FONT} fontWeight={600} fontSize={size} fill={C.muted}>
					Needed to call it a success: 73 s
				</text>
				<rect x={x0} y={y0 + 16} width={w73} height={26} rx={4} fill={C.cyan} />
				<text x={x0} y={y0 + gap} fontFamily={FONT} fontWeight={700} fontSize={size} fill={C.white}>
					Measured: ≈ 33 min — about 27× more
				</text>
				<rect x={x0} y={y0 + gap + 16} width={maxW * kb2} height={26} rx={4} fill={C.orange} />
			</g>
		);
	};

	const readout = (x: number, y: number, label: string, val: string, col: string, at: number, size: number, anchor: 'start' | 'middle') => {
		const k = prog(t, at, 0.6);
		if (k <= 0) return null;
		return (
			<g opacity={k}>
				<text x={x} y={y} fontFamily={FONT} fontWeight={800} fontSize={size * 0.32} letterSpacing={size * 0.06} fill={col} textAnchor={anchor}>
					{label}
				</text>
				<text x={x} y={y + size * 0.95} fontFamily={FONT} fontWeight={900} fontSize={size} fill={C.white} textAnchor={anchor}>
					{val}
				</text>
			</g>
		);
	};

	return (
		<Scene from={S.orbit[0]} to={S.orbit[1]}>
			<ellipse cx={g.cx} cy={g.cy} rx={g.rx} ry={g.ry} fill="none" stroke={C.cyan} strokeWidth={3} strokeDasharray="12 12" opacity={0.7} />
			{kAfter > 0 ? <ellipse cx={g.cx} cy={g.cy} rx={rx} ry={ry} fill="none" stroke={C.orange} strokeWidth={5} opacity={kAfter} /> : null}
			{!front && moon}
			<Asteroid id="ob-d" kind="didymos" cx={g.cx} cy={g.cy} r={g.r} seed={21} spin={t * 0.5} />
			{front && moon}
			{l.v ? (
				<g>
					<Kicker x={540} y={280} anchor="middle" text="THE RESULT" at={S.orbit[0]} />
					<Note x={540} y={360} anchor="middle" size={40} weight={700} color={C.white} text="Dimorphos's orbit around *Didymos*" at={S.orbit[0] + 0.2} />
					<Note x={540} y={500} anchor="middle" size={20} text="Orbit size change exaggerated" at={L.after + 1} />
					{readout(285, 1040, 'BEFORE', '11 h 55 min', C.cyan, L.before + 0.4, 66, 'middle')}
					{readout(795, 1040, 'AFTER', '≈ 11 h 22 min', C.orange, L.after, 66, 'middle')}
					<Chip x={540} y={1215} anchor="middle" filled text="≈ 33 MINUTES SHORTER" at={L.after + 1.2} size={34} />
					{bars(140, 1320, 800, 100, 30)}
					<Note x={540} y={1520} anchor="middle" size={20} text="Period change −33 ± 1 min (Thomas et al., Nature 2023)" at={L.after + 1.5} />
				</g>
			) : (
				<g>
					<Kicker x={1070} y={170} text="THE RESULT" at={S.orbit[0]} />
					<Note x={1070} y={240} size={42} weight={700} color={C.white} text="Dimorphos's orbit around *Didymos*" at={S.orbit[0] + 0.2} />
					{readout(1070, 330, 'BEFORE', '11 h 55 min', C.cyan, L.before + 0.4, 76, 'start')}
					{readout(1070, 470, 'AFTER', '≈ 11 h 22 min', C.orange, L.after, 76, 'start')}
					<Chip x={1070} y={655} filled text="≈ 33 MINUTES SHORTER" at={L.after + 1.2} size={34} />
					{bars(1070, 780, 760, 110, 30)}
					<Note x={110} y={1040} size={20} text="Orbit size change exaggerated · Period change −33 ± 1 min (Thomas et al., Nature 2023)" at={L.after + 1.5} />
				</g>
			)}
		</Scene>
	);
};

/* ================================================================== */
/* 8. EJECTA — debris recoil amplifies the push                        */
/* ================================================================== */
export const EjectaScene: React.FC = () => {
	const l = useLayout();
	const t = useTime();
	const D = pick(l, {x: 1420, y: 460, r: 230}, {x: 700, y: 900, r: 220});
	const axis = pick(l, 158, 180);
	const ax = deg(axis);
	const ip = {x: D.x + Math.cos(ax) * D.r * 0.9, y: D.y + Math.sin(ax) * D.r * 0.9};
	const impact = L.blasted - 0.15;
	const dt = t - impact;
	const k = prog(t, S.ejecta[0] - 0.3, impact - S.ejecta[0] + 0.3, (x) => x);
	const dist = 900;
	const dx = ip.x + Math.cos(ax) * dist * (1 - k);
	const dy = ip.y + Math.sin(ax) * dist * (1 - k);
	const push = prog(t, impact, 6) * 14;
	const pd = {x: -Math.cos(ax) * push, y: -Math.sin(ax) * push};

	const vec = (x0: number, y0: number, unit: number, size: number) => (
		<g>
			<Note x={x0} y={y0 + 50} size={size} weight={700} color={C.cyan} text="DART's push" at={L.exhaust} />
			<Arrow x1={x0} y1={y0} x2={x0 + unit} y2={y0} k={prog(t, L.exhaust + 0.2, 0.5)} color={C.cyan} width={12} />
			<Note x={x0 + unit + 12} y={y0 - 34} size={size} weight={700} color={C.orange} text="+ recoil from ejecta" at={L.extraPush} />
			<Arrow x1={x0 + unit} y1={y0} x2={x0 + unit * 3} y2={y0} k={prog(t, L.extraPush + 0.1, 0.8)} color={C.orange} width={12} />
			<Note x={x0} y={y0 + 110} size={size} weight={800} color={C.white} text="= total push" at={L.notJust + 0.2} />
			<Arrow x1={x0} y1={y0 + 140} x2={x0 + unit * 3} y2={y0 + 140} k={prog(t, L.notJust + 0.4, 0.8)} color={C.white} width={16} />
			<Note x={x0} y={y0 + 200} size={size * 0.8} text="Roughly 2–4× the spacecraft's own momentum (published estimates)" at={L.amplified + 0.2} />
		</g>
	);

	return (
		<Scene from={S.ejecta[0]} to={S.ejecta[1]}>
			<g transform={`translate(${pd.x},${pd.y})`}>
				<Asteroid id="ej-dimo" kind="dimorphos" cx={D.x} cy={D.y} r={D.r} seed={8} spin={t * 3} />
			</g>
			<Ejecta x={ip.x + pd.x} y={ip.y + pd.y} axis={axis} dt={dt} scale={pick(l, 620, 560)} count={260} seed={17} />
			{dt < 0 ? <Dart x={dx} y={dy} s={0.9} rot={axis + 180} streak={1} t={t} /> : null}
			<ImpactFlash x={ip.x} y={ip.y} dt={dt} size={170} />
			<Note
				x={pick(l, ip.x + Math.cos(ax) * 420, 300)}
				y={ip.y + Math.sin(ax) * pick(l, 420, 330) + pick(l, 150, 250)}
				anchor="middle"
				size={28}
				weight={800}
				color="#E8D9C4"
				text="EJECTA: ROCK + DUST"
				at={L.blasted + 1.0}
			/>
			{l.v ? (
				<g>
					<Headline x={540} y={300} anchor="middle" size={78} at={L.evenMore} until={L.blasted} lines={['The collision', 'did even *more*.']} />
					<Headline x={540} y={300} anchor="middle" size={78} at={L.blasted} until={L.exhaust} lines={['Rock and dust', '*blasted* into space']} />
					<Headline x={540} y={300} anchor="middle" size={78} at={L.exhaust} until={L.notJust} lines={['Debris acted like', '*rocket exhaust*']} />
					<Headline x={540} y={300} anchor="middle" size={78} at={L.notJust} until={L.amplified} lines={["DART didn't just", 'hit Dimorphos…']} />
					<Headline x={540} y={300} anchor="middle" size={84} at={L.amplified} lines={['An *amplified*', 'shove.']} />
					{vec(150, 1280, 120, 28)}
				</g>
			) : (
				<g>
					<Headline x={110} y={170} size={80} at={L.evenMore} until={L.blasted} lines={['And the collision', 'did even *more*.']} />
					<Headline x={110} y={170} size={80} at={L.blasted} until={L.exhaust} lines={['Rock and dust', '*blasted* into space']} />
					<Headline x={110} y={170} size={80} at={L.exhaust} until={L.notJust} lines={['Debris acted like', '*rocket exhaust*']} />
					<Headline x={110} y={170} size={80} at={L.notJust} until={L.amplified} lines={["DART didn't just", 'hit Dimorphos…']} />
					<Headline x={110} y={170} size={88} at={L.amplified} lines={['An *amplified*', 'shove.']} />
					{vec(1180, 800, 130, 28)}
				</g>
			)}
		</Scene>
	);
};

/* ================================================================== */
/* 9. SUN — the pair's heliocentric period changed ~0.15 s             */
/* ================================================================== */
export const SunScene: React.FC = () => {
	const l = useLayout();
	const t = useTime();
	const AU = pick(l, 280, 190);
	const a = 1.64 * AU;
	const e = 0.38;
	const c = a * e;
	const b = a * Math.sqrt(1 - e * e);
	const sun = pick(l, {x: 440, y: 560}, {x: 540, y: 800});
	// Ellipse: landscape major axis horizontal (aphelion right); vertical major axis vertical (aphelion down).
	const ell = l.v ? {cx: sun.x, cy: sun.y + c, rx: b, ry: a} : {cx: sun.x + c, cy: sun.y, rx: a, ry: b};
	const k = prog(t, S.sun[0], 1.6, easeInOut);
	const th = 3.6 + (t - S.sun[0]) * 0.22;
	const px = ell.cx + ell.rx * Math.cos(th);
	const py = ell.cy + ell.ry * Math.sin(th);
	const eth = 0.5 + (t - S.sun[0]) * 0.5;
	const ex = sun.x + AU * Math.cos(eth);
	const ey = sun.y + AU * Math.sin(eth);
	const kFirst = prog(t, L.first, 0.6);
	return (
		<Scene from={S.sun[0]} to={S.sun[1]}>
			<circle cx={sun.x} cy={sun.y} r={AU} fill="none" stroke={C.muted} strokeOpacity={0.35} strokeWidth={2} />
			<ellipse cx={ell.cx} cy={ell.cy} rx={ell.rx} ry={ell.ry} fill="none" stroke={C.orange} strokeWidth={3} strokeDasharray={`${4000 * k} 4000`} />
			<Sun cx={sun.x} cy={sun.y} r={pick(l, 58, 48)} t={t} />
			<Earth id="sn-earth" cx={ex} cy={ey} r={16} t={t} />
			<circle cx={px} cy={py} r={34} fill="url(#glowOrange)" />
			<Asteroid id="sn-d" kind="didymos" cx={px} cy={py} r={14} seed={21} />
			<Asteroid id="sn-m" kind="dimorphos" cx={px + 18 * Math.cos(t * 3)} cy={py + 8 * Math.sin(t * 3)} r={5} seed={8} />
			<Note x={sun.x + AU * 0.71 + 12} y={sun.y - AU * 0.71 - 12} size={22} text="Earth's orbit" at={S.sun[0] + 0.6} />
			<Note x={px} y={py + pick(l, -44, 60)} size={24} weight={700} anchor="middle" color={C.orange} text="Didymos + Dimorphos" at={S.sun[0] + 1.2} until={L.notCrash} />
			{l.v ? (
				<g>
					<Kicker x={540} y={270} anchor="middle" text="AROUND THE SUN" at={S.sun[0]} />
					<Headline x={540} y={370} anchor="middle" size={68} at={L.sun} until={L.notCrash} lines={["The pair's orbit", 'around the *Sun*', 'changed too.']} />
					<Headline x={540} y={370} anchor="middle" size={72} at={L.notCrash} until={L.first} lines={['Not just a', 'spectacular *crash*.']} />
					<Headline x={540} y={370} anchor="middle" size={64} at={L.first} lines={['The *first* time humans', 'deliberately changed', "a celestial object's motion"]} />
					<g opacity={1 - kFirst}>
						<Headline x={540} y={1370} anchor="middle" size={110} weight={900} color={C.orange} at={L.sun + 2.6} lines={['≈ 0.15 s']} />
						<Note x={540} y={1425} anchor="middle" size={28} color={C.white} text="change in its ≈ 770-day orbit around the Sun" at={L.sun + 3} />
						<Note x={540} y={1470} anchor="middle" size={22} text="Not the 33-minute change — that one was around Didymos." at={L.sun + 4} />
					</g>
					<Chip x={540} y={1400} anchor="middle" filled text="A FIRST FOR PLANETARY DEFENSE" at={L.first + 0.8} size={30} />
					<Note x={540} y={1520} anchor="middle" size={20} text="Makadia et al., Science Advances · NASA" at={L.sun + 4} />
				</g>
			) : (
				<g>
					<Kicker x={1170} y={190} text="AROUND THE SUN" at={S.sun[0]} />
					<Headline x={1170} y={290} size={64} at={L.sun} until={L.notCrash} lines={["The pair's orbit", 'around the *Sun*', 'changed too.']} />
					<Headline x={1170} y={290} size={68} at={L.notCrash} until={L.first} lines={['Not just a', 'spectacular *crash*.']} />
					<Headline x={1170} y={290} size={56} at={L.first} lines={['The *first* time humans', 'deliberately changed', 'the motion of a', 'celestial object.']} />
					<g opacity={1 - kFirst}>
						<Headline x={1170} y={640} size={124} weight={900} color={C.orange} at={L.sun + 2.6} lines={['≈ 0.15 s']} />
						<Note x={1170} y={710} size={28} color={C.white} text="change in its ≈ 770-day orbit around the Sun" at={L.sun + 3} />
						<Note x={1170} y={760} size={22} text="Not the 33-minute change — that one was around Didymos." at={L.sun + 4} />
					</g>
					<Chip x={1170} y={600} filled text="A FIRST FOR PLANETARY DEFENSE" at={L.first + 0.8} size={30} />
					<Note x={1840} y={1040} anchor="end" size={20} text="Makadia et al., Science Advances · NASA · orbits schematic" at={L.sun + 4} />
				</g>
			)}
		</Scene>
	);
};

/* ================================================================== */
/* 10. FINALE — a precise hit years in advance                         */
/* ================================================================== */
export const FinaleScene: React.FC = () => {
	const l = useLayout();
	const t = useTime();
	const E = pick(l, {x: 1480, y: 640, r: 250}, {x: 560, y: 1290, r: 260});
	const A0 = pick(l, {x: 150, y: 470}, {x: 120, y: 640});
	const len = Math.hypot(E.x - A0.x, E.y - A0.y);
	const a0 = Math.atan2(E.y - A0.y, E.x - A0.x);
	const miss = pick(l, 420, 360);
	const sHit = 0.3;
	const hitPt = {x: A0.x + Math.cos(a0) * len * sHit, y: A0.y + Math.sin(a0) * len * sHit};
	const remain = len * (1 - sHit);
	const delta = -Math.asin(miss / remain);
	const preK = prog(t, S.finale[0], FINALE_HIT - S.finale[0], (x) => x);
	const postK = prog(t, FINALE_HIT, 122.8 - FINALE_HIT, (x) => x);
	let ax: number;
	let ay: number;
	if (t < FINALE_HIT) {
		ax = A0.x + Math.cos(a0) * len * sHit * preK;
		ay = A0.y + Math.sin(a0) * len * sHit * preK;
	} else {
		const bend = Math.min(1, postK * 3);
		const ang = a0 + delta * bend;
		const d = remain * 0.95 * postK;
		ax = hitPt.x + Math.cos(ang) * d;
		ay = hitPt.y + Math.sin(ang) * d;
	}
	const threatK = prog(t, L.threatens, 1.6, easeInOut);
	const newK = prog(t, FINALE_HIT + 0.2, 2.2, easeInOut);
	const endPt = {x: hitPt.x + Math.cos(a0 + delta) * remain * 1.15, y: hitPt.y + Math.sin(a0 + delta) * remain * 1.15};
	const craftK = prog(t, L.precise, FINALE_HIT - L.precise, (x) => x);
	const craft = {x: lerp(E.x, hitPt.x, craftK), y: lerp(E.y, hitPt.y, craftK)};
	const craftAng = (Math.atan2(hitPt.y - E.y, hitPt.x - E.x) * 180) / Math.PI;
	const glow = prog(t, L.difference, 1.5);
	const zoom = 1 + 0.04 * prog(t, L.difference, 4, easeInOut);
	const cx = E.x;
	const cy = E.y;
	return (
		<Scene from={S.finale[0]} to={S.finale[1]}>
			<g transform={`translate(${cx},${cy}) scale(${zoom}) translate(${-cx},${-cy})`}>
				<Earth id="fn-earth" cx={E.x} cy={E.y} r={E.r} t={t} glow={glow * 0.8} />
				<DrawPath
					d={`M${A0.x},${A0.y} L${E.x - Math.cos(a0) * E.r},${E.y - Math.sin(a0) * E.r}`}
					k={threatK}
					stroke={C.orange}
					width={5}
					dash="16 14"
					opacity={1 - 0.6 * newK}
				/>
				<DrawPath d={`M${hitPt.x},${hitPt.y} L${endPt.x},${endPt.y}`} k={newK} stroke={C.cyan} width={6} marker="arrowCyan" />
				{t >= L.precise && t < FINALE_HIT ? <Dart x={craft.x} y={craft.y} s={0.32} rot={craftAng} t={t} /> : null}
				<Asteroid id="fn-ast" kind="generic" cx={ax} cy={ay} r={pick(l, 44, 40)} seed={41} spin={t * 20} />
				<ImpactFlash x={hitPt.x} y={hitPt.y} dt={t - FINALE_HIT} size={90} />
			</g>
			{l.v ? (
				<g>
					<Headline x={540} y={300} anchor="middle" size={80} at={L.matters} until={L.threatens} lines={['That matters for', 'one *reason*.']} />
					<Headline x={540} y={300} anchor="middle" size={76} at={L.threatens} until={L.explosion} lines={['If an asteroid', 'ever threatens *Earth*…']} />
					<Headline x={540} y={300} anchor="middle" size={76} at={L.explosion} until={L.precise} lines={['…the best defense may', 'not be a giant *explosion*.']} />
					<Headline x={540} y={300} anchor="middle" size={80} at={L.precise} until={L.tinyCraft} lines={['A precise hit,', '*years* in advance.']} />
					<Headline x={540} y={320} anchor="middle" size={84} at={L.tinyCraft} until={L.tinyChange} lines={['A tiny *spacecraft*.']} />
					<Headline x={540} y={320} anchor="middle" size={84} at={L.tinyChange} until={L.difference} lines={['A tiny *change*.']} />
					<Headline x={540} y={320} anchor="middle" size={92} weight={900} at={L.difference} lines={['One very *big*', 'difference.']} />
					<Chip x={540} y={540} anchor="middle" color={C.cyan} text="NEEDS EARLY DETECTION" at={L.precise + 0.8} until={L.difference} size={28} />
					<Note x={540} y={620} anchor="middle" size={20} text="Illustration · timeline compressed" at={L.threatens} />
				</g>
			) : (
				<g>
					<Headline x={110} y={170} size={80} at={L.matters} until={L.threatens} lines={['That matters for', 'one *reason*.']} />
					<Headline x={110} y={170} size={80} at={L.threatens} until={L.explosion} lines={['If an asteroid ever', 'threatens *Earth*…']} />
					<Headline x={110} y={170} size={76} at={L.explosion} until={L.precise} lines={['…the best defense may', 'not be a giant *explosion*.']} />
					<Headline x={110} y={170} size={80} at={L.precise} until={L.tinyCraft} lines={['A precise hit,', '*years* in advance.']} />
					<Headline x={110} y={190} size={92} at={L.tinyCraft} until={L.tinyChange} lines={['A tiny *spacecraft*.']} />
					<Headline x={110} y={190} size={92} at={L.tinyChange} until={L.difference} lines={['A tiny *change*.']} />
					<Headline x={110} y={190} size={104} weight={900} at={L.difference} lines={['One very *big*', 'difference.']} />
					<Chip x={115} y={980} color={C.cyan} text="NEEDS EARLY DETECTION" at={L.precise + 0.8} until={L.difference} size={26} />
					<Note x={1840} y={1050} anchor="end" size={20} text="Illustration · timeline compressed" at={L.threatens} />
				</g>
			)}
		</Scene>
	);
};
