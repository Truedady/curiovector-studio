import {Easing, interpolate} from 'remotion';

export type Pt = [number, number];
export type Curve = {start: Pt; segs: [number, number, number, number, number, number][]};

export const curveD = (c: Curve) =>
  `M ${c.start[0]} ${c.start[1]} ` + c.segs.map((s) => `C ${s.join(' ')}`).join(' ');

const bez = (a: number, b: number, c: number, d: number, t: number) => {
  const m = 1 - t;
  return m * m * m * a + 3 * m * m * t * b + 3 * m * t * t * c + t * t * t * d;
};

export type Sampled = {pts: Pt[]; cum: number[]; length: number};

export const sample = (c: Curve, perSeg = 40): Sampled => {
  const pts: Pt[] = [c.start];
  let [x, y] = c.start;
  for (const [c1x, c1y, c2x, c2y, ex, ey] of c.segs) {
    for (let i = 1; i <= perSeg; i++) {
      const t = i / perSeg;
      pts.push([bez(x, c1x, c2x, ex, t), bez(y, c1y, c2y, ey, t)]);
    }
    x = ex;
    y = ey;
  }
  const cum = [0];
  for (let i = 1; i < pts.length; i++) {
    cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  }
  return {pts, cum, length: cum[cum.length - 1]};
};

export const pointAt = (s: Sampled, frac: number): Pt => {
  const target = Math.max(0, Math.min(1, frac)) * s.length;
  let lo = 0;
  let hi = s.cum.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (s.cum[mid] < target) lo = mid + 1;
    else hi = mid;
  }
  const i = Math.max(1, lo);
  const seg = s.cum[i] - s.cum[i - 1] || 1;
  const k = (target - s.cum[i - 1]) / seg;
  return [
    s.pts[i - 1][0] + (s.pts[i][0] - s.pts[i - 1][0]) * k,
    s.pts[i - 1][1] + (s.pts[i][1] - s.pts[i - 1][1]) * k,
  ];
};

const ease = Easing.bezier(0.33, 0, 0.2, 1);

/** 0→1 between a and b seconds, eased. */
export const ramp = (t: number, a: number, b: number) =>
  interpolate(t, [a, b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});

/** Fade in over [a, a+fi], hold, fade out over [b-fo, b]. */
export const win = (t: number, a: number, b: number, fi = 0.5, fo = 0.5) =>
  Math.min(ramp(t, a, a + fi), 1 - ramp(t, b - fo, b));

/** Piecewise keyframe interpolation over seconds with easing. */
export const keys = (t: number, times: number[], values: number[]) =>
  interpolate(t, times, values, {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease});

export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
