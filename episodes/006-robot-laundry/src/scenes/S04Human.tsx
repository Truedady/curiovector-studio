import React from 'react';
import {Shirt, shirtPoint, ShirtParams} from '../art/Shirt';
import {Hand} from '../art/Hand';
import {Chip, Reveal, Txt} from '../art/ui';
import {C, FONT} from '../lib/theme';
import {lerp, ramp} from '../lib/timing';
import {SceneProps, toWorld, XY} from './types';

type Label = {text: string; at: number; anchor: XY; pos: [XY, XY]; side: 'l' | 'r'};

export const Human: React.FC<SceneProps> = ({T, v}) => {
  const lift = ramp(T, 28.9, 30.2);
  const sway = Math.sin((T - 29) * 1.3) * lift;
  const p: ShirtParams = {
    t: T,
    hang: lift,
    wobble: 2.2,
    pulls: [{x: 0, y: 200, dx: 18 * sway, dy: 0, r: 220}],
    wrinkle: 0.7,
  };
  const s = v ? 1.3 : 1.05;
  const ox = v ? 540 : 700;
  const oy = (v ? 980 : 600) - lift * 60;
  const L = toWorld(ox, oy, s, shirtPoint(-112, -186, p));
  const R = toWorld(ox, oy, s, shirtPoint(112, -186, p));
  // "where your hands should move next": ghost path for the right hand
  const nextK = ramp(T, 36.3, 37.6);
  const nextTo: XY = [R[0] + (v ? 170 : 230), R[1] + (v ? 230 : 260)];
  const fade = 1 - 0.55 * ramp(T, 38.5, 39.0);

  const labels: Label[] = [
    {text: 'SHAPE', at: 31.2, anchor: [-150, -60], pos: [[120, 300], [70, 640]], side: 'l'},
    {text: 'WEIGHT', at: 33.18, anchor: [0, 214], pos: [[120, 860], [70, 1300]], side: 'l'},
    {text: 'HOW IT BENDS', at: 34.06, anchor: [-200, -110], pos: [[120, 580], [70, 970]], side: 'l'},
    {text: 'HOW IT DRAPES', at: 35.0, anchor: [146, 150], pos: [[1360, 760], [1010, 1190]], side: 'r'},
    {text: 'NEXT MOVE', at: 36.24, anchor: [0, 0], pos: [[1360, 470], [1010, 700]], side: 'r'},
  ];

  return (
    <g>
      <Shirt id="hm" x={ox} y={oy} scale={s} p={p} shadow={1 - lift * 0.6} />
      <Hand x={L[0]} y={L[1]} angle={168} scale={0.85} pinch={0.7} />
      <Hand x={R[0]} y={R[1]} angle={-168} scale={0.85} pinch={0.7} flip />
      {nextK > 0 && (
        <g opacity={nextK * fade}>
          <path
            d={`M${R[0]},${R[1]} Q${lerp(R[0], nextTo[0], 0.9)},${R[1]} ${nextTo[0]},${nextTo[1]}`}
            fill="none"
            stroke={C.cyan}
            strokeWidth={4}
            strokeDasharray="10 10"
            strokeDashoffset={-T * 40}
          />
          <circle cx={nextTo[0]} cy={nextTo[1]} r={16 + 4 * Math.sin(T * 5)} fill="none" stroke={C.cyan} strokeWidth={4} />
        </g>
      )}
      {labels.map((l, i) => {
        const k = ramp(T, l.at, l.at + 0.45);
        if (k <= 0) return null;
        const [lx, ly] = v ? l.pos[1] : l.pos[0];
        const a = l.text === 'NEXT MOVE' ? nextTo : toWorld(ox, oy, s, shirtPoint(l.anchor[0], l.anchor[1], p));
        const w = l.text.length * 17 + 36;
        const edgeX = l.side === 'l' ? lx + w : lx - w;
        return (
          <g key={i} opacity={k * fade}>
            <line x1={edgeX} y1={ly} x2={lerp(edgeX, a[0], k)} y2={lerp(ly, a[1], k)} stroke={C.cyan} strokeWidth={2} strokeOpacity={0.7} />
            <circle cx={a[0]} cy={a[1]} r={7 * k} fill={C.cyan} />
            {l.side === 'l' ? (
              <Chip x={lx} y={ly} text={l.text} size={24} />
            ) : (
              <Chip x={lx - w} y={ly} text={l.text} size={24} />
            )}
          </g>
        );
      })}
      {/* eyes → brain → hands loop */}
      <Reveal T={T} at={30.4} out={v ? 38.2 : undefined}>
        <g opacity={fade}>
          {v ? (
            <Txt x={540} y={1470} anchor="middle" size={64} lines={[['Your brain ', {t: 'instantly', c: C.cyan}], ['understands it']]} />
          ) : (
            <Txt x={1300} y={200} size={52} lines={[['Your brain ', {t: 'instantly', c: C.cyan}], ['understands it']]} />
          )}
        </g>
      </Reveal>
      <Reveal T={T} at={29.1} out={30.2}>
        <Txt x={v ? 540 : 1300} y={v ? 1470 : 200} anchor={v ? 'middle' : 'start'} size={v ? 64 : 52} lines={[['When you pick'], ['up a shirt…']]} />
      </Reveal>
      <Reveal T={T} at={38.55}>
        {v ? (
          <Txt x={540} y={1470} anchor="middle" size={64} lines={[['You barely ', {t: 'think', c: C.orange}], ['about it.']]} />
        ) : (
          <Txt x={1300} y={930} size={62} lines={[['You barely ', {t: 'think', c: C.orange}], ['about it.']]} />
        )}
      </Reveal>
      <Reveal T={T} at={38.55}>
        <text
          x={v ? 540 : 1300}
          y={v ? 1700 : 1010}
          textAnchor={v ? 'middle' : 'start'}
          fontFamily={FONT}
          fontSize={24}
          fontWeight={600}
          letterSpacing={4}
          fill={C.muted}
          opacity={v ? 0 : 1}
        >
          EYES · BRAIN · HANDS — ONE LOOP
        </text>
      </Reveal>
    </g>
  );
};
