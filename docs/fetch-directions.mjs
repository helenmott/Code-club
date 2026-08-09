/**
 * Fetch real road-following polylines from the Google Maps Directions API.
 *
 * Run once (or whenever the itinerary changes) to populate
 * data/directions-cache.json. The build step (build.mjs) then prefers
 * those cached polylines over the hand-crafted waypoints in itinerary.mjs.
 *
 *   GOOGLE_MAPS_API_KEY=your_key node fetch-directions.mjs
 *
 * Requirements: Directions API enabled on the key in Google Cloud Console.
 * Ferry legs are skipped — they stay as straight lines on the map.
 */

import { writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { routeLegs } from './data/itinerary.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));
const API_KEY = process.env.GOOGLE_MAPS_API_KEY;

if (!API_KEY) {
  console.error('Error: GOOGLE_MAPS_API_KEY environment variable is not set.');
  console.error('Get a key from https://console.cloud.google.com/ and enable the Directions API.');
  process.exit(1);
}

/**
 * Extra intermediate waypoints for legs where the Directions API would
 * otherwise pick the wrong road. Using lat/lng pairs passed as
 * ?waypoints= to ensure the route follows the intended corridor.
 */
const FORCED_WAYPOINTS = {
  // The scenic coastal route via Peggy's Cove, not the direct highway
  'Halifax → Lunenburg (coastal route)': [[44.4922, -63.9163]],
  // Western Cabot Trail via Pleasant Bay, not the short direct road
  'Baddeck → Ingonish (the Cabot Trail day)': [[46.835, -60.8]],
};

/** Google-encoded polyline → [[lat, lng], …] */
function decodePolyline(encoded) {
  const coords = [];
  let index = 0;
  let lat = 0;
  let lng = 0;
  while (index < encoded.length) {
    let result = 0;
    let shift = 0;
    let b;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    lat += result & 1 ? ~(result >> 1) : result >> 1;

    result = 0;
    shift = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    lng += result & 1 ? ~(result >> 1) : result >> 1;

    coords.push([lat / 1e5, lng / 1e5]);
  }
  return coords;
}

async function fetchDirections(origin, destination, waypointCoords = []) {
  const params = new URLSearchParams({
    origin: `${origin[0]},${origin[1]}`,
    destination: `${destination[0]},${destination[1]}`,
    mode: 'driving',
    key: API_KEY,
  });

  if (waypointCoords.length > 0) {
    params.set('waypoints', waypointCoords.map(([la, lo]) => `${la},${lo}`).join('|'));
  }

  const res = await fetch(`https://maps.googleapis.com/maps/api/directions/json?${params}`);
  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);

  const data = await res.json();
  if (data.status !== 'OK') {
    throw new Error(`Directions API returned ${data.status}: ${data.error_message ?? '(no message)'}`);
  }

  // Concatenate per-step polylines for maximum road detail
  const points = [];
  for (const leg of data.routes[0].legs) {
    for (const step of leg.steps) {
      const decoded = decodePolyline(step.polyline.points);
      // Drop the first point of each continuation to avoid exact duplicates at junctions
      if (points.length > 0) decoded.shift();
      points.push(...decoded);
    }
  }
  return points;
}

const cache = {};
const drivingLegs = routeLegs.filter((l) => !l.ferry);

console.log(`Fetching directions for ${drivingLegs.length} driving leg(s)…\n`);

for (const leg of drivingLegs) {
  const origin = leg.points[0];
  const destination = leg.points[leg.points.length - 1];
  const extraWaypoints = FORCED_WAYPOINTS[leg.label] ?? [];

  process.stdout.write(`  ${leg.label} … `);
  try {
    const points = await fetchDirections(origin, destination, extraWaypoints);
    cache[leg.label] = points;
    console.log(`${points.length} points`);
  } catch (err) {
    console.error(`FAILED — ${err.message}`);
    // Leave this leg out of the cache; build.mjs will fall back to manual points
  }

  // Respect the API's rate limits with a small pause between requests
  await new Promise((r) => setTimeout(r, 300));
}

const outPath = join(ROOT, 'data', 'directions-cache.json');
await writeFile(outPath, JSON.stringify(cache, null, 2));
console.log(`\nWrote ${Object.keys(cache).length} legs → ${outPath}`);
console.log('Run `node build.mjs` to rebuild the site with the new routes.');
