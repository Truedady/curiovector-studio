import React from 'react';
import {Satellite} from '../art';
import {Globe, WorldMap} from '../globe';
import {T} from '../timing';
import {Bg, C, Em, FONT, Headline, Svg, ramp, useLay} from '../lib';

// 61.5–67.1 s · hundreds of cable systems link the continents → "why not just use satellites?"
export const Network: React.FC<{t: number}> = ({t}) => {
  const {w: W, tall} = useLay();
  const draw = ramp(t, T.hundreds, T.hundreds + 3.2);
  const sat = ramp(t, T.whySat - 0.1, T.whySat + 0.6);
  const sats = [0, 1, 2];
  return (
    <div style={{position: 'absolute', inset: 0}}>
      <Bg kind="space" />
      <Svg>
        {tall ? (
          <g>
            <Globe cx={540} cy={1140} r={480} lon={-35 + (t - T.hundreds) * 3} lat={22} t={t} draw={draw} cableW={3.4} dim={sat} />
            {sats.map((i) => {
              const a = (t - T.whySat) * 0.5 + (i * Math.PI * 2) / 3;
              const rx = 560;
              const ry = 150 + i * 40;
              const x = 540 + Math.cos(a) * rx;
              const y = 1140 + Math.sin(a) * ry - 120 + i * 120;
              const front = Math.sin(a) > -0.2;
              return (
                <g key={i} opacity={sat}>
                  <ellipse cx={540} cy={1140 - 120 + i * 120} rx={rx} ry={ry} fill="none" stroke={C.cyanSoft} strokeOpacity={0.3} strokeWidth={2} strokeDasharray="6 10" />
                  <Satellite x={x} y={y} s={0.55} r={-15} o={front ? 1 : 0.35} />
                </g>
              );
            })}
          </g>
        ) : (
          <g>
            <WorldMap x0={70} y0={250} x1={1850} y1={1060} t={t} draw={draw} cableW={2.8} dim={sat} />
            {sats.map((i) => {
              const u = ((t - T.whySat) * 0.12 + i * 0.33) % 1;
              const x = -100 + u * (W + 200);
              const y = 330 + i * 150 + Math.sin(u * Math.PI * 2) * 40;
              return (
                <g key={i} opacity={sat}>
                  <path d={`M-100,${330 + i * 150} Q${W / 2},${330 + i * 150 - 90} ${W + 100},${330 + i * 150}`} fill="none" stroke={C.cyanSoft} strokeOpacity={0.25} strokeWidth={2} strokeDasharray="6 10" />
                  <Satellite x={x} y={y} s={0.6} r={-10} />
                </g>
              );
            })}
          </g>
        )}
        <text
          x={tall ? 540 : 1840}
          y={tall ? 1700 : 1050}
          textAnchor={tall ? 'middle' : 'end'}
          fill={C.cyanSoft}
          opacity={0.75 * ramp(t, T.hundreds + 1, T.hundreds + 1.5)}
          fontFamily={FONT}
          fontWeight={600}
          fontSize={tall ? 24 : 20}
        >
          Illustrative routes, not a live map · see submarinecablemap.com
        </text>
      </Svg>
      <Headline
        t={t}
        a={T.hundreds}
        b={T.whySat}
        lines={tall ? [<>Hundreds of</>, <><Em>cable systems</Em></>, <>link continents</>] : [<>Hundreds of <Em>cable systems</Em></>, <>link the continents</>]}
        wide={{size: 68}}
        tall={{size: 84}}
      />
      <Headline
        t={t}
        a={T.whySat}
        b={T.satVital + 0.3}
        lines={tall ? [<>Why not just use</>, <Em>satellites?</Em>] : [<>Why not just use <Em>satellites?</Em></>]}
        wide={{size: 76}}
        tall={{size: 92}}
      />
    </div>
  );
};
