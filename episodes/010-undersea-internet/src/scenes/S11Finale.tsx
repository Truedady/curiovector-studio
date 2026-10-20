import React from 'react';
import {CloudShape} from '../art';
import {Globe} from '../globe';
import {T} from '../timing';
import {Bg, C, EASE_IN_OUT, Em, FONT, Headline, Svg, lerp, ramp, useLay} from '../lib';

// 93.9–105.4 s · not a weightless cloud → pull back to Earth: the internet's physical skeleton.
export const Finale: React.FC<{t: number}> = ({t}) => {
  const {w: W, h: H, tall} = useLay();
  const evap = ramp(t, T.notCloud + 1.4, T.skeleton, EASE_IN_OUT);
  const pull = ramp(t, T.skeleton - 0.3, T.skeleton + 2.2, EASE_IN_OUT);
  const end = ramp(t, T.end - 0.7, T.end);

  // the globe starts as a huge horizon under the cloud and pulls back to a whole planet
  const rEnd = tall ? 470 : 430;
  const cxEnd = tall ? 540 : 1300;
  const cyEnd = tall ? 1160 : 600;
  const rStart = tall ? 1500 : 1900;
  const r = lerp(rStart, rEnd, pull);
  const cx = lerp(W / 2, cxEnd, pull);
  const cy = lerp((tall ? 1420 : 860) + rStart, cyEnd, pull);
  const cloud = tall ? {x: 540, y: 960, s: 1.25} : {x: 960, y: 520, s: 1.2};

  return (
    <div style={{position: 'absolute', inset: 0, opacity: 1 - end}}>
      <Bg kind="space" />
      <Svg>
        <Globe cx={cx} cy={cy} r={r} lon={-32 + (t - T.notCloud) * 3.6} lat={lerp(35, 16, pull)} t={t} draw={1} cableW={lerp(2.5, 3.4, pull)} />
        <g opacity={1 - evap}>
          <CloudShape x={cloud.x} y={cloud.y - 30 * evap} s={cloud.s} spread={evap} />
          <text
            x={cloud.x}
            y={cloud.y + 20}
            textAnchor="middle"
            fill={C.white}
            fontFamily={FONT}
            fontWeight={700}
            fontSize={tall ? 56 : 52}
            letterSpacing={8}
            opacity={1 - ramp(t, T.notCloud + 1.2, T.notCloud + 1.8)}
          >
            “THE CLOUD”
          </text>
        </g>
      </Svg>
      <Headline
        t={t}
        a={T.notCloud}
        b={T.skeleton}
        lines={tall ? [<>The internet isn&apos;t</>, <>a weightless</>, <Em>cloud</Em>] : [<>The internet isn&apos;t a</>, <>weightless <Em>cloud</Em></>]}
        wide={{size: 76}}
        tall={{size: 90}}
      />
      <Headline
        t={t}
        a={T.skeleton}
        b={T.end + 1}
        lines={[<>The internet</>, <>has a</>, <Em>skeleton</Em>]}
        sub={t > T.finale ? 'Thin threads of glass resting on the ocean floor' : undefined}
        wide={{size: 96, x: 110, y: 300, width: 760}}
        tall={{size: 100}}
      />
    </div>
  );
};
