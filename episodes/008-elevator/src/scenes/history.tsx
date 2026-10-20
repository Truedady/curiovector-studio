import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {Defs} from '../art';
import {C, FONT_BODY, FONT_HEAD, lerp, ramp} from '../theme';
import {S} from '../timeline';
import {Backdrop, Chip, Glow, Headline, Hi, Panel, SvgGlow, SvgLabel} from '../ui';
import {dims, SceneProps} from './opening';

const P = 200; // half distance between the wooden guide posts
const TOWER = 760;

/** Ratchet teeth on the inner face of a guide post. dir=1 for left post (teeth face right). */
const Teeth: React.FC<{x: number; y1: number; y2: number; dir: number}> = ({x, y1, y2, dir}) => {
	const pts: string[] = [];
	for (let y = y1; y < y2; y += 22) pts.push(`M ${x} ${y} L ${x + dir * 14} ${y + 16} L ${x} ${y + 22}`);
	return <path d={pts.join(' ')} fill="none" stroke="#D9B27A" strokeWidth={3} strokeLinejoin="round" />;
};

/** Otis with top hat, one arm raised. Origin: feet centre. */
const Otis: React.FC<{x: number; y: number; arm: number}> = ({x, y, arm}) => (
	<g transform={`translate(${x} ${y})`}>
		<path d="M -18 0 L -14 -78 L 14 -78 L 18 0 Z" fill="#0A1736" />
		<path d="M -30 -70 Q -36 -120 -26 -150 L 26 -150 Q 36 -120 30 -70 Z" fill="#0F1F45" stroke="#FFB473" strokeWidth={2.5} />
		<line x1={0} y1={-150} x2={0} y2={-80} stroke="#FFB473" strokeWidth={1.5} opacity={0.6} />
		<circle cx={0} cy={-166} r={16} fill="#E9C9A6" />
		<path d="M -14 -158 Q 0 -146 14 -158 L 12 -150 Q 0 -140 -12 -150 Z" fill="#5B3A22" />
		<rect x={-14} y={-210} width={28} height={34} rx={2} fill="#0A1736" stroke="#FFB473" strokeWidth={2} />
		<rect x={-22} y={-180} width={44} height={6} rx={3} fill="#0A1736" stroke="#FFB473" strokeWidth={2} />
		{/* raised arm */}
		<g transform={`translate(24 -140) rotate(${-150 + arm * 20})`}>
			<rect x={-7} y={0} width={14} height={62} rx={7} fill="#0F1F45" stroke="#FFB473" strokeWidth={2} />
			<circle cx={0} cy={66} r={8} fill="#E9C9A6" />
		</g>
		<g transform="translate(-24 -140) rotate(12)">
			<rect x={-7} y={0} width={14} height={62} rx={7} fill="#0F1F45" stroke="#FFB473" strokeWidth={2} />
		</g>
	</g>
);

