import React from 'react';
import {C, FONT_BODY} from './theme';

/* Shared gradient/defs. Each composition mounts this once inside an <svg>. */
export const Defs: React.FC<{id: string}> = ({id}) => (
	<defs>
		<linearGradient id={`${id}-cab`} x1="0" y1="0" x2="1" y2="0">
			<stop offset="0" stopColor="#1A3366" />
			<stop offset="0.45" stopColor="#24447F" />
			<stop offset="1" stopColor="#12264F" />
		</linearGradient>
		<linearGradient id={`${id}-door`} x1="0" y1="0" x2="1" y2="0">
			<stop offset="0" stopColor="#3A5D96" />
			<stop offset="0.5" stopColor="#6A8CC0" />
			<stop offset="1" stopColor="#30528A" />
		</linearGradient>
		<linearGradient id={`${id}-steel`} x1="0" y1="0" x2="1" y2="0">
			<stop offset="0" stopColor="#566F98" />
			<stop offset="0.35" stopColor="#B8C8E2" />
			<stop offset="0.6" stopColor="#7C93BA" />
			<stop offset="1" stopColor="#3E5683" />
		</linearGradient>
		<linearGradient id={`${id}-rail`} x1="0" y1="0" x2="1" y2="0">
			<stop offset="0" stopColor="#3A5585" />
			<stop offset="0.5" stopColor="#A9BCDD" />
			<stop offset="1" stopColor="#3A5585" />
		</linearGradient>
		<linearGradient id={`${id}-wall`} x1="0" y1="0" x2="1" y2="0">
			<stop offset="0" stopColor="#0B1A3D" />
			<stop offset="0.5" stopColor="#0F2350" />
			<stop offset="1" stopColor="#0B1A3D" />
		</linearGradient>
		<linearGradient id={`${id}-orange`} x1="0" y1="0" x2="0" y2="1">
			<stop offset="0" stopColor="#FFB473" />
			<stop offset="1" stopColor="#E2661C" />
		</linearGradient>
		<radialGradient id={`${id}-sheave`} cx="0.4" cy="0.35" r="0.75">
			<stop offset="0" stopColor="#3E5E96" />
			<stop offset="1" stopColor="#14284F" />
		</radialGradient>
		<linearGradient id={`${id}-wood`} x1="0" y1="0" x2="1" y2="0">
			<stop offset="0" stopColor="#5A3B22" />
			<stop offset="0.5" stopColor="#8E6239" />
			<stop offset="1" stopColor="#5A3B22" />
		</linearGradient>
		<linearGradient id={`${id}-light`} x1="0" y1="0" x2="0" y2="1">
			<stop offset="0" stopColor="#FFE6C8" stopOpacity="0.55" />
			<stop offset="1" stopColor="#FFE6C8" stopOpacity="0" />
		</linearGradient>
	</defs>
);

/** A T-section guide rail seen face-on, from y1 to y2 at x (center). */
export const Rail: React.FC<{id: string; x: number; y1: number; y2: number; glow?: number}> = ({id, x, y1, y2, glow = 0}) => (
	<g>
		<rect x={x - 14} y={y1} width={28} height={y2 - y1} fill={`url(#${id}-rail)`} />
		<rect x={x - 3} y={y1} width={6} height={y2 - y1} fill="#E6EEFF" opacity={0.35} />
		{glow > 0 ? <rect x={x - 16} y={y1} width={32} height={y2 - y1} fill="none" stroke={C.cyan} strokeWidth={3} opacity={glow} /> : null}
	</g>
);

