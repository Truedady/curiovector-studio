import React, {useMemo} from 'react';
import {C, rng, smoothClosed, useLayout} from './theme';

/* ------------------------------------------------------------------ */
/* Starfield + nebula backdrop (persistent across scenes)              */
/* ------------------------------------------------------------------ */
export const Backdrop: React.FC<{t: number}> = ({t}) => {
	const {W, H, v} = useLayout();
	const stars = useMemo(() => {
		const r = rng(v ? 51 : 7);
		return Array.from({length: 320}, () => ({
			x: r() * W,
			y: r() * H,
			s: Math.pow(r(), 3) * 2.4 + 0.5,
			ph: r() * Math.PI * 2,
			depth: r() * 0.8 + 0.2,
			warm: r() < 0.12,
		}));
	}, [W, H, v]);
	return (
		<g>
			<rect width={W} height={H} fill="url(#bgGrad)" />
			<ellipse cx={W * 0.78} cy={H * 0.22} rx={W * 0.55} ry={H * 0.35} fill="url(#nebCyan)" />
			<ellipse cx={W * 0.12} cy={H * 0.85} rx={W * 0.5} ry={H * 0.3} fill="url(#nebOrange)" />
			{stars.map((s, i) => {
				const x = (s.x - t * 6 * s.depth + W * 10) % W;
				const tw = 0.55 + 0.45 * Math.sin(t * 1.3 + s.ph);
				return (
					<circle
						key={i}
						cx={x}
						cy={s.y}
						r={s.s}
						fill={s.warm ? '#FFD6B0' : C.white}
						opacity={(0.25 + 0.6 * s.depth) * tw}
					/>
				);
			})}
		</g>
	);
};

export const Defs: React.FC = () => (
	<defs>
		<linearGradient id="bgGrad" x1="0" y1="0" x2="0.3" y2="1">
			<stop offset="0" stopColor="#0B1A3F" />
			<stop offset="0.55" stopColor={C.navy} />
			<stop offset="1" stopColor={C.navyDeep} />
		</linearGradient>
		<radialGradient id="nebCyan">
			<stop offset="0" stopColor={C.cyan} stopOpacity="0.13" />
			<stop offset="0.6" stopColor={C.cyan} stopOpacity="0.04" />
			<stop offset="1" stopColor={C.cyan} stopOpacity="0" />
		</radialGradient>
		<radialGradient id="nebOrange">
			<stop offset="0" stopColor={C.orange} stopOpacity="0.10" />
			<stop offset="1" stopColor={C.orange} stopOpacity="0" />
		</radialGradient>
		<radialGradient id="vignette" cx="0.5" cy="0.5" r="0.75">
			<stop offset="0.55" stopColor="#000" stopOpacity="0" />
			<stop offset="1" stopColor="#000" stopOpacity="0.55" />
		</radialGradient>
		<radialGradient id="flash">
			<stop offset="0" stopColor="#FFFFFF" stopOpacity="1" />
			<stop offset="0.18" stopColor="#FFF2DC" stopOpacity="0.95" />
			<stop offset="0.45" stopColor={C.orange} stopOpacity="0.45" />
			<stop offset="1" stopColor={C.orange} stopOpacity="0" />
		</radialGradient>
		<radialGradient id="glowCyan">
			<stop offset="0" stopColor={C.cyan} stopOpacity="0.55" />
			<stop offset="1" stopColor={C.cyan} stopOpacity="0" />
		</radialGradient>
		<radialGradient id="glowOrange">
			<stop offset="0" stopColor={C.orange} stopOpacity="0.6" />
			<stop offset="1" stopColor={C.orange} stopOpacity="0" />
		</radialGradient>
		<radialGradient id="dust">
			<stop offset="0" stopColor="#E8D9C4" stopOpacity="0.55" />
			<stop offset="0.5" stopColor="#B59C80" stopOpacity="0.22" />
			<stop offset="1" stopColor="#8A7660" stopOpacity="0" />
		</radialGradient>
		<linearGradient id="foil" x1="0" y1="0" x2="1" y2="1">
			<stop offset="0" stopColor="#F6CF7A" />
			<stop offset="0.45" stopColor="#C98A2E" />
			<stop offset="1" stopColor="#6E4513" />
		</linearGradient>
		<linearGradient id="panel" x1="0" y1="0" x2="1" y2="0">
			<stop offset="0" stopColor="#1B3C86" />
			<stop offset="0.5" stopColor="#24509F" />
			<stop offset="1" stopColor="#11275A" />
		</linearGradient>
		<linearGradient id="streak" x1="0" y1="0" x2="1" y2="0">
			<stop offset="0" stopColor={C.cyan} stopOpacity="0" />
			<stop offset="1" stopColor={C.cyan} stopOpacity="0.8" />
		</linearGradient>
		<radialGradient id="sunGrad">
			<stop offset="0" stopColor="#FFFFFF" />
			<stop offset="0.35" stopColor="#FFE3B8" />
			<stop offset="0.7" stopColor={C.orange} />
			<stop offset="1" stopColor="#E0601C" />
		</radialGradient>
		<radialGradient id="corona">
			<stop offset="0.3" stopColor={C.orange} stopOpacity="0.5" />
			<stop offset="1" stopColor={C.orange} stopOpacity="0" />
		</radialGradient>
		<marker id="arrowCyan" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
			<path d="M0,0 L10,5 L0,10 Z" fill={C.cyan} />
		</marker>
		<marker id="arrowOrange" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
			<path d="M0,0 L10,5 L0,10 Z" fill={C.orange} />
		</marker>
		<marker id="arrowWhite" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
			<path d="M0,0 L10,5 L0,10 Z" fill={C.white} />
		</marker>
	</defs>
);