/** The 1854-style hoisting tower with platform, wagon spring and pawls. Origin: stage floor centre. */
const Tower: React.FC<{id: string; drop: number; bow: number; pawl: number; cut: number; caught: number; ropeTop: number}> = ({
	id,
	drop,
	bow,
	pawl,
	cut,
	caught,
	ropeTop,
}) => {
	const deckY = -380 + drop;
	const frameTop = deckY - 270;
	const reach = lerp(28, 6, pawl);
	const sp = `M ${-P + reach} ${frameTop} Q 0 ${frameTop - bow * 2} ${P - reach} ${frameTop}`;
	const cutY = (-TOWER + 20 + frameTop - bow) / 2;
	return (
		<g>
			{/* posts */}
			{[-1, 1].map((d) => (
				<g key={d}>
					<rect x={d * P - 17 + d * 17} y={-TOWER} width={34} height={TOWER} fill={`url(#${id}-wood)`} stroke="#3E2A18" strokeWidth={2} />
					<Teeth x={d * P} y1={-TOWER + 40} y2={-10} dir={-d} />
				</g>
			))}
			{/* top beam + pulley */}
			<rect x={-P - 60} y={-TOWER - 30} width={2 * P + 120} height={34} rx={4} fill={`url(#${id}-wood)`} stroke="#3E2A18" strokeWidth={2} />
			<circle cx={0} cy={-TOWER + 20} r={30} fill="#3E2A18" stroke="#D9B27A" strokeWidth={4} />
			{/* hoist rope */}
			{cut < 1 ? (
				<line x1={0} y1={-TOWER + 20} x2={0} y2={frameTop - bow} stroke="#D8C29A" strokeWidth={9} />
			) : (
				<g>
					<line x1={0} y1={-TOWER + 20} x2={0} y2={cutY - 20 - ropeTop} stroke="#D8C29A" strokeWidth={9} />
					<path d={`M 0 ${frameTop - bow} Q 26 ${(frameTop + cutY) / 2} ${-10} ${cutY + 30 + drop * 0.4}`} fill="none" stroke="#D8C29A" strokeWidth={9} />
				</g>
			)}
			{/* platform frame uprights */}
			<rect x={-P + 22} y={frameTop} width={14} height={deckY - frameTop} fill="#6B4A2E" />
			<rect x={P - 36} y={frameTop} width={14} height={deckY - frameTop} fill="#6B4A2E" />
			{/* wagon spring (leaf stack) */}
			<path d={sp} fill="none" stroke={caught > 0.5 ? C.orange : '#C9D4E8'} strokeWidth={10} strokeLinecap="round" />
			<path d={sp} transform="translate(0 9)" fill="none" stroke={caught > 0.5 ? '#E2661C' : '#8EA5CC'} strokeWidth={6} strokeLinecap="round" />
			<rect x={-16} y={frameTop - bow * 2 + bow - 8} width={32} height={20} rx={4} fill="#3E2A18" />
			{/* pawls at the spring ends */}
			{[-1, 1].map((d) => (
				<path
					key={d}
					d={`M ${d * (P - reach)} ${frameTop - 8} L ${d * (P - reach + 20)} ${frameTop + 6} L ${d * (P - reach)} ${frameTop + 18} Z`}
					fill={caught > 0.5 ? C.orange : '#D9B27A'}
					stroke="#3E2A18"
					strokeWidth={2}
				/>
			))}
			{/* deck */}
			<rect x={-P + 18} y={deckY} width={2 * P - 36} height={26} rx={3} fill={`url(#${id}-wood)`} stroke="#3E2A18" strokeWidth={2} />
			{/* cargo: crates + barrel */}
			<rect x={50} y={deckY - 70} width={70} height={70} fill="#7A5332" stroke="#3E2A18" strokeWidth={3} />
			<line x1={50} y1={deckY - 70} x2={120} y2={deckY} stroke="#3E2A18" strokeWidth={3} />
			<rect x={70} y={deckY - 120} width={50} height={50} fill="#8E6239" stroke="#3E2A18" strokeWidth={3} />
			<rect x={-150} y={deckY - 80} width={56} height={80} rx={16} fill="#6B4A2E" stroke="#3E2A18" strokeWidth={3} />
			<line x1={-150} y1={deckY - 56} x2={-94} y2={deckY - 56} stroke="#3E2A18" strokeWidth={3} />
			<line x1={-150} y1={deckY - 24} x2={-94} y2={deckY - 24} stroke="#3E2A18" strokeWidth={3} />
			{/* stage floor */}
			<rect x={-460} y={0} width={920} height={40} fill="#3A2716" />
			<rect x={-460} y={0} width={920} height={5} fill="#93683F" />
		</g>
	);
};

