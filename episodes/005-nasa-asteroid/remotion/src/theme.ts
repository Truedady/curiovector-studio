import {createContext, useContext} from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';

export const C = {
	navy: '#08132F',
	navyDeep: '#030918',
	navyLift: '#12234F',
	cyan: '#43C5F5',
	orange: '#FF923E',
	white: '#F8FAFF',
	muted: '#A9B8DC',
	rock: '#8A8174',
};

export const FONT = "'Inter', 'Inter Display', 'Liberation Sans', sans-serif";

export const FPS = 30;
// ffprobe Nasa.mp3: 122.82775 s
export const AUDIO_SECONDS = 122.82775;
export const DURATION_FRAMES = Math.ceil(AUDIO_SECONDS * FPS);

export type Layout = {W: number; H: number; v: boolean};
export const LayoutCtx = createContext<Layout>({W: 1920, H: 1080, v: false});
export const useLayout = () => useContext(LayoutCtx);

/** Pick a landscape or vertical value. */
export const pick = <T,>(l: Layout, land: T, vert: T): T => (l.v ? vert : land);

export const easeOut = Easing.bezier(0.22, 1, 0.36, 1);
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

export const useTime = () => useCurrentFrame() / FPS;

/** Eased 0→1 progress starting at `start` seconds lasting `dur` seconds. */
export const prog = (t: number, start: number, dur = 0.6, ease = easeOut) =>
	interpolate(t, [start, start + dur], [0, 1], {
		extrapolateLeft: 'clamp',
		extrapolateRight: 'clamp',
		easing: ease,
	});

/** Visible between in/out with fades. */
export const window01 = (t: number, from: number, to: number, fade = 0.35) =>
	Math.min(prog(t, from, fade), 1 - prog(t, to - fade, fade, easeInOut));

export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

export const rng = (seed: number) => {
	let s = seed >>> 0;
	return () => {
		s = (s + 0x6d2b79f5) >>> 0;
		let x = s;
		x = Math.imul(x ^ (x >>> 15), x | 1);
		x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
		return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
	};
};

/** Smooth closed path through points (Catmull-Rom → cubic Bézier). */
export const smoothClosed = (pts: [number, number][]) => {
	const n = pts.length;
	let d = `M${pts[0][0].toFixed(4)},${pts[0][1].toFixed(4)}`;
	for (let i = 0; i < n; i++) {
		const p0 = pts[(i - 1 + n) % n];
		const p1 = pts[i];
		const p2 = pts[(i + 1) % n];
		const p3 = pts[(i + 2) % n];
		const c1x = p1[0] + (p2[0] - p0[0]) / 6;
		const c1y = p1[1] + (p2[1] - p0[1]) / 6;
		const c2x = p2[0] - (p3[0] - p1[0]) / 6;
		const c2y = p2[1] - (p3[1] - p1[1]) / 6;
		d += `C${c1x.toFixed(4)},${c1y.toFixed(4)} ${c2x.toFixed(4)},${c2y.toFixed(4)} ${p2[0].toFixed(4)},${p2[1].toFixed(4)}`;
	}
	return d + 'Z';
};
