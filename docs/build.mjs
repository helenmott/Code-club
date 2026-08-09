/**
 * Static site generator.
 *
 *   node build.mjs
 *
 * Reads data/itinerary.mjs and writes index.html, one page per location, and
 * assets/js/route-data.js. Output is plain static HTML with no runtime
 * dependencies beyond the vendored Leaflet — drop the folder on any host.
 */

import { writeFile, mkdir, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  trip, locations, routeLegs, waypoints, heroWiki,
  costs, costTotal, practical, savings,
} from './data/itinerary.mjs';

const ROOT = dirname(fileURLToPath(import.meta.url));

// Populated at the start of main() from data/directions-cache.json if present.
// fetch-directions.mjs writes this file; when absent, manual waypoints are used.
let directionsCache = {};

/* -------------------------------------------------------------- helpers -- */

const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const nights = (n) => `${n} night${n === 1 ? '' : 's'}`;

/** A photo slot. Filled at runtime from Wikimedia; degrades to a captioned tile. */
const photo = (wikiTitles, fallback, cls = 'photo', alt = '') => `
      <div class="${cls}" data-wiki="${esc((wikiTitles || []).join('|'))}" data-fallback="${esc(fallback)}"${alt ? ` data-alt="${esc(alt)}"` : ''}></div>`;

const ext = (href, label, cls = 'card-link') =>
  `<a class="${cls}" href="${esc(href)}" target="_blank" rel="noopener noreferrer">${esc(label)}</a>`;

/* --------------------------------------------------------------- layout -- */

function layout({ title, description, body, current, depth = 0, extraHead = '', extraFoot = '' }) {
  const base = depth === 0 ? '' : '../';
  const nav = locations
    .map((l, i) => {
      const isCur = l.slug === current;
      return `<a href="${base}${l.slug}.html"${isCur ? ' aria-current="page"' : ''}>${i + 1}. ${esc(l.name)}</a>`;
    })
    .join('\n          ');

  return `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="color-scheme" content="light dark">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:type" content="website">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E%F0%9F%A6%9E%3C/text%3E%3C/svg%3E">
<link rel="stylesheet" href="${base}assets/vendor/leaflet/leaflet.css">
<link rel="stylesheet" href="${base}assets/css/site.css">
${extraHead}</head>
<body>
<a class="skip" href="#main">Skip to content</a>

<header class="site-head">
  <div class="wrap">
    <a class="brand" href="${base}index.html">
      Nova Scotia &amp; PEI
      <span class="brand-sub">16-day road trip</span>
    </a>
    <nav class="stop-nav" aria-label="Stops on the journey">
          ${nav}
    </nav>
  </div>
</header>

<main id="main">
${body}
</main>

<footer class="site-foot">
  <div class="wrap foot-grid">
    <div>
      <h2>About this trip</h2>
      <p>${esc(trip.party)} &middot; ${esc(trip.timing)}.<br>
      ${esc(trip.distance)} of driving, ${esc(trip.driving)}.</p>
      <p style="margin-top:12px">Photographs are loaded from Wikimedia Commons and remain the property of their
      photographers &mdash; hover any image for its source. Accommodation prices and guest ratings are indicative;
      always confirm on the operator&rsquo;s own site.</p>
    </div>
    <div>
      <h2>Every stop</h2>
      <ul>
        ${locations.map((l, i) => `<li><a href="${base}${l.slug}.html">${i + 1}. ${esc(l.name)}</a></li>`).join('\n        ')}
      </ul>
    </div>
  </div>
</footer>

<script src="${base}assets/vendor/leaflet/leaflet.js"></script>
<script src="${base}assets/js/route-data.js"></script>
<script src="${base}assets/js/map.js"></script>
<script src="${base}assets/js/photos.js"></script>
${extraFoot}</body>
</html>
`;
}

/* ----------------------------------------------------------- home page --- */

