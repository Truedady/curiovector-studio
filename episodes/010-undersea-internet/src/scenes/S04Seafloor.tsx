import React from 'react';
import {Img, staticFile} from 'remotion';
import {Ship} from '../art';
import {T} from '../timing';
import {C, Em, FONT, Glow, GlowLine, Headline, P, Tag, along, ramp, smooth, useLay} from '../lib';

// 32.9–37.2 s · crossing an ocean: landing station → shelf → slope → abyssal plain.
export const Seafloor: React.FC<{t: number}> = ({t}) => {
  const {w: W, h: H, tall} = useLay();
  const a = T.ocean;
  const sY = tall ? 640 : 360;
  const coast = tall ? 230 : 330;
  const floor: P[] = tall
    ? [[coast, sY + 20], [330, sY + 70], [440, sY + 130], [520, 1000], [600, 1400], [700, 1640], [860, 1690], [1000, 1670], [1200, 1700]]
    : [[coast, sY + 20], [520, sY + 70], [720, sY + 120], [880, 560], [1040, 800], [1200, 880], [1450, 900], [1700, 870], [1950, 910], [2250, 890]];
  const cable: P[] = [[coast - 120, sY - 30], [coast - 40, sY + 4], ...floor.slice(1).map(([x, y]) => [x, y - 6] as P)];
  const floorD = `M-300,${sY - 34} L${coast - 30},${sY - 34} L${smooth(floor).slice(1)} L${W + 600},${floor[floor.length - 1][1]} L${W + 600},${H + 600} L-300,${H + 600} Z`;

  const k = ramp(t, a - 0.2, T.glass + 0.2);
  const pan = tall ? `translate(70px, ${120 - 70 * k}px)` : `translate(${120 - 110 * k}px, 110px)`;
  const draw = ramp(t, a, a + 1.6);
  const msg = along(cable, ramp(t, a + 0.4, a + 4.2));

  return (
    <div style={{position: 'absolute', inset: 0, background: C.navyDeep}}>
      <Img src={staticFile(`img/space_${tall ? 'tall' : 'wide'}.jpg`)} style={{position: 'absolute', left: 0, top: 0, width: W, height: H}} />
      <div style={{position: 'absolute', inset: 0, transform: pan}}>
      <Img src={staticFile(`img/ocean_${tall ? 'tall' : 'wide'}.jpg`)} style={{position: 'absolute', left: -300, top: sY, width: W + 900, height: ((W + 900) * H) / W}} />
      <svg width={W} height={H} style={{position: 'absolute', overflow: 'visible'}}>
        <g>
          <rect x={-300} y={sY - 3} width={W + 900} height={5} fill={C.cyanSoft} opacity={0.5} />
          <Ship x={tall ? 760 : 1320} y={sY} s={tall ? 0.42 : 0.5} />
          <path d={floorD} fill="url(#g-seabed)" stroke="#4A6A9C" strokeWidth={2} />
          <path d={smooth(floor.map(([x, y]) => [x, y + 40] as P))} fill="none" stroke="#5E7299" strokeOpacity={0.2} strokeWidth={2} />
          {/* landing station */}
          <g transform={`translate(${coast - 150} ${sY - 34})`}>
            <rect x={-70} y={-90} width={150} height={90} rx={8} fill="#15294F" stroke={C.cyan} strokeOpacity={0.7} strokeWidth={3} />
            <rect x={-50} y={-70} width={40} height={24} fill="#FFD9A0" opacity={0.45} />
            <circle cx={40} cy={-45} r={16} fill={C.orange} />
            <circle cx={40} cy={-45} r={50} fill="url(#g-or)" opacity={0.7} />
          </g>
          <GlowLine d={smooth(cable)} w={tall ? 6 : 5.5} progress={draw} pulses={{t, speed: 0.22, len: 0.015, gap: 0.07}} />
          <Glow x={msg[0]} y={msg[1]} r={60} color="wh" o={ramp(t, a + 0.4, a + 0.7)} />
          <Tag x={coast - 140} y={sY + 60} text="LANDING STATION" size={tall ? 28 : 24} o={ramp(t, a + 0.3, a + 0.8)} />
          <Tag
            x={tall ? 330 : 560}
            y={tall ? sY + 230 : sY + 190}
            text={tall ? 'BURIED NEAR SHORE' : 'OFTEN BURIED NEAR SHORE'}
            size={tall ? 26 : 22}
            color={C.cyanSoft}
            o={ramp(t, a + 1, a + 1.5)}
          />
          <Tag
            x={tall ? 830 : 1500}
            y={tall ? 1640 : 840}
            text={tall ? 'RESTING ON THE SEAFLOOR' : 'RESTING ON THE DEEP-SEA FLOOR'}
            size={tall ? 30 : 26}
            color={C.orange}
            o={ramp(t, a + 1.8, a + 2.3)}
          />
          <text
            x={tall ? 900 : 1700}
            y={tall ? 1400 : 700}
            textAnchor="middle"
            fill={C.cyanSoft}
            opacity={0.7 * ramp(t, a + 1.8, a + 2.3)}
            fontFamily={FONT}
            fontWeight={700}
            fontSize={tall ? 26 : 22}
            letterSpacing={4}
          >
            KILOMETERS DEEP
          </text>
        </g>
      </svg>
      </div>
      <Headline
        t={t}
        a={a}
        b={T.glass + 0.3}
        kicker="STEP 4 · CROSSING AN OCEAN"
        lines={tall ? [<>It <Em>likely</Em> travels</>, <>along the</>, <Em>seafloor</Em>] : [<>It <Em>likely</Em> travels along</>, <>the <Em>seafloor</Em></>]}
        wide={{size: 70}}
        tall={{size: 84}}
      />
    </div>
  );
};

