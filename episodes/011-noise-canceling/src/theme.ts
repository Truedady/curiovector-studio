export const C = {
	navy: '#08132F',
	navyDeep: '#040B1E',
	navyLift: '#13244F',
	cyan: '#43C5F5',
	orange: '#FF923E',
	white: '#F8FAFF',
	mute: '#9FB0D6',
	skin: '#E9B896',
	skinShade: '#B8826B',
	hair: '#1B1F33',
	metal: '#2A3A66',
	metalHi: '#5B74AE',
};

export const FONT = "'Inter Display', 'Inter', 'DejaVu Sans', sans-serif";

export type Fmt = 'land' | 'short';

export const SIZE = {
	land: {w: 1920, h: 1080},
	short: {w: 1080, h: 1920},
} as const;
