import React from 'react';
import {Shirt, shirtPoint, ShirtParams} from '../art/Shirt';
import {Gripper} from '../art/Gripper';
import {Footnote, Reveal, Table, Txt} from '../art/ui';
import {C, DISPLAY, FONT} from '../lib/theme';
import {lerp, ramp} from '../lib/timing';
import {SceneProps, toWorld, XY} from './types';

// The robot gets better: a careful, complete fold, while perception,
// prediction and control converge into "physical intelligence".
export const Closing: React.FC<SceneProps> = ({T, W, H, v}) => {
  const fR = ramp(T, 98.6, 100.0);
  const fL = ramp(T, 100.3, 101.7);
  const fB = ramp(T, 102.0, 103.4);
  const p: ShirtParams = {t: T, wobble: 1.2, foldR: fR, foldL: fL, foldBottom: fB, wrinkle: 0.5};
  const sx = v ? 540 : 560;
  const sy = v ? 900 : 610;
  const s = v ? 1.05 : 1.0;
  const W_ = (x: number, y: number) => toWorld(sx, sy, s, shirtPoint(x, y, p));
  // gripper waypoints: right sleeve → left sleeve → hem → away
  let gp: XY;
  let open = 0.15;
  const R0 = W_(240, -76);
  const L0 = W_(-240, -76);
  const B0 = W_(0, 210);
  const home: XY = v ? [900, 520] : [800, 170];
  if (T < 100.0) gp = R0;
  else if (T < 100.3) {
    const k = ramp(T, 100.0, 100.3);
    gp = [lerp(R0[0], L0[0], k), lerp(R0[1], L0[1], k) - Math.sin(k * Math.PI) * 80];
    open = 0.7;
  } else if (T < 101.7) gp = L0;
  else if (T < 102.0) {
    const k = ramp(T, 101.7, 102.0);
    gp = [lerp(L0[0], B0[0], k), lerp(L0[1], B0[1], k) - Math.sin(k * Math.PI) * 80];
    open = 0.7;
  } else if (T < 103.4) gp = B0;
  else {
    const k = ramp(T, 103.4, 104.2);
    gp = [lerp(B0[0], home[0], k), lerp(B0[1], home[1], k)];
    open = lerp(0.15, 0.8, k);
  }
  const done = ramp(T, 103.4, 104.0);

  // converging rings
  const merge = ramp(T, 103.6, 105.0);
  const rc = v ? {x: 540, y: 1460, r: 95, gap: 150} : {x: 1440, y: 650, r: 120, gap: 170};
  const rings = [
    {t: 'SEE', c: C.cyan},
    {t: 'PREDICT', c: '#8FA6E8'},
    {t: 'CONTROL', c: C.orange},
  ];
  const ringsK = ramp(T, 98.6, 99.4);
  const endK = ramp(T, 107.0, 107.7);

  return (
    <g>
      <g opacity={1 - endK}>
        <Table x={v ? 60 : 90} y={v ? 560 : 260} w={v ? 960 : 940} h={v ? 680 : 720} />
        <Shirt id="cl" x={sx} y={sy} scale={s} p={p} />
        {done > 0 && (
          <circle cx={sx} cy={sy - 40 * s} r={150 + 30 * done} fill="none" stroke={C.cyan} strokeWidth={3} opacity={done * (1 - ramp(T, 104.5, 106))} />
        )}
        <Gripper x={gp[0]} y={gp[1]} angle={v ? 22 : 26} open={open} scale={0.72} status="ok" />
        <Reveal T={T} at={98.2}>
          {v ? (
            <Txt x={80} y={250} size={58} lines={[['The future isn’t just'], [{t: 'smarter AI.', c: C.cyan}]]} />
          ) : (
            <Txt x={1090} y={200} size={56} lines={[['The future isn’t just'], [{t: 'smarter AI.', c: C.cyan}]]} />
          )}
        </Reveal>
        <Reveal T={T} at={103.5}>
          {v ? (
            <Txt x={80} y={420} size={44} weight={600} lines={[['It’s machines that ', {t: 'handle', c: C.orange}], ['the chaos of the real world.']]} />
          ) : (
            <Txt x={1090} y={350} size={42} weight={600} lines={[['It’s machines that ', {t: 'handle', c: C.orange}], ['the chaos of the real world.']]} />
          )}
        </Reveal>
        {ringsK > 0 && (
          <g opacity={ringsK}>
            {rings.map((r, i) => {
              const off = (i - 1) * rc.gap * (1 - merge * 0.62);
              const cx = rc.x + off;
              return (
                <g key={r.t}>
                  <circle cx={cx} cy={rc.y} r={rc.r} fill={r.c} fillOpacity={0.08} stroke={r.c} strokeWidth={4} />
                  <text
                    x={rc.x + (i - 1) * rc.gap}
                    y={rc.y + (merge > 0.5 ? -rc.r - 22 : 9)}
                    textAnchor="middle"
                    fontFamily={FONT}
                    fontWeight={800}
                    fontSize={v ? 22 : 24}
                    letterSpacing={3}
                    fill={r.c}
                  >
                    {r.t}
                  </text>
                </g>
              );
            })}
            <text x={rc.x} y={rc.y + 12} textAnchor="middle" fontFamily={DISPLAY} fontWeight={800} fontSize={v ? 30 : 32} fill={C.white} opacity={ramp(T, 104.6, 105.3)}>
              PHYSICAL
            </text>
            <text x={rc.x} y={rc.y + (v ? 46 : 50)} textAnchor="middle" fontFamily={DISPLAY} fontWeight={800} fontSize={v ? 30 : 32} fill={C.white} opacity={ramp(T, 104.6, 105.3)}>
              INTELLIGENCE
            </text>
            <Footnote
              x={rc.x}
              y={rc.y + rc.r + (v ? 60 : 80)}
              anchor="middle"
              size={22}
              opacity={ramp(T, 105.2, 105.8)}
              text="Reliable perception + control in a changing world"
            />
          </g>
        )}
        <Reveal T={T} at={99.2}>
          <Footnote
            x={v ? 540 : 110}
            y={v ? 1300 : 1040}
            anchor={v ? 'middle' : 'start'}
            size={22}
            text="Robots already fold clothes in labs and demos — reliability everywhere is the frontier."
          />
        </Reveal>
      </g>
      {endK > 0 && (
        <g opacity={endK}>
          <text x={W / 2} y={H / 2 - 20} textAnchor="middle" fontFamily={DISPLAY} fontWeight={800} fontSize={v ? 96 : 104} fill={C.white}>
            Curio<tspan fill={C.cyan}>Vector</tspan>
          </text>
          <text x={W / 2} y={H / 2 + 50} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={v ? 36 : 36} letterSpacing={4} fill={C.orange}>
            BIG QUESTIONS. CLEAR ANSWERS.
          </text>
          <text x={W / 2} y={H / 2 + 130} textAnchor="middle" fontFamily={FONT} fontWeight={500} fontSize={22} fill={C.muted}>
            Sources: arXiv:2105.01767 · arXiv:2312.10419
          </text>
        </g>
      )}
    </g>
  );
};
