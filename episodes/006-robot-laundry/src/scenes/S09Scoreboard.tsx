import React from 'react';
import {Shirt} from '../art/Shirt';
import {Chip, Footnote, Panel, Reveal, Txt} from '../art/ui';
import {C, DISPLAY} from '../lib/theme';
import {easeOut, ramp} from '../lib/timing';
import {SceneProps} from './types';

const Knight: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path
      d="M-34,50 L34,50 L30,36 L22,32 C22,10 26,-6 36,-22 C40,-30 38,-44 26,-52 C14,-60 -2,-60 -12,-54 L-18,-64 L-24,-50 C-36,-42 -44,-28 -46,-12 L-50,2 C-52,10 -44,14 -38,10 L-22,-2 C-16,4 -12,10 -18,22 L-22,32 L-30,36 Z"
      fill={C.white}
    />
    <circle cx={-14} cy={-34} r={4} fill={C.navy} />
  </g>
);

const Calc: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => (
  <text x={x} y={y + 30 * s} textAnchor="middle" fontFamily={DISPLAY} fontWeight={700} fontSize={84 * s} fill={C.white}>
    ∑×÷
  </text>
);

const Pattern: React.FC<{x: number; y: number; s: number; T: number}> = ({x, y, s, T}) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {Array.from({length: 25}, (_, i) => {
      const r = Math.floor(i / 5);
      const c = i % 5;
      const on = r === c || r + c === 4;
      return <circle key={i} cx={(c - 2) * 24} cy={(r - 2) * 24} r={7} fill={on ? C.cyan : '#3A5296'} opacity={on ? 0.7 + 0.3 * Math.sin(T * 4 + i) : 1} />;
    })}
  </g>
);

export const Scoreboard: React.FC<SceneProps> = ({T, v}) => {
  const items = [
    {name: 'Chess', at: 92.3, ok: true},
    {name: 'Calculations', at: 93.0, ok: true},
    {name: 'Pattern recognition', at: 93.9, ok: true},
    {name: 'Your laundry', at: 95.76, ok: false},
  ];
  return (
    <g>
      <Reveal T={T} at={90.8}>
        {v ? (
          <Txt x={80} y={300} size={62} lines={[['Machines may'], [{t: 'beat you', c: C.cyan}, ' at…']]} />
        ) : (
          <Txt x={110} y={200} size={62} lines={[['Machines may ', {t: 'beat you', c: C.cyan}, ' at…']]} />
        )}
      </Reveal>
      {items.map((it, i) => {
        const k = ramp(T, it.at - 0.15, it.at + 0.4, easeOut);
        if (k <= 0) return null;
        const col = it.ok ? C.cyan : C.orange;
        const box = v ? {x: 60, y: 440 + i * 285, w: 960, h: 255} : {x: 110 + i * 435, y: 300, w: 400, h: 560};
        const icx = v ? box.x + 150 : box.x + box.w / 2;
        const icy = v ? box.y + box.h / 2 : box.y + 200;
        const icon =
          i === 0 ? (
            <Knight x={icx} y={icy} s={v ? 1.5 : 1.8} />
          ) : i === 1 ? (
            <Calc x={icx} y={icy - 10} s={v ? 1.1 : 1.3} />
          ) : i === 2 ? (
            <Pattern x={icx} y={icy} s={v ? 1.4 : 1.7} T={T} />
          ) : (
            <Shirt id="sb" x={icx} y={icy} scale={v ? 0.4 : 0.55} p={{t: T, wobble: 5, bunch: 0.7, sleeveFlipR: 0.6, wrinkle: 1}} shadow={0.5} />
          );
        return (
          <g key={it.name} opacity={k} transform={`translate(0,${(1 - k) * 40})`}>
            <Panel x={box.x} y={box.y} w={box.w} h={box.h} stroke={col} />
            {icon}
            {v ? (
              <>
                <Txt x={box.x + 300} y={box.y + 110} size={48} lines={[[it.name]]} />
                <Chip x={box.x + 300} y={box.y + 175} text={it.ok ? 'MACHINES EXCEL' : 'STILL HARD'} color={col} size={24} filled={!it.ok} />
              </>
            ) : (
              <>
                <Txt x={icx} y={box.y + 420} anchor="middle" size={i === 2 ? 36 : 42} lines={[[it.name]]} />
                <Chip x={icx} y={box.y + 490} anchor="middle" text={it.ok ? 'MACHINES EXCEL' : 'STILL HARD'} color={col} size={22} filled={!it.ok} />
              </>
            )}
          </g>
        );
      })}
      <Reveal T={T} at={95.9}>
        <Footnote
          x={v ? 540 : 960}
          y={v ? 1625 : 960}
          anchor="middle"
          size={v ? 24 : 24}
          text={v ? 'Board games & math: software. Laundry: software + body + touch.' : 'Board games and math run in software. Laundry needs software, a body, sensors and touch.'}
        />
      </Reveal>
    </g>
  );
};
