import React from 'react';
import {Shirt, shirtPoint, ShirtParams} from '../art/Shirt';
import {Gripper} from '../art/Gripper';
import {Hand} from '../art/Hand';
import {Chip, Reveal, Table, Txt} from '../art/ui';
import {C} from '../lib/theme';
import {clamp, easeOut, lerp, ramp} from '../lib/timing';
import {SceneProps, toWorld, XY} from './types';

// Human: two quick folds. Robot: grabs a loose sleeve that flips back, then
// the hem — the whole shirt drags and bunches.
const humanParams = (T: number): ShirtParams => ({
  t: T,
  wobble: 1.2,
  foldL: ramp(T, 0.15, 0.95),
  foldR: ramp(T, 0.25, 1.05),
  foldBottom: ramp(T, 1.2, 1.95),
  wrinkle: 0.5,
});

const robotState = (T: number) => {
  // attempt 1: sleeve
  const grab1 = ramp(T, 0.45, 0.65);
  const lift1 = ramp(T, 0.65, 2.0);
  const slip1 = ramp(T, 2.05, 2.35, easeOut);
  // attempt 2: hem corner
  const grab2 = ramp(T, 2.9, 3.1);
  const lift2 = ramp(T, 3.1, 4.3);
  const slip2 = ramp(T, 4.35, 4.6, easeOut);
  const a1 = lift1 * (1 - slip1);
  const a2 = lift2 * (1 - slip2 * 0.6);
  const p: ShirtParams = {
    t: T,
    wobble: 3 + 7 * Math.max(slip1 * (1 - ramp(T, 2.4, 3.0)), slip2),
    sleeveFlipR: a1 * 0.62 + slip1 * 0.12 * (1 - ramp(T, 2.6, 3.2)),
    pulls: [
      {x: 236, y: -78, dx: -a1 * 90, dy: -a1 * 70, r: 120},
      {x: 140, y: 205, dx: a2 * 70, dy: -a2 * 40, r: 150},
    ],
    bunch: a2 * 0.55,
    bunchX: 120,
    wrinkle: 0.9,
  };
  const slide = lift2 * 70 - slip2 * 20;
  return {p, grab1, slip1, grab2, slip2, a1, a2, slide};
};