function homePage() {
  const stopCards = locations
    .map((l, i) => `
        <a class="stop-card" href="${l.slug}.html">
          ${photo(heroWiki[l.slug], l.name, 'photo', `${l.name}, ${l.region}`).trim()}
          <div class="stop-card-body">
            <div class="stop-card-top">
              <span class="num">${i + 1}</span>
              <span class="stop-card-days">${esc(l.days)} &middot; ${esc(nights(l.nights))}</span>
            </div>
            <div class="stop-card-title">${esc(l.name)}</div>
            <div class="stop-card-region">${esc(l.region)}</div>
            <p class="stop-card-tag">${esc(l.tagline)}</p>
            <div class="stop-card-foot">
              <span>Drive in <b>${esc(l.driveIn.time)}</b></span>
              <span>${l.sights.length} things to do</span>
            </div>
          </div>
        </a>`)
    .join('');

  const glanceRows = locations
    .map((l, i) => `
          <tr>
            <td class="num-col">${esc(l.days.replace('Days ', ''))}</td>
            <td><a href="${l.slug}.html">${i + 1}. ${esc(l.name)}</a></td>
            <td class="num-col">${l.nights}</td>
            <td class="num-col">${esc(l.driveIn.time)}</td>
          </tr>`)
    .join('') + `
          <tr>
            <td class="num-col">15–16</td>
            <td><a href="halifax.html">Halifax &mdash; and home</a></td>
            <td class="num-col">1</td>
            <td class="num-col">4 hr 30</td>
          </tr>`;

  const costRows = costs
    .map(([item, value, note]) => `
          <tr>
            <td>${esc(item)}${note ? `<br><span style="color:var(--ink-3);font-size:.86em">${esc(note)}</span>` : ''}</td>
            <td class="num-col">${esc(value)}</td>
          </tr>`)
    .join('');

  const practicalCards = practical
    .map((p) => `
        <div class="card">
          <div class="card-body">
            <h3>${esc(p.title)}</h3>
            <p>${esc(p.body)}</p>
            ${p.link ? ext(p.link.href, p.link.label) : ''}
          </div>
        </div>`)
    .join('');

  const body = `
<section class="hero">
  <div class="wrap">
    <span class="eyebrow">16 days &middot; Atlantic Canada</span>
    <h1>${esc(trip.title)}</h1>
    <p class="lede">${esc(trip.intro)}</p>
    <p class="route-line">${esc(trip.routeSummary)}</p>

    <dl class="facts">
      <div><div class="k">Party</div><div class="v">2 adults, 2 children</div></div>
      <div><div class="k">When</div><div class="v">August</div></div>
      <div><div class="k">Distance</div><div class="v">${esc(trip.distance)}</div></div>
      <div><div class="k">Behind the wheel</div><div class="v">~30 hours</div></div>
    </dl>

    ${photo(['Cabot Trail', 'Peggys Cove, Nova Scotia'], 'Atlantic Canada', 'photo hero-photo', 'The Cabot Trail, Cape Breton').trim()}
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="section-head">
      <h2>The route</h2>
      <p>Seven bases in a loop out of Halifax. Tap any numbered pin to open that stop &mdash; the amber dots are
      day trips off the main route.</p>
    </div>
    <div class="map-shell">
      <div id="route-map" data-current=""></div>
      <div class="map-hint">
        <span class="map-key"><i></i> Driving</span>
        <span class="map-key ferry"><i></i> Ferry</span>
        <span class="map-key detour"><i></i> Day trip</span>
        <span style="margin-left:auto">Click the map to enable scroll zoom</span>
      </div>
    </div>
  </div>
</section>

<section class="section alt">
  <div class="wrap">
    <div class="section-head">
      <h2>Every stop</h2>
      <p>In travel order. Each has its own page with sights, places to eat, where to stay and links through
      to book.</p>
    </div>
    <div class="stop-grid">${stopCards}
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="section-head">
      <h2>At a glance</h2>
      <p>The driving is deliberately broken up. The longest single day is the run to Cape Breton, and that one
      has a 75-minute ferry in the middle of it.</p>
    </div>
    <div class="table-scroll">
      <table>
        <thead>
          <tr><th class="num-col">Days</th><th>Base</th><th class="num-col">Nights</th><th class="num-col">Drive in</th></tr>
        </thead>
        <tbody>${glanceRows}
        </tbody>
      </table>
    </div>
  </div>
</section>

<section class="section alt">
  <div class="wrap">
    <div class="section-head">
      <h2>Practical notes</h2>
      <p>The things worth sorting before you go.</p>
    </div>
    <div class="card-grid cols-3">${practicalCards}
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="section-head">
      <h2>What it costs</h2>
      <p>For 2 adults and 2 children, 16 days, booked 6&ndash;9 months in advance.</p>
    </div>
    <div class="table-scroll">
      <table>
        <thead><tr><th>Item</th><th class="num-col">Estimate</th></tr></thead>
        <tbody>${costRows}
        </tbody>
        <tfoot>
          <tr><td>${esc(costTotal.label)}</td><td class="num-col">${esc(costTotal.value)}</td></tr>
        </tfoot>
      </table>
    </div>
    <p style="color:var(--ink-3);font-size:.88rem;margin-top:12px">${esc(costTotal.note)}</p>

    <div class="section-head" style="margin-top:44px">
      <h2>Where you could save</h2>
    </div>
    <ul class="plain-list">
      ${savings.map((s) => `<li>${esc(s)}</li>`).join('\n      ')}
    </ul>
  </div>
</section>

<section class="section alt">
  <div class="wrap" style="text-align:center">
    <div class="section-head" style="margin-inline:auto">
      <h2>Start at the beginning</h2>
      <p>Halifax, two nights, and a waterfront to run off the flight on.</p>
    </div>
    <div class="link-row" style="justify-content:center">
      <a class="btn primary" href="halifax.html">Open stop 1 &mdash; Halifax</a>
      <a class="btn" href="#route-map">Back to the map</a>
    </div>
  </div>
</section>
`;

  return layout({
    title: `${trip.title} — ${trip.subtitle}`,
    description: `${trip.routeSummary}. ${trip.distance} over 16 days with two adults and two children, with photos, places to stay, and links to book.`,
    body,
    current: null,
  });
}

