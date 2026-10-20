import {feature} from 'topojson-client';
import type {Topology, GeometryCollection} from 'topojson-specification';
import type {FeatureCollection, Geometry, LineString} from 'geojson';
import land110 from 'world-atlas/land-110m.json';

// Natural Earth 1:110m land (public domain) via world-atlas.
const topo = land110 as unknown as Topology<{land: GeometryCollection}>;
export const LAND = feature(topo, topo.objects.land) as unknown as FeatureCollection<Geometry>;

type LL = [number, number]; // [lon, lat]

/**
 * ILLUSTRATIVE submarine-cable corridors. Waypoints follow the broad
 * real-world corridors (see submarinecablemap.com) but these are NOT
 * surveyed routes of specific systems, and not a complete inventory.
 */
export const ROUTES: LL[][] = [
  // North Atlantic: US Northeast ↔ UK / Ireland / Spain
  [[-72.9, 40.8], [-60, 42.5], [-40, 48], [-20, 51], [-4.6, 50.8]],
  [[-70.6, 41.4], [-48, 49], [-25, 54], [-10, 53.4]],
  [[-74.1, 39.6], [-55, 39.5], [-30, 42], [-12, 44], [-3, 43.5]],
  // US ↔ Caribbean ↔ Brazil, Brazil ↔ Portugal
  [[-80.1, 26.4], [-66, 20], [-48, 6], [-38.5, -3.7]],
  [[-38.5, -3.7], [-27, 12], [-17, 28], [-9.3, 38.7]],
  [[-38.5, -3.7], [-36, -12], [-43.2, -23], [-56, -36]],
  // Europe ↔ Mediterranean ↔ Red Sea ↔ India ↔ Singapore ↔ Hong Kong ↔ Japan
  [[-9.3, 38.7], [-7, 36], [-2, 36.4], [5.4, 43.3]],
  [[5.4, 43.3], [10, 38.5], [20, 35], [29.9, 31.3]],
  [[32.5, 29.9], [35.5, 25], [40.5, 17], [43.3, 12.6], [51, 13], [62, 17], [72.8, 19]],
  [[72.8, 19], [76, 9], [82, 5.5], [92, 6], [98, 5.5], [103.8, 1.3]],
  [[103.8, 1.3], [108, 7], [114.2, 22.3], [122, 25.5], [131, 31], [139.8, 35]],
  [[103.8, 1.3], [112, 3], [118, 8], [121, 14.6]],
  // Africa: West coast & East coast
  [[-9.3, 38.7], [-18, 22], [-18, 12], [-8, 3.5], [3.4, 6.4]],
  [[3.4, 6.4], [6, -2], [11, -10], [13, -20], [18.4, -33.9]],
  [[18.4, -33.9], [27, -35.5], [33, -30], [40.5, -20], [41.2, -9], [39.7, -4]],
  [[39.7, -4], [45, 2], [51, 10], [43.3, 12.6]],
  // Trans-Pacific
  [[-118.4, 33.9], [-135, 30], [-158, 21.3]],
  [[-158, 21.3], [-175, 18], [165, 14], [144.8, 13.4]],
  [[144.8, 13.4], [140, 25], [139.8, 35]],
  [[-123.8, 45.3], [-150, 47], [-175, 46], [165, 42], [141, 36.5]],
  // Australia
  [[103.8, 1.3], [107, -9], [113, -24], [115.8, -31.9]],
  [[151.2, -33.9], [165, -25], [-178, -5], [-158, 21.3]],
  [[151.2, -33.9], [157, -20], [150, -2], [145, 13]],
  // Americas west coast
  [[-80.1, 26.4], [-82, 20], [-79.5, 9.3]],
  [[-79.5, 8.5], [-84, -2], [-78, -12.1], [-73, -25], [-71.6, -33]],
  [[-118.4, 33.9], [-112, 22], [-98, 14], [-86, 11], [-79.5, 8.5]],
];

/** Approximate landing hubs (for the glowing dots). */
export const HUBS: LL[] = [
  [-72.9, 40.8], [-4.6, 50.8], [-10, 53.4], [-3, 43.5], [-80.1, 26.4], [-38.5, -3.7], [-9.3, 38.7],
  [5.4, 43.3], [29.9, 31.3], [43.3, 12.6], [72.8, 19], [103.8, 1.3], [114.2, 22.3], [139.8, 35],
  [3.4, 6.4], [18.4, -33.9], [39.7, -4], [-118.4, 33.9], [-158, 21.3], [144.8, 13.4], [115.8, -31.9],
  [151.2, -33.9], [-71.6, -33], [-123.8, 45.3], [-43.2, -23], [121, 14.6],
];

/** d3-geo draws each leg as a great-circle arc on whatever projection is used. */
export const routeLine = (r: LL[]): LineString => ({type: 'LineString', coordinates: r});