export const Vignette: React.FC = () => {
	const {W, H} = useLayout();
	return <rect width={W} height={H} fill="url(#vignette)" pointerEvents="none" />;
};

/* ------------------------------------------------------------------ */
/* Asteroid — Didymos (spinning-top) or Dimorphos (boulder-strewn)     */
/* ------------------------------------------------------------------ */
type AsteroidProps = {
	id: string;
	cx: number;
	cy: number;
	r: number;
	kind: 'didymos' | 'dimorphos' | 'generic';
	seed?: number;
	spin?: number; // degrees
	light?: number; // direction light comes FROM, degrees (SVG coords)
	glow?: string;
};

export const Asteroid: React.FC<AsteroidProps> = ({id, cx, cy, r, kind, seed = 3, spin = 0, light = 215, glow}) => {
	const geo = useMemo(() => {
		const R = rng(seed);
		const harm = Array.from({length: 7}, (_, k) => ({a: (R() * 0.07) / (k * 0.6 + 1), ph: R() * Math.PI * 2}));
		const pts: [number, number][] = [];
		const N = 64;
		for (let i = 0; i < N; i++) {
			const th = (i / N) * Math.PI * 2;
			let base = 1;
			if (kind === 'didymos') base = 0.8 + 0.2 * Math.pow(Math.abs(Math.cos(th)), 1.6);
			if (kind === 'dimorphos') base = 1 / Math.sqrt(Math.cos(th) ** 2 + (Math.sin(th) / 0.8) ** 2);
			if (kind === 'generic') base = 1 / Math.sqrt(Math.cos(th) ** 2 + (Math.sin(th) / 0.7) ** 2);
			let n = 0;
			harm.forEach((h, k) => (n += h.a * Math.sin((k + 2) * th + h.ph)));
			const rr = base * (1 + n);
			pts.push([Math.cos(th) * rr, Math.sin(th) * rr]);
		}
		const craters = Array.from({length: kind === 'dimorphos' ? 10 : 20}, () => {
			const a = R() * Math.PI * 2;
			const d = Math.sqrt(R()) * 0.72;
			const s = 0.04 + Math.pow(R(), 2) * 0.15;
			return {x: Math.cos(a) * d, y: Math.sin(a) * d * 0.85, s, a, d};
		});
		const boulders = Array.from({length: kind === 'dimorphos' ? 90 : 30}, () => {
			const a = R() * Math.PI * 2;
			const d = Math.sqrt(R()) * 0.85;
			return {x: Math.cos(a) * d, y: Math.sin(a) * d * 0.8, s: 0.008 + Math.pow(R(), 3) * (kind === 'dimorphos' ? 0.06 : 0.03)};
		});
		const mottles = Array.from({length: 26}, () => ({
			x: R() * 2 - 1,
			y: R() * 2 - 1,
			s: 0.1 + R() * 0.3,
			a: R() * 180,
			dark: R() < 0.55,
		}));
		const outline = smoothClosed(pts);
		return {outline, craters, boulders, mottles};
	}, [seed, kind]);

	const lx = Math.cos((light * Math.PI) / 180);
	const ly = Math.sin((light * Math.PI) / 180);
	const base = kind === 'didymos' ? '#7A7266' : kind === 'dimorphos' ? '#8E867A' : '#7E7468';
	const sw = 1 / r;

	return (
		<g transform={`translate(${cx},${cy}) scale(${r})`}>
			<defs>
				<clipPath id={`${id}-clip`}>
					<path d={geo.outline} transform={`rotate(${spin})`} />
				</clipPath>
				<radialGradient id={`${id}-shade`} cx={0.5 + lx * 0.16} cy={0.5 + ly * 0.16} r="0.42">
					<stop offset="0" stopColor="#FFF1DC" stopOpacity="0.42" />
					<stop offset="0.3" stopColor="#FFF1DC" stopOpacity="0.08" />
					<stop offset="0.55" stopColor="#0A1024" stopOpacity="0.35" />
					<stop offset="0.8" stopColor="#040816" stopOpacity="0.88" />
					<stop offset="1" stopColor="#02040C" stopOpacity="0.97" />
				</radialGradient>
				<linearGradient id={`${id}-rim`} x1={0.5 + lx / 2} y1={0.5 + ly / 2} x2={0.5 - lx / 2} y2={0.5 - ly / 2}>
					<stop offset="0" stopColor="#FFE9C9" stopOpacity="0.9" />
					<stop offset="0.45" stopColor="#FFE9C9" stopOpacity="0" />
					<stop offset="0.8" stopColor={C.cyan} stopOpacity="0" />
					<stop offset="1" stopColor={C.cyan} stopOpacity="0.55" />
				</linearGradient>
			</defs>
			{glow ? <circle r={1.6} fill={glow} opacity={0.35} /> : null}
			<g clipPath={`url(#${id}-clip)`}>
				<rect x={-1.4} y={-1.4} width={2.8} height={2.8} fill={base} />
				<g transform={`rotate(${spin})`}>
					{geo.mottles.map((m, i) => (
						<ellipse key={`mt${i}`} cx={m.x} cy={m.y} rx={m.s} ry={m.s * 0.7} transform={`rotate(${m.a} ${m.x} ${m.y})`} fill={m.dark ? '#3D3830' : '#B1A794'} opacity={0.18} />
					))}
					{geo.craters.map((c, i) => {
						const fore = Math.sqrt(Math.max(0.15, 1 - c.d * c.d));
						const rot = (c.a * 180) / Math.PI;
						return (
							<g key={i} transform={`translate(${c.x},${c.y}) rotate(${rot}) scale(${fore},1)`}>
								<ellipse cx={-lx * c.s * 0.12} rx={c.s * 1.1} ry={c.s * 1.1} fill="#B3A894" opacity={0.28} />
								<ellipse rx={c.s} ry={c.s} fill="#2F2B26" opacity={0.55} />
								<ellipse cx={c.s * 0.18} rx={c.s * 0.75} ry={c.s * 0.75} fill="#4A443C" opacity={0.6} />
							</g>
						);
					})}
					{geo.boulders.map((b, i) => (
						<g key={`b${i}`}>
							<ellipse cx={b.x - lx * b.s * 0.7} cy={b.y - ly * b.s * 0.7} rx={b.s * 1.2} ry={b.s * 0.9} fill="#1A1714" opacity={0.55} />
							<ellipse cx={b.x} cy={b.y} rx={b.s} ry={b.s * 0.8} fill="#857C6F" />
							<ellipse cx={b.x + lx * b.s * 0.3} cy={b.y + ly * b.s * 0.3} rx={b.s * 0.55} ry={b.s * 0.4} fill="#C9BEAC" opacity={0.45} />
						</g>
					))}
				</g>
				<rect x={-1.4} y={-1.4} width={2.8} height={2.8} fill={`url(#${id}-shade)`} />
			</g>
			<path d={geo.outline} transform={`rotate(${spin})`} fill="none" stroke={`url(#${id}-rim)`} strokeWidth={sw * 3} />
		</g>
	);
};

