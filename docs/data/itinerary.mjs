/**
 * Nova Scotia & PEI — 16-day family road trip.
 * Single source of truth for the whole site. `build.mjs` turns this into
 * static HTML; `assets/js/map.js` reads the route via the generated route.json.
 *
 * Link policy (see README): institutional links go to official sites, small
 * operators and restaurants go to a search or maps lookup so they never rot,
 * and hotel links marked `booking: true` are verified deep links.
 */

const gmaps = (q) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
const find = (q) => `https://www.google.com/search?q=${encodeURIComponent(q)}`;
const airbnb = (q) =>
  `https://www.airbnb.co.uk/s/${encodeURIComponent(q)}/homes`;
const bookingSearch = (q) =>
  `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(q)}`;

export const trip = {
  title: 'Nova Scotia & PEI',
  subtitle: 'A 16-day family road trip',
  party: '2 adults, 2 children (6 and 8)',
  timing: 'August — depart around 10–14 August, return 25–29 August',
  distance: '~2,300 km',
  driving: '~30 hours across 16 days',
  routeSummary:
    'Halifax → South Shore → Bay of Fundy → New Brunswick → PEI → Cape Breton → Halifax',
  intro:
    'Two whale-watching opportunities on opposite coasts, the highest tides in the world, ' +
    'red-sand beaches warm enough to swim in, and a highland plateau that falls straight into the sea. ' +
    'Seven bases over sixteen days, with the driving deliberately broken up so nobody spends a whole day in the car.',
};

/** Costs table from the itinerary, in GBP. */
export const costs = [
  ['Flights, LHR–Halifax return × 4', '£2,400 – 3,000', 'Direct with Air Canada, ~7 hrs. Peak August fares run £550–750pp.'],
  ['Car hire, 16 days (mid-size SUV)', '£1,000 – 1,300', 'Includes insurance top-up and additional driver.'],
  ['Accommodation, 15 nights', '£2,900 – 3,400', 'Averaging £195–225/night across the mix.'],
  ['Food and drink', '£1,900 – 2,400', '~£120–150/day; cottage kitchens on PEI reduce this.'],
  ['Activities and attractions', '£800 – 1,000', 'Two whale tours (~£260), Parks Canada pass, museums, fishing trip, water park.'],
  ['Fuel', '£250 – 320', '~2,300 km.'],
  ['Ferry and bridge tolls', '£80 – 100', 'Confederation Bridge CAD 50.25, Wood Islands ferry ~CAD 86.'],
  ['Contingency (10%)', '£900 – 1,100', ''],
];

export const costTotal = { label: 'Total', value: '£10,200 – 12,600', note: 'Central estimate around £11,000.' };

export const practical = [
  {
    title: 'Parks Canada Discovery Pass',
    body: 'A family pass is around CAD 151 and covers PEI National Park, Cape Breton Highlands, Fort Anne and Kejimkujik. Pays for itself by the third site.',
    link: { label: 'Buy a Discovery Pass', href: 'https://parks.canada.ca/voyage-travel/admission' },
  },
  {
    title: 'Car hire',
    body: 'Book a mid-size SUV well ahead — August inventory in Halifax gets thin and prices spike. Automatic is standard, driving is on the right, roads are wide and quiet.',
    link: { label: 'Halifax airport car hire', href: find('car hire Halifax Stanfield Airport') },
  },
  {
    title: 'Whale tours',
    body: 'Book both in advance and build in a spare day. Weather cancellations are common and refunds are standard. Bring layers, waterproofs and something for seasickness.',
    link: null,
  },
  {
    title: 'Hopewell Rocks tides',
    body: 'Check the published tide table before committing to a day. Arriving at high tide means seeing nothing but water — the whole point is walking on the ocean floor at low tide.',
    link: { label: 'Tide table', href: 'https://thehopewellrocks.ca/' },
  },
  {
    title: 'Taxes',
    body: '15% HST applies across all three provinces, plus a 2–5% provincial room levy in PEI. Confirm with smaller B&Bs whether tax is collected at booking or check-in.',
    link: null,
  },
  {
    title: 'Booking window',
    body: 'For August, book accommodation 6–12 months out. Rates climb more than 30% over shoulder season and popular cottages go a year ahead.',
    link: null,
  },
];

export const savings = [
  'Shift to early September — same warm water, materially cheaper flights and accommodation, far fewer people. The constraint is school term.',
  'Drop Digby and whale-watch only in Cape Breton — saves two nights and a day’s driving, roughly £700, at the cost of the better whale grounds.',
  'More self-catering — the PEI cottage and one or two Airbnbs with kitchens could take £400–500 off the food line.',
  'Book flights the moment August schedules load, typically around 11 months out. This is the single largest swing factor in the total.',
];

/**
 * The seven bases, in travel order. Halifax is both the first and last stop —
 * its page carries the closing night as well.
 */
