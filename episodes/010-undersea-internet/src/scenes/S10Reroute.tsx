import React from 'react';
import {T} from '../timing';
import {Bg, C, Em, Glow, GlowLine, Headline, P, Svg, Tag, ramp, smooth, useLay} from '../lib';

const blob = (cx: number, cy: number, rx: number, ry: number, seed: number, n = 14): string => {
  const pts: P[] = Array.from({length: n}, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    const k = 1 + 0.12 * Math.sin(a * 3 + seed) + 0.07 * Math.sin(a * 5 + seed * 2);
    return [cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k];
  });
  return `${smooth([...pts, pts[0], pts[1]]).replace(/ C[^C]*$/, '')} Z`;
};

// 85.2–93.9 s · networks reroute around a break; places with few alternatives can go dark.
export const Reroute: React.FC<{t: number}> = ({t}) => {
  const {w: W, h: H, tall} = useLay();
  const re = ramp(t, T.reroute + 0.4, T.reroute + 1.4);
  const out = ramp(t, T.outage + 0.7, T.outage + 1.0);
  const dark = ramp(t, T.outage + 1.0, T.outage + 2.2);

  // geometry
  const landA = tall ? blob(540, 660, 720, 170, 1) : blob(80, 600, 330, 560, 1);
  const landB = tall ? blob(540, 1640, 720, 260, 4) : blob(1840, 560, 330, 560, 4);
  const island: P = tall ? [930, 1110] : [1010, 960];
  const islandD = blob(island[0], island[1], tall ? 110 : 140, tall ? 60 : 55, 7, 10);
  type Cab = {d: string; mid: P};
  const cab = (a: P, c: P, b: P): Cab => ({d: `M${a[0]},${a[1]} Q${c[0]},${c[1]} ${b[0]},${b[1]}`, mid: [(a[0] + 2 * c[0] + b[0]) / 4, (a[1] + 2 * c[1] + b[1]) / 4]});
  const cables: Cab[] = tall
    ? [cab([180, 760], [120, 1100], [200, 1420]), cab([420, 780], [440, 1100], [420, 1420]), cab([660, 770], [760, 1100], [660, 1420])]
    : [cab([380, 380], [960, 220], [1540, 380]), cab([400, 600], [960, 560], [1520, 600]), cab([380, 790], [960, 820], [1540, 780])];
  const islandCable = tall ? cab([island[0] - 20, island[1] + 50], [960, 1300], [900, 1440]) : cab([island[0] + 130, island[1] - 10], [1350, 990], [1560, 880]);
  const brk = cables[1].mid;
  const ibrk: P = tall ? [948, 1280] : [1340, 950];
  const lightsA: P[] = tall
    ? [[150, 600], [300, 650], [470, 590], [620, 660], [800, 610], [930, 670], [380, 720]]
    : [[100, 300], [200, 420], [120, 560], [240, 700], [90, 820], [260, 520], [180, 900]];
  const lightsB: P[] = tall
    ? [[160, 1560], [330, 1520], [520, 1580], [700, 1530], [880, 1590], [420, 1650]]
    : [[1700, 300], [1820, 420], [1720, 560], [1830, 700], [1700, 830], [1800, 920]];
  const lightsI: P[] = Array.from({length: 6}, (_, i) => [island[0] - 60 + i * 24, island[1] - 6 + (i % 2) * 14]);
  const sz = tall ? 30 : 26;

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <Bg kind="studio" />
      <Svg>
        <rect x={0} y={0} width={W} height={H} fill="#0A2A57" opacity={0.25} />
        <path d={landA} fill="url(#g-land)" stroke="#5B86C2" strokeWidth={3} />
        <path d={landB} fill="url(#g-land)" stroke="#5B86C2" strokeWidth={3} />
        <path d={islandD} fill="url(#g-land)" stroke="#5B86C2" strokeWidth={3} />
        {[...lightsA, ...lightsB].map(([x, y], i) => (
          <g key={i}>
            <Glow x={x} y={y} r={26} color={i % 3 ? 'or' : 'wh'} />
            <circle cx={x} cy={y} r={5} fill="#FFE0B0" />
          </g>
        ))}
        {lightsI.map(([x, y], i) => (
          <g key={i} opacity={1 - dark * (0.85 + 0.02 * i)}>
            <Glow x={x} y={y} r={24} color="or" />
            <circle cx={x} cy={y} r={4.5} fill="#FFE0B0" />
          </g>
        ))}
        {/* cables: the broken middle one, and the two that take over */}
        {cables.map((c, i) =>
          i === 1 ? (
            <g key={i}>
              <path d={c.d} fill="none" stroke="#4A5D80" strokeWidth={6} strokeDasharray="2 10" strokeLinecap="round" />
              <g transform={`translate(${brk[0]} ${brk[1]})`}>
                <Glow x={0} y={0} r={110} color="or" o={0.8} />
                <path d="M-24,-24 L24,24 M24,-24 L-24,24" stroke={C.orange} strokeWidth={10} strokeLinecap="round" />
              </g>
            </g>
          ) : (
            <GlowLine
              key={i}
              d={c.d}
              w={5 + 3 * re}
              pulses={{t, speed: 0.22 + 0.16 * re, len: 0.025 + 0.02 * re, gap: 0.1 - 0.05 * re}}
              halo={1 + 0.5 * re}
            />
          ),
        )}
        <GlowLine
          d={islandCable.d}
          w={5}
          color={out > 0.5 ? '#4A5D80' : C.cyan}
          halo={1 - out}
          pulses={out > 0.5 ? undefined : {t, speed: 0.25, len: 0.03, gap: 0.1}}
          o={ramp(t, T.outage - 0.2, T.outage + 0.3)}
        />
        <g opacity={out}>
          <Glow x={ibrk[0]} y={ibrk[1]} r={110} color="or" />
          <path transform={`translate(${ibrk[0]} ${ibrk[1]})`} d="M-22,-22 L22,22 M22,-22 L-22,22" stroke={C.orange} strokeWidth={10} strokeLinecap="round" />
        </g>
        <Tag x={tall ? 540 : 960} y={tall ? 1000 : 160 + 340} text="TRAFFIC REROUTES" size={sz} color={C.cyan} o={ramp(t, T.reroute + 0.9, T.reroute + 1.4) * (1 - ramp(t, T.outage, T.outage + 0.4))} />
        <Tag
          x={tall ? 760 : island[0]}
          y={tall ? island[1] - 110 : island[1] + 90}
          text={tall ? 'ONE CABLE → OUTAGE' : 'ONLY ONE CABLE → OUTAGE'}
          size={sz}
          color={C.orange}
          o={ramp(t, T.outage + 1.4, T.outage + 1.9)}
        />
      </Svg>
      <Headline
        t={t}
        a={T.reroute}
        b={T.outage}
        lines={tall ? [<>Networks often</>, <><Em>reroute</Em> data</>] : [<>Networks often <Em>reroute</Em> data</>]}
        sub="…through other connections"
        wide={{size: 70, y: 70, width: 1700}}
        tall={{size: 86, y: 150}}
      />
      <Headline
        t={t}
        a={T.outage}
        b={T.notCloud + 0.3}
        lines={tall ? [<>Few alternatives?</>, <>Major <Em>outages</Em></>] : [<>Few alternatives? Major <Em>outages</Em></>]}
        wide={{size: 70, y: 70, width: 1700}}
        tall={{size: 86, y: 150}}
      />
    </div>
  );
};
