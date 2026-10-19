import React from 'react';
import {Shirt, shirtPoint, ShirtParams} from '../art/Shirt';
import {Gripper} from '../art/Gripper';
import {Chip, Panel, Reveal, StepBar, Table, Txt} from '../art/ui';
import {C, FONT} from '../lib/theme';
import {clamp, lerp, ramp} from '../lib/timing';
import {SceneProps, toWorld, XY} from './types';

// Run A (68.3–70.6): every parameter inside its band → the fold lands.
// Run B (70.9–73.4): angle nudged just outside its band → the sleeve slips.
const RUN_B = 70.9;

const SLIDERS = [
  {name: 'GRIP', a: 0.48, b: 0.5},
  {name: 'FRICTION', a: 0.55, b: 0.55},
  {name: 'ANGLE', a: 0.5, b: 0.68},
  {name: 'TENSION', a: 0.46, b: 0.47},
  {name: 'FORCE', a: 0.52, b: 0.53},
];

export const Control: React.FC<SceneProps> = ({T, v}) => {
  const runB = T >= RUN_B - 0.3;
  const rewind = ramp(T, 70.55, 70.85);
  const foldA = ramp(T, 68.4, 70.2) * (1 - rewind);
  const upB = ramp(T, 71.0, 72.1);
  const slipB = ramp(T, 72.15, 72.5);
  const foldB = 0.62 * upB * (1 - slipB) + 0.12 * slipB;
  const f = runB ? foldB : foldA;
  const p: ShirtParams = {
    t: T,
    wobble: 1.5 + 6 * slipB * (1 - ramp(T, 73.2, 74.5)),
    foldR: f,
    bunch: 0.45 * slipB,
    bunchX: 120,
    wrinkle: 0.7,
  };
  const sx = v ? 520 : 700;
  const sy = v ? 860 : 620;
  const s = v ? 1.05 : 1.05;
  const tipW = toWorld(sx, sy, s, shirtPoint(240, -76, p));
  const lifted: XY = [tipW[0] + 30, tipW[1] - 110];
  const release = runB ? slipB : ramp(T, 70.25, 70.5);
  const gp: XY = [lerp(tipW[0], lifted[0], release), lerp(tipW[1], lifted[1], release)];
  const success = T > 70.2 && T < 70.6;
  const fail = slipB > 0.5;

  const panel = v ? {x: 60, y: 1250, w: 960, h: 420} : {x: 1230, y: 250, w: 600, h: 640};
  const sliderK = ramp(T, 66.2, 66.9);

  return (
    <g>
      <Reveal T={T} at={66.08} out={73.3}>
        {v ? (
          <Txt x={80} y={380} size={58} lines={[['Then comes ', {t: 'control.', c: C.orange}]]} />
        ) : (
          <Txt x={110} y={210} size={58} lines={[['Then comes ', {t: 'control.', c: C.orange}]]} />
        )}
      </Reveal>
      <Reveal T={T} at={73.54}>
        <Txt x={v ? 80 : 110} y={v ? 380 : 210} size={58} lines={[['That’s the ', {t: 'real challenge.'}]]} />
      </Reveal>
      <Table x={v ? 40 : 90} y={v ? 470 : 290} w={v ? 1000 : 1090} h={v ? 740 : 700} />
      <Shirt id="ct" x={sx} y={sy} scale={s} p={p} />
      <Gripper x={gp[0]} y={gp[1]} angle={30} open={lerp(0.15, 0.8, release)} scale={0.72} status={fail ? 'warn' : 'ok'} />
      {success && <Chip x={sx} y={sy + 300 * s} anchor="middle" text="✓ FOLD LANDS" color={C.cyan} filled />}
      {fail && <Chip x={sx} y={sy + 300 * s} anchor="middle" text="✗ SLEEVE SLIPS" color={C.orange} filled />}

      {sliderK > 0 && (
        <g opacity={sliderK}>
          <Panel x={panel.x} y={panel.y} w={panel.w} h={panel.h} />
          <text x={panel.x + 36} y={panel.y + 56} fontFamily={FONT} fontSize={22} fontWeight={700} letterSpacing={4} fill={C.muted}>
            {runB ? 'TRY 2 · ANGLE +4°' : 'TRY 1'}
          </text>
          {SLIDERS.map((sl, i) => {
            const rowH = (panel.h - 90) / SLIDERS.length;
            const y = panel.y + 100 + i * rowH;
            const x0 = panel.x + (v ? 230 : 200);
            const x1 = panel.x + panel.w - 40;
            const val = lerp(sl.a, sl.b, ramp(T, RUN_B - 0.3, RUN_B + 0.2));
            const out = val > 0.6;
            const named = ['GRIP', 'ANGLE', 'FORCE'].includes(sl.name);
            const hl = named ? clamp(1 - Math.abs(T - (sl.name === 'GRIP' ? 69.6 : sl.name === 'ANGLE' ? 70.1 : 70.8)) / 0.6) : 0;
            return (
              <g key={sl.name}>
                <text x={panel.x + 36} y={y + 9} fontFamily={FONT} fontSize={v ? 26 : 24} fontWeight={700} letterSpacing={3} fill={hl > 0.1 ? C.white : C.muted}>
                  {sl.name}
                </text>
                <rect x={x0} y={y - 6} width={x1 - x0} height={12} rx={6} fill="#1B2B5E" />
                <rect x={lerp(x0, x1, 0.4)} y={y - 6} width={(x1 - x0) * 0.2} height={12} rx={6} fill={C.cyan} opacity={0.45} />
                <circle cx={lerp(x0, x1, val)} cy={y} r={14 + 4 * hl} fill={out ? C.orange : C.white} stroke={out ? C.orange : C.cyan} strokeWidth={4} />
              </g>
            );
          })}
          <text x={panel.x + panel.w - 40} y={panel.y + 56} textAnchor="end" fontFamily={FONT} fontSize={20} fontWeight={600} fill={C.cyan} opacity={0.8}>
            ▬ SAFE BAND
          </text>
        </g>
      )}
      <StepBar x={v ? 540 : 960} y={v ? 230 : 90} gap={v ? 330 : 300} active={2} T={T} at={65.8} size={v ? 24 : 22} />
    </g>
  );
};
