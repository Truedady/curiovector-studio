import React from 'react';
import {C, FONT} from '../theme';

/**
 * Cross-section of an over-ear ANC earcup sitting on the ear (local box
 * 0..1000 x 0..720, ear canal runs to the right). Plain vector shapes and
 * gradients only.
 */
export const CUP = {
	outMic: {x: 108, y: 205},
	inMic: {x: 560, y: 470},
	chip: {x: 260, y: 360},
	driverX: 500,
	canalY: 360,
	canalX0: 600,
	drumX: 905,
	traces: {
		outToChip: [
			[124, 205],
			[200, 205],
			[200, 335],
			[220, 335],
		],
		inToChip: [
			[548, 478],
			[548, 560],
			[260, 560],
			[260, 400],
		],
		chipToDriver: [
			[300, 360],
			[400, 360],
		],
	} as Record<string, number[][]>,
};

/** Position along a polyline at progress p (0..1). */
export const along = (pts: number[][], p: number) => {
	const segs = pts.slice(1).map((b, i) => {
		const a = pts[i];
		return {a, b, len: Math.hypot(b[0] - a[0], b[1] - a[1])};
	});
	const total = segs.reduce((s, x) => s + x.len, 0);
	let d = Math.max(0, Math.min(1, p)) * total;
	for (const s of segs) {
		if (d <= s.len) {
			const k = s.len === 0 ? 0 : d / s.len;
			return {x: s.a[0] + (s.b[0] - s.a[0]) * k, y: s.a[1] + (s.b[1] - s.a[1]) * k};
		}
		d -= s.len;
	}
	const last = pts[pts.length - 1];
	return {x: last[0], y: last[1]};
};

const poly = (pts: number[][]) => pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join(' ');

