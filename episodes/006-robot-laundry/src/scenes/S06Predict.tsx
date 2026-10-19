import React from 'react';
import {Shirt, shirtPoint, ShirtParams} from '../art/Shirt';
import {Gripper} from '../art/Gripper';
import {Panel, Reveal, StepBar, Txt} from '../art/ui';
import {C, FONT} from '../lib/theme';
import {clamp, easeOut, ramp} from '../lib/timing';
import {SceneProps, toWorld, XY} from './types';

// One pull, three futures. Every branch starts from the same grasp point and
// the same pull vector; only the outcome differs.
const PULL: XY = [240, -76];

const outcome = (kind: number, T: number, k: number): {p: ShirtParams; dx: number; rot: number} => {
  const base: ShirtParams = {t: T, wobble: 2.5, wrinkle: 0.8};
  const pull = {x: PULL[0], y: PULL[1], dx: 50 * k, dy: -30 * k, r: 110};
  if (kind === 0) return {p: {...base, sleeveFlipR: 0.85 * k, pulls: [pull]}, dx: 0, rot: 0};
  if (kind === 1) return {p: {...base, bunch: 0.85 * k, bunchX: 150, pulls: [pull], wobble: 2.5 + 3 * k}, dx: 0, rot: 0};
  return {p: {...base, pulls: [{...pull, dx: 20 * k}]}, dx: 140 * k, rot: 8 * k};
};

const TITLES = ['Sleeve flips over', 'Fabric bunches up', 'Whole shirt slides'];
const AT = [60.75, 62.44, 64.01];

export const Predict: React.FC<SceneProps> = ({T, v}) => {
  // source shirt with the grasp
  const src = v ? {x: 470, y: 760, s: 0.78} : {x: 290, y: 640, s: 0.62};
  const sp: ShirtParams = {t: T, wobble: 1.5, wrinkle: 0.6};
  const grasp = toWorld(src.x, src.y, src.s, shirtPoint(PULL[0], PULL[1], sp));
  const arrowK = ramp(T, 59.7, 60.3, easeOut);
  const pullDir: XY = [0.85, -0.52];
  const arrowLen = (v ? 150 : 90) * arrowK;
  const tip: XY = [grasp[0] + pullDir[0] * (arrowLen + 40), grasp[1] + pullDir[1] * (arrowLen + 40)];

  const panels = [0, 1, 2].map((i) =>
    v ? {x: 40 + i * 340, y: 1080, w: 320, h: 520} : {x: 760 + i * 380, y: 300, w: 350, h: 600}
  );

  return (
    <g>
      <Reveal T={T} at={56.2} out={59.5}>
        {v ? (
          <Txt x={80} y={380} size={58} lines={[['Then it must ', {t: 'predict', c: C.orange}], ['what happens next.']]} />
        ) : (
          <Txt x={110} y={210} size={58} lines={[['Then it must ', {t: 'predict', c: C.orange}, ' what happens next.']]} />
        )}
      </Reveal>
      <Reveal T={T} at={59.72}>
        {v ? (
          <Txt x={80} y={380} size={58} lines={[['Same pull.'], [{t: 'Three', c: C.orange}, ' possible futures.']]} />
        ) : (
          <Txt x={110} y={210} size={58} lines={[['Same pull. ', {t: 'Three', c: C.orange}, ' possible futures.']]} />
        )}
      </Reveal>

      <Shirt id="pr" x={src.x} y={src.y} scale={src.s} p={sp} />
      <Gripper x={grasp[0]} y={grasp[1]} angle={34} open={0.15} scale={0.5} arm={500} />
      {arrowK > 0 && (
        <g>
          <line x1={grasp[0] + pullDir[0] * 40} y1={grasp[1] + pullDir[1] * 40} x2={tip[0]} y2={tip[1]} stroke={C.orange} strokeWidth={8} strokeLinecap="round" />
          <polygon
            points={`${tip[0] + pullDir[0] * 26},${tip[1] + pullDir[1] * 26} ${tip[0] - pullDir[1] * 16},${tip[1] + pullDir[0] * 16} ${tip[0] + pullDir[1] * 16},${tip[1] - pullDir[0] * 16}`}
            fill={C.orange}
          />
          <text x={tip[0] - (v ? 20 : 60)} y={tip[1] - (v ? 34 : 70)} fontFamily={FONT} fontWeight={800} fontSize={26} letterSpacing={3} fill={C.orange} opacity={arrowK}>
            PULL HERE?
          </text>
        </g>
      )}

      {panels.map((pn, i) => {
        const k = ramp(T, AT[i] - 0.2, AT[i] + 0.3, easeOut);
        if (k <= 0) return null;
        const local = T - AT[i];
        // loop: pull 1.2 s, hold 0.6 s, reset 0.4 s
        const cyc = ((local % 2.2) + 2.2) % 2.2;
        const kk = cyc < 1.2 ? easeOut(clamp(cyc / 1.2)) : cyc < 1.8 ? 1 : 1 - clamp((cyc - 1.8) / 0.4);
        const o = outcome(i, T, kk);
        const cs = v ? 0.44 : 0.47;
        const cx = pn.x + pn.w / 2 - 20 + (v ? 0 : 0);
        const cy = pn.y + (v ? 250 : 290);
        const g = toWorld(cx + o.dx * cs, cy, cs, shirtPoint(PULL[0], PULL[1], o.p));
        // branch line from the arrow tip
        const bx = pn.x + pn.w / 2;
        const by = pn.y;
        return (
          <g key={i} opacity={k}>
            <path
              d={v ? `M${tip[0]},${tip[1] + 30} C${tip[0]},${by - 120} ${bx},${by - 140} ${bx},${by}` : `M${tip[0] + 20},${tip[1] - 10} C${tip[0] + 160},${by - 150} ${bx},${by - 150} ${bx},${by}`}
              fill="none"
              stroke={C.orange}
              strokeOpacity={0.55}
              strokeWidth={3}
              strokeDasharray="8 8"
            />
            <Panel x={pn.x} y={pn.y} w={pn.w} h={pn.h} stroke={C.orange} />
            <defs>
              <clipPath id={`pc${i}`}>
                <rect x={pn.x} y={pn.y} width={pn.w} height={pn.h} rx={28} />
              </clipPath>
            </defs>
            <g clipPath={`url(#pc${i})`}>
              <Shirt id={`po${i}`} x={cx + o.dx * cs} y={cy} rotate={o.rot} scale={cs} p={o.p} />
              <Gripper x={g[0]} y={g[1]} angle={34} open={0.15} scale={0.36} arm={500} status={kk > 0.8 ? 'warn' : 'ok'} />
            </g>
            <text x={pn.x + 26} y={pn.y + pn.h - 70} fontFamily={FONT} fontSize={22} fontWeight={700} letterSpacing={4} fill={C.orange}>
              {`FUTURE ${String.fromCharCode(65 + i)}`}
            </text>
            <Txt x={pn.x + 26} y={pn.y + pn.h - 28} size={v ? 30 : 34} lines={[[TITLES[i]]]} />
          </g>
        );
      })}
      <StepBar x={v ? 540 : 960} y={v ? 230 : 90} gap={v ? 330 : 300} active={1} T={T} at={55.9} size={v ? 24 : 22} />
    </g>
  );
};