/* ------------------------------------------------------------------ */
/* DART spacecraft (side view, travelling toward +x)                   */
/* ------------------------------------------------------------------ */
export const Dart: React.FC<{x: number; y: number; s: number; rot?: number; streak?: number; t?: number}> = ({x, y, s, rot = 0, streak = 0, t = 0}) => {
	const cells = Array.from({length: 9}, (_, k) => k);
	const arr = (sign: 1 | -1) => (
		<g>
			<rect x={-1.2} y={sign > 0 ? 11 : -16} width={2.4} height={5} fill="#9AA3B5" />
			<rect x={-7} y={sign > 0 ? 16 : -96} width={14} height={80} rx={1.5} fill="url(#panel)" stroke="#7FA6E8" strokeWidth={0.6} />
			{cells.map((k) => (
				<line key={k} x1={-7} x2={7} y1={(sign > 0 ? 16 : -96) + 8 * (k + 1)} y2={(sign > 0 ? 16 : -96) + 8 * (k + 1)} stroke={C.cyan} strokeOpacity={0.35} strokeWidth={0.5} />
			))}
			<line x1={0} x2={0} y1={sign > 0 ? 16 : -96} y2={sign > 0 ? 96 : -16} stroke={C.cyan} strokeOpacity={0.3} strokeWidth={0.5} />
			<rect x={-7} y={sign > 0 ? 16 : -96} width={4} height={80} fill="#FFFFFF" opacity={0.08} />
		</g>
	);
	return (
		<g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
			{streak > 0 ? (
				<g opacity={streak}>
					{[-60, -30, 0, 30, 60].map((dy, i) => (
						<rect key={i} x={-260 - i * 25} y={dy - 0.8} width={200 + (i % 2) * 60} height={1.6} fill="url(#streak)" />
					))}
				</g>
			) : null}
			{arr(1)}
			{arr(-1)}
			{/* high-gain antenna on the back */}
			<ellipse cx={-15} cy={0} rx={3.5} ry={9} fill="#D9DEE8" stroke="#8C95A8" strokeWidth={0.6} />
			<line x1={-15} y1={0} x2={-20} y2={0} stroke="#D9DEE8" strokeWidth={1} />
			{/* bus with gold foil */}
			<rect x={-11} y={-10} width={22} height={20} rx={2} fill="url(#foil)" stroke="#5B3A10" strokeWidth={0.6} />
			<path d="M-9,-6 L-2,-8 L4,-4 L9,-7 M-9,2 L-3,0 L3,4 L9,1 M-8,7 L0,5 L8,8" stroke="#FFE3A3" strokeOpacity={0.5} strokeWidth={0.5} fill="none" />
			{/* DRACO camera aperture forward */}
			<rect x={11} y={-4} width={8} height={8} rx={1} fill="#2B3142" stroke="#9AA3B5" strokeWidth={0.5} />
			<circle cx={19} cy={0} r={2.4} fill={C.cyan} opacity={0.6 + 0.4 * Math.sin(t * 8)} />
			<circle cx={19} cy={0} r={6} fill="url(#glowCyan)" />
		</g>
	);
};

