import React from 'react';
import {MiniPhone, Pulse, Satellite} from '../art';
import {C, Earth, FONT, Fill, Headline, Svg, Tag, map, pick, rise, useL} from '../lib';
import {CUE} from '../timing';

// 34.62–44.4 s: time-of-flight. Signal leaves at a known time, arrives later;
// distance = speed of light × travel time.  0.070 s × 299,792 km/s ≈ 21,000 km
// (GPS satellites orbit ~20,200 km up, so real ranges are ~20,000–26,000 km).
const MONO = "'DejaVu Sans Mono', monospace";

export const Flight: React.FC<{t: number}> = ({t}) => {
  const L = useL();
  const P = L.P;
  const earth = pick(L, {cx: 1480, cy: 2080, r: 1270}, {cx: 760, cy: 2700, r: 1260});
  const ph = {x: earth.cx, y: earth.cy - earth.r + 4};
  const sat = pick(L, {x: 360, y: 250}, {x: 240, y: 700});
  const a = {x: sat.x + 10, y: sat.y + 50};
  const b = {x: ph.x, y: ph.y - 60};

  // Fast "speed of light" pulses, then one measured pulse in slow motion.
  const fast = t >= CUE.lightSpeed + 0.3 && t < CUE.measure ? ((t - CUE.lightSpeed - 0.3) / 0.55) % 1 : -1;
  const m0 = CUE.measure + 0.3;
  const m1 = CUE.distance - 0.2;
  const mk = map(t, [m0, m1], [0, 1], (x) => x);
  const travel = mk * 0.07; // seconds of real flight shown in slow motion
  const arrived = t >= m1;
  const panel = rise(t, CUE.measure, 0.5);
  const eq = rise(t, CUE.distance, 0.5);
  const dimLine = rise(t, CUE.distance + 0.4, 0.8);
  const camScale = map(t, [34.62, 44.4], [1.04, 1]);

  const pnl = pick(L, {x: 1170, y: 150, w: 640}, {x: 480, y: 430, w: 500});
  const hx = pick(L, 110, 70);
  const hy = pick(L, 820, 190);
  const hs = pick(L, 62, 70);
  const hw = pick(L, 900, 940);

  // perpendicular offset for the distance dimension line
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  const nx = (dy / len) * 46;
  const ny = (-dx / len) * 46;
  const mid = {x: (a.x + b.x) / 2 + nx * 2.2, y: (a.y + b.y) / 2 + ny * 2.2};

  return (
    <Fill>
      <div style={{position: 'absolute', inset: 0, transform: `scale(${camScale})`}}>
        <Earth cx={earth.cx} cy={earth.cy} r={earth.r} />
        <Svg>
          <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={C.cyan} strokeWidth={3} strokeDasharray="6 12" opacity={0.75} />
          {fast >= 0 && <Pulse ax={a.x} ay={a.y} bx={b.x} by={b.y} k={fast} r={10} />}
          {mk > 0 && !arrived && <Pulse ax={a.x} ay={a.y} bx={b.x} by={b.y} k={mk} r={14} color={C.orange} />}
          {dimLine > 0 && (
            <g opacity={dimLine}>
              <line x1={a.x + nx} y1={a.y + ny} x2={a.x + nx + dx * dimLine} y2={a.y + ny + dy * dimLine} stroke={C.orange} strokeWidth={4} />
              <line x1={a.x + nx * 0.5} y1={a.y + ny * 0.5} x2={a.x + nx * 1.5} y2={a.y + ny * 1.5} stroke={C.orange} strokeWidth={4} />
              <line x1={b.x + nx * 0.5} y1={b.y + ny * 0.5} x2={b.x + nx * 1.5} y2={b.y + ny * 1.5} stroke={C.orange} strokeWidth={4} opacity={dimLine > 0.95 ? 1 : 0} />
            </g>
          )}
          <MiniPhone x={ph.x} y={ph.y} s={pick(L, 1.5, 1.7)} lit={arrived ? 1 : 0.3} />
        </Svg>
        <Satellite id="tof" t={t} x={sat.x} y={sat.y} scale={pick(L, 0.95, 0.9)} rot={-14} glow={0.7} />
        <Tag t={t} at={CUE.distance + 1.0} x={mid.x} y={mid.y} text="≈ 21,000 km" color={C.orange} size={pick(L, 30, 32)} solid />
      </div>

      {/* stopwatch panel */}
      {panel > 0 && (
        <div
          style={{
            position: 'absolute',
            left: pnl.x,
            top: pnl.y,
            width: pnl.w,
            opacity: panel,
            transform: `translateY(${(1 - panel) * 20}px)`,
            background: 'rgba(8,19,47,0.92)',
            border: `2px solid ${C.cyan}`,
            borderRadius: 22,
            padding: '22px 30px',
            boxSizing: 'border-box',
            fontFamily: FONT,
            color: C.white,
          }}
        >
          <div style={{fontSize: 22, fontWeight: 800, letterSpacing: '0.12em', color: C.cyan}}>SIGNAL TIMING</div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 26}}>
            <span style={{opacity: 0.75}}>Sent at</span>
            <span style={{fontFamily: MONO}}>09:41:07.000</span>
          </div>
          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 26}}>
            <span style={{opacity: 0.75}}>Heard at</span>
            <span style={{fontFamily: MONO, color: arrived ? C.white : 'rgba(248,250,255,0.35)'}}>
              09:41:07.{String(Math.round(travel * 1000)).padStart(3, '0')}
            </span>
          </div>
          <div style={{height: 2, background: 'rgba(67,197,245,0.35)', margin: '14px 0'}} />
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
            <span style={{fontSize: 26, fontWeight: 700}}>Travel time</span>
            <span style={{fontFamily: MONO, fontSize: 44, fontWeight: 700, color: C.orange}}>{travel.toFixed(3)} s</span>
          </div>
          <div style={{overflow: 'hidden', maxHeight: eq * 140, opacity: eq}}>
            <div style={{height: 2, background: 'rgba(67,197,245,0.35)', margin: '14px 0'}} />
            <div style={{fontSize: 26, opacity: 0.85}}>speed of light × travel time</div>
            <div style={{fontSize: 30, fontWeight: 800, marginTop: 6}}>
              300,000 km/s × 0.070 s ≈ <span style={{color: C.orange}}>21,000 km</span>
            </div>
          </div>
        </div>
      )}
      <Tag t={t} at={CUE.measure + 0.6} out={CUE.distance} x={pick(L, pnl.x + pnl.w - 10, pnl.x + pnl.w - 10)} y={pnl.y - 26} text="slowed way down" color={C.dim} size={20} anchor="right" />

      <Tag t={t} at={CUE.lightSpeed + 0.6} out={CUE.measure + 0.2} x={pick(L, 1050, 540)} y={pick(L, 300, 900)} text="≈ 300,000 km per second" color={C.cyan} size={pick(L, 30, 32)} />

      <Headline t={t} at={CUE.lightSpeed} out={CUE.measure} x={hx} y={hy} size={hs} width={hw} text="Radio signals fly at the *speed of light.*" />
      <Headline t={t} at={CUE.measure} out={CUE.distance} x={hx} y={hy} size={hs} width={hw} text="Measure *how long* each one took…" />
      <Headline t={t} at={CUE.distance} out={44.35} x={hx} y={hy} size={hs} width={hw} text="…and you know *how far away* that satellite is." />
    </Fill>
  );
};