/** Small explanatory state diagram of Otis's spring + ratchet catch. */
const StateMini: React.FC<{x: number; y: number; s: number; taut: boolean; title: string; sub: string}> = ({x, y, s, taut, title, sub}) => {
	const bow = taut ? 34 : 4;
	const reach = taut ? 34 : 4;
	const pw = 130;
	return (
		<g transform={`translate(${x} ${y}) scale(${s})`}>
			{[-1, 1].map((d) => (
				<g key={d}>
					<rect x={d * pw - 10 + d * 10} y={-90} width={20} height={190} fill="#6B4A2E" />
					<Teeth x={d * pw} y1={-84} y2={96} dir={-d} />
				</g>
			))}
			<path d={`M ${-pw + reach} 20 Q 0 ${20 - bow * 2} ${pw - reach} 20`} fill="none" stroke={taut ? '#C9D4E8' : C.orange} strokeWidth={8} strokeLinecap="round" />
			{[-1, 1].map((d) => (
				<path key={d} d={`M ${d * (pw - reach)} 12 L ${d * (pw - reach + 18)} 24 L ${d * (pw - reach)} 34 Z`} fill={taut ? '#D9B27A' : C.orange} />
			))}
			{taut ? <line x1={0} y1={-90} x2={0} y2={20 - bow} stroke="#D8C29A" strokeWidth={6} /> : <line x1={0} y1={-90} x2={0} y2={-40} stroke="#D8C29A" strokeWidth={6} strokeDasharray="10 8" />}
			<text x={pw + 50} y={-20} fill={taut ? C.cyan : C.orange} fontFamily={FONT_BODY} fontWeight={800} fontSize={30} letterSpacing={2}>
				{title}
			</text>
			<text x={pw + 50} y={20} fill={C.white} fontFamily={FONT_BODY} fontWeight={600} fontSize={26}>
				{sub.split('|').map((l, k) => (
					<tspan key={k} x={pw + 50} dy={k === 0 ? 0 : 32}>
						{l}
					</tspan>
				))}
			</text>
		</g>
	);
};

const CUT = S.otis1854 + 7.8;
const CATCH = S.caughtIt - 0.1;

