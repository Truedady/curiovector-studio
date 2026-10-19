import React from 'react';
import {Shirt, ShirtParams} from '../art/Shirt';
import {Chip, Reveal, Table, Txt} from '../art/ui';
import {C} from '../lib/theme';
import {ramp} from '../lib/timing';
import {SceneProps} from './types';

export const Question: React.FC<SceneProps> = ({T, v}) => {
  const reveal = ramp(T, 26.3, 27.2);
  const tug = Math.sin((T - 26.3) * 1.6) * reveal;
  const p: ShirtParams = {
    t: T,
    wobble: 1.5 + 4 * reveal,
    pulls: [
      {x: 230, y: -80, dx: 60 * tug, dy: -40 * tug, r: 130},
      {x: -120, y: 200, dx: -40 * tug, dy: 50 * Math.abs(tug), r: 150},
    ],
    bunch: 0.25 * reveal * (0.5 + 0.5 * Math.sin((T - 26.3) * 0.9)),
    wrinkle: 0.6 + 0.4 * reveal,
  };
  const answer = Math.min(ramp(T, 24.55, 24.9), 1 - ramp(T, 26.0, 26.3));
  const push = ramp(T, 18.5, 28.8);
  const sx = v ? 540 : 1340;
  const sy = v ? 1120 : 600;
  const sc = (v ? 1.3 : 1.15) * (1 + 0.06 * push);
  return (
    <g>
      <Table x={v ? 40 : 880} y={v ? 800 : 230} w={v ? 1000 : 940} h={v ? 680 : 740} />
      <Shirt id="q" x={sx} y={sy} scale={sc} p={p} mesh={reveal} />
      <Reveal T={T} at={27.0}>
        <Chip x={v ? 540 : 1340} y={v ? 1560 : 1010} anchor="middle" text="COUNTLESS POSSIBLE SHAPES" color={C.cyan} size={v ? 26 : 24} />
      </Reveal>
      <Reveal T={T} at={18.6}>
        {v ? (
          <Txt x={80} y={290} size={78} lines={[['So why is folding'], [{t: 'laundry'}, ' still so'], ['hard for robots?']]} />
        ) : (
          <Txt x={120} y={330} size={80} lines={[['So why is folding'], [{t: 'laundry'}, ' still so'], ['hard for robots?']]} />
        )}
      </Reveal>
      {answer > 0 && (
        <g opacity={answer}>
          <Txt x={v ? 80 : 120} y={v ? 640 : 700} size={v ? 50 : 48} color={C.cyan} lines={[['The answer is simple.']]} />
        </g>
      )}
      <Reveal T={T} at={26.28}>
        {v ? (
          <Txt x={80} y={630} size={56} lines={[['A T-shirt is much harder'], ['than it ', {t: 'looks.', c: C.cyan}]]} />
        ) : (
          <Txt x={120} y={700} size={56} lines={[['A T-shirt is much harder'], ['than it ', {t: 'looks.', c: C.cyan}]]} />
        )}
      </Reveal>
    </g>
  );
};