/* ------------------------------------------------------- location pages -- */

function locationPage(loc, index) {
  const prev = index > 0 ? locations[index - 1] : null;
  const isLast = index === locations.length - 1;
  const next = isLast ? locations[0] : locations[index + 1];

  const sightCards = loc.sights
    .map((s) => `
        <div class="card">
          ${photo(s.wiki, s.name, 'photo', s.name).trim()}
          <div class="card-body">
            <h3>${esc(s.name)}</h3>
            <p>${esc(s.blurb)}</p>
            ${s.callout ? `<div class="callout">${esc(s.callout)}</div>` : ''}
            ${s.link ? ext(s.link.href, s.link.label) : ''}
          </div>
        </div>`)
    .join('');

  const foodItems = loc.food
    .map((f) => `
        <li>
          <a href="${esc(f.link)}" target="_blank" rel="noopener noreferrer">
            <span class="fn">${esc(f.name)}</span>
            <span class="fd">${esc(f.blurb)}</span>
            <span class="fx">Map &amp; hours &rarr;</span>
          </a>
        </li>`)
    .join('');

  const stayCards = loc.stays
    .map((s) => `
        <div class="card stay">
          <div class="card-body">
            <div class="stay-head">
              <h3>${esc(s.name)}</h3>
              ${s.rating ? `<div class="rating"><span class="score">${esc(s.rating.score)}</span><span class="revs">${esc(s.rating.reviews)} reviews</span></div>` : ''}
            </div>
            ${s.price ? `<span class="price">${esc(s.price)}</span>` : ''}
            <p>${esc(s.blurb)}</p>
            ${s.facilities ? `<ul class="facil">${s.facilities.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>` : ''}
            ${ext(s.link, s.booking ? 'See photos & check prices' : 'Find places & prices')}
            ${s.booking ? '<span class="verified">Live availability &amp; guest reviews</span>' : ''}
          </div>
        </div>`)
    .join('');

  const stepsBlock = loc.itinerary
    ? `
<section class="section alt">
  <div class="wrap">
    <div class="section-head">
      <h2>${esc(loc.itinerary.title)}</h2>
      <p>Start early &mdash; this is the biggest day of the trip, and the whale tour is the fixed point everything
      else has to fit around.</p>
    </div>
    <ol class="steps">
      ${loc.itinerary.steps.map((st) => `
      <li>
        <h3>${esc(st.name)}</h3>
        <div class="t">${esc(st.time)}</div>
        <p>${esc(st.body)}</p>
      </li>`).join('')}
    </ol>
  </div>
</section>`
    : '';

  const finalNightBlock = loc.finalNight
    ? `
<section class="section alt">
  <div class="wrap">
    <div class="section-head">
      <h2>${esc(loc.finalNight.title)}</h2>
    </div>
    <p style="max-width:66ch;color:var(--ink-2)">${esc(loc.finalNight.body)}</p>
  </div>
</section>`
    : '';

  const body = `
<section class="loc-head">
  <div class="wrap">
    <span class="num-big">${index + 1}</span>
    <h1>${esc(loc.name)}</h1>
    <div class="region">${esc(loc.region)}</div>
    <p class="tagline">${esc(loc.tagline)}</p>

    <div class="meta-strip">
      <span class="chip">${esc(loc.days)}</span>
      <span class="chip"><b>${esc(nights(loc.nights))}</b></span>
      <span class="chip">Drive in <b>${esc(loc.driveIn.time)}</b></span>
      ${loc.alsoFinalNight ? '<span class="chip">Also your final night</span>' : ''}
    </div>

    <div class="drive-in"><b>Getting here:</b> ${esc(loc.driveIn.text)} &mdash; <b>${esc(loc.driveIn.time)}</b>.</div>

    ${photo(heroWiki[loc.slug], loc.name, 'photo hero-photo', `${loc.name}, ${loc.region}`).trim()}
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="section-head">
      <h2>The idea</h2>
    </div>
    <p style="max-width:66ch;font-size:1.05rem;color:var(--ink-2)">${esc(loc.overview)}</p>
    ${loc.callout ? `<div class="callout" style="max-width:66ch">${esc(loc.callout)}</div>` : ''}
  </div>
</section>
${stepsBlock}
<section class="section${loc.itinerary ? '' : ' alt'}">
  <div class="wrap">
    <div class="section-head">
      <h2>What to do</h2>
      <p>Hover or tap any photograph for its source on Wikimedia Commons.</p>
    </div>
    <div class="card-grid cols-3">${sightCards}
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="section-head">
      <h2>Where to eat</h2>
      <p>Every one of these opens in maps, so you get current opening hours and directions.</p>
    </div>
    <ul class="food-list">${foodItems}
    </ul>
  </div>
</section>

<section class="section alt">
  <div class="wrap">
    <div class="section-head">
      <h2>Where to stay</h2>
      ${loc.budget ? `<p>${esc(loc.budget)}.</p>` : ''}
    </div>
    <div class="card-grid cols-3">${stayCards}
    </div>
  </div>
</section>

<section class="section">
  <div class="wrap">
    <div class="section-head">
      <h2>Where this is</h2>
      <p>Stop ${index + 1} of ${locations.length}. The rest of the route is shown faintly &mdash; tap any other pin to jump there.</p>
    </div>
    <div class="map-shell">
      <div id="stop-map" class="map-mini" data-current="${esc(loc.slug)}"></div>
      <div class="map-hint">
        <span class="map-key"><i></i> Driving</span>
        <span class="map-key ferry"><i></i> Ferry</span>
        <span class="map-key detour"><i></i> Day trip</span>
        <span style="margin-left:auto"><a href="index.html#route-map">See the whole route &rarr;</a></span>
      </div>
    </div>
    ${loc.links?.length ? `<div class="link-row">${loc.links.map((l) => `<a class="btn" href="${esc(l.href)}" target="_blank" rel="noopener noreferrer">${esc(l.label)}</a>`).join('')}</div>` : ''}
  </div>
</section>
${finalNightBlock}
<nav class="wrap journey-nav" aria-label="Previous and next stop">
  ${prev
      ? `<a class="jn prev" href="${prev.slug}.html">
    <span class="jn-dir">Previous stop</span>
    <span class="jn-name">${esc(prev.name)}</span>
    <span class="jn-meta">${esc(prev.days)} &middot; ${esc(nights(prev.nights))}</span>
  </a>`
      : `<div class="jn prev is-empty">
    <span class="jn-dir">Start of the trip</span>
    <span class="jn-name">You are here</span>
    <span class="jn-meta">Landed at Halifax Stanfield</span>
  </div>`}
  <a class="jn next" href="${next.slug}.html">
    <span class="jn-dir">${isLast ? 'Back to the start' : 'Next stop'}</span>
    <span class="jn-name">${esc(next.name)}</span>
    <span class="jn-meta">${isLast ? 'Final night, then home &middot; 4 hr 30' : `${esc(next.days)} &middot; drive ${esc(next.driveIn.time)}`}</span>
  </a>
</nav>
`;

  return layout({
    title: `${loc.name} — ${trip.title} road trip`,
    description: `${loc.days}, ${nights(loc.nights)} in ${loc.name}, ${loc.region}. ${loc.tagline}`,
    body,
    current: loc.slug,
  });
}

/* ----------------------------------------------------------- route data -- */

function routeData() {
  const payload = {
    stops: locations.map((l, i) => ({
      slug: l.slug,
      number: i + 1,
      name: l.name,
      region: l.region,
      days: l.days,
      nights: nights(l.nights),
      coords: l.coords,
      href: `${l.slug}.html`,
    })),
    legs: routeLegs.map((leg) => ({
      label: leg.label,
      ferry: !!leg.ferry,
      detour: !!leg.detour,
      // Prefer real road geometry from the Directions API cache when available
      points: directionsCache[leg.label] ?? leg.points,
    })),
    waypoints,
  };

  return `/* Generated by build.mjs — do not edit by hand. */\nwindow.TRIP_ROUTE = ${JSON.stringify(payload, null, 2)};\n`;
}

/* ------------------------------------------------------------------ run -- */

async function main() {
  // Load Google Maps Directions API cache if available
  try {
    const raw = await readFile(join(ROOT, 'data', 'directions-cache.json'), 'utf8');
    directionsCache = JSON.parse(raw);
    const count = Object.keys(directionsCache).length;
    console.log(`Loaded directions cache (${count} leg${count === 1 ? '' : 's'}).`);
  } catch {
    console.log('No directions cache found — using manual waypoints from itinerary.mjs.');
    console.log('Run `node fetch-directions.mjs` with a Google Maps API key to enable real road routes.');
  }

  const written = [];

  const write = async (rel, contents) => {
    const path = join(ROOT, rel);
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, contents, 'utf8');
    written.push(`${rel}  (${(Buffer.byteLength(contents) / 1024).toFixed(1)} kB)`);
  };

  await write('index.html', homePage());
  for (const [i, loc] of locations.entries()) {
    await write(`${loc.slug}.html`, locationPage(loc, i));
  }
  await write('assets/js/route-data.js', routeData());

  console.log(`Built ${written.length} files:`);
  written.forEach((w) => console.log('  ' + w));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
