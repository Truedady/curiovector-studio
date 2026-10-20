import React from 'react';
import {Satellite, Ship} from '../art';
import {T} from '../timing';
import {Bg, C, Em, FONT, Glow, Headline, P, Svg, Tag, lerp, ramp, useLay} from '../lib';

type Rect = {x: number; y: number; w: number; h: number};

const Plane: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(-8)`}>
    <path d="M-90,0 Q-80,-12 60,-10 Q95,-8 100,0 Q95,8 60,10 Q-80,12 -90,0 Z" fill="#C9D6EA" />
    <path d="M-10,-8 L-40,-70 L-20,-70 L30,-8 Z M-10,8 L-40,70 L-20,70 L30,8 Z" fill="#8EA3C4" />
    <path d="M-88,-2 L-100,-40 L-84,-40 L-70,-6 Z" fill={C.orange} />
  </g>
);

const Cabin: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-120,0 Q-60,-50 0,-46 Q70,-50 130,0 Z" fill="#1D3A68" />
    <path d="M-40,-36 L-40,-90 L0,-120 L40,-90 L40,-36 Z" fill="#15294F" stroke="#5B86C2" strokeWidth={3} />
    <rect x={-22} y={-86} width={18} height={16} fill="#FFD9A0" opacity={0.8} />
    <line x1={60} y1={-40} x2={60} y2={-120} stroke="#8EA3C4" strokeWidth={4} />
    <ellipse cx={60} cy={-120} rx={26} ry={12} fill="#C9D6EA" transform="rotate(-25 60 -120)" />
  </g>
);

// 67.1–76.6 s · satellites are vital for some places; undersea fiber carries far more, cheaper per bit.
export const SatVsFiber: React.FC<{t: number}> = ({t}) => {
  const {w: W, h: H, tall} = useLay();
  const a = T.satVital;
  const b = T.fiberCost;
  const left: Rect = tall ? {x: 40, y: 560, w: 1000, h: 560} : {x: 40, y: 300, w: 900, h: 720};
  const right: Rect = tall ? {x: 40, y: 1160, w: 1000, h: 520} : {x: 980, y: 300, w: 900, h: 720};
  const satIn = ramp(t, a - 0.2, a + 0.5);
  const fibIn = ramp(t, b - 0.2, b + 0.6);

  // satellite panel
  const sx = left.x + left.w / 2;
  const sy = left.y + left.h * (tall ? 0.2 : 0.17);
  const limbR = left.w * 1.8;
  const limbY = left.y + left.h * (tall ? 0.86 : 0.84);
  const limbEdge = limbY + limbR - Math.sqrt(limbR * limbR - (left.w / 2) * (left.w / 2));
  const slide = tall ? [0, 300 * (1 - fibIn)] : [(W / 2 - left.w / 2 - left.x) * (1 - fibIn), 0];
  const targets: [P, string][] = [
    [[left.x + left.w * 0.18, limbY - 8], 'SHIPS AT SEA'],
    [[left.x + left.w * 0.5, limbY - 30], 'REMOTE PLACES'],
    [[left.x + left.w * 0.83, left.y + left.h * 0.55], 'AIRCRAFT'],
  ];

  // fiber panel: a wide river of parallel lanes
  const lanes = 14;
  const tubeY = right.y + right.h * 0.52;
  const tubeH = right.h * 0.42;

  return (
    <div style={{position: 'absolute', inset: 0}}>
      <Bg kind="space" />
      <Svg>
        {/* --- satellites --- */}
        <g opacity={satIn * (1 - 0.35 * fibIn)} transform={`translate(${slide[0]} ${slide[1]})`}>
          <rect x={left.x} y={left.y} width={left.w} height={left.h} rx={14} fill="#071028" fillOpacity={0.55} stroke={C.cyan} strokeOpacity={0.25} strokeWidth={2} />
          <path
            d={`M${left.x},${left.y + left.h} L${left.x},${limbEdge} A${limbR},${limbR} 0 0 1 ${left.x + left.w},${limbEdge} L${left.x + left.w},${left.y + left.h} Z`}
            fill="url(#g-sphere)"
          />
          <path d={`M${left.x},${limbEdge} A${limbR},${limbR} 0 0 1 ${left.x + left.w},${limbEdge}`} fill="none" stroke={C.cyan} strokeOpacity={0.7} strokeWidth={3} />
          <text x={left.x + left.w / 2} y={left.y + (tall ? 64 : 80)} textAnchor="middle" fill={C.white} fontFamily={FONT} fontWeight={700} fontSize={36} letterSpacing={3}>
            SATELLITES
          </text>
          {targets.map(([p], i) => (
            <g key={i}>
              <path d={`M${sx - 14},${sy + 30} L${p[0] - 60},${p[1]} L${p[0] + 60},${p[1]} L${sx + 14},${sy + 30} Z`} fill={C.cyan} opacity={0.1} />
              {[0, 1, 2].map((j) => {
                const u = ((t - a) * 0.6 + j / 3 + i * 0.2) % 1;
                const q: P = [lerp(sx, p[0], u), lerp(sy + 30, p[1], u)];
                return <rect key={j} x={q[0] - 7} y={q[1] - 7} width={14} height={14} rx={3} fill={C.white} opacity={0.9 * Math.sin(u * Math.PI)} />;
              })}
            </g>
          ))}
          <Satellite x={sx} y={sy} s={tall ? 1.1 : 1.15} r={-6} />
          <Ship x={targets[0][0][0]} y={targets[0][0][1] + 10} s={0.33} />
          <Cabin x={targets[1][0][0]} y={targets[1][0][1] + 20} s={0.8} />
          <Plane x={targets[2][0][0]} y={targets[2][0][1]} s={0.75} />
          {targets.map(([p, label], i) => (
            <Tag key={label} x={i === 2 ? p[0] : p[0]} y={i === 2 ? p[1] + 100 : limbY + (tall ? 62 : 70)} text={label} size={tall ? 26 : 24} o={ramp(t, a + 0.6 + i * 0.4, a + 1 + i * 0.4)} />
          ))}
        </g>
        {/* --- undersea fiber --- */}
        <g opacity={fibIn}>
          <rect x={right.x} y={right.y} width={right.w} height={right.h} rx={14} fill="#071028" fillOpacity={0.55} stroke={C.orange} strokeOpacity={0.35} strokeWidth={2} />
          <Glow x={right.x + right.w / 2} y={tubeY} r={right.w * 0.6} o={0.6} />
          <rect x={right.x + 30} y={tubeY - tubeH / 2} width={right.w - 60} height={tubeH} rx={tubeH / 2} fill="#0B1F45" stroke={C.cyanSoft} strokeOpacity={0.6} strokeWidth={3} />
          {Array.from({length: lanes}).map((_, i) => {
            const y = tubeY - tubeH / 2 + ((i + 0.5) / lanes) * tubeH;
            const sp = 380 + (i % 4) * 70;
            return (
              <line
                key={i}
                x1={right.x + 60}
                y1={y}
                x2={right.x + right.w - 60}
                y2={y}
                stroke={i % 5 === 2 ? C.white : C.cyan}
                strokeWidth={tubeH / lanes - 6}
                strokeLinecap="round"
                strokeDasharray={`${18 + (i % 3) * 10} ${12 + (i % 4) * 6}`}
                strokeDashoffset={-(t - b) * sp}
                opacity={0.85}
              />
            );
          })}
          <text x={right.x + right.w / 2} y={right.y + (tall ? 64 : 80)} textAnchor="middle" fill={C.white} fontFamily={FONT} fontWeight={700} fontSize={tall ? 36 : 36} letterSpacing={3}>
            UNDERSEA FIBER
          </text>
          <Tag x={right.x + right.w / 2} y={tubeY + tubeH / 2 + (tall ? 60 : 80)} text="EXTRAORDINARY CAPACITY" size={tall ? 30 : 30} color={C.cyan} o={ramp(t, b + 0.6, b + 1.1)} />
          <Tag x={right.x + right.w / 2} y={tubeY + tubeH / 2 + (tall ? 118 : 150)} text="MUCH LOWER COST PER BIT" size={tall ? 30 : 30} color={C.orange} o={ramp(t, b + 2.2, b + 2.7)} />
        </g>
        <Tag
          x={W / 2}
          y={tall ? 1760 : H - 22}
          text="NOT RIVALS — THEY COMPLEMENT EACH OTHER"
          size={tall ? 28 : 26}
          color={C.cyanSoft}
          o={ramp(t, b + 3.6, b + 4.1)}
        />
      </Svg>
      <Headline
        t={t}
        a={a}
        b={b}
        lines={tall ? [<>Satellites are</>, <><Em>vital</Em> for some</>, <>places</>] : [<>Satellites are <Em>vital</Em> for some places</>]}
        wide={{size: 66, y: 110, width: 1700}}
        tall={{size: 82}}
      />
      <Headline
        t={t}
        a={b}
        b={T.vulnerable + 0.3}
        lines={tall ? [<>But fiber carries</>, <><Em>far more</Em> data</>] : [<>But fiber carries <Em>far more</Em> data</>]}
        wide={{size: 66, y: 110, width: 1700}}
        tall={{size: 82}}
      />
    </div>
  );
};
