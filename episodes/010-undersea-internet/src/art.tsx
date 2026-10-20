import React from 'react';
import {C, FONT} from './lib';

type G = {x: number; y: number; s?: number; o?: number; r?: number};
const tf = ({x, y, s = 1, r = 0}: G) => `translate(${x} ${y}) rotate(${r}) scale(${s})`;

/** Smartphone, origin at its center (≈120×240 at s=1). */
export const Phone: React.FC<G & {glow?: number; play?: boolean; bubble?: number}> = ({
  glow = 1,
  play,
  bubble = 0,
  o = 1,
  ...g
}) => (
  <g transform={tf(g)} opacity={o}>
    <circle r={190} fill="url(#g-cy)" opacity={0.35 * glow} />
    <rect x={-64} y={-124} width={128} height={248} rx={24} fill="#0A1636" stroke="#7E9BD0" strokeWidth={3.5} />
    <rect x={-55} y={-112} width={110} height={224} rx={15} fill="url(#g-screen)" />
    <rect x={-18} y={-106} width={36} height={8} rx={4} fill="#050B1E" />
    <path d="M-55,-30 L55,-80 L55,-112 L-40,-112 Z" fill="#FFFFFF" opacity={0.07} />
    {play && (
      <g>
        <rect x={-44} y={-62} width={88} height={56} rx={8} fill="#08132F" opacity={0.6} />
        <path d="M-10,-48 L14,-34 L-10,-20 Z" fill={C.white} />
        <rect x={-44} y={6} width={88} height={6} rx={3} fill="#08132F" opacity={0.6} />
        <rect x={-44} y={6} width={40} height={6} rx={3} fill={C.orange} />
        <rect x={-44} y={24} width={70} height={6} rx={3} fill="#9BE3FF" opacity={0.5} />
        <rect x={-44} y={38} width={56} height={6} rx={3} fill="#9BE3FF" opacity={0.35} />
      </g>
    )}
    {bubble > 0 && (
      <g opacity={bubble} transform={`translate(0 ${-10}) scale(${0.6 + 0.4 * bubble})`}>
        <rect x={-42} y={-30} width={84} height={50} rx={14} fill={C.cyan} />
        <path d="M-18,18 L-30,34 L-4,20 Z" fill={C.cyan} />
        <rect x={-28} y={-16} width={56} height={6} rx={3} fill={C.navy} opacity={0.7} />
        <rect x={-28} y={-2} width={38} height={6} rx={3} fill={C.navy} opacity={0.7} />
      </g>
    )}
  </g>
);

/** Lattice cell tower, origin at base center, height ≈ 300·s. */
export const Tower: React.FC<G & {active?: number}> = ({active = 0, o = 1, ...g}) => (
  <g transform={tf(g)} opacity={o}>
    <g stroke="#8FA6CC" strokeWidth={4} fill="none" strokeLinejoin="round">
      <path d="M-46,0 L-10,-280 M46,0 L10,-280" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const y0 = -i * 40;
        const y1 = -(i + 1) * 40;
        const w0 = 46 - (36 * i * 40) / 280;
        const w1 = 46 - (36 * (i + 1) * 40) / 280;
        return <path key={i} d={`M${-w0},${y0} L${w1},${y1} M${w0},${y0} L${-w1},${y1}`} strokeWidth={2.5} opacity={0.75} />;
      })}
    </g>
    {[-1, 1].map((sd) => (
      <rect key={sd} x={sd * 16 - 6} y={-300} width={12} height={46} rx={3} fill="#C9D6EA" />
    ))}
    <rect x={-4} y={-312} width={8} height={56} rx={3} fill="#C9D6EA" />
    <circle cy={-316} r={7} fill={C.orange} />
    <circle cy={-316} r={36} fill="url(#g-or)" opacity={0.6 + 0.4 * active} />
  </g>
);

