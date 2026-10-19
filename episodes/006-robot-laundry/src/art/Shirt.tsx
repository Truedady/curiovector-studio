import React from 'react';
import {clamp} from '../lib/timing';

// A 2D T-shirt built from 8 cloth panels. Every panel is resampled densely in
// its rest shape, pushed through the same deformation pipeline (sleeve flip,
// hang, bunch, pulls, folds, fabric noise) and redrawn as a smooth curve, so
// the shirt can fold, droop, bunch and ripple while staying one continuous
// piece of fabric.

type V = [number, number];
type Kind = 'cT' | 'cB' | 'lT' | 'lB' | 'lS' | 'rT' | 'rB' | 'rS';

export type Pull = {x: number; y: number; dx: number; dy: number; r: number};

export type ShirtParams = {
  t: number;
  wobble?: number;
  foldL?: number;
  foldR?: number;
  foldBottom?: number;
  sleeveFlipL?: number;
  sleeveFlipR?: number;
  bunch?: number;
  bunchX?: number;
  hang?: number;
  pulls?: Pull[];
  wrinkle?: number;
};

const FX = 88;
const FY = 30;
const NECK: V[] = [
  [-58, -200],
  [-40, -183],
  [-20, -172],
  [0, -168],
  [20, -172],
  [40, -183],
  [58, -200],
];

const mirror = (pts: V[]): V[] => pts.map(([x, y]) => [-x, y] as V).reverse();
const R_TOP: V[] = [
  [88, -193.5],
  [150, -180],
  [146, -86],
  [147.5, FY],
  [88, FY],
];
const R_BOTTOM: V[] = [
  [88, FY],
  [147.5, FY],
  [150, 212],
  [88, 213],
];
const R_SLEEVE: V[] = [
  [150, -180],
  [262, -112],
  [222, -40],
  [146, -86],
];

const PIECES: Record<Kind, V[]> = {
  cT: [[-88, -193.5], ...NECK, [88, -193.5], [88, FY], [-88, FY]],
  cB: [
    [-88, FY],
    [88, FY],
    [88, 213],
    [0, 216],
    [-88, 213],
  ],
  rT: R_TOP,
  rB: R_BOTTOM,
  rS: R_SLEEVE,
  lT: mirror(R_TOP),
  lB: mirror(R_BOTTOM),
  lS: mirror(R_SLEEVE),
};

const resample = (poly: V[], step: number): V[] => {
  const out: V[] = [];
  for (let i = 0; i < poly.length; i++) {
    const [ax, ay] = poly[i];
    const [bx, by] = poly[(i + 1) % poly.length];
    const n = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay) / step));
    for (let k = 0; k < n; k++) out.push([ax + ((bx - ax) * k) / n, ay + ((by - ay) * k) / n]);
  }
  return out;
};

const SAMPLED: Record<Kind, V[]> = Object.fromEntries(
  (Object.keys(PIECES) as Kind[]).map((k) => [k, resample(PIECES[k], 12)])
) as Record<Kind, V[]>;

const rot = (x: number, y: number, cx: number, cy: number, a: number): V => {
  const c = Math.cos(a);
  const s = Math.sin(a);
  return [cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c];
};

const sideOf = (k: Kind) => (k[0] === 'l' ? -1 : k[0] === 'r' ? 1 : 0);
const foldOf = (k: Kind, p: ShirtParams) => {
  const s = sideOf(k);
  return s > 0 ? p.foldR ?? 0 : s < 0 ? p.foldL ?? 0 : 0;
};

export const pieceOf = (x: number, y: number): Kind => {
  const s = x > 0 ? 'r' : 'l';
  const ax = Math.abs(x);
  if (ax > 148 && y < -40) return `${s}S` as Kind;
  if (ax > FX) return `${s}${y > FY ? 'B' : 'T'}` as Kind;
  return y > FY ? 'cB' : 'cT';
};

