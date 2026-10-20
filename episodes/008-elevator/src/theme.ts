import {Easing, interpolate} from 'remotion';
import '@fontsource/montserrat/700.css';
import '@fontsource/montserrat/800.css';
import '@fontsource/montserrat/900.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

export const C = {
	navy: '#08132F',
	navy2: '#0E1F48',
	navy3: '#16305F',
	steel: '#2A4677',
	steelLight: '#5B79A8',
	cyan: '#43C5F5',
	cyanDim: '#1E7FAA',
	orange: '#FF923E',
	orangeDeep: '#E2661C',
	white: '#F8FAFF',
	mute: '#A9B9D6',
	brass: '#C9A46A',
	wood: '#6B4A2E',
	woodLight: '#93683F',
};

export const FONT_HEAD = 'Montserrat, Inter, sans-serif';
export const FONT_BODY = 'Inter, sans-serif';

export type Layout = 'landscape' | 'portrait';

export const EASE = Easing.bezier(0.33, 0, 0.15, 1);
export const EASE_IN = Easing.bezier(0.55, 0, 0.9, 0.4);

/** 0..1 progress between seconds a and b, clamped and eased. */
export const ramp = (t: number, a: number, b: number, ease = EASE) =>
	interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});

export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

/** Deterministic pseudo random in [0,1). */
export const rand = (seed: number) => {
	const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
	return x - Math.floor(x);
};