export const locations = [
  {
    slug: 'halifax',
    name: 'Halifax',
    region: 'Nova Scotia',
    days: 'Days 1–3',
    nights: 2,
    coords: [44.6488, -63.5752],
    tagline: 'Land, decompress, and let the boys loose on the waterfront.',
    driveIn: { text: 'Halifax Stanfield Airport to downtown', time: '35 min' },
    alsoFinalNight: true,
    overview:
      'Arrival day plus a recovery day. Halifax is a compact, walkable port city and an easy first landing — the boys can run about on the waterfront boardwalk while you recalibrate to a four-hour time difference. Don’t over-plan day one; the flight lands mid-afternoon local time, which will feel like evening.',
    sights: [
      {
        name: 'Maritime Museum of the Atlantic',
        wiki: ['Maritime Museum of the Atlantic'],
        blurb:
          'Halifax recovered many of the Titanic victims and the museum holds a serious collection, including a surviving deckchair. Genuinely gripping for an 8-year-old, and there’s a Halifax Explosion section that’s handled well for children.',
        link: { label: 'Museum site', href: 'https://maritimemuseum.novascotia.ca/' },
      },
      {
        name: 'Halifax Citadel',
        wiki: ['Citadel Hill (Fort George)', 'Halifax Citadel'],
        blurb:
          'Star-shaped hilltop fort with costumed soldiers, a noon gun, and a children’s programme where kids get kitted out as junior redcoats. Book the soldier-for-a-day session ahead in August.',
        link: { label: 'Parks Canada', href: 'https://parks.canada.ca/lhn-nhs/ns/halifax' },
      },
      {
        name: 'Peggy’s Cove',
        wiki: ['Peggys Cove, Nova Scotia', 'Peggys Cove'],
        blurb:
          'Forty-five minutes out. The most photographed lighthouse in Canada, on wave-scoured granite. Go early or late to dodge coach parties, and keep the boys well back from the black rocks, which are genuinely dangerous when wet.',
        link: { label: 'Visitor info', href: find('Peggys Cove Nova Scotia visitor information') },
      },
      {
        name: 'Discovery Centre',
        wiki: ['Discovery Centre (Halifax)', 'Halifax, Nova Scotia'],
        blurb:
          'Four floors of hands-on science. This is your jet-lag insurance policy: indoors, air-conditioned, and it will absorb three hours.',
        link: { label: 'Discovery Centre', href: 'https://discoverycentre.ca/' },
      },
      {
        name: 'Waterfront boardwalk',
        wiki: ['Halifax Harbour', 'Halifax, Nova Scotia'],
        blurb:
          'Four kilometres of it, with the Wave sculpture (children climb it, adults slide off it), buskers, and a hydrostone.',
        link: { label: 'On the map', href: gmaps('Halifax Waterfront Boardwalk, Halifax NS') },
      },
    ],
    food: [
      { name: 'Salty’s', blurb: 'Waterfront, two floors. Take the downstairs bar side with children; fish and chips, chowder, lobster rolls, and a view of the harbour.', link: gmaps("Salty's Restaurant Halifax") },
      { name: 'Dave’s Lobster', blurb: 'Counter-service lobster rolls on the boardwalk. Fast, unfussy, about CAD 25 a roll.', link: gmaps("Dave's Lobster Halifax") },
      { name: 'The Bicycle Thief', blurb: 'Smarter Italian-leaning waterfront spot but entirely relaxed about families at 6pm. Good pasta for the boys.', link: gmaps('The Bicycle Thief Halifax') },
      { name: 'Halifax Seaport Farmers’ Market', blurb: 'Saturday morning breakfast. Oldest continuously operating market in North America.', link: gmaps('Halifax Seaport Farmers Market') },
      { name: 'Freak Lunchbox', blurb: 'Absurd sweet shop on Barrington Street. Budget for a bribe.', link: gmaps('Freak Lunchbox Barrington Street Halifax') },
      { name: 'COWS Creamery', blurb: 'Maritime institution. You will end up here repeatedly on this trip.', link: gmaps('COWS Creamery Halifax') },
    ],
    budget: 'Target £180–240 / CAD 315–420 per night',
    stays: [
      {
        name: 'Homewood Suites by Hilton Halifax — Downtown',
        blurb:
          'One- and two-bedroom suites with kitchens, indoor pool, breakfast included. Top of budget, but the separate bedroom and kitchen earn their keep on arrival night.',
        price: 'Around CAD 380–450 in August',
        rating: { score: 8.5, reviews: 312, stars: 3 },
        facilities: ['Indoor heated pool', 'Kitchens', 'Family rooms', 'Free WiFi'],
        link: 'https://www.booking.com/hotel/ca/homewood-suites-by-hilton-halifax.html',
        booking: true,
      },
      {
        name: 'Cambridge Suites Halifax',
        blurb: 'Similar suite format, slightly cheaper, with a rooftop terrace.',
        price: 'Around CAD 340–420',
        rating: { score: 8.3, reviews: 1308, stars: 3 },
        facilities: ['Rooftop terrace', 'Family rooms', 'Fitness centre', 'Hot tub'],
        link: 'https://www.booking.com/hotel/ca/cambridge-suites-halifax.html',
        booking: true,
      },
      {
        name: 'Airbnb — North End or South End',
        blurb:
          'A two-bed flat gives you laundry, which matters on a 16-day trip, and puts you in a real neighbourhood rather than a hotel corridor.',
        price: 'CAD 300–380',
        link: airbnb('Halifax--Nova Scotia'),
      },
    ],
    links: [
      { label: 'Discover Halifax', href: 'https://discoverhalifax.ca/' },
      { label: 'Tourism Nova Scotia', href: 'https://www.novascotia.com/' },
    ],
    finalNight: {
      title: 'Days 15–16 — back to Halifax, and home',
      body:
        'Ingonish to Halifax is 4 hr 30. Break it at the Canso Causeway or in Antigonish. Last night near the airport or back downtown, depending on your flight time. If you have the afternoon, the Discovery Centre or Point Pleasant Park fills it easily. Air Canada’s Halifax–Heathrow service is an overnight departure, arriving back mid-morning — which works well with children, though nobody sleeps much.',
    },
  },

  {
    slug: 'lunenburg',
    name: 'Lunenburg',
    region: 'South Shore, Nova Scotia',
    days: 'Days 3–5',
    nights: 2,
    coords: [44.3776, -64.3153],
    tagline: 'UNESCO clapboard, a working harbour, and the first proper beaches.',
    driveIn: {
      text: 'Halifax to Lunenburg direct is 1 hr 15 — but take the coastal route via Peggy’s Cove, Chester and Mahone Bay and make a half-day of it',
      time: '2 hr 30 with stops',
    },
    overview:
      'A UNESCO World Heritage town of painted clapboard houses stacked up a hillside above a working harbour. This is the prettiest stretch of the trip and the first proper beach opportunity — the South Shore beaches are white sand, though the Atlantic here is bracing at around 16–18°C. Manageable for children, who feel the cold less than you do.',
    sights: [
      {
        name: 'Fisheries Museum of the Atlantic',
        wiki: ['Fisheries Museum of the Atlantic'],
        blurb:
          'Right on the wharf, with aquarium tanks, a working boat shed, and the Bluenose II schooner often berthed alongside. Two hours minimum.',
        link: { label: 'Museum site', href: 'https://fisheriesmuseum.novascotia.ca/' },
      },
      {
        name: 'Bluenose II',
        wiki: ['Bluenose II', 'Bluenose'],
        blurb:
          'The replica of the schooner on the Canadian dime. When she’s in port you can go aboard, and she runs harbour sailings through the summer.',
        link: { label: 'Sailing schedule', href: 'https://bluenose.novascotia.ca/' },
      },
      {
        name: 'Blue Rocks',
        wiki: ['Blue Rocks, Nova Scotia', 'Lunenburg, Nova Scotia'],
        blurb:
          'Five minutes from Lunenburg, a cluster of fishing shacks on slate outcrops. Pleasant Paddling run family-friendly kayak trips through the islands here — suitable for the 8-year-old in a double, the 6-year-old in a triple with you.',
        link: { label: 'Pleasant Paddling kayak tours', href: find('Pleasant Paddling Blue Rocks kayak tours Lunenburg') },
      },
      {
        name: 'The Ovens Natural Park',
        wiki: ['The Ovens, Nova Scotia', 'Lunenburg County, Nova Scotia'],
        blurb:
          'Clifftop trail past sea caves you can hear booming below, plus gold-panning in the river. Genuinely thrilling for this age group.',
        link: { label: 'The Ovens Natural Park', href: find('The Ovens Natural Park Nova Scotia') },
      },
      {
        name: 'Hirtle’s Beach & Rissers Beach',
        wiki: ['Rissers Beach Provincial Park', 'Lunenburg County, Nova Scotia'],
        blurb:
          'Long sand crescents, lifeguarded in season at Rissers, which also has warmer, shallower water than Hirtle’s.',
        link: { label: 'Rissers Beach Provincial Park', href: 'https://parks.novascotia.ca/' },
      },
      {
        name: 'Mahone Bay',
        wiki: ['Mahone Bay, Nova Scotia'],
        blurb: 'Three churches reflected in the harbour, good ice cream, twenty minutes north.',
        link: { label: 'On the map', href: gmaps('Mahone Bay, Nova Scotia') },
      },
    ],
    food: [
      { name: 'Salt Shaker Deli', blurb: 'The reliable answer. Wood-fired pizza, fish tacos, chowder, harbour view, and no fuss about children.', link: gmaps('Salt Shaker Deli Lunenburg') },
      { name: 'The Grand Banker Bar & Grill', blurb: 'Solid pub food, extensive kids’ menu, lively.', link: gmaps('The Grand Banker Bar and Grill Lunenburg') },
      { name: 'The Old Fish Factory', blurb: 'Inside the Fisheries Museum. Big, breezy, on the water, and convenient if you’re already there.', link: gmaps('The Old Fish Factory Restaurant Lunenburg') },
      { name: 'The Barn Coffee & Social House', blurb: 'Best breakfast stop in the area, over in Mahone Bay.', link: gmaps('The Barn Coffee and Social House Mahone Bay') },
    ],
    stays: [
      {
        name: 'Airbnb in Lunenburg Old Town',
        blurb:
          'Heritage houses with harbour views. This is the best-value option here and lets you walk everywhere — which in a town this steep and this pretty is the entire point.',
        price: 'CAD 320–420',
        link: airbnb('Lunenburg--Nova Scotia'),
      },
      {
        name: 'Lunenburg Arms Hotel',
        blurb: 'Central, harbour-facing, with a spa and a restaurant if you want a night off self-catering.',
        price: 'Around CAD 350–400',
        link: bookingSearch('Lunenburg, Nova Scotia'),
      },
      {
        name: 'Cottage at Blue Rocks or Second Peninsula',
        blurb: 'Quieter and more space, five to fifteen minutes out of town. Better if you want the boys running around outside.',
        price: 'CAD 300–380',
        link: airbnb('Blue Rocks--Nova Scotia'),
      },
    ],
    links: [
      { label: 'Town of Lunenburg', href: 'https://www.explorelunenburg.ca/' },
      { label: 'UNESCO listing — Old Town Lunenburg', href: 'https://whc.unesco.org/en/list/741/' },
    ],
  },

  {
    slug: 'digby',
    name: 'Digby & Brier Island',
    region: 'Bay of Fundy, Nova Scotia',
    days: 'Days 5–7',
    nights: 2,
    coords: [44.622, -65.758],
    tagline: 'The world’s highest tides, and the best whale grounds on the trip.',
    driveIn: { text: 'Lunenburg to Digby via Bridgewater and the Annapolis Valley', time: '2 hr 15' },
    overview:
      'The Bay of Fundy has the world’s highest tides, and the enormous volume of water flushing through four times a day drives a food chain that draws whales in numbers. This is the anchor of the trip’s wildlife content. Digby itself is a small scallop-fishing port — pleasant rather than beautiful — and functions as your base.',
    sights: [
      {
        name: 'Whale watching from Brier Island',
        wiki: ['Humpback whale', 'Brier Island'],
        blurb:
          'The main event. The drive from Digby down Highway 217 takes about 90 minutes including two short ferry hops that run hourly, are free, and are an adventure in themselves. In August you’re looking at humpbacks, finbacks, minkes, harbour porpoises and white-sided dolphins, with occasional pilot whales. Roughly CAD 75 adult / CAD 35 child, 3–4 hours.',
        link: { label: 'Mariner Cruises & Brier Island Whale Cruises', href: find('Brier Island whale watching Mariner Cruises Westport Nova Scotia') },
        callout:
          'Timing matters: for a 12:30 tour you need to leave Digby by about 9:45 to catch the 10:30 ferry and the 11:00 connection. Book the tour in advance, confirm the ferry schedule the day before, and bring layers — it is significantly colder on the water than on land, even in August.',
      },
      {
        name: 'Balancing Rock trail',
        wiki: ['Long Island (Nova Scotia)', 'Digby Neck'],
        blurb:
          'On Long Island, en route to Brier Island. A 2.5km boardwalk through forest ending in 235 steps down to a basalt column improbably standing on end. The boys will love the steps; you will feel them.',
        link: { label: 'Trail info', href: find('Balancing Rock trail Long Island Nova Scotia') },
      },
      {
        name: 'Bay of Fundy tides',
        wiki: ['Bay of Fundy'],
        blurb:
          'The tidal range here runs to sixteen metres. Watch the Digby waterfront over a few hours and the boats go from afloat to sitting on mud and back again.',
        link: { label: 'Tide tables', href: find('Digby Nova Scotia tide times') },
      },
      {
        name: 'Annapolis Royal',
        wiki: ['Annapolis Royal', 'Fort Anne'],
        blurb:
          'Thirty-five minutes from Digby. Fort Anne, the Historic Gardens, and one of the oldest European settlements in North America.',
        link: { label: 'Fort Anne — Parks Canada', href: 'https://parks.canada.ca/lhn-nhs/ns/fortanne' },
      },
    ],
    food: [
      { name: 'Crow’s Nest', blurb: 'Locally famous for Digby clams. Unpretentious, busy, correct.', link: gmaps("Crow's Nest Restaurant Digby Nova Scotia") },
      { name: 'The Fundy Restaurant', blurb: 'Waterside, scallops done properly, full kids’ menu.', link: gmaps('The Fundy Restaurant Digby') },
      { name: 'Shoreline Restaurant', blurb: 'Reliable seafood, good chowder.', link: gmaps('Shoreline Restaurant Digby') },
      { name: 'Roof Hound Brewing Co.', blurb: 'Family-friendly patio, decent food, useful for a low-key evening.', link: gmaps('Roof Hound Brewing Digby') },
    ],
    stays: [
      {
        name: 'Digby Pines Golf Resort & Spa',
        blurb:
          'Norman-style resort hotel with an outdoor heated pool, extensive grounds, and family cottages. The pool makes this the right call with children.',
        price: 'Around CAD 350–450',
        rating: { score: 7.4, reviews: 413, stars: 4 },
        facilities: ['Heated outdoor pool', 'Family rooms', 'Children’s playground', 'Restaurant'],
        link: 'https://www.booking.com/hotel/ca/digby-pines-golf-resort.html',
        booking: true,
      },
      {
        name: 'Airbnb around Digby or Smiths Cove',
        blurb: 'More space and sea views, a few minutes out along the Annapolis Basin.',
        price: 'CAD 280–360',
        link: airbnb('Digby--Nova Scotia'),
      },
    ],
    links: [
      { label: 'Bay of Fundy tourism', href: 'https://www.novascotia.com/places-to-go/regions/bay-of-fundy-and-annapolis-valley' },
      { label: 'Digby Neck ferry schedules', href: find('Digby Neck ferry schedule Tiverton Freeport') },
    ],
  },

  {
    slug: 'shediac',
    name: 'Shediac',
    region: 'New Brunswick',
    days: 'Days 7–8',
    nights: 1,
    coords: [46.2186, -64.5411],
    tagline: 'A staging post that turns out to be two of the best kid-days of the trip.',
    driveIn: { text: 'Digby to Shediac via the Annapolis Valley, Truro and Moncton', time: '3 hr 45' },
    overview:
      'A deliberate staging post to break what would otherwise be a brutal six-hour transfer to PEI. It also happens to deliver two of the best kid-days of the trip. Shediac bills itself as the lobster capital of the world and has a fourteen-tonne concrete lobster to prove it.',
    sights: [
      {
        name: 'Hopewell Rocks',
        wiki: ['Hopewell Rocks'],
        blurb:
          'Forty minutes off the route near Moncton, and unmissable. At low tide you walk on the ocean floor among towering flowerpot-shaped sea stacks; six hours later the same spot is under 12 metres of water.',
        link: { label: 'Hopewell Rocks — tides & tickets', href: 'https://thehopewellrocks.ca/' },
        callout:
          'Check the tide table before you set off and plan your arrival around low tide — it’s the whole point. Arriving at high tide means seeing nothing but water.',
      },
      {
        name: 'Parlee Beach',
        wiki: ['Parlee Beach Provincial Park', 'Shediac'],
        blurb:
          'Shallow, sandy, and among the warmest saltwater in Canada at 20–22°C in August. Supervised in season. This is where the boys get their first proper warm swim.',
        link: { label: 'Parlee Beach Provincial Park', href: find('Parlee Beach Provincial Park New Brunswick') },
      },
      {
        name: 'Magic Mountain Water Park',
        wiki: ['Magic Mountain (water park)', 'Moncton'],
        blurb: 'Over in Moncton — your wet-weather contingency, and a decent bribe.',
        link: { label: 'Magic Mountain', href: find('Magic Mountain water park Moncton') },
      },
      {
        name: 'The world’s largest lobster',
        wiki: ['Shediac'],
        blurb: 'Fourteen tonnes of concrete crustacean on the way into town. Non-negotiable photo stop.',
        link: { label: 'On the map', href: gmaps('Giant Lobster Shediac New Brunswick') },
      },
    ],
    food: [
      { name: 'Captain Dan’s, Pointe-du-Chêne wharf', blurb: 'Casual, on the water, seafood and burgers.', link: gmaps("Captain Dan's Pointe-du-Chene wharf Shediac") },
      { name: 'Paturel Shore House', blurb: 'Lobster suppers with a view.', link: gmaps('Paturel Shore House Shediac') },
    ],
    stays: [
      {
        name: 'Hôtel Shediac',
        blurb: 'Modern, well-reviewed, indoor heated pool, five minutes from Parlee Beach. For one night, this is the easy answer.',
        price: 'Around CAD 250–320',
        rating: { score: 8.9, reviews: 405, stars: 4 },
        facilities: ['Indoor heated pool', 'Restaurant', 'Free parking', 'Free WiFi'],
        link: 'https://www.booking.com/hotel/ca/shediac-shediac.html',
        booking: true,
      },
      {
        name: 'Airbnb in Shediac',
        blurb: 'Plenty of options near Parlee Beach if you want a kitchen and more room.',
        price: 'CAD 250–330',
        link: airbnb('Shediac--New Brunswick'),
      },
      {
        name: 'Moncton chain hotel',
        blurb: 'Hampton Inn, Residence Inn and similar. It’s one night — prioritise convenience over character.',
        price: 'CAD 250–320',
        link: bookingSearch('Moncton, New Brunswick'),
      },
    ],
    links: [
      { label: 'Tourism New Brunswick', href: 'https://www.tourismnewbrunswick.ca/' },
      { label: 'Bay of Fundy tides explained', href: 'https://thehopewellrocks.ca/' },
    ],
  },

  {
    slug: 'cavendish',
    name: 'Cavendish',
    region: 'Prince Edward Island',
    days: 'Days 8–12',
    nights: 4,
    coords: [46.4967, -63.3906],
    tagline: 'Four nights in one place. Red cliffs, warm water, and no schedule.',
    driveIn: { text: 'Shediac to Cavendish via the Confederation Bridge — 12.9 km, and a genuine event in itself. Toll CAD 50.25, charged on the way off the island', time: '2 hr 30' },
    overview:
      'This is the decompression block, and where the trip earns its beach credentials. Four nights in one place with a heated pool at the cottage and warm water at the beach. Deliberately unstructured — after a week of moving, everyone needs it.',
    sights: [
      {
        name: 'Cavendish & Brackley Beaches',
        wiki: ['Prince Edward Island National Park', 'Cavendish, Prince Edward Island'],
        blurb:
          'Red cliffs, white sand, and water reaching 21–23°C in late August. Part of PEI National Park; a Parks Canada pass covers entry.',
        link: { label: 'PEI National Park', href: 'https://parks.canada.ca/pn-np/pe/pei-ipe' },
      },
      {
        name: 'Greenwich Dunes',
        wiki: ['Greenwich, Prince Edward Island', 'Prince Edward Island National Park'],
        blurb:
          'A floating boardwalk across a pond to enormous parabolic dunes. Easy 4.5km round trip and the single best walk on the island for this age group. About an hour east.',
        link: { label: 'Greenwich — Parks Canada', href: 'https://parks.canada.ca/pn-np/pe/pei-ipe' },
      },
      {
        name: 'Basin Head Provincial Park',
        wiki: ['Basin Head Provincial Park', 'Prince Edward Island'],
        blurb:
          '“Singing sands” that squeak underfoot, plus a channel the local children jump into. Ninety minutes east, worth a full day.',
        link: { label: 'Basin Head', href: find('Basin Head Provincial Park PEI singing sands') },
      },
      {
        name: 'Deep-sea fishing from North Rustico',
        wiki: ['North Rustico', 'Prince Edward Island'],
        blurb:
          'Two-hour family trips, they bait the hooks for you, and you’ll catch mackerel. Reliably a highlight at this age.',
        link: { label: 'Find a boat', href: find('North Rustico deep sea fishing family trips PEI') },
      },
      {
        name: 'Green Gables Heritage Place',
        wiki: ['Green Gables', 'Anne of Green Gables'],
        blurb:
          'If either boy has any interest, fine; if not, the surrounding Balsam Hollow woodland trails are pleasant regardless.',
        link: { label: 'Green Gables — Parks Canada', href: 'https://parks.canada.ca/lhn-nhs/pe/greengables' },
      },
      {
        name: 'Confederation Bridge',
        wiki: ['Confederation Bridge'],
        blurb: 'Nearly thirteen kilometres of it, curving out of sight over the Northumberland Strait. The boys will not stop talking about it.',
        link: { label: 'Bridge & tolls', href: 'https://www.confederationbridge.com/' },
      },
      {
        name: 'Confederation Trail',
        wiki: ['Confederation Trail'],
        blurb: 'Flat, gravel, former railway line. Bike hire in Cavendish; an easy 10km with children.',
        link: { label: 'Trail info', href: find('Confederation Trail PEI bike hire Cavendish') },
      },
      {
        name: 'Charlottetown',
        wiki: ['Charlottetown'],
        blurb: 'Half a day. Victorian streets, the waterfront, and the COWS Creamery factory, which does tours.',
        link: { label: 'Discover Charlottetown', href: find('Discover Charlottetown PEI things to do') },
      },
      {
        name: 'Shining Waters Family Fun Park',
        wiki: ['Cavendish, Prince Edward Island'],
        blurb: 'Waterslides and pedal boats. Cavendish’s rainy-day answer.',
        link: { label: 'Shining Waters', href: find('Shining Waters Family Fun Park Cavendish PEI') },
      },
    ],
    food: [
      { name: 'New Glasgow Lobster Suppers', blurb: 'An institution since 1958. All-you-can-eat mussels, chowder and rolls before the main event, and proper children’s portions. Book ahead.', link: gmaps('New Glasgow Lobster Suppers PEI') },
      { name: 'Blue Mussel Café, North Rustico', blurb: 'Small, harbourside, excellent. Worth the queue.', link: gmaps('Blue Mussel Cafe North Rustico PEI') },
      { name: 'Richard’s Fresh Seafood, Covehead', blurb: 'Order at the window, eat at picnic tables by the harbour. The best casual meal on the island.', link: gmaps("Richard's Fresh Seafood Covehead PEI") },
      { name: 'Carr’s Oyster Bar, Stanley Bridge', blurb: 'For you rather than the boys, but they do a good burger.', link: gmaps("Carr's Oyster Bar Stanley Bridge PEI") },
      { name: 'Water Prince Corner Shop, Charlottetown', blurb: 'Unfussy lobster dinners in a converted corner shop.', link: gmaps('Water Prince Corner Shop Charlottetown') },
    ],
    stays: [
      {
        name: 'Cavendish Maples Cottages',
        blurb:
          'Two- and three-bedroom cottages with kitchens, a heated outdoor pool and a playground. Superb guest scores and exactly the right format for four nights.',
        price: 'CAD 320–420',
        rating: { score: 9.5, reviews: 172, stars: 4 },
        facilities: ['Heated outdoor pool', 'Kitchens', 'Playground', 'BBQ facilities'],
        link: 'https://www.booking.com/hotel/ca/cavendish-maples-cottages.html',
        booking: true,
      },
      {
        name: 'Other Cavendish cottage resorts',
        blurb:
          'Mayfield Country Cottages, Hidden Acres, or Kindred Spirits Country Inn & Cottages. A two- or three-bedroom with a kitchen, separate bedrooms and a pool on site is cheaper than two hotel rooms.',
        price: 'CAD 320–420',
        link: bookingSearch('Cavendish, Prince Edward Island'),
      },
    ],
    callout:
      'Book this one early. PEI fills hard for August, and cottage operators often impose weekly minimums in peak season.',
    links: [
      { label: 'Tourism PEI', href: 'https://www.tourismpei.com/' },
      { label: 'PEI National Park', href: 'https://parks.canada.ca/pn-np/pe/pei-ipe' },
    ],
  },

  {
    slug: 'baddeck',
    name: 'Baddeck',
    region: 'Cape Breton, Nova Scotia',
    days: 'Days 12–13',
    nights: 1,
    coords: [46.1, -60.755],
    tagline: 'A gentle landing on an inland sea before the Cabot Trail.',
    driveIn: {
      text: 'Cavendish to Baddeck, taking the Wood Islands to Caribou ferry (75-minute crossing, roughly CAD 86 per car) rather than doubling back over the bridge — same journey time, the boys get a boat, and you save the bridge toll',
      time: '5 hr 15 incl. ferry',
    },
    overview:
      'A staging night on the shore of the Bras d’Or Lake, an inland sea in the middle of Cape Breton. Warm, calm, swimmable water and a gentle landing before the Cabot Trail.',
    sights: [
      {
        name: 'Alexander Graham Bell National Historic Site',
        wiki: ['Alexander Graham Bell National Historic Site', 'Alexander Graham Bell'],
        blurb:
          'Much better than it sounds. Bell spent his summers here and the museum covers his kites, hydrofoils and aircraft as well as the telephone. Hands-on sections for children.',
        link: { label: 'Parks Canada', href: 'https://parks.canada.ca/lhn-nhs/ns/grahambell' },
      },
      {
        name: 'Swimming in the Bras d’Or',
        wiki: ["Bras d'Or Lake"],
        blurb: 'Sheltered and noticeably warmer than the open Atlantic — a UNESCO Biosphere Reserve, and effectively an inland sea.',
        link: { label: 'On the map', href: gmaps("Bras d'Or Lake Baddeck Nova Scotia") },
      },
      {
        name: 'Kidston Island',
        wiki: ['Baddeck'],
        blurb: 'A free ferry from the Baddeck wharf to a small island with a lighthouse and a supervised beach.',
        link: { label: 'Kidston Island ferry', href: find('Kidston Island ferry Baddeck lighthouse beach') },
      },
    ],
    food: [
      { name: 'Baddeck Lobster Suppers', blurb: 'Same format as New Glasgow, equally good.', link: gmaps('Baddeck Lobster Suppers Nova Scotia') },
      { name: 'The Freight Shed', blurb: 'On the wharf, casual, good chowder.', link: gmaps('The Freight Shed Baddeck') },
    ],
    stays: [
      {
        name: 'Inverary Resort',
        blurb:
          'Lakefront, indoor pool, family cabins and rooms, on-site dining. The obvious choice with children, and walkable into the village.',
        price: 'Around CAD 330–420',
        link: bookingSearch('Baddeck, Nova Scotia'),
      },
      {
        name: 'Trailsman Lodge',
        blurb: 'Outdoor pool, private beach area, family rooms and a games room. Good value if Inverary is full.',
        price: 'Around CAD 210–280',
        rating: { score: 7.6, reviews: 1298, stars: 4 },
        facilities: ['Outdoor pool', 'Private beach', 'Family rooms', 'Games room'],
        link: 'https://www.booking.com/hotel/ca/trailsman-motel.html',
        booking: true,
      },
    ],
    links: [
      { label: 'Destination Cape Breton', href: 'https://www.cbisland.com/' },
      { label: 'Northumberland Ferries (Wood Islands–Caribou)', href: 'https://www.ferries.ca/' },
    ],
  },

  {
    slug: 'ingonish',
    name: 'Ingonish',
    region: 'Cape Breton, Nova Scotia',
    days: 'Days 13–15',
    nights: 2,
    coords: [46.69, -60.39],
    tagline: 'The Cabot Trail, a second shot at whales, and the best beach setup of the trip.',
    driveIn: {
      text: 'The big day — Baddeck to Ingonish the long way round, driving the western half of the Cabot Trail, plus stops and a whale tour. Start early',
      time: '3 hr 30 driving',
    },
    overview:
      'The Cabot Trail is the scenic set-piece of Atlantic Canada: a highland plateau dropping in cliffs straight into the sea, with the road cut into the side of it. Ingonish then gives you two nights to do the eastern highlights at a slower pace.',
    itinerary: {
      title: 'The Cabot Trail day, in order',
      steps: [
        {
          name: 'Baddeck → Margaree Valley → Chéticamp',
          time: '1 hr 15',
          body: 'Chéticamp is Acadian, French-speaking, and a good coffee stop.',
        },
        {
          name: 'Chéticamp → Pleasant Bay',
          time: '45 min',
          body:
            'Through the national park’s most dramatic stretch. Stop at the Skyline Trail if you have the appetite — a 7km loop to a headland boardwalk, moose common, very doable for an 8-year-old but a stretch for a 6-year-old. There’s a shorter out-and-back option.',
        },
        {
          name: 'Whale watching at Pleasant Bay',
          time: '~2.5 hrs',
          body:
            'Your second bite. Captain Mark’s Whale & Seal Cruise or Love Boat Whale Cruises. Pilot whales are the speciality here and are reliably seen in August; minkes and finbacks too. Around CAD 60 adult / CAD 30 child. Zodiac and larger-boat options — take the larger boat with a 6-year-old.',
        },
        {
          name: 'Pleasant Bay → Ingonish',
          time: '1 hr 30',
          body: 'Over North Mountain and down the eastern side.',
        },
      ],
    },
    sights: [
      {
        name: 'Cabot Trail',
        wiki: ['Cabot Trail'],
        blurb:
          'Nearly 300 km of it around the northern tip of Cape Breton. The western half, which you drive on the way in, is the dramatic one.',
        link: { label: 'Cabot Trail', href: 'https://www.cbisland.com/explore/cabot-trail/' },
      },
      {
        name: 'Cape Breton Highlands National Park',
        wiki: ['Cape Breton Highlands National Park'],
        blurb: 'A third of the Cabot Trail runs through it. Your Parks Canada pass covers entry.',
        link: { label: 'Parks Canada', href: 'https://parks.canada.ca/pn-np/ns/cbreton' },
      },
      {
        name: 'Whale watching at Pleasant Bay',
        wiki: ['Pilot whale', 'Long-finned pilot whale'],
        blurb:
          'Pilot whales are the speciality and are reliably seen in August, with minkes and finbacks too. Take the larger boat rather than the zodiac with a 6-year-old.',
        link: { label: 'Pleasant Bay whale cruises', href: find("Captain Mark's Whale and Seal Cruise Pleasant Bay Cape Breton") },
      },
      {
        name: 'Ingonish Beach',
        wiki: ['Ingonish'],
        blurb:
          'A freshwater lake and an ocean beach separated by a sand bar. The boys can choose warm or bracing. Best beach setup on the trip.',
        link: { label: 'On the map', href: gmaps('Ingonish Beach Nova Scotia') },
      },
      {
        name: 'Middle Head Trail',
        wiki: ['Cape Breton Highlands National Park'],
        blurb: '4km out-and-back along a narrow peninsula with sea on both sides. Easy, spectacular, seals often visible.',
        link: { label: 'Trail info', href: find('Middle Head Trail Ingonish Cape Breton') },
      },
      {
        name: 'Skyline Trail',
        wiki: ['Cape Breton Highlands National Park'],
        blurb: 'A 7km loop to a headland boardwalk over the sea, moose common. There’s a shorter out-and-back if the 6-year-old flags.',
        link: { label: 'Skyline Trail', href: find('Skyline Trail Cape Breton Highlands National Park') },
      },
      {
        name: 'Neil’s Harbour',
        wiki: ["Neil's Harbour", 'Ingonish'],
        blurb: 'Small fishing village twenty minutes north with a lighthouse — and the best meal in Cape Breton beside it.',
        link: { label: 'On the map', href: gmaps("Neil's Harbour Nova Scotia") },
      },
      {
        name: 'Mary Ann Falls',
        wiki: ['Cape Breton Highlands National Park'],
        blurb: 'Swimming hole beneath a waterfall, reached by a gravel road. Cold but irresistible.',
        link: { label: 'On the map', href: gmaps('Mary Ann Falls Cape Breton Highlands National Park') },
      },
      {
        name: 'Chéticamp',
        wiki: ['Chéticamp, Nova Scotia'],
        blurb: 'Acadian, French-speaking, and your coffee stop on the way round the western side.',
        link: { label: 'On the map', href: gmaps('Cheticamp Nova Scotia') },
      },
    ],
    food: [
      { name: 'Chowder House, Neil’s Harbour', blurb: 'Beside the lighthouse, picnic tables, seafood chowder and lobster rolls. The best meal in Cape Breton and entirely informal.', link: gmaps("Chowder House Neil's Harbour Nova Scotia") },
      { name: 'Main Street Restaurant & Bakery', blurb: 'Hearty, cheap, generous. Good breakfasts, in Ingonish.', link: gmaps('Main Street Restaurant and Bakery Ingonish') },
      { name: 'Rusty Anchor, Pleasant Bay', blurb: 'Convenient for the whale tour day.', link: gmaps('Rusty Anchor Restaurant Pleasant Bay Nova Scotia') },
      { name: 'Coastal Waters Restaurant', blurb: 'Reliable evening option in Ingonish.', link: gmaps('Coastal Waters Restaurant Ingonish') },
    ],
    stays: [
      {
        name: 'Glenghorm Beach Resort',
        blurb:
          'Directly on the beach, with an outdoor pool, family rooms and cottages, and a playground. The practical family choice.',
        price: 'Around CAD 300–380',
        rating: { score: 7.0, reviews: 581, stars: 2 },
        facilities: ['Private beach', 'Outdoor pool', 'Family rooms', 'Games room'],
        link: 'https://www.booking.com/hotel/ca/glenghorm-resort.html',
        booking: true,
      },
      {
        name: 'Castle Rock Country Inn',
        blurb: 'Ocean views from every room, a few minutes south at Ingonish Ferry.',
        price: 'Around CAD 280–350',
        link: bookingSearch('Ingonish, Nova Scotia'),
      },
      {
        name: 'Keltic Lodge at the Highlands',
        blurb:
          'The grand option, on a headland with a pool. Above budget but worth pricing for one night — the setting is the best on the trip.',
        price: 'Around CAD 450–550',
        link: find('Keltic Lodge at the Highlands Ingonish booking'),
      },
    ],
    links: [
      { label: 'Cape Breton Highlands National Park', href: 'https://parks.canada.ca/pn-np/ns/cbreton' },
      { label: 'Destination Cape Breton', href: 'https://www.cbisland.com/' },
    ],
  },
];