/** Multi-strand steel rope. `phase` scrolls the lay pattern so motion reads. */
export const Rope: React.FC<{
	x1: number;
	y1: number;
	x2: number;
	y2: number;
	w?: number;
	color?: string;
	phase?: number;
	opacity?: number;
}> = ({x1, y1, x2, y2, w = 8, color = '#AFC2E2', phase = 0, opacity = 1}) => (
	<g opacity={opacity}>
		<line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#1A2C52" strokeWidth={w + 4} strokeLinecap="round" />
		<line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={w} strokeLinecap="round" />
		<line
			x1={x1}
			y1={y1}
			x2={x2}
			y2={y2}
			stroke="#22385F"
			strokeWidth={w * 0.6}
			strokeDasharray={`${w * 0.7} ${w * 0.9}`}
			strokeDashoffset={phase}
		/>
	</g>
);

/**
 * Elevator car with sling frame, safety linkage and safety gear.
 * Origin: centre of the crosshead top (where the hoist ropes hitch).
 * lever: 0..1 governor-actuated lever rotation; engage: wedges pulled up.
 */
export const Car: React.FC<{
	id: string;
	x: number;
	y: number;
	s?: number;
	lever?: number;
	engage?: number;
	lit?: number;
	showLinkage?: boolean;
	interior?: boolean;
}> = ({id, x, y, s = 1, lever = 0, engage = 0, lit = 1, showLinkage = true, interior = true}) => {
	const lift = engage * 14;
	const hot = engage > 0.05;
	const rod = hot ? C.orange : '#7F96BE';
	const leverRot = -lever * 16;
	return (
		<g transform={`translate(${x} ${y}) scale(${s})`}>
			{/* stiles (vertical sling members) */}
			<rect x={-176} y={0} width={18} height={446} rx={4} fill="#2B4675" stroke="#5F7DB0" strokeWidth={2} />
			<rect x={158} y={0} width={18} height={446} rx={4} fill="#2B4675" stroke="#5F7DB0" strokeWidth={2} />
			{/* crosshead */}
			<rect x={-190} y={0} width={380} height={30} rx={6} fill={`url(#${id}-steel)`} stroke="#25406E" strokeWidth={2} />
			<rect x={-34} y={-18} width={68} height={22} rx={5} fill="#3E5A8C" stroke="#6E8CC0" strokeWidth={2} />
			{/* guide shoes */}
			{[-1, 1].map((d) => (
				<g key={d}>
					<rect x={d * 200 - 18} y={2} width={36} height={34} rx={5} fill="#1F3664" stroke="#6E8CC0" strokeWidth={2} />
					<rect x={d * 200 - 18} y={386} width={36} height={30} rx={5} fill="#1F3664" stroke="#6E8CC0" strokeWidth={2} />
				</g>
			))}
			{/* cab */}
			<rect x={-150} y={42} width={300} height={352} rx={12} fill={`url(#${id}-cab)`} stroke="#6E8CC0" strokeWidth={3} />
			{interior ? (
				<g>
					<rect x={-126} y={62} width={252} height={18} rx={6} fill="#0B1838" />
					<rect x={-96} y={65} width={192} height={10} rx={5} fill="#FFD9A8" opacity={0.85 * lit} />
					<rect x={-120} y={96} width={118} height={286} rx={5} fill={`url(#${id}-door)`} />
					<rect x={2} y={96} width={118} height={286} rx={5} fill={`url(#${id}-door)`} />
					<line x1={0} y1={96} x2={0} y2={382} stroke="#0B1838" strokeWidth={4} />
					<rect x={-120} y={96} width={240} height={140} fill={`url(#${id}-light)`} opacity={0.5 * lit} />
				</g>
			) : null}
			{/* plank (bottom beam) */}
			<rect x={-190} y={414} width={380} height={34} rx={6} fill={`url(#${id}-steel)`} stroke="#25406E" strokeWidth={2} />
			{/* safety gear housings at both rails */}
			{[-1, 1].map((d) => (
				<g key={d} transform={`translate(${d * 200} 432)`}>
					<path d="M -40 -26 L 40 -26 L 34 34 L -34 34 Z" fill="#203A69" stroke={hot ? C.orange : '#7F96BE'} strokeWidth={3} />
					{/* wedges either side of the rail blade */}
					<path
						d={`M -30 ${22 - lift} L -12 ${16 - lift} L -12 ${-14 - lift} L -24 ${-10 - lift} Z`}
						transform={`translate(${engage * 4} 0)`}
						fill={hot ? `url(#${id}-orange)` : '#9FB1D0'}
					/>
					<path
						d={`M 30 ${22 - lift} L 12 ${16 - lift} L 12 ${-14 - lift} L 24 ${-10 - lift} Z`}
						transform={`translate(${-engage * 4} 0)`}
						fill={hot ? `url(#${id}-orange)` : '#9FB1D0'}
					/>
				</g>
			))}
			{/* safety linkage: lever on crosshead + lift rods down the stiles */}
			{showLinkage ? (
				<g>
					<line x1={-167} y1={20} x2={-167} y2={404 - lift} stroke={rod} strokeWidth={5} strokeLinecap="round" />
					<line x1={167} y1={20} x2={167} y2={404 - lift} stroke={rod} strokeWidth={5} strokeLinecap="round" />
					<line x1={-167} y1={-6 - lift * 0.4} x2={167} y2={-6 - lift * 0.4} stroke={rod} strokeWidth={5} strokeLinecap="round" />
					<g transform={`translate(150 -6) rotate(${leverRot})`}>
						<rect x={-6} y={-7} width={110} height={14} rx={7} fill={hot ? C.orange : '#8EA5CC'} stroke="#1A2C52" strokeWidth={2} />
						<circle cx={0} cy={0} r={9} fill="#1A2C52" stroke="#B8C8E2" strokeWidth={3} />
						<circle cx={96} cy={0} r={7} fill="#1A2C52" stroke="#B8C8E2" strokeWidth={2} />
					</g>
				</g>
			) : null}
		</g>
	);
};