/** Home Wi-Fi router, origin at center. */
export const Router: React.FC<G & {active?: number}> = ({active = 0, o = 1, ...g}) => (
  <g transform={tf(g)} opacity={o}>
    <circle r={120} fill="url(#g-cy)" opacity={0.25 + 0.3 * active} />
    <rect x={-20} y={-80} width={8} height={60} rx={4} fill="#9FB3D1" transform="rotate(-12 -16 -20)" />
    <rect x={14} y={-80} width={8} height={60} rx={4} fill="#9FB3D1" transform="rotate(12 18 -20)" />
    <rect x={-70} y={-24} width={140} height={48} rx={14} fill="#16274D" stroke="#7E9BD0" strokeWidth={3} />
    {[-40, -20, 0].map((dx) => (
      <circle key={dx} cx={dx} cy={0} r={5} fill={C.cyan} />
    ))}
    <circle cx={40} cy={0} r={5} fill={C.orange} />
  </g>
);

/** Satellite with solar wings, origin at center. */
export const Satellite: React.FC<G & {beam?: number}> = ({beam = 0, o = 1, ...g}) => (
  <g transform={tf(g)} opacity={o}>
    <circle r={110} fill="url(#g-wh)" opacity={0.18 + beam * 0.2} />
    {[-1, 1].map((sd) => (
      <g key={sd} transform={`translate(${sd * 78} 0)`}>
        <rect x={-50} y={-22} width={100} height={44} rx={3} fill="#1C4C8C" stroke="#9BE3FF" strokeWidth={2} />
        {[-25, 0, 25].map((dx) => (
          <line key={dx} x1={dx} y1={-22} x2={dx} y2={22} stroke="#9BE3FF" strokeOpacity={0.5} strokeWidth={1.5} />
        ))}
        <line x1={-50} y1={0} x2={50} y2={0} stroke="#9BE3FF" strokeOpacity={0.5} strokeWidth={1.5} />
      </g>
    ))}
    <rect x={-30} y={-6} width={60} height={12} fill="#7F93B5" />
    <rect x={-26} y={-30} width={52} height={60} rx={6} fill="url(#g-steel)" />
    <rect x={-26} y={-30} width={52} height={14} rx={6} fill={C.orange} opacity={0.85} />
    <path d="M-14,30 L14,30 L22,48 L-22,48 Z" fill="#C9D6EA" />
  </g>
);

/** Cargo ship side view, origin at waterline center (≈ 420 long at s=1). */
export const Ship: React.FC<G & {lights?: number}> = ({lights = 1, o = 1, ...g}) => (
  <g transform={tf(g)} opacity={o}>
    <path d="M-210,-40 L210,-40 L180,22 L-196,22 Z" fill="url(#g-hull)" stroke="#6E86B3" strokeWidth={2} />
    <path d="M-210,-40 L210,-40 L206,-30 L-207,-30 Z" fill={C.orange} opacity={0.85} />
    {[-150, -100, -50, 0, 50].map((x, i) => (
      <rect
        key={x}
        x={x}
        y={-78 - (i % 2) * 18}
        width={46}
        height={38 + (i % 2) * 18}
        fill={['#2C5A95', '#B4562A', '#3A6EA8', '#7F93B5', '#2C5A95'][i]}
        stroke="#0B1735"
        strokeWidth={2}
      />
    ))}
    <rect x={110} y={-120} width={70} height={80} fill="#C9D6EA" />
    <rect x={120} y={-150} width={50} height={32} fill="#9FB3D1" />
    {[0, 1, 2].map((i) => (
      <rect key={i} x={120 + i * 18} y={-110} width={12} height={8} fill="#FFE0B0" opacity={0.4 + 0.6 * lights} />
    ))}
    <rect x={140} y={-176} width={10} height={28} fill="#7F93B5" />
    <circle cx={145} cy={-180} r={22} fill="url(#g-or)" opacity={0.7 * lights} />
  </g>
);

