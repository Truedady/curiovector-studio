import React, {createContext, useContext} from 'react';
import {Easing, Img, interpolate, staticFile} from 'remotion';

export const C = {
  navy: '#08132F',
  navy2: '#0E1E46',
  navy3: '#16295A',
  cyan: '#43C5F5',
  orange: '#FF923E',
  white: '#F8FAFF',
  dim: 'rgba(248,250,255,0.62)',
  blue: '#2F86FF',
};

export const FONT = "'CV007 Inter Display', 'Inter Display', Inter, 'DejaVu Sans', sans-serif";

// ---- Layout -------------------------------------------------------------------------
export type Layout = {W: number; H: number; P: boolean};
export const LayoutCtx = createContext<Layout>({W: 1920, H: 1080, P: false});
export const useL = () => useContext(LayoutCtx);
/** Pick a value per format. */
export const pick = <T,>(L: Layout, landscape: T, portrait: T): T => (L.P ? portrait : landscape);

// ---- Time helpers (t = absolute seconds) -------------------------------------------
export const EASE = Easing.bezier(0.22, 1, 0.36, 1);
export const EASE_IO = Easing.bezier(0.65, 0, 0.35, 1);
const CL = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

/** 0→1 over [start, start+dur], eased. */
export const rise = (t: number, start: number, dur = 0.6, easing = EASE) =>
  interpolate(t, [start, start + dur], [0, 1], {...CL, easing});
/** Visible window: fades in at a, out at b. */
export const win = (t: number, a: number, b: number, d = 0.45) =>
  rise(t, a, d) * (1 - rise(t, b - d, d, EASE_IO));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const map = (t: number, inp: number[], out: number[], easing = EASE_IO) =>
  interpolate(t, inp, out, {...CL, easing});

// ---- Pre-rasterized light sprites (only transform/opacity animate) ----------------
type GlowColor = 'cyan' | 'orange' | 'white' | 'blue';
export const Glow: React.FC<{
  x: number;
  y: number;
  size: number;
  color?: GlowColor;
  opacity?: number;
  sx?: number;
}> = ({x, y, size, color = 'cyan', opacity = 1, sx = 1}) =>
  opacity <= 0.002 ? null : (
    <Img
      src={staticFile(`art/glow_${color}.png`)}
      style={{
        position: 'absolute',
        left: x - size / 2,
        top: y - size / 2,
        width: size,
        height: size,
        opacity,
        transform: sx !== 1 ? `scaleX(${sx})` : undefined,
        pointerEvents: 'none',
      }}
    />
  );

export const Earth: React.FC<{cx: number; cy: number; r: number; opacity?: number}> = ({
  cx,
  cy,
  r,
  opacity = 1,
}) => (
  <div style={{position: 'absolute', left: 0, top: 0, opacity}}>
    <Img
      src={staticFile('art/earth_atmo.png')}
      style={{position: 'absolute', left: cx - r * 1.25, top: cy - r * 1.25, width: r * 2.5, height: r * 2.5}}
    />
    <Img
      src={staticFile('art/earth.png')}
      style={{position: 'absolute', left: cx - r, top: cy - r, width: r * 2, height: r * 2}}
    />
  </div>
);

// ---- Typography --------------------------------------------------------------------
/** Renders `*word*` segments in orange, `_word_` in cyan. */
export const Rich: React.FC<{text: string}> = ({text}) => (
  <>
    {text.split(/(\*[^*]+\*|_[^_]+_)/g).map((seg, i) => {
      if (seg.startsWith('*') && seg.endsWith('*'))
        return (
          <span key={i} style={{color: C.orange}}>
            {seg.slice(1, -1)}
          </span>
        );
      if (seg.startsWith('_') && seg.endsWith('_') && seg.length > 2)
        return (
          <span key={i} style={{color: C.cyan}}>
            {seg.slice(1, -1)}
          </span>
        );
      return <React.Fragment key={i}>{seg}</React.Fragment>;
    })}
  </>
);