/** Point where the governor rope attaches to the car lever, in car-local coords. */
export const leverTip = (lever: number) => {
	const a = (-lever * 16 * Math.PI) / 180;
	return [150 + 96 * Math.cos(a), -6 + 96 * Math.sin(a)] as const;
};

/**
 * Overspeed governor (centrifugal flyweight type). Origin: sheave centre.
 * spin: sheave angle (deg); fly: 0..1 flyweight swing; trip: 0..1 latch;
 * clamp: 0..1 rope jaw closure.
 */
export const Governor: React.FC<{
	id: string;
	x: number;
	y: number;
	s?: number;
	spin: number;
	fly: number;
	trip: number;
	clamp: number;
	ropePhase: number;
	ropeLen?: number;
	hot?: number;
}> = ({id, x, y, s = 1, spin, fly, trip, clamp, ropePhase, ropeLen = 420, hot = 0}) => {
	const R = 150;
	const weightAng = fly * 34;
	const jawGap = 34 - clamp * 22;
	const orangeMix = Math.max(trip, hot);
	return (
		<g transform={`translate(${x} ${y}) scale(${s})`}>
			{/* base stand */}
			<path d="M -200 220 L 200 220 L 170 260 L -170 260 Z" fill="#132A55" stroke="#4E6CA0" strokeWidth={3} />
			<path d="M -40 0 L -110 220 L 110 220 L 40 0 Z" fill="#0F2247" stroke="#3E5A8C" strokeWidth={3} />
			{/* rope: wraps top of sheave, descends both sides */}
			<path d={`M ${-R} 0 A ${R} ${R} 0 0 1 ${R} 0`} fill="none" stroke="#1A2C52" strokeWidth={14} />
			<Rope x1={-R} y1={0} x2={-R} y2={ropeLen} w={10} phase={-ropePhase} />
			<Rope x1={R} y1={0} x2={R} y2={ropeLen} w={10} phase={ropePhase} color={clamp > 0.5 ? '#FFC79A' : '#AFC2E2'} />
			{/* sheave */}
			<circle r={R} fill={`url(#${id}-sheave)`} stroke="#AFC2E2" strokeWidth={10} />
			<circle r={R - 16} fill="none" stroke="#2C4A80" strokeWidth={4} />
			<g transform={`rotate(${spin})`}>
				{[0, 60, 120, 180, 240, 300].map((a) => (
					<rect key={a} x={-7} y={-R + 22} width={14} height={R - 40} rx={6} fill="#2E4C83" transform={`rotate(${a})`} />
				))}
				{/* flyweights: pivot on the sheave face, swing outward with speed */}
				{[0, 180].map((a) => (
					<g key={a} transform={`rotate(${a})`}>
						<g transform={`translate(-62 -40) rotate(${weightAng})`}>
							<path
								d="M 0 0 C 30 -32 92 -38 120 -18 L 112 6 C 84 -6 36 0 10 16 Z"
								fill={orangeMix > 0.3 ? C.orange : C.cyan}
								stroke={C.white}
								strokeWidth={2.5}
							/>
							<circle cx={0} cy={0} r={9} fill="#0E1F48" stroke={C.white} strokeWidth={2.5} />
						</g>
					</g>
				))}
				{/* balance spring between the weights */}
				<path
					d={`M -34 ${-52 - fly * 6} l 10 -10 l 10 20 l 10 -20 l 10 20 l 10 -20 l 10 20 l 10 -10`}
					transform="translate(-1 30)"
					fill="none"
					stroke="#DCE6F8"
					strokeWidth={3}
				/>
				<circle r={30} fill="#16305F" stroke="#AFC2E2" strokeWidth={5} />
				<circle r={9} fill="#AFC2E2" />
			</g>
			{/* trip latch (stationary), struck by an outswung weight */}
			<g transform={`translate(${R + 34} ${-R + 20}) rotate(${trip * 28})`}>
				<rect x={-10} y={-8} width={78} height={16} rx={8} fill={trip > 0.3 ? C.orange : '#8EA5CC'} stroke="#1A2C52" strokeWidth={2} />
				<circle r={10} fill="#1A2C52" stroke="#DCE6F8" strokeWidth={3} />
			</g>
			{/* rope-gripping jaw on the descending (car) side */}
			<g transform={`translate(${R} ${R + 70})`}>
				<rect x={-jawGap - 30} y={-34} width={30} height={68} rx={6} fill={clamp > 0.3 ? C.orange : '#3E5A8C'} stroke="#DCE6F8" strokeWidth={2.5} />
				<rect x={jawGap} y={-34} width={30} height={68} rx={6} fill={clamp > 0.3 ? C.orange : '#3E5A8C'} stroke="#DCE6F8" strokeWidth={2.5} />
				<rect x={-90} y={-46} width={180} height={10} rx={5} fill="#24407A" />
			</g>
		</g>
	);
};

