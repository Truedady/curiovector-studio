import React, {createContext, useContext} from 'react';
import {
  AbsoluteFill,
  continueRender,
  delayRender,
  Easing,
  Img,
  interpolate,
  staticFile,
  useCurrentFrame,
} from 'remotion';
import {FPS, XF} from './timing';

// ------------------------------------------------------------------ brand
export const C = {
  navy: '#08132F',
  navyDeep: '#040A1C',
  navyMid: '#10244F',
  cyan: '#43C5F5',
  cyanSoft: '#9BE3FF',
  orange: '#FF923E',
  white: '#F8FAFF',
  steel: '#8EA3C4',
  dim: '#5E7299',
};

export const FONT = "'CV Inter', Inter, 'DejaVu Sans', sans-serif";
export const FONT_DISPLAY = "'CV Inter Display', 'CV Inter', Inter, sans-serif";

// ------------------------------------------------------------------ fonts
// Episode-local copies of Inter (OFL) so renders never depend on host fonts.
const FACES: [string, string, string][] = [
  ['CV Inter', 'fonts/Inter-SemiBold.otf', '600'],
  ['CV Inter', 'fonts/Inter-Bold.otf', '700'],
  ['CV Inter Display', 'fonts/InterDisplay-Black.otf', '900'],
];
if (typeof window !== 'undefined' && typeof FontFace !== 'undefined') {
  const handle = delayRender('Loading Inter');
  Promise.all(
    FACES.map(([family, file, weight]) =>
      new FontFace(family, `url(${staticFile(file)})`, {weight})
        .load()
        .then((f) => (document.fonts as unknown as {add: (f: FontFace) => void}).add(f)),
    ),
  )
    .then(() => continueRender(handle))
    .catch((e) => {
      console.error(e);
      continueRender(handle);
    });
}

// ------------------------------------------------------------------ layout
export type Lay = {w: number; h: number; tall: boolean};
export const LayCtx = createContext<Lay>({w: 1920, h: 1080, tall: false});
export const useLay = () => useContext(LayCtx);
/** pick(wideValue, tallValue) */
export const usePick = () => {
  const {tall} = useLay();
  return <T,>(wide: T, tallV: T): T => (tall ? tallV : wide);
};

// ------------------------------------------------------------------ time
export const useT = () => useCurrentFrame() / FPS;

const EASE = Easing.bezier(0.33, 0, 0.2, 1);
export const EASE_IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
/** 0→1 between seconds a and b (clamped, eased). */
export const ramp = (t: number, a: number, b: number, ease = EASE) =>
  interpolate(t, [a, b], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });
/** fade in over [a, a+d], out over [b-d, b] */
export const win = (t: number, a: number, b: number, d = 0.35) =>
  Math.min(ramp(t, a, a + d), 1 - ramp(t, b - d, b));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const pop = (t: number, a: number, d = 0.45) =>
  interpolate(t, [a, a + d * 0.65, a + d], [0, 1.08, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

// ------------------------------------------------------------------ geometry
export type P = [number, number];
/** Catmull-Rom → cubic bezier path through points. */
export const smooth = (pts: P[], tension = 0.5) => {
  if (pts.length < 2) return '';
  let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[Math.min(pts.length - 1, i + 2)];
    const k = tension / 3;
    const c1: P = [p1[0] + (p2[0] - p0[0]) * k, p1[1] + (p2[1] - p0[1]) * k];
    const c2: P = [p2[0] - (p3[0] - p1[0]) * k, p2[1] - (p3[1] - p1[1]) * k];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
};
/** Point on a polyline at fraction u (by length). */
export const along = (pts: P[], u: number): P => {
  const seg: number[] = [];
  let total = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const l = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]);
    seg.push(l);
    total += l;
  }
  let target = Math.max(0, Math.min(1, u)) * total;
  for (let i = 0; i < seg.length; i++) {
    if (target <= seg[i] || i === seg.length - 1) {
      const k = seg[i] === 0 ? 0 : Math.min(1, target / seg[i]);
      return [lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k)];
    }
    target -= seg[i];
  }
  return pts[pts.length - 1];
};
export const quad = (p0: P, c: P, p1: P, u: number): P => [
  (1 - u) * (1 - u) * p0[0] + 2 * (1 - u) * u * c[0] + u * u * p1[0],
  (1 - u) * (1 - u) * p0[1] + 2 * (1 - u) * u * c[1] + u * u * p1[1],
];

