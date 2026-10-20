import React from 'react';
import {MiniPhone, Satellite} from '../art';
import {geometry} from '../geom';
import {C, EASE, Earth, Fill, Headline, Svg, Tag, pick, rise, useL} from '../lib';
import {CUE} from '../timing';

/** Kept for call sites; range spheres no longer need gradient defs. */
export const SphereDefs: React.FC = () => null;

export const RangeCircle: React.FC<{x: number; y: number; r: number; k: number; color?: string; dim?: number}> = ({
  x,
  y,
  r,
  k,
  color = C.cyan,
  dim = 1,
}) =>
  k <= 0.001 ? null : (
    <g opacity={dim}>
      {/* shell glow from layered strokes: only perimeter pixels rasterize (a filled
          gradient disc of r≈1000 px cost ~45% of frame time) */}
      <circle cx={x} cy={y} r={r * k - 14} fill="none" stroke={color} strokeWidth={28} opacity={0.07} />
      <circle cx={x} cy={y} r={r * k - 5} fill="none" stroke={color} strokeWidth={10} opacity={0.12} />
      <circle cx={x} cy={y} r={r * k} fill="none" stroke={color} strokeWidth={3} opacity={0.9} />
    </g>
  );

// 44.4–54.65 s: one range = a sphere; two = a ring; three = two points.
export const Spheres: React.FC<{t: number}> = ({t}) => {
  const L = useL();
  const g = geometry(L);
  const {P: p, sats, radii, ring, Q} = g;

  const grow = (at: number) => rise(t, at, 1.3, EASE);
  const k1 = grow(CUE.oneNotEnough + 0.2);
  const k2 = grow(CUE.second + 0.1);
  const k3 = grow(CUE.third + 0.05);
  const ringK = rise(t, CUE.second + 1.2, 1.0) * (1 - rise(t, CUE.third + 1.0, 0.6));
  const ptsK = rise(t, CUE.third + 1.0, 0.5);
  const satIn = (at: number) => rise(t, at - 0.3, 0.5);
  const circumference = Math.PI * (3 * (ring.rx + ring.ry) - Math.sqrt((3 * ring.rx + ring.ry) * (ring.rx + 3 * ring.ry)));

  const hx = pick(L, 110, 70);
  const hy = pick(L, 860, 1440);
  const hs = pick(L, 60, 64);
  const hw = pick(L, 1400, 940);

  return (
    <Fill>
      <Earth cx={g.earth.cx} cy={g.earth.cy} r={g.earth.r} />
      <Svg>
        <SphereDefs />
        <RangeCircle x={sats[0].x} y={sats[0].y} r={radii[0]} k={k1} dim={1 - 0.35 * k2} />
        <RangeCircle x={sats[1].x} y={sats[1].y} r={radii[1]} k={k2} dim={1 - 0.35 * k3} />
        <RangeCircle x={sats[2].x} y={sats[2].y} r={radii[2]} k={k3} />
        {/* ring of possibilities: sphere ∩ sphere, seen in perspective */}
        {ringK > 0 && (
          <ellipse
            cx={ring.cx}
            cy={ring.cy}
            rx={ring.rx}
            ry={ring.ry}
            transform={`rotate(${ring.rot} ${ring.cx} ${ring.cy})`}
            fill="none"
            stroke={C.orange}
            strokeWidth={6}
            strokeDasharray={`${circumference * ringK} ${circumference}`}
            opacity={ringK}
          />
        )}
        {ptsK > 0 && (
          <g opacity={ptsK}>
            <circle cx={Q.x} cy={Q.y} r={16} fill={C.orange} />
            <circle cx={Q.x} cy={Q.y} r={28} fill="none" stroke={C.orange} strokeWidth={3} />
            <circle cx={p.x} cy={p.y} r={16} fill={C.orange} />
            <circle cx={p.x} cy={p.y} r={28} fill="none" stroke={C.orange} strokeWidth={3} />
          </g>
        )}
        <MiniPhone x={p.x} y={p.y + 36 * pick(L, 1.1, 1.3)} s={pick(L, 1.1, 1.3)} lit={0.4} />
      </Svg>
      {sats.slice(0, 3).map((s, i) => (
        <Satellite
          key={i}
          id={`sp${i}`}
          t={t}
          x={s.x}
          y={s.y}
          scale={pick(L, 0.48, 0.5)}
          opacity={satIn([CUE.oneNotEnough, CUE.second, CUE.third][i])}
          glow={0.5}
        />
      ))}
      <Tag t={t} at={CUE.sphere + 0.3} out={CUE.second + 0.6} x={p.x + pick(L, -60, 0)} y={p.y - pick(L, 120, 150)} text="you're somewhere on here" color={C.cyan} size={pick(L, 26, 28)} anchor={pick<'left' | 'center' | 'right'>(L, 'right', 'center')} />
      <Tag t={t} at={CUE.second + 1.5} out={CUE.third + 0.9} x={pick(L, ring.cx - 220, ring.cx - 70)} y={pick(L, ring.cy + 240, ring.cy + 380)} text="two spheres → a ring" color={C.orange} size={pick(L, 26, 28)} anchor="right" />
      <Tag t={t} at={CUE.third + 1.2} x={Q.x + 44} y={Q.y} text="or here?" color={C.orange} size={pick(L, 24, 26)} anchor="left" />
      <Tag t={t} at={CUE.third + 1.2} x={p.x + 50} y={p.y - 70} text="here?" color={C.orange} size={pick(L, 24, 26)} anchor="left" />

      {/* readable scrim under bottom headlines */}
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: pick(L, 300, 560), background: 'linear-gradient(180deg, rgba(8,19,47,0) 0%, rgba(8,19,47,0.78) 55%)'}} />
      <Headline t={t} at={CUE.oneNotEnough} out={CUE.second} x={hx} y={hy} size={hs} width={hw} text="One distance = an *enormous sphere.*" />
      <Headline t={t} at={CUE.second} out={CUE.third} x={hx} y={hy} size={hs} width={hw} text="A second satellite *narrows it down.*" />
      <Headline t={t} at={CUE.third} out={54.6} x={hx} y={hy} size={hs} width={hw} text="A third: *just two points left.*" />
      <Headline
        t={t}
        at={CUE.sphere}
        out={54.6}
        x={hx}
        y={hy + hs * pick(L, 1.25, 2.3)}
        size={pick(L, 24, 28)}
        width={hw}
        weight={600}
        color={C.dim}
        lift={0}
        text="Cross-section view · not to scale"
      />
    </Fill>
  );
};