/** Tension sheave weighted in the pit, keeps the governor rope taut. */
export const TensionSheave: React.FC<{x: number; y: number; s?: number; spin: number}> = ({x, y, s = 1, spin}) => (
	<g transform={`translate(${x} ${y}) scale(${s})`}>
		<circle r={60} fill="#16305F" stroke="#AFC2E2" strokeWidth={8} />
		<g transform={`rotate(${spin})`}>
			{[0, 90].map((a) => (
				<rect key={a} x={-5} y={-52} width={10} height={104} rx={4} fill="#2E4C83" transform={`rotate(${a})`} />
			))}
		</g>
		<circle r={12} fill="#AFC2E2" />
		<rect x={-30} y={68} width={60} height={50} rx={6} fill="#24407A" stroke="#6E8CC0" strokeWidth={2} />
		<line x1={0} y1={12} x2={0} y2={68} stroke="#6E8CC0" strokeWidth={6} />
	</g>
);

/** Traction machine: drive sheave + motor + spring-applied drum brake. */
export const TractionMachine: React.FC<{
	id: string;
	x: number;
	y: number;
	s?: number;
	spin: number;
	brake: number;
	power: number;
	ropes?: number;
	ropeDrop?: number;
}> = ({id, x, y, s = 1, spin, brake, power, ropes = 5, ropeDrop = 0}) => {
	const shoe = 26 - brake * 22;
	const hot = brake > 0.4;
	return (
		<g transform={`translate(${x} ${y}) scale(${s})`}>
			{/* bedplate */}
			<rect x={-330} y={120} width={660} height={40} rx={8} fill="#132A55" stroke="#4E6CA0" strokeWidth={3} />
			{/* motor */}
			<rect x={70} y={-90} width={240} height={210} rx={26} fill="#1A3366" stroke="#6E8CC0" strokeWidth={3} />
			{[0, 1, 2, 3, 4, 5].map((i) => (
				<line key={i} x1={100 + i * 36} y1={-70} x2={100 + i * 36} y2={100} stroke="#2C4A80" strokeWidth={8} strokeLinecap="round" />
			))}
			<circle cx={290} cy={-70} r={14} fill={power > 0.5 ? C.cyan : '#3B4B6B'} />
			{/* drive sheave with rope grooves */}
			<circle cx={-170} cy={0} r={118} fill={`url(#${id}-sheave)`} stroke="#AFC2E2" strokeWidth={8} />
			{Array.from({length: ropes}).map((_, i) => (
				<circle key={i} cx={-170} cy={0} r={104 - i * 3} fill="none" stroke="#7F96BE" strokeWidth={1.5} opacity={0.6} />
			))}
			<g transform={`translate(-170 0) rotate(${spin})`}>
				{[0, 72, 144, 216, 288].map((a) => (
					<rect key={a} x={-6} y={-92} width={12} height={70} rx={5} fill="#2E4C83" transform={`rotate(${a})`} />
				))}
				<circle r={26} fill="#16305F" stroke="#AFC2E2" strokeWidth={4} />
			</g>
			{/* shaft */}
			<rect x={-60} y={-14} width={140} height={28} fill={`url(#${id}-steel)`} />
			{/* brake drum + shoes */}
			<circle cx={-10} cy={0} r={58} fill="#2B4675" stroke="#B8C8E2" strokeWidth={5} />
			<circle cx={-10} cy={0} r={16} fill="#AFC2E2" />
			<g transform={`translate(-10 ${-58 - shoe})`}>
				<path d="M -52 -6 Q 0 14 52 -6 L 52 -24 L -52 -24 Z" fill={hot ? C.orange : '#8EA5CC'} stroke="#1A2C52" strokeWidth={2} />
				<path d="M -10 -24 l 6 -10 l 8 10 l 8 -10 l 8 10 l 8 -10" fill="none" stroke="#DCE6F8" strokeWidth={3} />
			</g>
			<g transform={`translate(-10 ${58 + shoe}) scale(1 -1)`}>
				<path d="M -52 -6 Q 0 14 52 -6 L 52 -24 L -52 -24 Z" fill={hot ? C.orange : '#8EA5CC'} stroke="#1A2C52" strokeWidth={2} />
			</g>
			{/* hoist ropes leaving the drive sheave downward */}
			{Array.from({length: ropes}).map((_, i) => {
				const off = (i - (ropes - 1) / 2) * 9;
				return <Rope key={i} x1={-288 + 6 + off * 0.3} y1={0} x2={-288 + 6 + off * 0.3} y2={300 + ropeDrop} w={5} />;
			})}
		</g>
	);
};

