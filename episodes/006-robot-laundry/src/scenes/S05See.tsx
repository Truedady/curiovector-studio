import React from 'react';
import {Shirt, shirtPoint, ShirtParams} from '../art/Shirt';
import {Gripper} from '../art/Gripper';
import {Chip, Reveal, StepBar, Table, Txt, Viewfinder} from '../art/ui';
import {C, FONT} from '../lib/theme';
import {lerp, ramp} from '../lib/timing';
import {SceneProps, toWorld, XY} from './types';

const KEYPOINTS: {name: string; p: XY; hides?: number}[] = [
  {name: 'collar', p: [0, -168]},
  {name: 'sleeve', p: [-240, -76], hides: 51.45},
  {name: 'sleeve', p: [240, -76]},
  {name: 'hem', p: [-146, 210], hides: 51.9},
  {name: 'hem', p: [146, 210]},
];

export const See: React.FC<SceneProps> = ({T, v}) => {
  const unstable = ramp(T, 47.4, 48.2);
  const touch1 = ramp(T, 53.0, 53.5) * (1 - ramp(T, 54.0, 54.4));
  const touch2 = ramp(T, 54.5, 55.0);
  const p: ShirtParams = {
    t: T,
    wobble: 1.5 + 5 * unstable,
    wrinkle: 0.5 + 0.5 * ramp(T, 49.6, 50.3),
    bunch: 0.32 * ramp(T, 49.7, 50.6),
    bunchX: -40,
    foldL: 0.8 * ramp(T, 50.5, 51.4),
    pulls: [
      {x: 150, y: 120, dx: 70 * touch1, dy: -50 * touch1, r: 120},
      {x: 60, y: -150, dx: -60 * touch2, dy: 70 * touch2, r: 140},
    ],
  };
  const sx = v ? 540 : 1210;
  const sy = v ? 1000 : 620;
  const s = v ? 1.15 : 1.15;
  const show = ramp(T, 44.6, 45.3);

  // gripper touches the shirt twice
  const t1 = toWorld(sx, sy, s, shirtPoint(150, 120, p));
  const t2 = toWorld(sx, sy, s, shirtPoint(60, -150, p));
  const home: XY = v ? [880, 560] : [1640, 220];
  const g1 = ramp(T, 52.6, 53.1) * (1 - ramp(T, 54.0, 54.3));
  const g2 = ramp(T, 54.2, 54.6);
  const gp: XY =
    T < 54.1 ? [lerp(home[0], t1[0], g1), lerp(home[1], t1[1], g1)] : [lerp(home[0], t2[0], g2), lerp(home[1], t2[1], g2)];

  const vf = v ? {x: 50, y: 590, w: 980, h: 830} : {x: 650, y: 175, w: 1180, h: 840};

  const tags = [
    {t: 'WRINKLES', at: 49.75},
    {t: 'FOLDS', at: 50.55},
    {t: 'HIDES EDGES', at: 51.43},
    {t: 'CHANGES SHAPE', at: 52.9},
  ];

  return (
    <g>
      <Table x={vf.x + 20} y={vf.y + 20} w={vf.w - 40} h={vf.h - 40} />
      <Shirt id="see" x={sx} y={sy} scale={s} p={p} />
      <Gripper x={gp[0]} y={gp[1]} angle={v ? 30 : 32} open={0.6} scale={0.7} status="ok" />
      <Viewfinder x={vf.x} y={vf.y} w={vf.w} h={vf.h} T={T} opacity={ramp(T, 44.4, 44.9)} />
      {show > 0 &&
        KEYPOINTS.map((k, i) => {
          const jitter = unstable * 9;
          const [x, y] = toWorld(sx, sy, s, shirtPoint(k.p[0], k.p[1], p));
          const jx = x + jitter * Math.sin(T * 11 + i * 2);
          const jy = y + jitter * Math.cos(T * 13 + i);
          const hidden = k.hides ? ramp(T, k.hides, k.hides + 0.3) : 0;
          const col = hidden > 0.5 ? C.orange : C.cyan;
          return (
            <g key={i} opacity={show}>
              <circle cx={jx} cy={jy} r={20} fill="none" stroke={col} strokeWidth={3} strokeDasharray={hidden > 0.5 ? '6 6' : undefined} />
              <circle cx={jx} cy={jy} r={5} fill={col} opacity={1 - hidden} />
              {hidden > 0.5 ? (
                <text x={jx} y={jy + 9} textAnchor="middle" fontFamily={FONT} fontWeight={800} fontSize={26} fill={C.orange}>
                  ?
                </text>
              ) : null}
              <text
                x={jx + 28}
                y={jy - 18}
                fontFamily={FONT}
                fontWeight={700}
                fontSize={20}
                letterSpacing={2}
                fill={col}
                stroke={C.navy}
                strokeWidth={6}
                strokeLinejoin="round"
                paintOrder="stroke"
              >
                {hidden > 0.5 ? 'HIDDEN' : k.name.toUpperCase()}
              </text>
            </g>
          );
        })}
      {/* narration-led headlines */}
      <Reveal T={T} at={40.45} out={44.2}>
        {v ? (
          <Txt x={80} y={380} size={58} lines={[['For a robot, almost'], ['every part is ', {t: 'difficult.'}]]} />
        ) : (
          <Txt x={110} y={330} size={58} lines={[['For a robot,'], ['almost every'], ['part is ', {t: 'difficult.'}]]} />
        )}
      </Reveal>
      <Reveal T={T} at={44.45} out={47.25}>
        {v ? (
          <Txt x={80} y={380} size={58} lines={[['First, it has to'], [{t: 'see', c: C.cyan}, ' the shirt clearly.']]} />
        ) : (
          <Txt x={110} y={330} size={58} lines={[['First, it has'], ['to ', {t: 'see', c: C.cyan}, ' the shirt'], ['clearly.']]} />
        )}
      </Reveal>
      <Reveal T={T} at={47.47}>
        {v ? (
          <Txt x={80} y={380} size={58} lines={[['But cloth doesn’t'], [{t: 'stay still.'}]]} />
        ) : (
          <Txt x={110} y={330} size={58} lines={[['But cloth'], ['doesn’t'], [{t: 'stay still.'}]]} />
        )}
      </Reveal>
      {tags.map((tg, i) => (
        <Reveal key={tg.t} T={T} at={tg.at} dur={0.35}>
          {v ? (
            <Chip x={i % 2 === 0 ? 70 : 560} y={1500 + Math.floor(i / 2) * 80} text={tg.t} size={26} color={i >= 2 ? C.orange : C.cyan} />
          ) : (
            <Chip x={110} y={620 + i * 82} text={tg.t} size={26} color={i >= 2 ? C.orange : C.cyan} />
          )}
        </Reveal>
      ))}
      <StepBar x={v ? 540 : 960} y={v ? 230 : 90} gap={v ? 330 : 300} active={T < 44.4 ? -1 : 0} T={T} at={41.0} size={v ? 24 : 22} />
    </g>
  );
};