/* 10 — New York, 1854: Elisha Otis's safety demonstration (historically inspired). */
export const OtisScene: React.FC<SceneProps> = ({t, layout}) => {
	const {L, W, H} = dims(layout);
	const id = `ot-${layout}`;
	const bx = L ? 760 : 540;
	const by = L ? 830 : 1500;
	const ts = L ? 0.95 : 1.12;
	const title = ramp(t, S.soundsMadeUp, S.soundsMadeUp + 0.4) * (1 - ramp(t, S.otis1854 - 0.6, S.otis1854 - 0.1));
	const stage = ramp(t, S.otis1854 - 0.7, S.otis1854 + 0.5);
	const cut = t >= CUT ? 1 : 0;
	const bow = 40 - ramp(t, CUT + 0.05, S.droppedLittle + 1.2) * 36;
	const pawl = ramp(t, CUT + 0.05, CATCH);
	const drop = ramp(t, CUT + 0.1, CATCH, (p) => p * p) * 46;
	const caught = ramp(t, CATCH, CATCH + 0.1);
	const ropeTop = ramp(t, CUT, CUT + 0.6) * 40;
	const catchFlash = t > CATCH ? Math.max(0, 1 - (t - CATCH) * 1.6) : 0;
	const cutFlash = t > CUT - 0.1 && t < CUT + 0.6 ? 1 - Math.abs(t - CUT) / 0.6 : 0;
	const axe = ramp(t, CUT - 0.45, CUT + 0.05);
	const push = 1 + ramp(t, S.otis1854, S.droppedLittle) * 0.06;
	const deckY = -380 + drop;
	const frameTop = deckY - 270;
	const cutYLocal = (-TOWER + 20 + frameTop - 40) / 2;
	const ins = ramp(t, S.caughtIt + 0.5, S.caughtIt + 1.0);
	const panel = L ? {x: 1240, y: 330, w: 600, h: 560} : {x: 70, y: 1340, w: 940, h: 390};
	const crowdA = 1 - (L ? 0 : ins * 0.7);
	return (
		<AbsoluteFill>
			<Backdrop layout={layout} grid={0} />
			{/* warm exhibition-hall light */}
			<Glow x={bx} y={by - 500 * ts} size={L ? 1300 : 1400} color="orange" opacity={0.28 * stage} />
			<Glow x={bx} y={by - 300 * ts} size={L ? 900 : 1000} color="white" opacity={0.12 * stage} />
			<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute'}}>
				<Defs id={id} />
				{/* iron-and-glass hall arches */}
				<g opacity={0.35 * stage} stroke="#5B79A8" strokeWidth={3} fill="none">
					{[-3, -2, -1, 0, 1, 2, 3].map((k) => {
						const ax = bx + k * (L ? 300 : 260);
						const top = by - (L ? 820 : 1150);
						return <path key={k} d={`M ${ax - 120} ${by} L ${ax - 120} ${top + 120} Q ${ax} ${top - 20} ${ax + 120} ${top + 120} L ${ax + 120} ${by}`} />;
					})}
				</g>
				<g opacity={stage} transform={`translate(${bx} ${by}) scale(${ts * push}) `}>
					<Tower id={id} drop={drop} bow={bow} pawl={pawl} cut={cut} caught={caught} ropeTop={ropeTop} />
					<Otis x={-40} y={deckY} arm={Math.sin(t * 1.4) * 0.5 + 0.5} />
					{/* the cutting blade */}
					{axe > 0 && t < CUT + 0.8 ? (
						<g transform={`translate(${-120 + axe * 150} ${cutYLocal}) rotate(${-30 + axe * 40})`} opacity={1 - ramp(t, CUT + 0.3, CUT + 0.8)}>
							<rect x={-120} y={-5} width={110} height={10} rx={5} fill="#6B4A2E" />
							<path d="M -14 -26 Q 16 -20 18 0 Q 16 20 -14 26 Z" fill="#DCE6F8" stroke="#1A2C52" strokeWidth={2} />
						</g>
					) : null}
					{cutFlash > 0 ? <SvgGlow x={0} y={cutYLocal} r={140} color="white" opacity={cutFlash} /> : null}
					{catchFlash > 0 ? [-1, 1].map((d) => <SvgGlow key={d} x={d * P} y={frameTop} r={150} color="orange" opacity={catchFlash} />) : null}
				</g>
				<SvgLabel
					t={t}
					at={S.caughtIt + 0.2}
					out={S.realSecret}
					from={[bx - P * ts * push + 10, by + frameTop * ts * push]}
					to={L ? [bx - P * ts - 150, by + frameTop * ts + 120] : [bx - P * ts - 60, by + frameTop * ts - 150]}
					text="Pawls lock"
					color={C.orange}
					anchor="middle"
					size={L ? 28 : 28}
				/>
				{ins > 0 ? (
					<g opacity={ins}>
						<Panel x={panel.x} y={panel.y} w={panel.w} h={panel.h} title="Otis's safety catch" color={C.orange} />
						{L ? (
							<>
								<StateMini x={panel.x + 170} y={panel.y + 200} s={0.85} taut title="ROPE TAUT" sub="Spring bowed,|pawls clear" />
								<StateMini x={panel.x + 170} y={panel.y + 430} s={0.85} taut={false} title="ROPE CUT" sub="Spring snaps flat,|pawls hit the teeth" />
							</>
						) : (
							<>
								<StateMini x={panel.x + 170} y={panel.y + 160} s={0.62} taut title="ROPE TAUT" sub="Spring bowed,|pawls clear" />
								<StateMini x={panel.x + 170} y={panel.y + 310} s={0.62} taut={false} title="ROPE CUT" sub="Spring snaps flat,|pawls hit the teeth" />
							</>
						)}
					</g>
				) : null}
			</svg>
			<Img
				src={staticFile(L ? 'crowd_landscape.png' : 'crowd_portrait.png')}
				style={{position: 'absolute', left: L ? -40 : -60, top: L ? 800 : 1460, width: L ? 2000 : 1200, height: 300, opacity: stage * crowdA}}
			/>
			{title > 0 ? (
				<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: title}}>
					<div style={{fontFamily: FONT_HEAD, fontWeight: 900, fontSize: L ? 100 : 104, lineHeight: 1.08, color: C.white, textAlign: 'center', width: L ? 1400 : 960}}>
						Now, the part that <span style={{color: C.orange}}>sounds made up.</span>
					</div>
					<div style={{marginTop: 40, fontFamily: FONT_BODY, fontWeight: 700, fontSize: L ? 40 : 44, letterSpacing: 12, color: C.cyan, opacity: ramp(t, S.soundsMadeUp + 1.0, S.soundsMadeUp + 1.5)}}>
						NEW YORK · 1854
					</div>
				</AbsoluteFill>
			) : null}
			{/* headlines: right column in landscape, top in portrait */}
			{[
				{at: S.otis1854, out: CUT - 1.6, title: <>Elisha Otis stands on a <Hi>raised platform.</Hi></>},
				{at: CUT - 1.6, out: S.droppedLittle, title: <>Then he has its rope <Hi>cut.</Hi></>},
				{at: S.droppedLittle, out: S.caughtIt, title: <>It drops <Hi>just a little…</Hi></>},
				{at: S.caughtIt, out: S.practical, title: <>…and his safety <Hi>catches it.</Hi></>},
				{at: S.practical, out: undefined, title: <>This helped make passenger elevators <Hi>practical.</Hi></>},
			].map((h, i) => (
				<Headline key={i} t={t} at={h.at} out={h.out} layout={layout} kicker="New York, 1854" title={h.title} x={L ? 1240 : undefined} y={L ? 80 : undefined} width={L ? 620 : 940} size={L ? 50 : 66} />
			))}
			<Chip t={t} at={CUT + 0.2} out={CATCH} x={L ? bx : 540} y={L ? 40 : 520} anchor="center" text="Slow motion" color={C.mute} size={22} />
			<Chip t={t} at={S.otis1854 + 0.5} out={S.realSecret} x={L ? 60 : 540} y={L ? 1010 : 1760} anchor={L ? 'left' : 'center'} text="Historical illustration" color={C.mute} size={18} />
		</AbsoluteFill>
	);
};

