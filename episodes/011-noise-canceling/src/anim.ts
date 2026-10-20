import {Easing} from 'remotion';

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const easeOut = Easing.bezier(0.22, 1, 0.36, 1);
const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

/** Eased 0→1 progress starting at `start` seconds lasting `dur` seconds. */
export const ramp = (t: number, start: number, dur = 0.7) => easeOut(clamp((t - start) / dur));
export const rampIO = (t: number, start: number, dur = 0.9) => easeInOut(clamp((t - start) / dur));

/** Visible between a and b with soft edges. */
export const win = (t: number, a: number, b: number, fade = 0.45) =>
	Math.min(ramp(t, a, fade), 1 - ramp(t, b - fade, fade));

export const mix = (a: number, b: number, p: number) => a + (b - a) * p;

/** Build an SVG polyline path for y = fn(x) sampled n times. */
export const curve = (x0: number, x1: number, fn: (x: number) => number, n = 140) => {
	let d = '';
	for (let i = 0; i <= n; i++) {
		const x = x0 + ((x1 - x0) * i) / n;
		d += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${fn(x).toFixed(1)}`;
	}
	return d;
};

/** Smooth window function used to fade wave ends (0 at edges, 1 inside). */
export const edge = (x: number, x0: number, x1: number, soft = 80) =>
	clamp((x - x0) / soft) * clamp((x1 - x) / soft);