export const Earcup: React.FC<{
	id: string;
	t: number;
	outMic?: number;
	inMic?: number;
	chip?: number;
	driver?: number; // 0..1 highlight
	driverMove?: number; // diaphragm displacement in px
	pads?: number;
	pulses?: {outToChip?: number; inToChip?: number; chipToDriver?: number};
	labels?: boolean;
	labelScale?: number;
	drumLabel?: number;
}> = ({id, t, drumLabel = 0.9, outMic = 0, inMic = 0, chip = 0, driver = 0, driverMove = 0, pads = 0, pulses = {}, labels = true, labelScale = 1}) => {
	const g = (n: string) => `${id}-${n}`;
	const ls = labelScale;
	const label = (x: number, y: number, text: string, o: number, color: string = C.white, anchor: 'start' | 'middle' | 'end' = 'middle') =>
		labels && o > 0.01 ? (
			<text x={x} y={y} fill={color} opacity={o} fontFamily={FONT} fontWeight={800} fontSize={26 * ls} letterSpacing={3 * ls} textAnchor={anchor}>
				{text}
			</text>
		) : null;
	return (
		<g>
			<defs>
				<linearGradient id={g('shell')} x1="0" y1="0" x2="1" y2="1">
					<stop offset="0" stopColor="#4A5E9C" />
					<stop offset="0.5" stopColor="#24356A" />
					<stop offset="1" stopColor="#111C42" />
				</linearGradient>
				<linearGradient id={g('pad')} x1="0" y1="0" x2="1" y2="0">
					<stop offset="0" stopColor="#2B2F4A" />
					<stop offset="1" stopColor="#474C6E" />
				</linearGradient>
				<linearGradient id={g('skin')} x1="0" y1="0" x2="1" y2="0">
					<stop offset="0" stopColor="#D9A486" />
					<stop offset="1" stopColor="#B37A62" />
				</linearGradient>
				<linearGradient id={g('cone')} x1="0" y1="0" x2="1" y2="0">
					<stop offset="0" stopColor="#5D6FA8" />
					<stop offset="1" stopColor="#9DB0E0" />
				</linearGradient>
			</defs>
			{/* side of the head + ear canal */}
			<path d="M590 30 L1000 30 L1000 690 L590 690 C 610 560 610 160 590 30 Z" fill={`url(#${g('skin')})`} />
			<path d="M640 330 L900 336 C 912 338 912 382 900 384 L640 392 Z" fill="#3A1F22" />
			<path d="M640 330 L900 336" stroke="#E8B89C" strokeWidth={3} opacity={0.6} />
			{/* outer ear (pinna) section */}
			<path d="M612 150 C 680 150 700 250 670 300 C 650 330 640 330 640 330 L640 392 C 690 420 700 520 640 570 C 620 590 605 580 600 560" fill="none" stroke="#E7B395" strokeWidth={22} strokeLinecap="round" />
			{/* eardrum */}
			<ellipse cx={CUP.drumX} cy={CUP.canalY} rx={9} ry={34} fill="#F3C9B5" stroke="#FFFFFF" strokeOpacity={0.5} strokeWidth={2} />
			{labels ? label(CUP.drumX + 4, 452, 'eardrum', drumLabel, C.white, 'end') : null}
			{/* shell */}
			<path
				d="M520 90 L300 90 C 170 90 120 170 120 260 L120 460 C 120 550 170 630 300 630 L520 630 L520 592 L300 592 C 200 592 160 530 160 450 L160 270 C 160 190 200 128 300 128 L520 128 Z"
				fill={`url(#${g('shell')})`}
			/>
			<path d="M300 98 C 190 98 132 172 130 262" stroke="#8FA6E2" strokeWidth={3} fill="none" opacity={0.6} />
			{/* cushions */}
			<rect x={505} y={66} width={92} height={110} rx={44} fill={`url(#${g('pad')})`} />
			<rect x={505} y={544} width={92} height={110} rx={44} fill={`url(#${g('pad')})`} />
			<rect x={505} y={66} width={92} height={110} rx={44} fill="none" stroke={C.orange} strokeWidth={5} opacity={pads} />
			<rect x={505} y={544} width={92} height={110} rx={44} fill="none" stroke={C.orange} strokeWidth={5} opacity={pads} />
			{/* traces */}
			{Object.entries(CUP.traces).map(([k, pts]) => (
				<path key={k} d={poly(pts)} stroke="#5E77B8" strokeWidth={4} fill="none" opacity={0.75} />
			))}
			{Object.entries(pulses).map(([k, p]) =>
				p === undefined ? null : (
					<g key={k}>
						{[0, 0.33, 0.66].map((o) => {
							const q = (p + o) % 1;
							const pt = along(CUP.traces[k], q);
							return <circle key={o} cx={pt.x} cy={pt.y} r={9} fill={k === 'chipToDriver' ? C.cyan : C.orange} opacity={Math.sin(Math.PI * q)} />;
						})}
					</g>
				),
			)}
			{/* driver: magnet + cone + diaphragm */}
			<rect x={396} y={318} width={44} height={84} rx={6} fill="#1A2550" stroke={driver > 0.1 ? C.cyan : '#4A5E9C'} strokeWidth={3} />
			<path d={`M440 318 L${490 + driverMove} 232 L${490 + driverMove} 488 L440 402 Z`} fill={`url(#${g('cone')})`} opacity={0.9} />
			<path d={`M${492 + driverMove} 228 C ${500 + driverMove} 300 ${500 + driverMove} 420 ${492 + driverMove} 492`} stroke={driver > 0.1 ? C.cyan : '#B8C6EA'} strokeWidth={6} fill="none" strokeLinecap="round" />
			{/* processor chip */}
			<g>
				<rect x={CUP.chip.x - 44} y={CUP.chip.y - 44} width={88} height={88} rx={10} fill="#0B1433" stroke={chip > 0.1 ? C.cyan : '#4A5E9C'} strokeWidth={4} />
				{[-26, -9, 9, 26].map((o) => (
					<g key={o} stroke="#6F86C4" strokeWidth={4}>
						<line x1={CUP.chip.x + o} y1={CUP.chip.y - 44} x2={CUP.chip.x + o} y2={CUP.chip.y - 56} />
						<line x1={CUP.chip.x + o} y1={CUP.chip.y + 44} x2={CUP.chip.x + o} y2={CUP.chip.y + 56} />
					</g>
				))}
				<rect x={CUP.chip.x - 24} y={CUP.chip.y - 24} width={48} height={48} rx={4} fill={C.cyan} opacity={0.15 + 0.6 * chip} />
			</g>
			{/* microphones */}
			{[
				{p: CUP.outMic, o: outMic},
				{p: CUP.inMic, o: inMic},
			].map(({p, o}, i) => (
				<g key={i}>
					<circle cx={p.x} cy={p.y} r={30} fill="none" stroke={C.orange} strokeWidth={3} opacity={o * (0.4 + 0.4 * Math.sin(t * 6 + i))} />
					<rect x={p.x - 16} y={p.y - 22} width={32} height={44} rx={16} fill="#0B1433" stroke={o > 0.1 ? C.orange : '#6F86C4'} strokeWidth={4} />
					<line x1={p.x - 7} y1={p.y - 6} x2={p.x + 7} y2={p.y - 6} stroke="#8FA6E2" strokeWidth={3} />
					<line x1={p.x - 7} y1={p.y + 4} x2={p.x + 7} y2={p.y + 4} stroke="#8FA6E2" strokeWidth={3} />
				</g>
			))}
			{label(CUP.outMic.x, CUP.outMic.y - 50, 'outside mic', outMic, C.orange)}
			{label(CUP.inMic.x, 708, 'inside mic', inMic, C.orange)}
			{label(CUP.chip.x, CUP.chip.y + 100, 'processor', chip, C.cyan)}
			{label(445, 210, 'speaker', driver, C.cyan)}
			{label(551, 40, 'pad + seal', pads, C.orange)}
		</g>
	);
};