// ------------------------------------------------------------------ global defs
// One hidden <svg> holds every gradient; all scene SVGs reference these ids.
export const GlobalDefs: React.FC = () => (
  <svg width={0} height={0} style={{position: 'absolute'}} aria-hidden>
    <defs>
      {(
        [
          ['g-cy', C.cyan],
          ['g-or', C.orange],
          ['g-wh', '#FFFFFF'],
        ] as const
      ).map(([id, col]) => (
        <radialGradient id={id} key={id}>
          <stop offset="0" stopColor={col} stopOpacity={0.9} />
          <stop offset="0.25" stopColor={col} stopOpacity={0.45} />
          <stop offset="0.6" stopColor={col} stopOpacity={0.12} />
          <stop offset="1" stopColor={col} stopOpacity={0} />
        </radialGradient>
      ))}
      <linearGradient id="g-screen" x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0" stopColor="#2A6FB3" />
        <stop offset="1" stopColor="#0B2350" />
      </linearGradient>
      <linearGradient id="g-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#040A1C" />
        <stop offset="0.7" stopColor="#0E2552" />
        <stop offset="1" stopColor="#1B3D74" />
      </linearGradient>
      <linearGradient id="g-water" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#14477E" />
        <stop offset="0.35" stopColor="#0B2A5A" />
        <stop offset="1" stopColor="#040B20" />
      </linearGradient>
      <linearGradient id="g-seabed" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#24395F" />
        <stop offset="0.12" stopColor="#15264A" />
        <stop offset="1" stopColor="#070E24" />
      </linearGradient>
      <linearGradient id="g-land" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1E3A66" />
        <stop offset="1" stopColor="#0B1735" />
      </linearGradient>
      <linearGradient id="g-soil" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1B2E52" />
        <stop offset="1" stopColor="#0A1430" />
      </linearGradient>
      <linearGradient id="g-steel" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#C9D6EA" />
        <stop offset="0.5" stopColor="#7F93B5" />
        <stop offset="1" stopColor="#3D4F72" />
      </linearGradient>
      <linearGradient id="g-hull" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2A3D63" />
        <stop offset="1" stopColor="#111C38" />
      </linearGradient>
      <linearGradient id="g-jacket" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3A4A6C" />
        <stop offset="0.35" stopColor="#1C2742" />
        <stop offset="1" stopColor="#0B1226" />
      </linearGradient>
      <linearGradient id="g-copper" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#F2B27A" />
        <stop offset="0.5" stopColor="#C46A2E" />
        <stop offset="1" stopColor="#7A3A14" />
      </linearGradient>
      <linearGradient id="g-glass" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#BFEFFF" stopOpacity={0.35} />
        <stop offset="0.5" stopColor="#43C5F5" stopOpacity={0.12} />
        <stop offset="1" stopColor="#BFEFFF" stopOpacity={0.3} />
      </linearGradient>
      <radialGradient id="g-sphere" cx="0.38" cy="0.32" r="0.75">
        <stop offset="0" stopColor="#1F6AAE" />
        <stop offset="0.55" stopColor="#0B2A5C" />
        <stop offset="1" stopColor="#040C24" />
      </radialGradient>
      <radialGradient id="g-shade" cx="0.35" cy="0.3" r="0.8">
        <stop offset="0.45" stopColor="#020617" stopOpacity={0} />
        <stop offset="1" stopColor="#020617" stopOpacity={0.75} />
      </radialGradient>
      <radialGradient id="g-section" cx="0.4" cy="0.35" r="0.7">
        <stop offset="0" stopColor="#56698F" />
        <stop offset="0.6" stopColor="#2A3A60" />
        <stop offset="1" stopColor="#18233F" />
      </radialGradient>
      <linearGradient id="g-shadeTop" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#040A1C" stopOpacity={0.85} />
        <stop offset="1" stopColor="#040A1C" stopOpacity={0} />
      </linearGradient>
    </defs>
  </svg>
);