const mapPoint = (x0: number, y0: number, kind: Kind, p: ShirtParams): V => {
  let x = x0;
  let y = y0;
  const side = sideOf(kind);
  const isSleeve = kind[1] === 'S';
  const isBottom = kind[1] === 'B';

  if (isSleeve) {
    const sf = side > 0 ? p.sleeveFlipR ?? 0 : p.sleeveFlipL ?? 0;
    if (sf) {
      const px = side * 148;
      const d = x - px;
      x = px + d * Math.cos(Math.PI * sf);
      y -= Math.sin(Math.PI * sf) * Math.abs(d) * 0.22;
    }
  }
  if (p.hang) {
    const h = p.hang;
    if (isSleeve) [x, y] = rot(x, y, side * 150, -150, side * h * 0.95);
    const k = clamp((y + 180) / 400);
    x = x * (1 - 0.2 * h * k);
    y = y + h * k * k * 34;
  }
  if (p.bunch) {
    const b = p.bunch;
    const bx = p.bunchX ?? 0;
    x = bx + (x - bx) * (1 - 0.42 * b) + b * 14 * Math.sin(y0 * 0.09);
    y = y * (1 - 0.12 * b) + b * (18 * Math.sin(x0 * 0.065 + 0.5) + 8 * Math.cos(y0 * 0.07));
  }
  if (p.pulls) {
    for (const q of p.pulls) {
      const w = Math.exp(-((x - q.x) ** 2 + (y - q.y) ** 2) / (q.r * q.r));
      x += q.dx * w;
      y += q.dy * w;
    }
  }
  const f = foldOf(kind, p);
  if (side && f) {
    const px = side * FX;
    const d = x - px;
    x = px + d * Math.cos(Math.PI * f);
    y -= Math.sin(Math.PI * f) * Math.abs(d) * 0.06;
  }
  const g = p.foldBottom ?? 0;
  if (isBottom && g) {
    y = FY + (y - FY) * Math.cos(Math.PI * g);
    x *= 1 - 0.04 * Math.sin(Math.PI * g);
  }
  const w = p.wobble ?? 0;
  if (w) {
    const t = p.t;
    x += w * (Math.sin(0.021 * y0 + 1.3 * t) + 0.5 * Math.sin(0.047 * x0 - 2.1 * t + 1.7));
    y += w * (Math.cos(0.018 * x0 + 1.1 * t) + 0.5 * Math.sin(0.05 * y0 + 1.7 * t + 0.4));
  }
  return [x, y];
};

// Local (shirt-space) position of a rest-shape point after deformation.
export const shirtPoint = (x0: number, y0: number, p: ShirtParams): V =>
  mapPoint(x0, y0, pieceOf(x0, y0), p);