/* ------------------------------------------------------------------ */
/* Earth                                                               */
/* ------------------------------------------------------------------ */
export const Earth: React.FC<{id: string; cx: number; cy: number; r: number; t: number; glow?: number}> = ({id, cx, cy, r, t, glow = 0}) => {
	const land = useMemo(() => {
		const R = rng(99);
		const out: {d: string; c: string}[] = [];
		// Continents: clusters of small irregular lobes give ragged coastlines.
		for (let k = 0; k < 6; k++) {
			const ox = R() * 2.4 - 1.2;
			const oy = R() * 1.3 - 0.65;
			const lobes = 4 + Math.floor(R() * 5);
			for (let j = 0; j < lobes; j++) {
				const lx = ox + (R() - 0.5) * 0.45;
				const ly = oy + (R() - 0.3) * 0.5;
				const sz = 0.05 + R() * 0.12;
				const pts: [number, number][] = [];
				for (let i = 0; i < 12; i++) {
					const a = (i / 12) * Math.PI * 2;
					const rr = sz * (0.55 + R() * 0.7);
					pts.push([lx + Math.cos(a) * rr * 1.2, ly + Math.sin(a) * rr]);
				}
				out.push({d: smoothClosed(pts), c: R() > 0.45 ? '#4C7A55' : R() > 0.5 ? '#8F7B57' : '#5E8A5C'});
			}
		}
		return out;
	}, []);
	const clouds = useMemo(() => {
		const R = rng(5);
		return Array.from({length: 22}, () => ({x: R() * 2.6 - 1.3, y: R() * 1.8 - 0.9, w: 0.08 + R() * 0.3, rot: R() * 30 - 15}));
	}, []);
	const drift = ((t * 0.035) % 2.6) - 1.3;
	return (
		<g transform={`translate(${cx},${cy}) scale(${r})`}>
			<defs>
				<radialGradient id={`${id}-ocean`} cx="0.38" cy="0.35" r="0.75">
					<stop offset="0" stopColor="#3C8FD8" />
					<stop offset="0.55" stopColor="#1A4F96" />
					<stop offset="1" stopColor="#0A2149" />
				</radialGradient>
				<radialGradient id={`${id}-atm`}>
					<stop offset="0.86" stopColor={C.cyan} stopOpacity="0" />
					<stop offset="0.93" stopColor={C.cyan} stopOpacity="0.55" />
					<stop offset="1" stopColor={C.cyan} stopOpacity="0" />
				</radialGradient>
				<linearGradient id={`${id}-night`} x1="0.2" y1="0.15" x2="1" y2="0.9">
					<stop offset="0.4" stopColor="#020611" stopOpacity="0" />
					<stop offset="0.7" stopColor="#020611" stopOpacity="0.7" />
					<stop offset="0.95" stopColor="#020611" stopOpacity="0.95" />
				</linearGradient>
				<clipPath id={`${id}-clip`}>
					<circle r={1} />
				</clipPath>
			</defs>
			{glow > 0 ? <circle r={1.6} fill="url(#glowCyan)" opacity={glow} /> : null}
			<circle r={1.13} fill={`url(#${id}-atm)`} />
			<g clipPath={`url(#${id}-clip)`}>
				<circle r={1} fill={`url(#${id}-ocean)`} />
				{[-2.6, 0].map((off) => (
					<g key={off} transform={`translate(${drift + off + 1.3},0)`}>
						{land.map((l, i) => (
							<path key={i} d={l.d} fill={l.c} opacity={0.92} />
						))}
						{clouds.map((c, i) => (
							<ellipse key={`c${i}`} cx={c.x} cy={c.y} rx={c.w} ry={0.022} transform={`rotate(${c.rot} ${c.x} ${c.y})`} fill="#FFFFFF" opacity={0.42} />
						))}
					</g>
				))}
				<ellipse cx={-0.05} cy={-0.95} rx={0.45} ry={0.12} fill="#EEF4FF" opacity={0.75} />
				<ellipse cx={0.05} cy={0.97} rx={0.4} ry={0.1} fill="#EEF4FF" opacity={0.7} />
				<circle cx={-0.35} cy={-0.38} r={0.35} fill="url(#glowCyan)" opacity={0.35} />
				<rect x={-1} y={-1} width={2} height={2} fill={`url(#${id}-night)`} />
			</g>
			<circle r={1} fill="none" stroke={C.cyan} strokeOpacity={0.5} strokeWidth={0.012} />
		</g>
	);
};