/** Shaft walls + landing doors, scrolled vertically by `scroll` px. */
export const Shaft: React.FC<{
	id: string;
	x: number;
	w: number;
	y1: number;
	y2: number;
	scroll?: number;
	floorGap?: number;
	streak?: number;
}> = ({id, x, w, y1, y2, scroll = 0, floorGap = 520, streak = 0}) => {
	const first = Math.floor((y1 - scroll) / floorGap) - 1;
	const n = Math.ceil((y2 - y1) / floorGap) + 3;
	const floors: number[] = [];
	for (let i = 0; i < n; i++) floors.push(first + i);
	return (
		<g>
			<rect x={x} y={y1} width={w} height={y2 - y1} fill={`url(#${id}-wall)`} />
			<rect x={x} y={y1} width={10} height={y2 - y1} fill="#1B3466" />
			<rect x={x + w - 10} y={y1} width={10} height={y2 - y1} fill="#1B3466" />
			{floors.map((f) => {
				const fy = f * floorGap + scroll;
				if (fy < y1 - floorGap || fy > y2 + floorGap) return null;
				return (
					<g key={f}>
						<rect x={x} y={fy} width={w} height={26} fill="#132A55" />
						<rect x={x} y={fy} width={w} height={4} fill="#2C4A80" />
						<rect x={x + w * 0.3} y={fy - 270} width={w * 0.4} height={270} fill="#0D1D42" stroke="#22417A" strokeWidth={2} />
						<text x={x + 26} y={fy - 20} fill="#3E5A8C" fontFamily={FONT_BODY} fontWeight={700} fontSize={26}>
							{`${40 - f}`}
						</text>
					</g>
				);
			})}
			{streak > 0
				? [0.15, 0.3, 0.5, 0.7, 0.85].map((p, i) => (
						<rect
							key={i}
							x={x + w * p}
							y={y1 + ((((i * 337 + scroll * 1.7) % (y2 - y1)) + (y2 - y1)) % (y2 - y1))}
							width={3}
							height={220}
							fill={C.cyan}
							opacity={streak * 0.35}
						/>
				  ))
				: null}
		</g>
	);
};