/* 11 — Finale: modern skyline, THE SECRET IS STOPPING. */
export const FinaleScene: React.FC<SceneProps> = ({t, layout}) => {
	const {L, W, H} = dims(layout);
	const t0 = S.realSecret;
	const push = 1 + ramp(t, t0 - 0.3, S.end) * 0.05;
	const hero = L ? {x: 1250, w: 270, top: 120} : {x: 400, w: 280, top: 600};
	const shaftX = hero.x + hero.w / 2 - 34;
	const carStart = L ? 960 : 1780;
	const carEnd = L ? 330 : 900;
	const rise = ramp(t, t0, S.stopSafely + 0.1, (p) => p);
	const carY = lerp(carStart, carEnd, rise);
	const stopped = t >= S.stopSafely + 0.1;
	const sf = stopped ? Math.max(0, 1 - (t - S.stopSafely - 0.1) * 1.4) : 0;
	const finalA = ramp(t, S.stopSafely, S.stopSafely + 0.5);
	const others = L
		? [
				{x: 860, w: 170, top: 420, sp: 0.6, ph: 0.2},
				{x: 1640, w: 200, top: 300, sp: 0.45, ph: 0.7},
		  ]
		: [
				{x: 760, w: 220, top: 900, sp: 0.55, ph: 0.3},
				{x: 80, w: 200, top: 1100, sp: 0.4, ph: 0.6},
		  ];
	return (
		<AbsoluteFill>
			<Backdrop layout={layout} grid={0} />
			<Glow x={L ? 1300 : 540} y={L ? 260 : 700} size={L ? 1500 : 1500} color="cyan" opacity={0.3} />
			<AbsoluteFill style={{transform: `scale(${push})`, transformOrigin: L ? '65% 70%' : '50% 75%'}}>
				<Img
					src={staticFile(L ? 'skyline_landscape.png' : 'skyline_portrait.png')}
					style={{position: 'absolute', left: L ? -140 : -160, top: L ? 380 : 820, width: L ? 2200 : 1400, height: L ? 700 : 1100}}
				/>
				<svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute'}}>
					{others.map((o, i) => {
						const cy = o.top + 60 + ((Math.sin(t * o.sp + o.ph * 6) + 1) / 2) * (H - o.top - 200);
						const sx = o.x + o.w / 2 - 22;
						return (
							<g key={i}>
								<rect x={o.x} y={o.top} width={o.w} height={H - o.top} fill="#0C1C44" stroke="#2C4A80" strokeWidth={2} />
								<rect x={sx} y={o.top + 20} width={44} height={H - o.top} fill="#0A2552" stroke={C.cyan} strokeOpacity={0.35} strokeWidth={2} />
								<rect x={sx + 6} y={cy} width={32} height={42} rx={4} fill="#FFD9A8" />
								<SvgGlow x={sx + 22} y={cy + 20} r={60} color="orange" opacity={0.5} />
							</g>
						);
					})}
					{/* hero tower with glass shaft */}
					<rect x={hero.x} y={hero.top} width={hero.w} height={H - hero.top} fill="#0C1C44" stroke="#3E5A8C" strokeWidth={3} />
					<path d={`M ${hero.x} ${hero.top} L ${hero.x + hero.w / 2} ${hero.top - 90} L ${hero.x + hero.w} ${hero.top}`} fill="#0C1C44" stroke="#3E5A8C" strokeWidth={3} />
					<line x1={hero.x + hero.w / 2} y1={hero.top - 90} x2={hero.x + hero.w / 2} y2={hero.top - 170} stroke="#5B79A8" strokeWidth={4} />
					{Array.from({length: 30}).map((_, i) => (
						<g key={i}>
							<rect x={hero.x + 18} y={hero.top + 30 + i * 46} width={44} height={22} fill="#FFC890" opacity={(i * 37) % 5 === 0 ? 0.7 : 0.12} />
							<rect x={hero.x + hero.w - 62} y={hero.top + 30 + i * 46} width={44} height={22} fill="#9ED8F5" opacity={(i * 53) % 7 === 0 ? 0.6 : 0.1} />
						</g>
					))}
					<rect x={shaftX} y={hero.top + 20} width={68} height={H - hero.top} fill="#0A2552" stroke={C.cyan} strokeWidth={3} strokeOpacity={0.7} />
					<line x1={shaftX + 34} y1={hero.top + 20} x2={shaftX + 34} y2={carY} stroke="#AFC2E2" strokeWidth={3} />
					<rect x={shaftX + 8} y={carY + 70} width={52} height={Math.max(0, carStart - carY)} fill={C.cyan} opacity={0.18} />
					<SvgGlow x={shaftX + 34} y={carY + 36} r={130} color={stopped ? 'orange' : 'white'} opacity={0.7} />
					<rect x={shaftX + 8} y={carY} width={52} height={70} rx={6} fill="#FFE2BC" stroke={stopped ? C.orange : C.white} strokeWidth={3} />
					{sf > 0 ? <SvgGlow x={shaftX + 34} y={carY + 70} r={240} color="orange" opacity={sf} /> : null}
				</svg>
			</AbsoluteFill>
			<Headline
				t={t}
				at={t0}
				out={S.stopSafely}
				layout={layout}
				kicker="The real secret of the skyscraper"
				title={<>Not just how we lift people <Hi>hundreds of feet…</Hi></>}
				width={L ? 900 : 940}
			/>
			{finalA > 0 ? (
				<div
					style={{
						position: 'absolute',
						left: L ? 110 : 0,
						top: L ? 150 : 200,
						width: L ? 1000 : W,
						textAlign: L ? 'left' : 'center',
						opacity: finalA,
						transform: `translateY(${(1 - finalA) * 30}px)`,
					}}
				>
					<div style={{fontFamily: FONT_BODY, fontWeight: 700, fontSize: L ? 30 : 34, letterSpacing: 8, color: C.cyan, marginBottom: 18}}>
						IT&apos;S HOW WE STOP THEM SAFELY
					</div>
					<div style={{fontFamily: FONT_HEAD, fontWeight: 900, fontSize: L ? 128 : 124, lineHeight: 0.98, color: C.white, textShadow: '0 6px 24px rgba(4,10,26,0.9)'}}>
						THE SECRET
						<br />
						IS <span style={{color: C.orange}}>STOPPING</span>
					</div>
				</div>
			) : null}
			<div
				style={{
					position: 'absolute',
					left: L ? 110 : 0,
					width: L ? 900 : W,
					top: L ? 1010 : 1640,
					textAlign: L ? 'left' : 'center',
					fontFamily: FONT_BODY,
					fontWeight: 500,
					fontSize: L ? 20 : 24,
					color: C.mute,
					opacity: finalA * 0.9,
				}}
			>
				Conventional traction elevator shown · safety designs vary by elevator type
			</div>
		</AbsoluteFill>
	);
};
