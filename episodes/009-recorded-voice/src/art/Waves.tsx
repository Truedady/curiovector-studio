import React from 'react';
import {staticFile} from 'remotion';
import {C, BODY_FONT, HEAD_FONT} from '../theme';

// Illustrative waveforms only — shapes are schematic, not measured spectra.
export const airWave = (x: number, t: number) => 0.5 * Math.sin(x * 0.085 - t * 8) + 0.22 * Math.sin(x * 0.21 - t * 13);
export const boneWave = (x: number, t: number) => 0.62 * Math.sin(x * 0.034 - t * 5) + 0.12 * Math.sin(x * 0.07 - t * 6);
export const mixWave = (x: number, t: number) => airWave(x, t) + boneWave(x, t);

export const WaveLine: React.FC<{
  w: number;
  h: number;
  fn: (x: number, t: number) => number;
  t: number;
  color: string;
  width?: number;
  amp?: number;
  draw?: number;
  opacity?: number;
  dashed?: boolean;
}> = ({w, h, fn, t, color, width = 5, amp = 1, draw = 1, opacity = 1, dashed}) => {
  const n = 90;
  const pts: string[] = [];
  const upto = Math.max(1, Math.round(n * draw));
  for (let i = 0; i <= upto; i++) {
    const x = (i / n) * w;
    const env = Math.sin((i / n) * Math.PI) ** 0.6;
    const y = h / 2 - fn(x, t) * env * amp * (h / 2) * 0.82;
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return (
    <polyline
      points={pts.join(' ')}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinejoin="round"
      strokeLinecap="round"
      opacity={opacity}
      strokeDasharray={dashed ? '3 12' : undefined}
    />
  );
};

export const Brain: React.FC<{size: number; glow: number; t: number}> = ({size, glow, t}) => (
  <svg width={size} height={size * 0.8} viewBox="0 0 250 200" style={{overflow: 'visible'}}>
    <image href={staticFile('glow_white.png')} x={-60} y={-80} width={370} height={370} opacity={glow * (0.5 + 0.15 * Math.sin(t * 4))} />
    <path
      d="M 60 160 C 20 160 6 120 22 96 C 6 70 26 36 60 40 C 70 14 110 6 132 24 C 156 6 200 16 206 46 C 240 54 246 96 226 116 C 240 146 214 176 182 168 C 168 190 128 192 112 172 C 96 184 70 180 60 160 Z"
      fill="#1B2D5A"
      stroke={C.white}
      strokeWidth={5}
    />
    <g stroke={C.white} strokeOpacity={0.55} strokeWidth={4} fill="none" strokeLinecap="round">
      <path d="M 60 70 C 80 60 96 76 90 96 C 84 116 110 126 124 112" />
      <path d="M 132 26 C 128 50 140 66 160 62 C 180 58 190 74 186 92" />
      <path d="M 40 120 C 60 112 76 124 76 140" />
      <path d="M 150 120 C 170 110 196 124 200 144" />
      <path d="M 124 112 C 126 140 120 156 112 172" />
    </g>
  </svg>
);

export const Mixer: React.FC<{
  t: number;
  w: number;
  air: number;
  bone: number;
  mix: number;
  brain: number;
  vertical?: boolean;
}> = ({t, w, air, bone, mix, brain, vertical}) => {
  const laneW = vertical ? w - 40 : w - 300;
  const laneH = 120;
  const label = (text: string, color: string, y: number, op: number) => (
    <text x={0} y={y} fill={color} fontFamily={BODY_FONT} fontWeight={600} fontSize={vertical ? 32 : 28} opacity={op}>
      {text}
    </text>
  );
  const H = vertical ? 760 : 560;
  return (
    <svg width={w} height={H} viewBox={`0 0 ${w} ${H}`} style={{overflow: 'visible'}}>
      {label('Through the air', C.cyan, 30, air)}
      <g transform="translate(0 44)" opacity={air}>
        <WaveLine w={laneW} h={laneH} fn={airWave} t={t} color={C.cyan} draw={air} />
      </g>
      {label('Through your head', C.orange, 220, bone)}
      <g transform="translate(0 234)" opacity={bone}>
        <WaveLine w={laneW} h={laneH} fn={boneWave} t={t} color={C.orange} width={7} draw={bone} />
      </g>
      <g opacity={mix}>
        <line x1={0} x2={laneW} y1={392} y2={392} stroke={C.white} strokeOpacity={0.25} strokeWidth={2} />
        {label('What you hear', C.white, 436, mix)}
        <g transform="translate(0 452)">
          <WaveLine w={laneW} h={laneH + 30} fn={mixWave} t={t} color={C.orange} width={12} amp={0.62} opacity={0.55} draw={mix} />
          <WaveLine w={laneW} h={laneH + 30} fn={mixWave} t={t} color={C.white} width={5} amp={0.62} draw={mix} />
        </g>
      </g>
      <g opacity={brain} transform={vertical ? `translate(${w / 2 - 110} 630)` : `translate(${laneW + 40} 300)`}>
        {!vertical && <path d="M -30 230 L 0 230" stroke={C.white} strokeWidth={4} />}
        <Brain size={220} glow={brain} t={t} />
      </g>
      <text
        x={vertical ? w / 2 : laneW + 150}
        y={vertical ? 820 : 540}
        textAnchor="middle"
        fill={C.dim}
        fontFamily={BODY_FONT}
        fontWeight={500}
        fontSize={vertical ? 26 : 22}
        opacity={mix}
      >
        Illustration — the exact mix varies by person
      </text>
      {!vertical && (
        <text x={laneW + 150} y={260} textAnchor="middle" fill={C.white} fontFamily={HEAD_FONT} fontWeight={900} fontSize={30} opacity={brain}>
          “MY VOICE”
        </text>
      )}
    </svg>
  );
};
