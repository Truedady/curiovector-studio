import React, {useMemo} from 'react';
import {geoGraticule10, geoNaturalEarth1, geoOrthographic, geoPath} from 'd3-geo';
import {HUBS, LAND, ROUTES, routeLine} from './geo';
import {C, Glow, GlowLine} from './lib';

type Common = {t: number; draw?: number; stagger?: number; cableW?: number; dim?: number};

const cableProgress = (draw: number, i: number, n: number, stagger: number) => {
  const s = (i / n) * stagger;
  return Math.max(0, Math.min(1, (draw - s) / (1 - stagger)));
};

/** Orthographic globe with illustrative cable corridors. */
export const Globe: React.FC<Common & {cx: number; cy: number; r: number; lon: number; lat: number}> = ({
  cx,
  cy,
  r,
  lon,
  lat,
  t,
  draw = 1,
  stagger = 0.5,
  cableW = 3,
  dim = 0,
}) => {
  const proj = geoOrthographic().scale(r).translate([cx, cy]).rotate([-lon, -lat]).clipAngle(90).precision(0.6);
  const path = geoPath(proj);
  const land = path(LAND) ?? '';
  const grat = path(geoGraticule10()) ?? '';
  return (
    <g>
      <circle cx={cx} cy={cy} r={r * 1.18} fill="url(#g-cy)" opacity={0.35} />
      <circle cx={cx} cy={cy} r={r} fill="url(#g-sphere)" />
      <path d={grat} fill="none" stroke={C.cyan} strokeOpacity={0.08} strokeWidth={1} />
      <path d={land} fill="#1D3A68" stroke="#5B86C2" strokeOpacity={0.7} strokeWidth={1.2} opacity={1 - 0.4 * dim} />
      {ROUTES.map((rt, i) => {
        const d = path(routeLine(rt));
        if (!d) return null;
        return (
          <GlowLine
            key={i}
            d={d}
            w={cableW}
            progress={cableProgress(draw, i, ROUTES.length, stagger)}
            pulses={{t: t + i * 0.37, speed: 0.18, len: 0.04, gap: 0.22}}
            halo={0.8}
          />
        );
      })}
      {HUBS.map((h, i) => {
        const p = proj(h);
        // hide hubs on the far side
        const vis = geoPath(proj)({type: 'Point', coordinates: h});
        if (!p || !vis) return null;
        return <circle key={i} cx={p[0]} cy={p[1]} r={cableW * 1.6} fill={C.orange} opacity={Math.min(1, draw * 2)} />;
      })}
      <circle cx={cx} cy={cy} r={r} fill="url(#g-shade)" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={C.cyanSoft} strokeOpacity={0.5} strokeWidth={2} />
    </g>
  );
};

/** Flat Natural Earth world map with the same corridors. */
export const WorldMap: React.FC<Common & {x0: number; y0: number; x1: number; y1: number}> = ({
  x0,
  y0,
  x1,
  y1,
  t,
  draw = 1,
  stagger = 0.55,
  cableW = 3,
  dim = 0,
}) => {
  const {land, grat, sphere, routes, hubs} = useMemo(() => {
    const proj = geoNaturalEarth1().fitExtent(
      [
        [x0, y0],
        [x1, y1],
      ],
      {type: 'Sphere'},
    );
    const p = geoPath(proj);
    return {
      land: p(LAND) ?? '',
      grat: p(geoGraticule10()) ?? '',
      sphere: p({type: 'Sphere'}) ?? '',
      routes: ROUTES.map((r) => p(routeLine(r)) ?? ''),
      hubs: HUBS.map((h) => proj(h)).filter(Boolean) as [number, number][],
    };
  }, [x0, y0, x1, y1]);
  return (
    <g>
      <path d={sphere} fill="#0A1E44" stroke={C.cyan} strokeOpacity={0.35} strokeWidth={2} />
      <path d={grat} fill="none" stroke={C.cyan} strokeOpacity={0.07} strokeWidth={1} />
      <path d={land} fill="#1D3A68" stroke="#5B86C2" strokeOpacity={0.7} strokeWidth={1.2} opacity={1 - 0.4 * dim} />
      {routes.map((d, i) => (
        <GlowLine
          key={i}
          d={d}
          w={cableW}
          progress={cableProgress(draw, i, routes.length, stagger)}
          pulses={{t: t + i * 0.37, speed: 0.16, len: 0.04, gap: 0.22}}
          halo={0.8}
          o={1 - 0.35 * dim}
        />
      ))}
      {hubs.map(([x, y], i) => (
        <g key={i} opacity={Math.min(1, draw * 2) * (1 - 0.35 * dim)}>
          <Glow x={x} y={y} r={18} color="or" />
          <circle cx={x} cy={y} r={cableW * 1.5} fill={C.orange} />
        </g>
      ))}
    </g>
  );
};