// ------------------------------------------------------------------ primitives
export const Glow: React.FC<{
  x: number;
  y: number;
  r: number;
  color?: 'cy' | 'or' | 'wh';
  o?: number;
}> = ({x, y, r, color = 'cy', o = 1}) =>
  o <= 0.001 ? null : <circle cx={x} cy={y} r={r} fill={`url(#g-${color})`} opacity={o} />;

/** A glowing cable/fiber line, optionally drawn on (progress) with moving pulses. */
export const GlowLine: React.FC<{
  d: string;
  w?: number;
  color?: string;
  o?: number;
  progress?: number;
  pulses?: {t: number; speed?: number; len?: number; gap?: number; o?: number};
  halo?: number;
}> = ({d, w = 4, color = C.cyan, o = 1, progress = 1, pulses, halo = 1}) => {
  if (o <= 0.001 || progress <= 0.0005) return null;
  const draw = progress < 1 ? {strokeDasharray: '1 1', strokeDashoffset: 1 - progress} : {};
  return (
    <g opacity={o} fill="none" strokeLinecap="round" strokeLinejoin="round">
      {halo > 0 && (
        <>
          <path d={d} pathLength={1} {...draw} stroke={color} strokeOpacity={0.1 * halo} strokeWidth={w * 7} />
          <path d={d} pathLength={1} {...draw} stroke={color} strokeOpacity={0.22 * halo} strokeWidth={w * 3} />
        </>
      )}
      <path d={d} pathLength={1} {...draw} stroke={color} strokeWidth={w} />
      <path d={d} pathLength={1} {...draw} stroke="#FFFFFF" strokeOpacity={0.55} strokeWidth={Math.max(0.6, w * 0.3)} />
      {pulses && progress >= 1 && (
        <path
          d={d}
          pathLength={1}
          stroke="#FFFFFF"
          strokeOpacity={pulses.o ?? 0.95}
          strokeWidth={w * 1.6}
          strokeDasharray={`${pulses.len ?? 0.025} ${pulses.gap ?? 0.12}`}
          strokeDashoffset={-pulses.t * (pulses.speed ?? 0.25)}
        />
      )}
    </g>
  );
};

// ------------------------------------------------------------------ text
export const Em: React.FC<{children: React.ReactNode; c?: string}> = ({children, c = C.orange}) => (
  <span style={{color: c}}>{children}</span>
);

type HeadPos = {x: number; y: number; width: number; size: number; align?: 'left' | 'center'};
/**
 * Editorial headline. Shorts placement stays inside the mobile-safe band
 * (y 170–560, x 70–1010) away from platform UI at the bottom and right.
 */
