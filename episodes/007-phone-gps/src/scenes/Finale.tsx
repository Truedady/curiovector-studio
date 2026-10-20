import React from 'react';
import {ClockFace, Phone, Satellite} from '../art';
import {C, EASE_IO, Fill, Glow, Headline, Rings, Svg, map, pick, rise, useL} from '../lib';
import {CUE} from '../timing';

// 87.2–97.5 s: the blue dot. Push into it until only the dot floats in the dark,
// with signal geometry converging on it and satellite clocks circling.
export const Finale: React.FC<{t: number}> = ({t}) => {
  const L = useL();
  const cx = L.W / 2;
  const cy = pick(L, 560, 820);

  // Phone geometry: we push into the blue dot on its screen.
  const w = pick(L, 330, 420);
  const h = w * 2.08;
  const bez = w * 0.045;
  const dotOffX = 0; // dot is horizontally centred on the screen
  const dotOffY = -h / 2 + bez + ((h - 2 * bez) * 470) / 840; // relative to phone centre
  const phoneX = cx - dotOffX;
  const phoneY = cy - dotOffY;

  const push = map(t, [CUE.noSatellite - 0.8, CUE.noSatellite + 1.0], [1, 5.5], EASE_IO);
  const phoneO = 1 - rise(t, CUE.noSatellite + 0.2, 0.7);
  const dotO = rise(t, CUE.noSatellite + 0.3, 0.6);
  const sats = rise(t, CUE.noSatellite + 0.5, 0.8) * (1 - rise(t, CUE.clocksInSpace, 0.8) * 0.6);
  const conv = rise(t, CUE.foundItself, 1.6);
  const clocks = rise(t, CUE.clocksInSpace + 0.1, 0.8);
  const breathe = 1 + 0.06 * Math.sin(t * 2.6);

  const ringR = pick(L, 430, 400);
  const satPos = [0, 1, 2, 3, 4].map((i) => {
    const a = ((-90 + i * 72 + (t - 90) * 4) * Math.PI) / 180;
    return {x: cx + Math.cos(a) * ringR * pick(L, 1.75, 1.15), y: cy + Math.sin(a) * ringR * pick(L, 0.95, 1.25)};
  });

  return (
    <Fill>
      {/* phone, pushing into the dot */}
      {phoneO > 0.002 && (
        <div style={{position: 'absolute', inset: 0, transform: `scale(${push})`, transformOrigin: `${cx}px ${cy}px`, opacity: phoneO}}>
          <Phone
            x={phoneX}
            y={phoneY}
            w={w}
            s={{noService: 1, mapFail: 1, coords: 0, dot: 1, pulse: t}}
            glow={0.8}
          />
        </div>
      )}

      {/* satellites around, rings travelling inward toward the dot */}
      {sats > 0.002 && (
        <>
          <Svg>
            {satPos.map((s, i) => (
              <line key={i} x1={s.x} y1={s.y} x2={cx} y2={cy} stroke={C.cyan} strokeWidth={2} strokeDasharray="3 12" opacity={sats * 0.55} />
            ))}
          </Svg>
          {satPos.map((s, i) => (
            <Satellite key={i} id={`fn${i}`} t={t} x={s.x} y={s.y} scale={0.38} glow={0.35} opacity={sats} rot={i * 9 - 18} />
          ))}
        </>
      )}

      {/* converging range circles = the hero geometry */}
      {conv > 0 && (
        <Svg>
          {satPos.map((s, i) => {
            const d = Math.hypot(s.x - cx, s.y - cy);
            return (
              <circle
                key={i}
                cx={s.x}
                cy={s.y}
                r={d + (1 - conv) * 120}
                fill="none"
                stroke={i % 2 ? C.cyan : C.orange}
                strokeWidth={2.5}
                opacity={0.55 * (1 - clocks * 0.5)}
              />
            );
          })}
        </Svg>
      )}

      {/* the dot */}
      {dotO > 0 && (
        <>
          <Glow x={cx} y={cy} size={pick(L, 620, 700) * breathe} color="blue" opacity={dotO} />
          <Svg>
            <Rings t={t} x={cx} y={cy} maxR={pick(L, 220, 260)} period={2.4} count={2} color={C.blue} opacity={dotO * 0.8} width={4} />
            <circle cx={cx} cy={cy} r={58} fill={C.white} opacity={dotO} />
            <circle cx={cx} cy={cy} r={44} fill={C.blue} opacity={dotO} />
          </Svg>
        </>
      )}

      {/* ring of satellite clocks */}
      {clocks > 0 && (
        <Svg>
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const a = ((i * 60 - 90 + (t - 95) * 10) * Math.PI) / 180;
            const R = pick(L, 300, 300) + (1 - clocks) * 60;
            return (
              <g key={i} opacity={clocks}>
                <ClockFace x={cx + Math.cos(a) * R * pick(L, 1.25, 1)} y={cy + Math.sin(a) * R} r={34} color={C.cyan} angle={(Math.floor(t * 4) / 4) * 6 * 6} />
              </g>
            );
          })}
        </Svg>
      )}

      <Headline t={t} at={CUE.nextTime} out={CUE.noSatellite} x={pick(L, 110, 70)} y={pick(L, 90, 190)} size={pick(L, 64, 68)} width={pick(L, 560, 940)} text="Next time you see that *tiny blue dot…*" />
      <Headline t={t} at={CUE.noSatellite} out={CUE.foundItself} x={cx} y={pick(L, 880, 1420)} size={pick(L, 72, 74)} width={pick(L, 1600, 940)} align="center" text="No satellite had to *find you.*" />
      <Headline t={t} at={CUE.foundItself} x={cx} y={pick(L, 840, 1330)} size={pick(L, 104, 104)} width={pick(L, 1700, 960)} align="center" weight={900} text="YOUR PHONE *FOUND ITSELF.*" />
      <Headline t={t} at={CUE.clocksInSpace} x={cx} y={pick(L, 970, 1560)} size={pick(L, 40, 44)} width={pick(L, 1600, 940)} align="center" weight={700} color={C.cyan} lift={14} text="…by listening to clocks in space." />
    </Fill>
  );
};