export const Sun: React.FC<{cx: number; cy: number; r: number; t: number}> = ({cx, cy, r, t}) => (
	<g>
		<circle cx={cx} cy={cy} r={r * (3 + 0.1 * Math.sin(t * 2))} fill="url(#corona)" />
		<circle cx={cx} cy={cy} r={r} fill="url(#sunGrad)" />
	</g>
);

/* ------------------------------------------------------------------ */
/* Impact flash + ejecta plume                                         */
/* ------------------------------------------------------------------ */
export const ImpactFlash: React.FC<{x: number; y: number; dt: number; size: number}> = ({x, y, dt, size}) => {
	if (dt < 0 || dt > 1.4) return null;
	const k = Math.min(1, dt / 0.12);
	const fade = Math.max(0, 1 - dt / 1.4);
	return <circle cx={x} cy={y} r={size * (0.3 + 0.9 * k + dt * 0.5)} fill="url(#flash)" opacity={fade} />;
};

/**
 * Ejecta cone. `axis` = degrees (SVG coords) the plume points to (back along the
 * incoming spacecraft's path). `dt` = seconds since impact.
 */
export const Ejecta: React.FC<{x: number; y: number; axis: number; dt: number; scale: number; seed?: number; count?: number}> = ({
	x,
	y,
	axis,
	dt,
	scale,
	seed = 11,
	count = 200,
}) => {
	const parts = useMemo(() => {
		const R = rng(seed);
		return Array.from({length: count}, () => {
			const wide = R() < 0.2;
			const spread = (R() - 0.5) * (wide ? 110 : 60);
			return {
				ang: spread,
				spd: 0.25 + Math.pow(R(), 1.6) * 1.0,
				sz: 0.6 + Math.pow(R(), 4) * 4,
				hot: R() < 0.25,
				life: 2.5 + R() * 5,
			};
		});
	}, [seed, count]);
	if (dt < 0) return null;
	const grow = Math.pow(dt, 0.65);
	const ax = (axis * Math.PI) / 180;
	const plumeLen = scale * Math.min(1.25, 0.25 + grow * 0.45);
	return (
		<g>
			<g transform={`translate(${x},${y}) rotate(${axis})`} opacity={Math.min(1, dt * 3)}>
				{[0.18, 0.38, 0.6, 0.85].map((f, i) => (
					<ellipse key={i} cx={plumeLen * f} cy={0} rx={plumeLen * (0.16 + f * 0.3)} ry={plumeLen * (0.1 + f * 0.42)} fill="url(#dust)" opacity={0.7} />
				))}
				<ellipse cx={plumeLen * 0.55} cy={0} rx={plumeLen * 0.6} ry={plumeLen * 0.42} fill="url(#dust)" opacity={0.8} />
			</g>
			{parts.map((p, i) => {
				const a = ax + (p.ang * Math.PI) / 180;
				const d = scale * p.spd * grow * 0.75;
				const op = Math.max(0, 1 - dt / p.life);
				if (op <= 0) return null;
				const px = x + Math.cos(a) * d;
				const py = y + Math.sin(a) * d;
				const hot = p.hot && dt < 1.6;
				return (
					<circle
						key={i}
						cx={px}
						cy={py}
						r={p.sz * (scale / 400)}
						fill={hot ? '#FFD9A6' : i % 3 === 0 ? '#D9C9B2' : '#A8957C'}
						opacity={op * 0.9}
					/>
				);
			})}
		</g>
	);
};