export const Headline: React.FC<{
  t: number;
  text: string;
  at: number;
  out?: number;
  x: number;
  y: number;
  size: number;
  width?: number;
  align?: 'left' | 'center' | 'right';
  weight?: number;
  color?: string;
  lift?: number;
}> = ({t, text, at, out = 1e9, x, y, size, width = 1400, align = 'left', weight = 800, color = C.white, lift = 26}) => {
  const k = rise(t, at, 0.55);
  const o = k * (1 - rise(t, out - 0.35, 0.35, EASE_IO));
  if (o <= 0.002) return null;
  const left = align === 'center' ? x - width / 2 : align === 'right' ? x - width : x;
  return (
    <div
      style={{
        position: 'absolute',
        left,
        top: y,
        width,
        textAlign: align,
        fontFamily: FONT,
        fontWeight: weight,
        fontSize: size,
        lineHeight: 1.04,
        letterSpacing: '-0.015em',
        color,
        opacity: o,
        transform: `translateY(${(1 - k) * lift}px)`,
        textShadow: '0 3px 12px rgba(3,8,22,0.85)',
      }}
    >
      <Rich text={text} />
    </div>
  );
};

/** Small uppercase pill label. */
export const Tag: React.FC<{
  t: number;
  at: number;
  out?: number;
  x: number;
  y: number;
  text: string;
  color?: string;
  size?: number;
  anchor?: 'left' | 'center' | 'right';
  solid?: boolean;
}> = ({t, at, out = 1e9, x, y, text, color = C.cyan, size = 26, anchor = 'center', solid = false}) => {
  const k = rise(t, at, 0.45);
  const o = k * (1 - rise(t, out - 0.3, 0.3, EASE_IO));
  if (o <= 0.002) return null;
  const tx = anchor === 'center' ? '-50%' : anchor === 'right' ? '-100%' : '0%';
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(${tx}, -50%) scale(${0.9 + 0.1 * k})`,
        opacity: o,
        padding: `${size * 0.32}px ${size * 0.7}px`,
        borderRadius: size,
        border: `2px solid ${color}`,
        background: solid ? color : 'rgba(8,19,47,0.82)',
        color: solid ? C.navy : color,
        fontFamily: FONT,
        fontWeight: 700,
        fontSize: size,
        letterSpacing: '0.08em',
        whiteSpace: 'nowrap',
        textTransform: 'uppercase',
      }}
    >
      <Rich text={text} />
    </div>
  );
};

export const Fill: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{position: 'absolute', inset: 0, overflow: 'hidden', ...style}}>{children}</div>
);

/** Full-frame SVG in pixel coordinates. */
export const Svg: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => {
  const L = useL();
  return (
    <svg
      width={L.W}
      height={L.H}
      viewBox={`0 0 ${L.W} ${L.H}`}
      style={{position: 'absolute', left: 0, top: 0, overflow: 'visible', ...style}}
    >
      {children}
    </svg>
  );
};

/** Broadcast rings expanding from a point, looping. Plain stroked circles: cheap. */
export const Rings: React.FC<{
  t: number;
  x: number;
  y: number;
  maxR: number;
  period?: number;
  count?: number;
  color?: string;
  opacity?: number;
  width?: number;
  phase?: number;
}> = ({t, x, y, maxR, period = 2.2, count = 3, color = C.cyan, opacity = 1, width = 3, phase = 0}) => {
  if (opacity <= 0.002) return null;
  return (
    <g>
      {Array.from({length: count}).map((_, i) => {
        const p = (((t + phase) / period + i / count) % 1 + 1) % 1;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={8 + p * maxR}
            fill="none"
            stroke={color}
            strokeWidth={width}
            opacity={opacity * (1 - p) * 0.9}
          />
        );
      })}
    </g>
  );
};