/**
 * Road-corridor waypoints for each leg, so the drawn route follows the land
 * rather than cutting across the Atlantic. `ferry: true` legs render dashed.
 */
export const routeLegs = [
  {
    from: 'halifax',
    to: 'lunenburg',
    label: 'Halifax → Lunenburg (coastal route)',
    points: [
      [44.6488, -63.5752], [44.57, -63.76], [44.4922, -63.9163],
      [44.54, -64.24], [44.4487, -64.3819], [44.3776, -64.3153],
    ],
  },
  {
    from: 'lunenburg',
    to: 'digby',
    label: 'Lunenburg → Digby',
    points: [
      [44.3776, -64.3153], [44.378, -64.519], [44.59, -64.95],
      [44.742, -65.515], [44.622, -65.758],
    ],
  },
  {
    from: 'digby',
    to: 'brier-island',
    label: 'Digby → Brier Island (whale watching, two free ferries)',
    ferry: true,
    detour: true,
    points: [
      [44.622, -65.758], [44.42, -66.03], [44.39, -66.21],
      [44.28, -66.34], [44.2506, -66.3603],
    ],
  },
  {
    from: 'digby',
    to: 'shediac',
    label: 'Digby → Shediac',
    points: [
      [44.622, -65.758], [44.742, -65.515], [45.077, -64.496],
      [44.988, -64.137], [45.367, -63.28], [45.817, -64.213],
      [46.0878, -64.7782], [46.2186, -64.5411],
    ],
  },
  {
    from: 'shediac',
    to: 'hopewell-rocks',
    label: 'Day trip → Hopewell Rocks',
    detour: true,
    points: [[46.2186, -64.5411], [46.0878, -64.7782], [45.8175, -64.5794]],
  },
  {
    from: 'shediac',
    to: 'cavendish',
    label: 'Shediac → Cavendish (Confederation Bridge)',
    points: [
      [46.2186, -64.5411], [46.16, -63.82], [46.19, -63.775],
      [46.245, -63.71], [46.434, -63.644], [46.4967, -63.3906],
    ],
  },
  {
    from: 'cavendish',
    to: 'wood-islands',
    label: 'Cavendish → Wood Islands',
    points: [[46.4967, -63.3906], [46.2382, -63.1311], [45.95, -62.742]],
  },
  {
    from: 'wood-islands',
    to: 'caribou',
    label: 'Wood Islands → Caribou ferry (75 min)',
    ferry: true,
    points: [[45.95, -62.742], [45.773, -62.68]],
  },
  {
    from: 'caribou',
    to: 'baddeck',
    label: 'Caribou → Baddeck',
    points: [
      [45.773, -62.68], [45.592, -62.648], [45.618, -61.998],
      [45.648, -61.413], [45.98, -61.12], [46.1, -60.755],
    ],
  },
  {
    from: 'baddeck',
    to: 'ingonish',
    label: 'Baddeck → Ingonish (the Cabot Trail day)',
    points: [
      [46.1, -60.755], [46.34, -61.1], [46.63, -61.01],
      [46.835, -60.8], [46.885, -60.56], [46.805, -60.33], [46.69, -60.39],
    ],
  },
  {
    from: 'ingonish',
    to: 'halifax',
    label: 'Ingonish → Halifax (home)',
    points: [
      [46.69, -60.39], [46.29, -60.54], [45.648, -61.413],
      [45.618, -61.998], [45.367, -63.28], [44.6488, -63.5752],
    ],
  },
];

