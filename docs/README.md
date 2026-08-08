# Nova Scotia & PEI — 16-day family road trip

A small static website that brings the itinerary to life: a map of the whole route,
a page for every stop, photographs of the sights, and links through to hotels,
tour operators and the places worth booking ahead.

## Viewing it

Everything is plain static HTML. Either open `index.html` directly, or serve the
folder (better — the map and photos behave properly over `http://`):

```sh
cd docs
python3 -m http.server 8000
# → http://localhost:8000
```

**Publishing on GitHub Pages:** the folder is called `docs/` deliberately. In the
repository's *Settings → Pages*, set the source to the `main`/`master` branch and
the `/docs` folder, and the site goes live with no build step.

## How it's put together

```
docs/
├── data/itinerary.mjs      ← every word of content lives here
├── build.mjs               ← turns the data into HTML
├── index.html              ← generated: route map + overview
├── <stop>.html             ← generated: one page per location
└── assets/
    ├── css/site.css
    ├── js/map.js           ← Leaflet route map
    ├── js/photos.js        ← photo loader
    ├── js/route-data.js    ← generated from the route waypoints
    └── vendor/leaflet/     ← Leaflet 1.9.4, vendored (no CDN)
```

To change any text, price, restaurant or link, edit `data/itinerary.mjs` and run:

```sh
node build.mjs
```

The generated HTML is committed, so the site works without anyone running Node.

## The map

Leaflet is vendored locally rather than loaded from a CDN, so the only thing the
map needs at runtime is OpenStreetMap tiles. The route is drawn from hand-placed
waypoints that follow the actual road corridors, so it hugs the coast instead of
cutting across the Atlantic:

- **solid blue** — driving
- **dashed orange** — ferries (Digby Neck, and Wood Islands → Caribou)
- **dotted amber** — day trips off the main route (Peggy's Cove, Brier Island, Hopewell Rocks)

Numbered pins open the relevant stop page. Scroll-zoom is disabled until you
click the map, so it doesn't hijack the page scroll on a phone.

## The photographs

Photos are fetched at page load from Wikipedia's image API, one batched request
per page. Each slot lists candidate article titles and takes the first that has a
lead image:

```html
<div class="photo" data-wiki="Halifax Citadel|Halifax, Nova Scotia" data-fallback="Halifax Citadel"></div>
```

This means the pictures are always real, correctly captioned and freely licensed,
with a credit link back to the source (hover any image). Redirects resolve, so
`Halifax Citadel` finds the photo on `Citadel Hill (Fort George)`. If nothing
resolves, the slot keeps a styled placeholder — nothing ever renders as a broken
image.

**To use your own photographs instead**, drop them in `assets/img/` and add a
`photo` field to the sight in `data/itinerary.mjs` — the local file wins over the
API. Hotel photography is licensed to the operators and can't be republished
here, so accommodation cards link out to the live galleries instead.

## Links

- **Hotels** marked *"Live availability & guest reviews"* are direct links to that
  property, with the guest score and review count taken from Booking.com.
- **Restaurants** open in maps, so you get current opening hours and directions
  rather than a website that may have moved.
- **Small operators** (whale tours, kayaking, cottages) go to a search for the
  business name, which stays working when they redesign their site.
- **Museums, parks and ferries** link to their official sites.

Prices and ratings are indicative and were captured while planning — always
confirm on the operator's own site before booking.
