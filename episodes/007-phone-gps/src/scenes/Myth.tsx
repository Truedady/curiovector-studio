import React from 'react';
import {MiniPhone, Satellite} from '../art';
import {C, Earth, Fill, Headline, Svg, Tag, map, pick, rise, useL} from '../lib';
import {CUE} from '../timing';

// 16.8–24.75 s: the intuitive (wrong) picture — a satellite scanning down for you — then crossed out.
export const Myth: React.FC<{t: number}> = ({t}) => {
  const L = useL();
  const earth = pick(L, {cx: 1180, cy: 2230, r: 1450}, {cx: 540, cy: 2620, r: 1300});
  const top = earth.cy - earth.r;
  const sat = pick(L, {x: 1180, y: 300}, {x: 540, y: 690});
  const ph = {x: earth.cx, y: top + 6};

  const cone = rise(t, CUE.myth + 0.4, 0.9) * (1 - rise(t, CUE.notHow + 0.2, 0.5) * 0.75);
  const sweep = Math.sin((t - CUE.myth) * 1.6) * pick(L, 120, 90);
  const ret = rise(t, 19.6, 1.4);
  const xk = rise(t, CUE.notHow, 0.45);
  const camY = map(t, [16.8, 24.75], [0, pick(L, -30, -40)]);

  const hx = pick(L, 110, 70);
  const hy = pick(L, 110, 200);
  const hs = pick(L, 74, 74);

  return (
    <Fill>
      <div style={{position: 'absolute', inset: 0, transform: `translateY(${camY}px)`}}>
        <Earth cx={earth.cx} cy={earth.cy} r={earth.r} />
        <Svg>
          <defs>
            <linearGradient id="myth-cone" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={C.orange} stopOpacity="0.55" />
              <stop offset="1" stopColor={C.orange} stopOpacity="0.08" />
            </linearGradient>
          </defs>
          {/* scanning cone */}
          <g opacity={cone}>
            <path
              d={`M ${sat.x - 14} ${sat.y + 50} L ${ph.x + sweep - 210} ${ph.y} L ${ph.x + sweep + 210} ${ph.y} L ${sat.x + 14} ${sat.y + 50} Z`}
              fill="url(#myth-cone)"
            />
            <ellipse cx={ph.x + sweep} cy={ph.y} rx={210} ry={26} fill="none" stroke={C.orange} strokeWidth={3} strokeDasharray="10 8" />
          </g>
          {/* fake "location sent back" beam */}
          {ret > 0 && (
            <g opacity={1 - xk * 0.7}>
              <line
                x1={ph.x + 40}
                y1={ph.y - 70}
                x2={ph.x + 40 + (sat.x + 40 - ph.x - 40) * ret}
                y2={ph.y - 70 + (sat.y + 70 - ph.y + 70) * ret}
                stroke={C.orange}
                strokeWidth={5}
                strokeDasharray="16 12"
              />
            </g>
          )}
          <MiniPhone x={ph.x} y={ph.y} s={1.4} lit={0.6} />
        </Svg>
        <Satellite id="myth" t={t} x={sat.x} y={sat.y} scale={pick(L, 1.0, 1.05)} glow={0.6} />
        <Tag t={t} at={19.9} out={CUE.notHow + 0.3} x={sat.x + pick(L, 210, 0)} y={pick(L, (sat.y + ph.y) / 2, (sat.y + ph.y) / 2 + 40)} text={'"found you!"'} color={C.orange} size={28} anchor={pick<'left' | 'center' | 'right'>(L, 'left', 'center')} />
      </div>

      {/* big cross-out */}
      {xk > 0 && (
        <Svg>
          <g transform={`translate(${sat.x},${(sat.y + ph.y) / 2}) scale(${0.6 + 0.4 * xk})`} opacity={xk}>
            <line x1={-150} y1={-150} x2={150} y2={150} stroke={C.orange} strokeWidth={30} strokeLinecap="round" />
            <line x1={150} y1={-150} x2={-150} y2={150} stroke={C.orange} strokeWidth={30} strokeLinecap="round" />
          </g>
        </Svg>
      )}

      <Tag t={t} at={CUE.myth} out={CUE.notHow} x={hx} y={hy - 34} text="the myth" color={C.orange} anchor="left" size={24} solid />
      <Headline t={t} at={CUE.myth} out={CUE.notHow} x={hx} y={hy + 10} size={hs} width={pick(L, 720, 940)} text="A satellite *spotting* your phone?" />
      <Headline t={t} at={CUE.notHow} out={24.7} x={hx} y={hy + 10} size={hs} width={pick(L, 720, 940)} text="That's *not* how GPS works." />
    </Fill>
  );
};
