export type SceneProps = {T: number; W: number; H: number; v: boolean};

export type XY = [number, number];
export const toWorld = (ox: number, oy: number, s: number, p: XY): XY => [ox + s * p[0], oy + s * p[1]];