/** Large detail of one safety-gear: wedges, tapered housing, rail blade, forces. */
export const SafetyDetail: React.FC<{id: string; x: number; y: number; s?: number; engage: number; slide?: number; a?: number}> = ({
	id,
	x,
	y,
	s = 1,
	engage,
	slide = 0,
	a = 1,
}) => {
	const lift = engage * 34;
	const inn = engage * 16;
	const hot = engage > 0.5;
	return (
		<g transform={`translate(${x} ${y}) scale(${s})`} opacity={a}>
			{/* rail blade (moves past while sliding) */}
			<rect x={-22} y={-250} width={44} height={500} fill={`url(#${id}-rail)`} />
			{[0, 1, 2, 3, 4, 5, 6].map((i) => (
				<line key={i} x1={-22} x2={22} y1={-250 + ((((i * 80 + slide) % 500) + 500) % 500)} y2={-250 + ((((i * 80 + slide) % 500) + 500) % 500)} stroke="#5B79A8" strokeWidth={2} />
			))}
			{/* tapered housing (narrow at top) */}
			<path d="M -150 -130 L -60 -130 L -92 140 L -170 140 Z" fill="#1F3664" stroke="#8EA5CC" strokeWidth={4} />
			<path d="M 150 -130 L 60 -130 L 92 140 L 170 140 Z" fill="#1F3664" stroke="#8EA5CC" strokeWidth={4} />
			<rect x={-170} y={140} width={340} height={30} rx={6} fill="#2B4675" stroke="#8EA5CC" strokeWidth={3} />
			{/* wedges */}
			<g transform={`translate(${inn} ${-lift})`}>
				<path d="M -92 120 L -72 -40 L -26 -40 L -26 120 Z" fill={hot ? `url(#${id}-orange)` : '#9FB1D0'} stroke="#1A2C52" strokeWidth={3} />
				{[0, 1, 2, 3, 4, 5].map((i) => (
					<line key={i} x1={-26} x2={-34} y1={-30 + i * 26} y2={-22 + i * 26} stroke="#1A2C52" strokeWidth={2} />
				))}
			</g>
			<g transform={`translate(${-inn} ${-lift})`}>
				<path d="M 92 120 L 72 -40 L 26 -40 L 26 120 Z" fill={hot ? `url(#${id}-orange)` : '#9FB1D0'} stroke="#1A2C52" strokeWidth={3} />
				{[0, 1, 2, 3, 4, 5].map((i) => (
					<line key={i} x1={26} x2={34} y1={-30 + i * 26} y2={-22 + i * 26} stroke="#1A2C52" strokeWidth={2} />
				))}
			</g>
			{/* lift rod */}
			<rect x={-110} y={110 - lift} width={220} height={12} rx={6} fill={hot ? C.orange : '#7F96BE'} />
		</g>
	);
};