/** Small fishing trawler with gantry, origin at waterline center. */
export const Trawler: React.FC<G> = ({o = 1, ...g}) => (
  <g transform={tf(g)} opacity={o}>
    <path d="M-120,-26 L110,-26 L90,16 L-104,16 Z" fill="url(#g-hull)" stroke="#6E86B3" strokeWidth={2} />
    <path d="M-120,-26 L110,-26 L107,-19 L-117,-19 Z" fill={C.orange} opacity={0.8} />
    <rect x={-20} y={-80} width={70} height={54} fill="#C9D6EA" />
    <rect x={-10} y={-70} width={50} height={14} fill="#355C94" />
    <path d="M-100,-26 L-80,-110 L-60,-26" stroke="#9FB3D1" strokeWidth={5} fill="none" />
    <line x1={-80} y1={-110} x2={-118} y2={-30} stroke="#9FB3D1" strokeWidth={2} />
  </g>
);

/** Anchor, origin at the shackle (top). */
export const Anchor: React.FC<G> = ({o = 1, ...g}) => (
  <g transform={tf(g)} opacity={o} fill="none" stroke="url(#g-steel)" strokeWidth={10} strokeLinecap="round">
    <circle cy={8} r={9} strokeWidth={6} />
    <line x1={0} y1={18} x2={0} y2={96} />
    <line x1={-26} y1={36} x2={26} y2={36} />
    <path d="M-44,72 Q-36,104 0,104 Q36,104 44,72" />
    <path d="M-44,72 l-6,14 M44,72 l6,14" strokeWidth={8} />
  </g>
);

/** Server rack cluster (network hub / data center), origin at base center. */
export const Rack: React.FC<G & {active?: number; t?: number; n?: number}> = ({active = 0, t = 0, n = 3, o = 1, ...g}) => (
  <g transform={tf(g)} opacity={o}>
    <ellipse cx={0} cy={-80} rx={n * 60} ry={110} fill="url(#g-cy)" opacity={0.25 + 0.45 * active} />
    {Array.from({length: n}).map((_, i) => {
      const x = (i - (n - 1) / 2) * 62 - 26;
      return (
        <g key={i}>
          <rect x={x} y={-150} width={52} height={150} rx={5} fill="#13244A" stroke="#7E9BD0" strokeWidth={2.5} />
          {[0, 1, 2, 3, 4, 5].map((j) => (
            <g key={j}>
              <rect x={x + 7} y={-140 + j * 23} width={38} height={15} rx={2} fill="#0A1636" />
              <circle
                cx={x + 38}
                cy={-132 + j * 23}
                r={2.8}
                fill={(i * 7 + j * 3 + Math.floor(t * 6)) % 4 === 0 ? C.orange : C.cyan}
                opacity={0.35 + 0.65 * active}
              />
            </g>
          ))}
        </g>
      );
    })}
  </g>
);

/** Minimal building silhouettes for skylines; origin at base-left. */
export const Skyline: React.FC<G & {kind: 'ny' | 'london' | 'city'; lit?: number; flip?: boolean}> = ({
  kind,
  lit = 1,
  flip,
  o = 1,
  ...g
}) => {
  const blocks: [number, number, number][] =
    kind === 'ny'
      ? [
          [0, 40, 120], [42, 34, 190], [78, 26, 150], [106, 30, 300], [138, 40, 230], [180, 28, 170], [210, 36, 120],
        ]
      : kind === 'london'
        ? [
            [0, 40, 90], [42, 30, 120], [74, 44, 80], [120, 34, 140], [156, 40, 100], [198, 30, 70],
          ]
        : [
            [0, 30, 80], [32, 26, 130], [60, 34, 100], [96, 22, 160], [120, 36, 110], [158, 28, 90],
          ];
  return (
    <g transform={`${tf(g)} ${flip ? 'scale(-1 1)' : ''}`} opacity={o}>
      {blocks.map(([x, w, h], i) => (
        <g key={i}>
          <rect x={x} y={-h} width={w} height={h} fill="#14284F" stroke="#2E4A7E" strokeWidth={1.5} />
          {Array.from({length: Math.floor(h / 22)}).map((_, j) =>
            (i + j) % 3 === 0 ? null : (
              <rect key={j} x={x + 6} y={-h + 10 + j * 22} width={w - 12} height={5} fill="#FFD9A0" opacity={0.25 * lit} />
            ),
          )}
        </g>
      ))}
      {kind === 'ny' && (
        <g>
          <path d="M106,-300 L121,-345 L136,-300 Z" fill="#14284F" stroke="#2E4A7E" strokeWidth={1.5} />
          <line x1={121} y1={-345} x2={121} y2={-380} stroke="#8EA3C4" strokeWidth={3} />
        </g>
      )}
      {kind === 'london' && (
        <g>
          <rect x={240} y={-210} width={34} height={210} fill="#14284F" stroke="#2E4A7E" strokeWidth={1.5} />
          <circle cx={257} cy={-175} r={11} fill="#FFD9A0" opacity={0.6 * lit} />
          <path d="M238,-210 L257,-258 L276,-210 Z" fill="#14284F" stroke="#2E4A7E" strokeWidth={1.5} />
        </g>
      )}
    </g>
  );
};

