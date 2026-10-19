import React from 'react';
import {C, DISPLAY, FONT} from '../lib/theme';
import {clamp, ramp} from '../lib/timing';

export const Backdrop: React.FC<{W: number; H: number; T: number}> = ({W, H, T}) => {
  const drift = Math.sin(T * 0.15) * 40;
  return (
    <g>
      <defs>
        <radialGradient id="bgR" cx="0.5" cy="0.42" r="0.75">
          <stop offset="0" stopColor="#13285E" />
          <stop offset="0.55" stopColor="#0B1A41" />
          <stop offset="1" stopColor={C.navy} />
        </radialGradient>
        <radialGradient id="haloC">
          <stop offset="0" stopColor={C.cyan} stopOpacity={0.16} />
          <stop offset="1" stopColor={C.cyan} stopOpacity={0} />
        </radialGradient>
        <radialGradient id="haloO">
          <stop offset="0" stopColor={C.orange} stopOpacity={0.12} />
          <stop offset="1" stopColor={C.orange} stopOpacity={0} />
        </radialGradient>
        <pattern id="dots" width={36} height={36} patternUnits="userSpaceOnUse">
          <circle cx={2} cy={2} r={1.3} fill="#8FB4FF" opacity={0.12} />
        </pattern>
        <radialGradient id="vign" cx="0.5" cy="0.5" r="0.75">
          <stop offset="0.6" stopColor="#000" stopOpacity={0} />
          <stop offset="1" stopColor="#000" stopOpacity={0.45} />
        </radialGradient>
      </defs>
      <rect width={W} height={H} fill="url(#bgR)" />
      <rect width={W} height={H} fill="url(#dots)" />
      <circle cx={W * 0.18 + drift} cy={H * 0.2} r={Math.max(W, H) * 0.42} fill="url(#haloC)" />
      <circle cx={W * 0.85 - drift} cy={H * 0.82} r={Math.max(W, H) * 0.4} fill="url(#haloO)" />
    </g>
  );
};

export const Vignette: React.FC<{W: number; H: number}> = ({W, H}) => (
  <rect width={W} height={H} fill="url(#vign)" pointerEvents="none" />
);

export const Gate: React.FC<{T: number; a: number; b: number; children: React.ReactNode}> = ({T, a, b, children}) => {
  const pad = 0.22;
  if (T < a - pad || T > b + pad) return null;
  const fadeIn = a <= 0 ? 1 : ramp(T, a - pad, a + pad);
  const fadeOut = 1 - ramp(T, b - pad, b + pad);
  return <g opacity={Math.min(fadeIn, fadeOut)}>{children}</g>;
};

type Run = string | {t: string; c?: string; w?: number};

// Multi-line text; each line is an array of runs so single words can be
// highlighted in orange/cyan.
export const Txt: React.FC<{
  x: number;
  y: number;
  lines: Run[][];
  size: number;
  lh?: number;
  color?: string;
  weight?: number;
  anchor?: 'start' | 'middle' | 'end';
  opacity?: number;
  rise?: number;
  display?: boolean;
  spacing?: number;
}> = ({x, y, lines, size, lh = 1.15, color = C.white, weight = 700, anchor = 'start', opacity = 1, rise = 0, display = true, spacing = 0}) => (
  <text
    x={x}
    y={y + rise}
    fontFamily={display ? DISPLAY : FONT}
    fontSize={size}
    fontWeight={weight}
    fill={color}
    textAnchor={anchor}
    opacity={opacity}
    letterSpacing={spacing}
  >
    {lines.map((line, i) => (
      <tspan key={i} x={x} dy={i === 0 ? 0 : size * lh}>
        {line.map((r, j) =>
          typeof r === 'string' ? (
            <tspan key={j}>{r}</tspan>
          ) : (
            <tspan key={j} fill={r.c ?? C.orange} fontWeight={r.w ?? weight}>
              {r.t}
            </tspan>
          )
        )}
      </tspan>
    ))}
  </text>
);

// Text that slides up and fades in at `at`.
export const Reveal: React.FC<{T: number; at: number; dur?: number; dist?: number; children: React.ReactNode; out?: number}> = ({
  T,
  at,
  dur = 0.5,
  dist = 24,
  children,
  out,
}) => {
  const k = ramp(T, at, at + dur);
  const o = out !== undefined ? 1 - ramp(T, out, out + 0.4) : 1;
  if (k <= 0) return null;
  return (
    <g opacity={k * o} transform={`translate(0,${(1 - k) * dist})`}>
      {children}
    </g>
  );
};