/**
 * Lead photo for each stop, as candidate Wikipedia article titles.
 * `assets/js/photos.js` takes the first one that actually has an image.
 */
export const heroWiki = {
  halifax: ['Halifax, Nova Scotia', 'Halifax Harbour'],
  lunenburg: ['Lunenburg, Nova Scotia', 'Fisheries Museum of the Atlantic'],
  digby: ['Digby, Nova Scotia', 'Bay of Fundy'],
  shediac: ['Shediac', 'Hopewell Rocks'],
  cavendish: ['Cavendish, Prince Edward Island', 'Prince Edward Island National Park'],
  baddeck: ['Baddeck', "Bras d'Or Lake"],
  ingonish: ['Cabot Trail', 'Cape Breton Highlands National Park'],
};

/** Non-base points worth marking on the map. */
export const waypoints = [
  { name: 'Peggy’s Cove', coords: [44.4922, -63.9163], note: 'Day trip from Halifax' },
  { name: 'Brier Island', coords: [44.2506, -66.3603], note: 'Whale watching — day trip from Digby' },
  { name: 'Hopewell Rocks', coords: [45.8175, -64.5794], note: 'Walk on the ocean floor at low tide' },
  { name: 'Confederation Bridge', coords: [46.19, -63.775], note: '12.9 km onto PEI' },
  { name: 'Wood Islands ferry', coords: [45.95, -62.742], note: '75-minute crossing to Caribou' },
  { name: 'Pleasant Bay', coords: [46.835, -60.8], note: 'Second whale tour — pilot whales' },
];