export const Hook: React.FC<SceneProps> = ({T, W, H, v}) => {
  // --- layout
  const hs = v ? 1.0 : 0.95; // human shirt scale
  const rs = v ? 1.0 : 0.95;
  const hx = v ? 540 : 470;
  const hy = v ? 560 : 610;
  const rx0 = v ? 520 : 1420;
  const ry = v ? 1385 : 630;

  const hp = humanParams(T);
  const handPhase = ramp(T, 1.0, 1.2);
  const lA = shirtPoint(-232, -80, hp);
  const lB = shirtPoint(-86, 206, hp);
  const rA = shirtPoint(232, -80, hp);
  const rB = shirtPoint(86, 206, hp);
  const lH = toWorld(hx, hy, hs, [lerp(lA[0], lB[0], handPhase), lerp(lA[1], lB[1], handPhase)]);
  const rH = toWorld(hx, hy, hs, [lerp(rA[0], rB[0], handPhase), lerp(rA[1], rB[1], handPhase)]);
  const retreat = ramp(T, 2.0, 2.6);

  const rs_ = robotState(T);
  const rx = rx0 + rs_.slide;
  const sleeveTip = toWorld(rx, ry, rs, shirtPoint(240, -76, rs_.p));
  const hemTip = toWorld(rx, ry, rs, shirtPoint(146, 206, rs_.p));
  // gripper path
  const home: XY = v ? [880, 1060] : [1700, 260];
  let gp: XY;
  let open = 0.9;
  if (T < 2.6) {
    const approach = ramp(T, 0.0, 0.5);
    gp = [lerp(home[0], sleeveTip[0], approach), lerp(home[1], sleeveTip[1], approach)];
    open = lerp(0.9, 0.15, rs_.grab1);
    if (rs_.slip1 > 0) {
      open = lerp(0.15, 0.9, rs_.slip1);
      gp = [sleeveTip[0] + rs_.slip1 * 40, sleeveTip[1] - rs_.slip1 * 90];
    }
  } else {
    const from: XY = [sleeveTip[0] + 40, sleeveTip[1] - 90];
    const approach = ramp(T, 2.5, 2.9);
    gp = [lerp(from[0], hemTip[0], approach), lerp(from[1], hemTip[1], approach)];
    open = lerp(0.9, 0.15, rs_.grab2);
    if (rs_.slip2 > 0) {
      open = lerp(0.15, 0.9, rs_.slip2);
      gp = [hemTip[0] + rs_.slip2 * 30, hemTip[1] - rs_.slip2 * 80];
    }
  }
  const slipBurst = Math.max(
    clamp(1 - Math.abs(T - 2.2) / 0.35),
    clamp(1 - Math.abs(T - 4.5) / 0.35)
  );
  const warn = slipBurst > 0.05;

  const humanClip = v ? {x: 0, y: 0, w: W, h: 951} : {x: 0, y: 0, w: W / 2 - 4, h: H};
  const robotClip = v ? {x: 0, y: 959, w: W, h: H - 959} : {x: W / 2 + 4, y: 0, w: W / 2, h: H};

  return (
    <g>
      <defs>
        <clipPath id="hookL">
          <rect x={humanClip.x} y={humanClip.y} width={humanClip.w} height={humanClip.h} />
        </clipPath>
        <clipPath id="hookR">
          <rect x={robotClip.x} y={robotClip.y} width={robotClip.w} height={robotClip.h} />
        </clipPath>
      </defs>
      {/* HUMAN half */}
      <g clipPath="url(#hookL)">
        <Table x={v ? 50 : 50} y={v ? 160 : 290} w={v ? 980 : 860} h={v ? 760 : 720} />
        <Shirt id="hkH" x={hx} y={hy} scale={hs} p={hp} />
        <g opacity={1 - retreat} transform={`translate(0,${retreat * 160})`}>
          <Hand x={lH[0]} y={lH[1]} angle={28} scale={0.78 * hs} pinch={0.55} flip />
          <Hand x={rH[0]} y={rH[1]} angle={-28} scale={0.78 * hs} pinch={0.55} />
        </g>
      </g>
      {/* ROBOT half */}
      <g clipPath="url(#hookR)">
        <Table x={v ? 50 : 1010} y={v ? 990 : 290} w={v ? 980 : 860} h={v ? 720 : 720} />
        <Shirt id="hkR" x={rx} y={ry} scale={rs} p={rs_.p} />
        {slipBurst > 0.02 && (
          <g opacity={slipBurst}>
            {[0, 1, 2, 3, 4].map((i) => {
              const a = (i / 5) * Math.PI * 2 + 0.4;
              const r1 = 40 + 20 * (1 - slipBurst);
              const r2 = 75 + 30 * (1 - slipBurst);
              return (
                <line
                  key={i}
                  x1={gp[0] + Math.cos(a) * r1}
                  y1={gp[1] + Math.sin(a) * r1}
                  x2={gp[0] + Math.cos(a) * r2}
                  y2={gp[1] + Math.sin(a) * r2}
                  stroke={C.orange}
                  strokeWidth={6}
                  strokeLinecap="round"
                />
              );
            })}
          </g>
        )}
        <Gripper x={gp[0]} y={gp[1]} angle={v ? 28 : 24} open={open} scale={0.8} status={warn ? 'warn' : 'ok'} />
      </g>
      {/* divider */}
      {v ? (
        <line x1={60} x2={W - 60} y1={955} y2={955} stroke={C.cyan} strokeOpacity={0.5} strokeWidth={3} />
      ) : (
        <line x1={W / 2} x2={W / 2} y1={80} y2={H - 80} stroke={C.cyan} strokeOpacity={0.5} strokeWidth={3} />
      )}
      {/* labels */}
      <Chip x={v ? 90 : 80} y={v ? 220 : 110} text="HUMAN" color={C.cyan} size={v ? 26 : 24} />
      <Chip x={v ? 90 : W / 2 + 70} y={v ? 1050 : 110} text="ROBOT" color={C.orange} size={v ? 26 : 24} />
      <Reveal T={T} at={0.25}>
        <Txt x={v ? W - 70 : W / 2 - 70} y={v ? 246 : 128} anchor="end" size={v ? 76 : 72} lines={[['Seconds.']]} />
      </Reveal>
      <Reveal T={T} at={2.6}>
        <Txt
          x={v ? W - 70 : W - 70}
          y={v ? 1076 : 128}
          anchor="end"
          size={v ? 76 : 72}
          lines={[[{t: 'A nightmare.'}]]}
        />
      </Reveal>
    </g>
  );
};
