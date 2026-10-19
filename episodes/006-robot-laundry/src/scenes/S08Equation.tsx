import React from 'react';
import {Shirt, ShirtParams} from '../art/Shirt';
import {Chip, Footnote, Panel, Reveal, Txt} from '../art/ui';
import {C, DISPLAY, FONT} from '../lib/theme';
import {ramp} from '../lib/timing';
import {SceneProps} from './types';

// Left: a written problem that holds still while it's solved.
// Right: a shirt that never holds still.
export const Equation: React.FC<SceneProps> = ({T, v}) => {
  const L = v ? {x: 60, y: 150, w: 960, h: 520} : {x: 90, y: 150, w: 840, h: 620};
  const R = v ? {x: 60, y: 700, w: 960, h: 570} : {x: 990, y: 150, w: 840, h: 620};
  const write = ramp(T, 75.6, 77.0);
  const solve = ramp(T, 76.9, 77.8);
  const shirtOn = ramp(T, 78.4, 78.9);
  const tt = T - 78.4;
  const p: ShirtParams = {
    t: T,
    wobble: 3 + 5 * shirtOn,
    wrinkle: 0.9,
    pulls: [
      {x: 200 * Math.sin(tt * 0.9), y: 100 * Math.cos(tt * 0.7), dx: 70 * Math.sin(tt * 1.7), dy: 60 * Math.cos(tt * 1.3), r: 140},
    ],
    bunch: 0.3 + 0.3 * Math.sin(tt * 0.8),
    bunchX: 60 * Math.sin(tt * 0.5),
    sleeveFlipL: 0.45 * (0.5 + 0.5 * Math.sin(tt * 1.1)),
    foldR: 0.35 * (0.5 + 0.5 * Math.sin(tt * 0.6 + 1)),
  };
  const ecx = L.x + L.w / 2;
  const ecy = L.y + L.h / 2;
  const tick = Math.floor(Math.max(0, T - 78.5));
  const words = [
    {t: 'MESSY', at: 86.8},
    {t: 'UNPREDICTABLE', at: 87.4},
    {t: 'HIDDEN COMPLEXITY', at: 88.8},
  ];
  return (
    <g>
      <Panel x={L.x} y={L.y} w={L.w} h={L.h} />
      <text x={L.x + 34} y={L.y + 56} fontFamily={FONT} fontWeight={700} fontSize={22} letterSpacing={4} fill={C.cyan}>
        A MATH PROBLEM
      </text>
      <defs>
        <clipPath id="eqWrite">
          <rect x={L.x} y={L.y} width={L.w * write} height={L.h} />
        </clipPath>
      </defs>
      <g clipPath="url(#eqWrite)">
        <text x={ecx} y={ecy - 10} textAnchor="middle" fontFamily={DISPLAY} fontStyle="italic" fontWeight={600} fontSize={v ? 120 : 112} fill={C.white}>
          3x + 4 = 19
        </text>
      </g>
      <text x={ecx} y={ecy + 110} textAnchor="middle" fontFamily={DISPLAY} fontStyle="italic" fontWeight={700} fontSize={v ? 84 : 80} fill={C.cyan} opacity={solve}>
        x = 5
      </text>
      <Reveal T={T} at={77.2}>
        <Chip x={ecx} y={L.y + L.h - 50} anchor="middle" text="STAYS THE SAME" size={24} />
      </Reveal>

      <Panel x={R.x} y={R.y} w={R.w} h={R.h} stroke={C.orange} />
      <text x={R.x + 34} y={R.y + 56} fontFamily={FONT} fontWeight={700} fontSize={22} letterSpacing={4} fill={C.orange}>
        A T-SHIRT
      </text>
      <g opacity={0.35 + 0.65 * shirtOn}>
        <defs>
          <clipPath id="eqR">
            <rect x={R.x} y={R.y} width={R.w} height={R.h} rx={28} />
          </clipPath>
        </defs>
        <g clipPath="url(#eqR)">
          <Shirt id="eq" x={R.x + R.w / 2} y={R.y + R.h / 2 + 10} scale={v ? 0.95 : 1.0} p={shirtOn > 0 ? p : {t: T, wobble: 1.5}} />
        </g>
        {/* ticking second hand */}
        <g transform={`translate(${R.x + R.w - 60},${R.y + 48})`}>
          <circle r={24} fill="none" stroke={C.orange} strokeWidth={3} />
          <line x1={0} y1={0} x2={18 * Math.sin((tick * Math.PI) / 6)} y2={-18 * Math.cos((tick * Math.PI) / 6)} stroke={C.orange} strokeWidth={4} strokeLinecap="round" />
        </g>
      </g>
      <Reveal T={T} at={78.6}>
        <Chip x={R.x + R.w / 2} y={R.y + R.h - 50} anchor="middle" text="CHANGES EVERY SECOND" size={24} color={C.orange} />
      </Reveal>

      {/* reasoning vs embodied control */}
      <Reveal T={T} at={81.1}>
        {v ? (
          <Txt x={540} y={1350} anchor="middle" size={50} lines={[['Reasoning ', {t: '≠', c: C.orange}, ' handling'], ['the physical world']]} />
        ) : (
          <Txt x={960} y={860} anchor="middle" size={52} lines={[['Abstract reasoning ', {t: '≠', c: C.orange}, ' handling the physical world']]} />
        )}
      </Reveal>
      {words.map((w, i) => (
        <Reveal key={w.t} T={T} at={w.at} dur={0.35}>
          {v ? (
            <Chip x={[300, 740, 540][i]} y={i < 2 ? 1480 : 1560} anchor="middle" text={w.t} color={C.orange} size={26} filled={T < w.at + 0.6} />
          ) : (
            <Chip x={960 + (i - 1) * 420} y={950} anchor="middle" text={w.t} color={C.orange} size={26} filled={T < w.at + 0.6} />
          )}
        </Reveal>
      ))}
      <Reveal T={T} at={82.5}>
        <Footnote
          x={v ? 540 : 960}
          y={v ? 1630 : 1040}
          anchor="middle"
          size={v ? 24 : 22}
          text="A metaphor, not a benchmark — plenty of math is far harder than laundry."
        />
      </Reveal>
    </g>
  );
};