export const Chip: React.FC<{
  x: number;
  y: number;
  text: string;
  color?: string;
  size?: number;
  anchor?: 'start' | 'middle';
  filled?: boolean;
}> = ({x, y, text, color = C.cyan, size = 26, anchor = 'start', filled = false}) => {
  const w = text.length * size * 0.8 + size * 1.3;
  const h = size * 1.8;
  const x0 = anchor === 'middle' ? x - w / 2 : x;
  return (
    <g>
      <rect x={x0} y={y - h / 2} width={w} height={h} rx={h / 2} fill={filled ? color : 'rgba(8,19,47,0.78)'} stroke={color} strokeWidth={2} />
      <text
        x={x0 + w / 2}
        y={y + size * 0.36}
        textAnchor="middle"
        fontFamily={FONT}
        fontWeight={700}
        fontSize={size}
        letterSpacing={size * 0.12}
        fill={filled ? C.navy : color}
      >
        {text}
      </text>
    </g>
  );
};

export const Table: React.FC<{x: number; y: number; w: number; h: number}> = ({x, y, w, h}) => (
  <g>
    <defs>
      <linearGradient id="tableG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1A3170" />
        <stop offset="1" stopColor="#0C1940" />
      </linearGradient>
    </defs>
    <rect x={x} y={y} width={w} height={h} rx={36} fill="url(#tableG)" />
    <rect x={x} y={y} width={w} height={h} rx={36} fill="none" stroke={C.cyan} strokeOpacity={0.18} strokeWidth={2} />
    <path d={`M${x + 40},${y + 2} L${x + w - 40},${y + 2}`} stroke="#7FA6FF" strokeOpacity={0.3} strokeWidth={3} />
  </g>
);

// Three-stage roadmap: SEE → PREDICT → CONTROL.
export const StepBar: React.FC<{x: number; y: number; active: number; T: number; at: number; gap: number; size?: number}> = ({
  x,
  y,
  active,
  T,
  at,
  gap,
  size = 24,
}) => {
  const labels = ['SEE', 'PREDICT', 'CONTROL'];
  return (
    <g>
      {labels.map((l, i) => {
        const k = ramp(T, at + i * 0.18, at + i * 0.18 + 0.4);
        const on = i === active;
        const done = i < active;
        const cx = x + (i - 1) * gap;
        return (
          <g key={l} opacity={k * (on ? 1 : done ? 0.75 : 0.45)}>
            {i < 2 && <line x1={cx + gap * 0.3} y1={y} x2={cx + gap * 0.7} y2={y} stroke={C.muted} strokeWidth={2} strokeDasharray="4 6" />}
            <Chip x={cx} y={y} text={`${i + 1} ${l}`} anchor="middle" size={size} color={on ? C.orange : C.cyan} filled={on} />
          </g>
        );
      })}
    </g>
  );
};

export const Viewfinder: React.FC<{x: number; y: number; w: number; h: number; opacity?: number; rec?: boolean; T: number}> = ({
  x,
  y,
  w,
  h,
  opacity = 1,
  rec = true,
  T,
}) => {
  const L = Math.min(w, h) * 0.12;
  const corner = (cx: number, cy: number, sx: number, sy: number) => (
    <path d={`M${cx},${cy + sy * L} L${cx},${cy} L${cx + sx * L},${cy}`} fill="none" stroke={C.cyan} strokeWidth={5} strokeLinecap="round" />
  );
  const scan = y + ((T * 0.45) % 1) * h;
  return (
    <g opacity={opacity}>
      {corner(x, y, 1, 1)}
      {corner(x + w, y, -1, 1)}
      {corner(x, y + h, 1, -1)}
      {corner(x + w, y + h, -1, -1)}
      <line x1={x + 12} x2={x + w - 12} y1={scan} y2={scan} stroke={C.cyan} strokeOpacity={0.22} strokeWidth={3} />
      {rec && (
        <g>
          <circle cx={x + 34} cy={y + 34} r={8} fill={C.orange} opacity={0.6 + 0.4 * Math.sin(T * 6)} />
          <text x={x + 52} y={y + 42} fontFamily={FONT} fontSize={22} fontWeight={700} fill={C.white} opacity={0.85} letterSpacing={3}>
            ROBOT CAMERA
          </text>
        </g>
      )}
    </g>
  );
};

export const Panel: React.FC<{x: number; y: number; w: number; h: number; stroke?: string; opacity?: number}> = ({
  x,
  y,
  w,
  h,
  stroke = C.cyan,
  opacity = 1,
}) => (
  <rect x={x} y={y} width={w} height={h} rx={28} fill="rgba(14,29,69,0.82)" stroke={stroke} strokeOpacity={0.45} strokeWidth={2} opacity={opacity} />
);

export const Footnote: React.FC<{x: number; y: number; text: string; size?: number; anchor?: 'start' | 'middle'; opacity?: number}> = ({
  x,
  y,
  text,
  size = 22,
  anchor = 'start',
  opacity = 1,
}) => (
  <text x={x} y={y} fontFamily={FONT} fontSize={size} fontWeight={500} fill={C.muted} textAnchor={anchor} opacity={opacity * clamp(1)}>
    {text}
  </text>
);
