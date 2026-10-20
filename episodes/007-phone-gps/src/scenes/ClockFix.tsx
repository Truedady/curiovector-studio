import React from 'react';
import {ClockFace, MiniPhone, Satellite} from '../art';
import {geometry} from '../geom';
import {C, EASE_IO, Earth, Fill, Glow, Headline, Svg, Tag, pick, rise, useL} from '../lib';
import {CUE} from '../timing';
import {RangeCircle, SphereDefs} from './Spheres';

// 54.65–70.5 s: the receiver's cheap clock is the real problem. One shared clock
// error inflates EVERY range equally, so the circles miss each other; a 4th satellite
// gives a 4th equation, and solving x, y, z + Δt makes all ranges meet at one point.
export const ClockFix: React.FC<{t: number}> = ({t}) => {
  const L = useL();
  const P = L.P;
  const g = geometry(L);

  const partA = rise(t, 54.65, 0.4) * (1 - rise(t, CUE.four - 0.3, 0.5, EASE_IO));
  const partB = rise(t, CUE.four - 0.1, 0.6);

  // --- Part A: atomic vs quartz -------------------------------------------------------
  const atomicA = (Math.floor((t - 54) * 4) / 4) * 6; // seconds hand, ticking 4×/s
  const drift = rise(t, CUE.atomic + 0.8, 2.5) * 26;
  const quartzA = atomicA + drift + Math.sin(t * 9) * 2.5;
  const clk = pick(L, {r: 190, ax: 650, bx: 1270, y: 500}, {r: 185, ax: 290, bx: 790, y: 760});

  // --- Part B: biased ranges then solved ------------------------------------------------
  const bias0 = pick(L, 85, 70);
  const solve = rise(t, CUE.whereItIs + 0.1, 2.0, EASE_IO);
  const bias = bias0 * (1 - solve);
  const grow = rise(t, CUE.four - 0.1, 1.2);
  const s4 = rise(t, CUE.four + 1.4, 1.0);
  const lock = rise(t, CUE.whereItIs + 1.9, 0.5);
  const fixClock = rise(t, CUE.clockOff + 0.9, 0.5);
  const ms = Math.round(1 * (1 - fixClock));

  const hx = pick(L, 110, 70);
  const hs = pick(L, 64, 68);
  const hw = pick(L, 1100, 940);

  return (
    <Fill>
      {/* ---------------- Part A ---------------- */}
      {partA > 0.002 && (
        <div style={{position: 'absolute', inset: 0, opacity: partA}}>
          <Glow x={clk.ax} y={clk.y} size={clk.r * 4} color="cyan" opacity={0.45} />
          <Glow x={clk.bx} y={clk.y} size={clk.r * 4} color="orange" opacity={0.35} />
          <Svg>
            <ClockFace x={clk.ax} y={clk.y} r={clk.r} color={C.cyan} angle={atomicA} label="ATOMIC CLOCK" sub="in every GPS satellite" />
            <ClockFace x={clk.bx} y={clk.y} r={clk.r} color={C.orange} angle={quartzA} label={P ? 'PHONE CLOCK' : "YOUR PHONE'S CLOCK"} sub="a cheap quartz crystal" />
          </Svg>
          <Tag t={t} at={CUE.atomic + 0.4} x={clk.ax} y={clk.y - clk.r - pick(L, 50, 46)} text="ultra-precise" color={C.cyan} size={pick(L, 24, 26)} />
          <Tag t={t} at={CUE.atomic + 1.2} x={clk.bx} y={clk.y - clk.r - pick(L, 50, 46)} text="drifts" color={C.orange} size={pick(L, 24, 26)} />
          <Tag
            t={t}
            at={CUE.atomic + 2.0}
            x={pick(L, 960, 540)}
            y={pick(L, 960, 1260)}
            text={P ? '1/1000 s off → ≈ *300 km* off' : 'just 1/1000 of a second off → distances off by ≈ *300 km*'}
            color={C.white}
            size={pick(L, 30, 32)}
          />
          <Headline t={t} at={CUE.problem} out={CUE.four} x={hx} y={pick(L, 80, 190)} size={hs} width={hw} text="But your phone has a *problem*: its clock." />
        </div>
      )}

      {/* ---------------- Part B ---------------- */}
      {partB > 0.002 && (
        <div style={{position: 'absolute', inset: 0, opacity: partB}}>
          <Earth cx={g.earth.cx} cy={g.earth.cy} r={g.earth.r} />
          <Svg>
            <SphereDefs />
            {g.sats.map((s, i) => (
              <RangeCircle
                key={i}
                x={s.x}
                y={s.y}
                r={g.radii[i] + bias}
                k={i < 3 ? grow : s4}
                color={solve > 0.98 ? C.cyan : i === 3 ? C.orange : C.cyan}
                dim={0.85}
              />
            ))}
            <MiniPhone x={g.P.x} y={g.P.y + 36 * pick(L, 1.1, 1.3)} s={pick(L, 1.1, 1.3)} lit={lock} />
          </Svg>
          <Glow x={g.P.x} y={g.P.y} size={260} color="blue" opacity={lock} />
          <Svg>
            <circle cx={g.P.x} cy={g.P.y} r={14 + 6 * lock} fill={C.white} opacity={lock} />
            <circle cx={g.P.x} cy={g.P.y} r={10 + 4 * lock} fill={C.blue} opacity={lock} />
          </Svg>
          {g.sats.map((s, i) => (
            <Satellite key={i} id={`cf${i}`} t={t} x={s.x} y={s.y} scale={pick(L, 0.48, 0.5)} opacity={i < 3 ? 1 : s4} glow={0.5} />
          ))}
          <Tag t={t} at={CUE.four + 2.4} out={CUE.whereItIs + 0.4} x={g.P.x} y={g.P.y - pick(L, 170, 190)} text="ranges don't quite meet" color={C.orange} size={pick(L, 24, 26)} />
          <Tag
            t={t}
            at={CUE.clockOff + 1.0}
            x={g.P.x}
            y={g.P.y - pick(L, 170, 190)}
            text={`phone clock: 09:41:07.00${ms} → fixed`}
            color={C.cyan}
            size={pick(L, 24, 26)}
          />

          <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: pick(L, 300, 560), background: 'linear-gradient(180deg, rgba(8,19,47,0) 0%, rgba(8,19,47,0.8) 55%)'}} />
          <Headline
            t={t}
            at={CUE.four}
            out={70.45}
            x={hx}
            y={pick(L, 870, 190)}
            size={pick(L, 56, 68)}
            width={pick(L, 960, 940)}
            text="*Four* satellites solve *two mysteries* at once:"
          />
          <Tag t={t} at={CUE.whereItIs} x={pick(L, 1180, 70)} y={pick(L, 900, 1470)} text="① where it is · _x, y, z_" color={C.cyan} size={pick(L, 28, 32)} anchor="left" />
          <Tag t={t} at={CUE.clockOff} x={pick(L, 1180, 70)} y={pick(L, 985, 1560)} text="② its clock error · _Δt_" color={C.orange} size={pick(L, 28, 32)} anchor="left" />
        </div>
      )}
    </Fill>
  );
};
