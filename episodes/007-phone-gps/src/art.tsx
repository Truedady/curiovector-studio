import React from 'react';
import {C, FONT, Glow, rise} from './lib';

// ===================================================================================
// GPS satellite — editorial vector, drawn around (0,0), ~260 px wide at scale 1.
// ===================================================================================
export const SatelliteGfx: React.FC<{blink?: number; id: string}> = ({blink = 1, id}) => (
  <g>
    <defs>
      <linearGradient id={`${id}-panel`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3B7FD6" />
        <stop offset="0.5" stopColor="#1C4C9A" />
        <stop offset="1" stopColor="#123271" />
      </linearGradient>
      <linearGradient id={`${id}-body`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#FFE1B8" />
        <stop offset="0.45" stopColor="#FFB067" />
        <stop offset="1" stopColor="#B85E1E" />
      </linearGradient>
    </defs>
    {/* booms */}
    <rect x={-118} y={-3} width={236} height={6} fill="#8FA3C7" />
    {/* solar wings */}
    {[-1, 1].map((s) => (
      <g key={s} transform={`translate(${s * 82},0)`}>
        <rect x={-46} y={-30} width={92} height={60} rx={4} fill={`url(#${id}-panel)`} stroke="#9FD9F7" strokeWidth={2} />
        {[-23, 0, 23].map((gx) => (
          <line key={gx} x1={gx} y1={-30} x2={gx} y2={30} stroke="#0B2350" strokeWidth={2} />
        ))}
        <line x1={-46} y1={0} x2={46} y2={0} stroke="#0B2350" strokeWidth={2} />
        <path d="M -44 -28 L 10 -28 L -20 -2 L -44 -2 Z" fill="#FFFFFF" opacity={0.16} />
      </g>
    ))}
    {/* body (gold foil) */}
    <rect x={-30} y={-36} width={60} height={70} rx={6} fill={`url(#${id}-body)`} stroke="#FFE7C7" strokeWidth={2} />
    <path d="M -26 -30 L 6 -30 L -26 10 Z" fill="#FFFFFF" opacity={0.28} />
    <rect x={-30} y={8} width={60} height={4} fill="#7A3D12" opacity={0.6} />
    {/* nadir antenna array */}
    <rect x={-18} y={34} width={36} height={10} rx={2} fill="#E8EEF9" />
    <path d="M -24 44 Q 0 62 24 44 Z" fill="#C9D5EA" stroke="#F8FAFF" strokeWidth={1.5} />
    {/* atomic clock beacon */}
    <circle cx={0} cy={-18} r={6} fill={C.cyan} opacity={0.35 + 0.65 * blink} />
  </g>
);

export const Satellite: React.FC<{
  x: number;
  y: number;
  scale?: number;
  rot?: number;
  id: string;
  t: number;
  glow?: number;
  opacity?: number;
}> = ({x, y, scale = 1, rot = 0, id, t, glow = 0.5, opacity = 1}) => {
  if (opacity <= 0.002) return null;
  const blink = 0.5 + 0.5 * Math.sin(t * 6 + x * 0.01);
  return (
    <div style={{position: 'absolute', left: 0, top: 0, opacity}}>
      <Glow x={x} y={y} size={380 * scale} color="cyan" opacity={glow * 0.55} />
      <svg
        width={300}
        height={160}
        viewBox="-150 -80 300 160"
        style={{
          position: 'absolute',
          left: x - 150,
          top: y - 80,
          overflow: 'visible',
          transform: `scale(${scale}) rotate(${rot}deg)`,
        }}
      >
        <SatelliteGfx id={id} blink={blink} />
      </svg>
    </div>
  );
};

// ===================================================================================
// Phone with an offline map screen.
// ===================================================================================
export type MapState = {
  noService: number; // 0..1 highlight of "No Service / Wi-Fi off"
  mapFail: number; // 0..1 map tiles replaced by "can't load"
  coords: number; // 0..1 coordinate card
  dot: number; // 0..1 blue dot visibility
  pulse: number; // seconds for pulse animation
};

const SW = 400; // screen design units
const SH = 840;

const MapScreen: React.FC<{s: MapState}> = ({s}) => {
  const dx = 200;
  const dy = 470;
  const p = (s.pulse % 1.6) / 1.6;
  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${SW} ${SH}`} style={{display: 'block'}}>
      <defs>
        <radialGradient id="map-bg" cx="0.5" cy="0.55" r="0.8">
          <stop offset="0" stopColor="#173068" />
          <stop offset="1" stopColor="#0A1636" />
        </radialGradient>
      </defs>
      <rect width={SW} height={SH} fill="url(#map-bg)" />
      {/* topo map */}
      <g opacity={1 - s.mapFail * 0.92}>
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <path
            key={i}
            d={`M -20 ${170 + i * 95} C 90 ${120 + i * 92} 170 ${250 + i * 88} 260 ${190 + i * 96} S 380 ${150 + i * 100} 440 ${200 + i * 92}`}
            fill="none"
            stroke={C.cyan}
            strokeWidth={2}
            opacity={0.22}
          />
        ))}
        <path d="M 60 840 C 110 700 150 640 200 470 S 300 260 330 120" fill="none" stroke={C.orange} strokeWidth={6} strokeDasharray="14 12" opacity={0.75} />
        <path d="M 250 330 l 26 -40 l 26 40 z" fill="#C9D5EA" opacity={0.5} />
        <text x={312} y={350} fontFamily={FONT} fontSize={20} fill={C.white} opacity={0.55}>
          Summit
        </text>
        <path d="M 0 610 C 120 640 260 600 400 660" fill="none" stroke="#3B7FD6" strokeWidth={10} opacity={0.5} />
      </g>
      {/* map tiles failing to load */}
      {s.mapFail > 0.01 && (
        <g opacity={s.mapFail}>
          {Array.from({length: 7}).map((_, r) =>
            Array.from({length: 4}).map((__, c) => (
              <rect
                key={`${r}-${c}`}
                x={c * 100 + 3}
                y={110 + r * 104 + 3}
                width={94}
                height={98}
                fill={(r + c) % 2 ? '#1A2850' : '#15224A'}
              />
            )),
          )}
          <rect x={60} y={176} width={280} height={84} rx={16} fill="#0A1636" stroke={C.orange} strokeWidth={2.5} />
          <text x={200} y={212} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={23} fill={C.orange}>
            Map can't load
          </text>
          <text x={200} y={242} textAnchor="middle" fontFamily={FONT} fontSize={19} fill={C.white} opacity={0.75}>
            You're offline
          </text>
        </g>
      )}
      {/* blue dot */}
      <g opacity={s.dot}>
        <circle cx={dx} cy={dy} r={74} fill={C.blue} opacity={0.18} />
        <circle cx={dx} cy={dy} r={20 + p * 64} fill="none" stroke={C.blue} strokeWidth={4} opacity={(1 - p) * 0.8} />
        <circle cx={dx} cy={dy} r={24} fill={C.white} />
        <circle cx={dx} cy={dy} r={17} fill={C.blue} />
      </g>
      {/* coordinate card */}
      <g opacity={s.coords} transform={`translate(0, ${(1 - s.coords) * 20})`}>
        <rect x={24} y={650} width={352} height={150} rx={22} fill="#081330" stroke={C.cyan} strokeWidth={2} />
        <text x={48} y={694} fontFamily={FONT} fontWeight={700} fontSize={19} letterSpacing="2" fill={C.cyan}>
          YOUR POSITION
        </text>
        <text x={48} y={738} fontFamily={FONT} fontWeight={800} fontSize={31} fill={C.white}>
          46.5577° N
        </text>
        <text x={48} y={778} fontFamily={FONT} fontWeight={800} fontSize={31} fill={C.white}>
          7.9806° E
        </text>
      </g>
      {/* status bar */}
      <rect width={SW} height={92} fill="#060E26" opacity={0.92} />
      <text x={36} y={60} fontFamily={FONT} fontWeight={700} fontSize={28} fill={C.white}>
        9:41
      </text>
      <g opacity={0.8 + 0.2 * s.noService}>
        <text
          x={238}
          y={60}
          textAnchor="end"
          fontFamily={FONT}
          fontWeight={700}
          fontSize={22}
          fill={s.noService > 0.5 ? C.orange : C.white}
        >
          No Service
        </text>
        {/* wifi glyph with slash */}
        <g transform="translate(272,64)" stroke={s.noService > 0.5 ? C.orange : C.white} strokeWidth={4} fill="none" strokeLinecap="round">
          <path d="M -18 -18 Q 0 -32 18 -18" />
          <path d="M -11 -10 Q 0 -19 11 -10" />
          <circle cx={0} cy={-2} r={2} fill={s.noService > 0.5 ? C.orange : C.white} />
          <line x1={-20} y1={-30} x2={18} y2={4} />
        </g>
        <rect x={312} y={40} width={50} height={24} rx={6} fill="none" stroke={C.white} strokeWidth={2.5} />
        <rect x={316} y={44} width={34} height={16} rx={3} fill={C.white} />
        <rect x={364} y={47} width={4} height={10} rx={1} fill={C.white} />
      </g>
    </svg>
  );
};

/** Phone body + screen. Height = width * 2.08. Drawn at (x,y) center. */
export const Phone: React.FC<{
  x: number;
  y: number;
  w: number;
  s: MapState;
  rot?: number;
  opacity?: number;
  glow?: number;
}> = ({x, y, w, s, rot = 0, opacity = 1, glow = 0.6}) => {
  if (opacity <= 0.002) return null;
  const h = w * 2.08;
  const bez = w * 0.045;
  return (
    <div style={{position: 'absolute', left: 0, top: 0, opacity}}>
      <Glow x={x} y={y + w * 0.12} size={w * 3.2} color="blue" opacity={glow * 0.55} />
      <div
        style={{
          position: 'absolute',
          left: x - w / 2,
          top: y - h / 2,
          width: w,
          height: h,
          borderRadius: w * 0.15,
          background: 'linear-gradient(135deg, #5C6C8E 0%, #20283E 18%, #0B1023 60%, #3A4A6E 100%)',
          transform: `rotate(${rot}deg)`,
          padding: bez,
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            borderRadius: w * 0.115,
            overflow: 'hidden',
            background: '#060E26',
            position: 'relative',
          }}
        >
          <MapScreen s={s} />
          {/* glass reflection */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(115deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.02) 32%, rgba(255,255,255,0) 60%)',
            }}
          />
          {/* dynamic island */}
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: w * 0.03,
              width: w * 0.28,
              height: w * 0.075,
              marginLeft: -w * 0.14,
              borderRadius: w,
              background: '#000',
            }}
          />
        </div>
        {/* rim light */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: w * 0.15,
            border: `2px solid rgba(67,197,245,0.55)`,
          }}
        />
      </div>
    </div>
  );
};

// ===================================================================================
// Night mountains with a hiker standing on the near ridge.
// Drawn in a 1920x1080 world; the near ridge summit (hiker's feet) is at (700, 700).
// ===================================================================================
export const HIKER_FEET = {x: 700, y: 700};

export const Mountains: React.FC<{viewBox: string; width: number; height: number; t: number; phoneGlow: number}> = ({
  viewBox,
  width,
  height,
  t,
  phoneGlow,
}) => (
  <svg width={width} height={height} viewBox={viewBox} preserveAspectRatio="xMidYMid slice" style={{position: 'absolute', left: 0, top: 0}}>
    <defs>
      <linearGradient id="mt-far" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#24427E" />
        <stop offset="1" stopColor="#0E1E46" />
      </linearGradient>
      <linearGradient id="mt-mid" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#152C61" />
        <stop offset="1" stopColor="#0A1736" />
      </linearGradient>
      <linearGradient id="mt-near" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0A1534" />
        <stop offset="1" stopColor="#040A1C" />
      </linearGradient>
      <linearGradient id="mt-haze" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#43C5F5" stopOpacity="0" />
        <stop offset="1" stopColor="#43C5F5" stopOpacity="0.16" />
      </linearGradient>
    </defs>
    {/* far range with snow */}
    <path
      d="M -200 640 L 80 430 L 210 520 L 420 330 L 560 450 L 760 380 L 960 250 L 1130 400 L 1300 330 L 1500 470 L 1680 300 L 1900 440 L 2200 380 L 2200 1500 L -200 1500 Z"
      fill="url(#mt-far)"
    />
    <path d="M 420 330 L 470 372 L 440 368 L 410 392 L 380 364 Z M 960 250 L 1030 310 L 990 300 L 955 330 L 915 296 Z M 1680 300 L 1735 345 L 1700 340 L 1670 362 L 1640 336 Z" fill="#DCE8FA" opacity={0.75} />
    <path d="M 960 250 L 1130 400" stroke={C.cyan} strokeWidth={2.5} opacity={0.5} fill="none" />
    <path d="M 1680 300 L 1900 440" stroke={C.cyan} strokeWidth={2.5} opacity={0.45} fill="none" />
    <rect x={-200} y={420} width={2400} height={360} fill="url(#mt-haze)" />
    {/* mid range */}
    <path
      d="M -200 760 L 120 590 L 300 660 L 520 560 L 640 620 L 900 520 L 1120 640 L 1380 560 L 1600 660 L 1820 590 L 2200 700 L 2200 1500 L -200 1500 Z"
      fill="url(#mt-mid)"
    />
    <path d="M 900 520 L 1120 640 M 1380 560 L 1600 660" stroke={C.cyan} strokeWidth={2} opacity={0.3} fill="none" />
    {/* near ridge — hiker summit at (700,700) */}
    <path
      d="M -200 900 L 200 820 L 420 760 L 600 712 L 700 700 L 790 716 L 980 790 L 1250 850 L 1600 900 L 2200 960 L 2200 1500 L -200 1500 Z"
      fill="url(#mt-near)"
    />
    <path d="M 420 760 L 600 712 L 700 700 L 790 716 L 980 790" stroke={C.cyan} strokeWidth={2.5} opacity={0.55} fill="none" />
    {/* hiker silhouette */}
    <g transform={`translate(${HIKER_FEET.x},${HIKER_FEET.y})`} fill="#030817">
      <circle cx={4} cy={-138} r={11} />
      <path d="M -8 -126 L 15 -126 L 19 -80 L 13 -70 L -10 -70 L -14 -96 Z" />
      <rect x={-31} y={-124} width={23} height={50} rx={7} />
      <path d="M -9 -72 L -21 -30 L -27 0 L -15 0 L -8 -32 L 2 -58 L 9 -30 L 17 0 L 29 0 L 19 -34 L 13 -72 Z" />
      <path d="M 12 -118 L 30 -98 L 42 -112" stroke="#030817" strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <line x1={-4} y1={-104} x2={-40} y2={0} stroke="#030817" strokeWidth={3.5} />
      <path d="M -6 -136 Q 4 -152 15 -138" fill="none" stroke={C.cyan} strokeWidth={2} opacity={0.6} />
      <rect x={38} y={-124} width={9} height={15} rx={2} fill={C.cyan} opacity={0.6 + 0.4 * phoneGlow} />
    </g>
    {/* subtle drifting mist band (transform only) */}
    <rect x={-200} y={820} width={2400} height={120} fill={C.cyan} opacity={0.05} transform={`translate(${Math.sin(t * 0.3) * 30},0)`} />
  </svg>
);

// ===================================================================================
// Analog clock face (atomic = cyan, quartz = orange).
// ===================================================================================
export const ClockFace: React.FC<{
  x: number;
  y: number;
  r: number;
  color: string;
  angle: number; // seconds-hand angle in degrees
  wobble?: number;
  label?: string;
  sub?: string;
}> = ({x, y, r, color, angle, label, sub}) => (
  <g transform={`translate(${x},${y})`}>
    <circle r={r * 1.08} fill="#0A1636" stroke={color} strokeWidth={r * 0.05} />
    <circle r={r * 0.94} fill="none" stroke={color} strokeWidth={1.5} opacity={0.35} />
    {Array.from({length: 60}).map((_, i) => {
      const a = (i / 60) * Math.PI * 2;
      const big = i % 5 === 0;
      const r1 = r * (big ? 0.78 : 0.86);
      return (
        <line
          key={i}
          x1={Math.sin(a) * r1}
          y1={-Math.cos(a) * r1}
          x2={Math.sin(a) * r * 0.92}
          y2={-Math.cos(a) * r * 0.92}
          stroke={C.white}
          strokeWidth={big ? r * 0.035 : r * 0.012}
          opacity={big ? 0.9 : 0.45}
        />
      );
    })}
    <line x1={0} y1={0} x2={0} y2={-r * 0.5} stroke={C.white} strokeWidth={r * 0.05} strokeLinecap="round" transform="rotate(300)" />
    <line x1={0} y1={0} x2={0} y2={-r * 0.7} stroke={C.white} strokeWidth={r * 0.035} strokeLinecap="round" transform="rotate(50)" />
    <g transform={`rotate(${angle})`}>
      <line x1={0} y1={r * 0.15} x2={0} y2={-r * 0.86} stroke={color} strokeWidth={r * 0.022} strokeLinecap="round" />
    </g>
    <circle r={r * 0.06} fill={color} />
    {label && (
      <text y={r * 1.42} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={r * 0.24} letterSpacing="2" fill={color}>
        {label}
      </text>
    )}
    {sub && (
      <text y={r * 1.72} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={r * 0.17} fill={C.white} opacity={0.75}>
        {sub}
      </text>
    )}
  </g>
);

/** Pulse travelling from a to b, k in [0,1]. Comet head + fading trail. */
export const Pulse: React.FC<{ax: number; ay: number; bx: number; by: number; k: number; color?: string; r?: number}> = ({
  ax,
  ay,
  bx,
  by,
  k,
  color = C.cyan,
  r = 12,
}) => {
  if (k <= 0 || k >= 1) return null;
  const x = ax + (bx - ax) * k;
  const y = ay + (by - ay) * k;
  const k0 = Math.max(0, k - 0.18);
  return (
    <g>
      <line x1={ax + (bx - ax) * k0} y1={ay + (by - ay) * k0} x2={x} y2={y} stroke={color} strokeWidth={r * 0.7} strokeLinecap="round" opacity={0.45} />
      <circle cx={x} cy={y} r={r * 1.9} fill={color} opacity={0.25} />
      <circle cx={x} cy={y} r={r} fill={C.white} />
    </g>
  );
};


/** Tiny phone marker (SVG group) standing on the planet surface at (x,y) = its base. */
export const MiniPhone: React.FC<{x: number; y: number; s?: number; lit?: number}> = ({x, y, s = 1, lit = 0}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <circle cx={0} cy={-34} r={46} fill={C.blue} opacity={0.12 + 0.25 * lit} />
    <rect x={-17} y={-68} width={34} height={64} rx={7} fill="#0B1023" stroke={C.cyan} strokeWidth={2.5} />
    <rect x={-13} y={-62} width={26} height={52} rx={4} fill="#173068" />
    <circle cx={0} cy={-36} r={7} fill={C.white} />
    <circle cx={0} cy={-36} r={5} fill={C.blue} />
  </g>
);