const smoothPath = (pts: V[], closed: boolean) => {
  const n = pts.length;
  if (n < 2) return '';
  const P = (i: number) => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = P(i - 1);
    const p1 = P(i);
    const p2 = P(i + 1);
    const p3 = P(i + 2);
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += `C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return closed ? d + 'Z' : d;
};

const densify = (pts: V[], step = 10): V[] => {
  const out: V[] = [];
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, ay] = pts[i];
    const [bx, by] = pts[i + 1];
    const n = Math.max(1, Math.ceil(Math.hypot(bx - ax, by - ay) / step));
    for (let k = 0; k < n; k++) out.push([ax + ((bx - ax) * k) / n, ay + ((by - ay) * k) / n]);
  }
  out.push(pts[pts.length - 1]);
  return out;
};

// 3-point lines are treated as a smooth arc through the middle point.
const arc = (pts: V[]): V[] => {
  if (pts.length !== 3) return densify(pts);
  const [a, m, c] = pts;
  const cx = 2 * m[0] - (a[0] + c[0]) / 2;
  const cy = 2 * m[1] - (a[1] + c[1]) / 2;
  const out: V[] = [];
  for (let i = 0; i <= 12; i++) {
    const t = i / 12;
    const u = 1 - t;
    out.push([u * u * a[0] + 2 * u * t * cx + t * t * c[0], u * u * a[1] + 2 * u * t * cy + t * t * c[1]]);
  }
  return out;
};

const mapLine = (pts: V[], p: ShirtParams) =>
  smoothPath(
    arc(pts).map(([x, y]) => shirtPoint(x, y, p)),
    false
  );

const WRINKLES: V[][] = [
  [[-120, -60], [-60, -24], [10, -42]],
  [[30, 64], [90, 22], [132, 40]],
  [[-104, 124], [-34, 152], [44, 128]],
  [[-34, -126], [20, -96], [72, -112]],
  [[172, -142], [204, -112], [236, -98]],
  [[-172, -142], [-204, -112], [-236, -98]],
  [[-64, 58], [-22, 92], [34, 84]],
  [[100, -140], [112, -80], [100, -20]],
];

export const SHIRT_ORANGE = {
  light: '#FFB878',
  base: '#FF923E',
  dark: '#D2621B',
  backLight: '#C7631E',
  backDark: '#8E4313',
  crease: 'rgba(98,34,0,0.42)',
  shine: 'rgba(255,236,214,0.5)',
  rib: '#E9782A',
};

type Palette = typeof SHIRT_ORANGE;

export const Shirt: React.FC<{
  id: string;
  x: number;
  y: number;
  scale?: number;
  rotate?: number;
  p: ShirtParams;
  palette?: Palette;
  shadow?: number;
  mesh?: number;
  meshColor?: string;
}> = ({id, x, y, scale = 1, rotate = 0, p, palette = SHIRT_ORANGE, shadow = 1, mesh = 0, meshColor = '#43C5F5'}) => {
  const g = p.foldBottom ?? 0;
  const order = (Object.keys(PIECES) as Kind[]).map((k) => {
    const side = sideOf(k);
    const f = foldOf(k, p);
    const sf = k[1] === 'S' ? (side > 0 ? p.sleeveFlipR ?? 0 : p.sleeveFlipL ?? 0) : 0;
    const sideFlipped = f > 0.5;
    const sleeveFlipped = sf > 0.5;
    let z = (sideFlipped ? 2 : 0) + (k[1] === 'S' ? 1 : 0) + (sleeveFlipped ? 3 : 0);
    let back = sideFlipped !== sleeveFlipped;
    if (k[1] === 'B' || k === 'cB') {
      if (g > 0.5) {
        z = 10 - z;
        back = !back;
      }
    }
    const turning = Math.max(Math.sin(Math.PI * f), Math.sin(Math.PI * sf), k[1] === 'B' || k === 'cB' ? Math.sin(Math.PI * g) : 0);
    return {k, z, back, turning};
  });
  order.sort((a, b) => a.z - b.z);

  const folded = Math.max(p.foldL ?? 0, p.foldR ?? 0, g);
  const wr = (p.wrinkle ?? 0.6) * (1 - clamp(folded * 2.2));

  return (
    <g transform={`translate(${x},${y}) rotate(${rotate}) scale(${scale})`}>
      <defs>
        <linearGradient id={`${id}-f`} gradientUnits="userSpaceOnUse" x1={-220} y1={-220} x2={200} y2={240}>
          <stop offset="0" stopColor={palette.light} />
          <stop offset="0.45" stopColor={palette.base} />
          <stop offset="1" stopColor={palette.dark} />
        </linearGradient>
        <linearGradient id={`${id}-b`} gradientUnits="userSpaceOnUse" x1={-220} y1={-220} x2={200} y2={240}>
          <stop offset="0" stopColor={palette.backLight} />
          <stop offset="1" stopColor={palette.backDark} />
        </linearGradient>
        <radialGradient id={`${id}-s`}>
          <stop offset="0" stopColor="#000" stopOpacity={0.55} />
          <stop offset="1" stopColor="#000" stopOpacity={0} />
        </radialGradient>
      </defs>
      {shadow > 0 && (
        <ellipse cx={8} cy={22} rx={300} ry={250} fill={`url(#${id}-s)`} opacity={shadow * 0.85} />
      )}
      {order.map(({k, back, turning}) => {
        const d = smoothPath(
          SAMPLED[k].map(([sx, sy]) => mapPoint(sx, sy, k, p)),
          true
        );
        const fill = `url(#${id}-${back ? 'b' : 'f'})`;
        return (
          <g key={k}>
            <path d={d} fill={fill} stroke={fill} strokeWidth={1.4} strokeLinejoin="round" />
            {turning > 0.02 && <path d={d} fill="#1a0800" opacity={0.28 * turning} />}
            {(back || turning > 0.3) && (
              <path d={d} fill="none" stroke="rgba(70,20,0,0.35)" strokeWidth={2} />
            )}
          </g>
        );
      })}
      {/* collar rib + cuffs + hem stitch */}
      <path d={mapLine(NECK, p)} fill="none" stroke={palette.rib} strokeWidth={11} strokeLinecap="round" opacity={1 - clamp(g * 2)} />
      <path d={mapLine(NECK, p)} fill="none" stroke={palette.crease} strokeWidth={2} transform="translate(0,5)" opacity={1 - clamp(g * 2)} />
      <path d={mapLine([[250, -118], [210, -46]], p)} fill="none" stroke={palette.crease} strokeWidth={2.4} opacity={0.8} />
      <path d={mapLine([[-250, -118], [-210, -46]], p)} fill="none" stroke={palette.crease} strokeWidth={2.4} opacity={0.8} />
      <path
        d={mapLine([[-140, 198], [140, 198]], p)}
        fill="none"
        stroke={palette.crease}
        strokeWidth={2}
        strokeDasharray="7 6"
        opacity={0.7 * (1 - clamp(g * 2))}
      />
      {wr > 0.01 &&
        WRINKLES.map((w, i) => (
          <g key={i} opacity={wr}>
            <path d={mapLine(w, p)} fill="none" stroke={palette.crease} strokeWidth={4} strokeLinecap="round" opacity={0.8} />
            <path
              d={mapLine(w.map(([a, b]) => [a + 4, b - 6] as V), p)}
              fill="none"
              stroke={palette.shine}
              strokeWidth={2.5}
              strokeLinecap="round"
              opacity={0.7}
            />
          </g>
        ))}
      {mesh > 0 && <Mesh p={p} opacity={mesh} color={meshColor} />}
    </g>
  );
};

const Mesh: React.FC<{p: ShirtParams; opacity: number; color: string}> = ({p, opacity, color}) => {
  const lines: V[][] = [];
  for (let y = -150; y <= 200; y += 25) lines.push([[-140, y], [140, y]]);
  for (let x = -135; x <= 135; x += 27) {
    const top = Math.abs(x) < 60 ? -160 : -186;
    lines.push([[x, top], [x, 205]]);
  }
  lines.push([[160, -168], [236, -96]], [[154, -130], [222, -64]], [[-160, -168], [-236, -96]], [[-154, -130], [-222, -64]]);
  return (
    <g opacity={opacity}>
      {lines.map((l, i) => (
        <path key={i} d={mapLine(l, p)} fill="none" stroke={color} strokeWidth={1.6} opacity={0.75} />
      ))}
    </g>
  );
};