/** Fluffy "cloud" icon, origin at center (≈ 520 wide at s=1). */
export const CloudShape: React.FC<G & {spread?: number}> = ({spread = 0, o = 1, ...g}) => {
  const puffs: [number, number, number][] = [
    [-170, 30, 90], [-80, -30, 120], [40, -60, 140], [160, -10, 110], [220, 50, 80], [60, 50, 110], [-60, 60, 100],
  ];
  return (
    <g transform={tf(g)} opacity={o}>
      {[0, 1].map((layer) =>
        puffs.map(([x, y, r], i) => {
          const dx = x * spread * 0.9 + (i % 2 ? 1 : -1) * spread * 40;
          const dy = y * spread * 0.7 - spread * 60 * ((i % 3) - 1);
          const rr = r * (1 + spread * 0.3);
          // layer 0 = outline silhouette, layer 1 = body (so overlaps merge into one cloud)
          return (
            <circle
              key={`${layer}-${i}`}
              cx={x + dx}
              cy={y + dy}
              r={layer === 0 ? rr + 5 : rr}
              fill={layer === 0 ? '#CFE6FF' : i % 2 ? '#2F5A93' : '#2A5189'}
              opacity={(1 - spread * 0.85) * (layer === 0 ? 0.9 : 1)}
            />
          );
        }),
      )}
      <ellipse cx={-10} cy={-70} rx={150} ry={50} fill="#FFFFFF" opacity={0.08 * (1 - spread)} />
    </g>
  );
};

/** Small "Wi-Fi" arcs icon, origin at bottom dot. */
export const WifiIcon: React.FC<G & {k?: number}> = ({k = 1, o = 1, ...g}) => (
  <g transform={tf(g)} opacity={o} fill="none" stroke={C.cyan} strokeWidth={10} strokeLinecap="round">
    {[1, 2, 3].map((i) => (
      <path
        key={i}
        d={`M${-i * 26},${-i * 18} A${i * 32},${i * 32} 0 0 1 ${i * 26},${-i * 18}`}
        opacity={Math.max(0, Math.min(1, k * 3 - (i - 1)))}
      />
    ))}
    <circle r={8} fill={C.cyan} stroke="none" />
  </g>
);

/** Hand-lettered small caption in SVG. */
export const Caption: React.FC<{x: number; y: number; text: string; size?: number; o?: number; color?: string; anchor?: 'start' | 'middle' | 'end'; weight?: number}> = ({
  x,
  y,
  text,
  size = 24,
  o = 1,
  color = C.cyanSoft,
  anchor = 'middle',
  weight = 600,
}) =>
  o <= 0.001 ? null : (
    <text x={x} y={y} fill={color} opacity={o} fontFamily={FONT} fontWeight={weight} fontSize={size} textAnchor={anchor}>
      {text}
    </text>
  );