/** Arrow helper (SVG). */
export const Arrow: React.FC<{x1: number; y1: number; x2: number; y2: number; color?: string; w?: number; a?: number}> = ({
	x1,
	y1,
	x2,
	y2,
	color = C.orange,
	w = 6,
	a = 1,
}) => {
	const ang = Math.atan2(y2 - y1, x2 - x1);
	const h = w * 3.4;
	const p1 = [x2 - h * Math.cos(ang - 0.45), y2 - h * Math.sin(ang - 0.45)];
	const p2 = [x2 - h * Math.cos(ang + 0.45), y2 - h * Math.sin(ang + 0.45)];
	return (
		<g opacity={a}>
			<line x1={x1} y1={y1} x2={x2 - Math.cos(ang) * h * 0.6} y2={y2 - Math.sin(ang) * h * 0.6} stroke={color} strokeWidth={w} strokeLinecap="round" />
			<path d={`M ${x2} ${y2} L ${p1[0]} ${p1[1]} L ${p2[0]} ${p2[1]} Z`} fill={color} />
		</g>
	);
};

/** Speed dial with a green/amber/red-free palette (cyan → orange). */
export const SpeedDial: React.FC<{x: number; y: number; s?: number; v: number; label?: string}> = ({x, y, s = 1, v, label = 'CAR SPEED'}) => {
	const ang = -120 + v * 240;
	const arc = (a0: number, a1: number, r: number) => {
		const p = (a: number) => [Math.sin((a * Math.PI) / 180) * r, -Math.cos((a * Math.PI) / 180) * r];
		const [x0, y0] = p(a0);
		const [x1, y1] = p(a1);
		return `M ${x0} ${y0} A ${r} ${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1} ${y1}`;
	};
	return (
		<g transform={`translate(${x} ${y}) scale(${s})`}>
			<circle r={130} fill="rgba(6,14,36,0.92)" stroke="#2C4A80" strokeWidth={4} />
			<path d={arc(-120, 50, 104)} fill="none" stroke={C.cyan} strokeWidth={14} strokeLinecap="round" />
			<path d={arc(60, 120, 104)} fill="none" stroke={C.orange} strokeWidth={14} strokeLinecap="round" />
			{Array.from({length: 13}).map((_, i) => {
				const a = ((-120 + i * 20) * Math.PI) / 180;
				return <line key={i} x1={Math.sin(a) * 82} y1={-Math.cos(a) * 82} x2={Math.sin(a) * 92} y2={-Math.cos(a) * 92} stroke="#8EA5CC" strokeWidth={3} />;
			})}
			<g transform={`rotate(${ang})`}>
				<path d="M -6 10 L 0 -96 L 6 10 Z" fill={v > 0.74 ? C.orange : C.white} />
			</g>
			<circle r={14} fill="#16305F" stroke={C.white} strokeWidth={3} />
			<text y={66} textAnchor="middle" fill={C.mute} fontFamily={FONT_BODY} fontWeight={700} fontSize={20} letterSpacing={3}>
				{label}
			</text>
		</g>
	);
};
