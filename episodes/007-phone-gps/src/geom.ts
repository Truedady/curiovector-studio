import type {Layout} from './lib';

// Cross-section geometry for the trilateration scenes. Every satellite range circle
// is constructed to pass exactly through the receiver P. The orange "ring of
// possibilities" (sphere ∩ sphere) is drawn as a tilted ellipse whose axis is the
// perpendicular from P to the S1–S2 line; the third satellite is placed on the
// perpendicular bisector of P and a second ring point Q so that it, too, is honest:
// three ranges leave exactly two candidate points (P and Q).

export type Pt = {x: number; y: number};
export type Geo = {
  earth: {cx: number; cy: number; r: number};
  P: Pt;
  sats: Pt[]; // S1..S4
  radii: number[];
  ring: {cx: number; cy: number; rx: number; ry: number; rot: number};
  Q: Pt;
};

const dist = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y);

const build = (
  earth: Geo['earth'],
  pAngle: number,
  S1: Pt,
  S2: Pt,
  qFrac: number,
  qSide: 1 | -1,
  s3t: number,
  S4: Pt,
): Geo => {
  const P = {x: earth.cx + Math.sin(pAngle) * earth.r, y: earth.cy - Math.cos(pAngle) * earth.r};
  // foot of perpendicular from P onto S1S2
  const dx = S2.x - S1.x;
  const dy = S2.y - S1.y;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const proj = (P.x - S1.x) * ux + (P.y - S1.y) * uy;
  const Cn = {x: S1.x + ux * proj, y: S1.y + uy * proj};
  const major = dist(P, Cn);
  const minor = major * 0.24;
  const ax = (P.x - Cn.x) / major; // unit vector C→P (major axis)
  const ay = (P.y - Cn.y) / major;
  const rot = (Math.atan2(ay, ax) * 180) / Math.PI;
  // Q on the ellipse: fraction along the major axis toward P, offset along minor axis
  const c = Math.sqrt(1 - qFrac * qFrac);
  const Q = {x: Cn.x + ax * major * qFrac - ay * minor * c * qSide, y: Cn.y + ay * major * qFrac + ax * minor * c * qSide};
  // S3 on the perpendicular bisector of PQ
  const M = {x: (P.x + Q.x) / 2, y: (P.y + Q.y) / 2};
  const pqx = Q.x - P.x;
  const pqy = Q.y - P.y;
  const pql = Math.hypot(pqx, pqy);
  const S3 = {x: M.x - (-pqy / pql) * s3t, y: M.y - (pqx / pql) * s3t};
  const sats = [S1, S2, S3, S4];
  return {
    earth,
    P,
    sats,
    radii: sats.map((s) => dist(s, P)),
    ring: {cx: Cn.x, cy: Cn.y, rx: major, ry: minor, rot},
    Q,
  };
};

export const geometry = (L: Layout): Geo =>
  L.P
    ? build({cx: 540, cy: 2650, r: 1300}, 0, {x: 175, y: 560}, {x: 925, y: 500}, 0.42, -1, 470, {x: 900, y: 960})
    : build({cx: 960, cy: 2250, r: 1450}, 0.045, {x: 220, y: 110}, {x: 1660, y: 120}, 0.36, -1, 760, {x: 1560, y: 470});