export const Headline: React.FC<{
  t: number;
  a: number;
  b: number;
  kicker?: string;
  lines: React.ReactNode[];
  wide?: Partial<HeadPos>;
  tall?: Partial<HeadPos>;
  sub?: React.ReactNode;
  /** optional absolute start time per line (for word-synced reveals) */
  at?: number[];
}> = ({t, a, b, kicker, lines, wide, tall, sub, at}) => {
  const L = useLay();
  const base: HeadPos = L.tall
    ? {x: 70, y: 190, width: 940, size: 86, align: 'center'}
    : {x: 110, y: 82, width: 1180, size: 78, align: 'left'};
  const p = {...base, ...(L.tall ? tall : wide)};
  const o = win(t, a, b, 0.3);
  if (o <= 0.001) return null;
  return (
    <div
      style={{
        position: 'absolute',
        left: p.x,
        top: p.y,
        width: p.width,
        textAlign: p.align,
        opacity: o,
        fontFamily: FONT_DISPLAY,
        color: C.white,
      }}
    >
      {kicker && (
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: p.size * 0.34,
            letterSpacing: '0.22em',
            color: C.cyan,
            marginBottom: p.size * 0.16,
            opacity: ramp(t, a, a + 0.35),
          }}
        >
          {kicker}
        </div>
      )}
      {lines.map((ln, i) => {
        const s0 = at?.[i] ?? a + 0.08 * i;
        const k = ramp(t, s0, s0 + 0.4);
        return (
          <div
            key={i}
            style={{
              fontWeight: 900,
              fontSize: p.size,
              lineHeight: 1.02,
              letterSpacing: '-0.01em',
              textTransform: 'uppercase',
              transform: `translateY(${(1 - k) * 26}px)`,
              opacity: k,
              textShadow: '0 3px 14px rgba(2,6,23,0.65)',
            }}
          >
            {ln}
          </div>
        );
      })}
      {sub && (
        <div
          style={{
            fontFamily: FONT,
            fontWeight: 600,
            fontSize: p.size * 0.36,
            lineHeight: 1.3,
            color: C.cyanSoft,
            marginTop: p.size * 0.22,
            opacity: ramp(t, a + 0.3, a + 0.7),
            textShadow: '0 2px 10px rgba(2,6,23,0.7)',
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
};

/** SVG label pill. */
export const Tag: React.FC<{
  x: number;
  y: number;
  text: string;
  o?: number;
  size?: number;
  color?: string;
  anchor?: 'start' | 'middle' | 'end';
  bg?: boolean;
}> = ({x, y, text, o = 1, size = 26, color = C.white, anchor = 'middle', bg = true}) => {
  if (o <= 0.001) return null;
  const w = text.length * size * 0.66 + size * 1.2;
  const h = size * 1.75;
  const x0 = anchor === 'middle' ? x - w / 2 : anchor === 'start' ? x - size * 0.6 : x - w + size * 0.6;
  return (
    <g opacity={o}>
      {bg && (
        <rect
          x={x0}
          y={y - h * 0.68}
          width={w}
          height={h}
          rx={h / 2}
          fill="#071028"
          fillOpacity={0.82}
          stroke={color}
          strokeOpacity={0.55}
          strokeWidth={2}
        />
      )}
      <text
        x={x}
        y={y}
        fill={color}
        fontFamily={FONT}
        fontWeight={700}
        fontSize={size}
        letterSpacing={size * 0.06}
        textAnchor={anchor}
      >
        {text}
      </text>
    </g>
  );
};

// ------------------------------------------------------------------ scene shell
export const Scene: React.FC<{
  a: number;
  b: number;
  first?: boolean;
  last?: boolean;
  children: (t: number) => React.ReactNode;
}> = ({a, b, first, last, children}) => {
  const t = useT();
  const h = XF / 2;
  if (t < a - h || t > b + h) return null;
  const o = Math.min(first ? 1 : ramp(t, a - h, a + h), last ? 1 : 1 - ramp(t, b - h, b + h));
  return <AbsoluteFill style={{opacity: o}}>{children(t)}</AbsoluteFill>;
};

export const Bg: React.FC<{kind: 'ocean' | 'space' | 'studio'; scale?: number; y?: number; o?: number}> = ({
  kind,
  scale = 1,
  y = 0,
  o = 1,
}) => {
  const L = useLay();
  return (
    <Img
      src={staticFile(`img/${kind}_${L.tall ? 'tall' : 'wide'}.jpg`)}
      style={{
        position: 'absolute',
        width: L.w,
        height: L.h,
        opacity: o,
        transform: `translateY(${y}px) scale(${scale})`,
      }}
    />
  );
};

export const Sprite: React.FC<{src: string; x: number; y: number; size: number; o?: number; sx?: number}> = ({
  src,
  x,
  y,
  size,
  o = 1,
  sx = 1,
}) =>
  o <= 0.001 ? null : (
    <Img
      src={staticFile(src)}
      style={{
        position: 'absolute',
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        opacity: o,
        transform: sx !== 1 ? `scaleX(${sx})` : undefined,
      }}
    />
  );

export const Svg: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => {
  const L = useLay();
  return (
    <svg
      width={L.w}
      height={L.h}
      viewBox={`0 0 ${L.w} ${L.h}`}
      style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', ...style}}
    >
      {children}
    </svg>
  );
};
