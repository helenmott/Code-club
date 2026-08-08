/**
 * Route map.
 *
 * Reads `window.TRIP_ROUTE` (written by build.mjs into route-data.js) and draws
 * the drive on an OpenStreetMap base layer. Two modes, chosen by which element
 * is present:
 *
 *   #route-map   full journey — every stop, numbered, each pin links to its page
 *   #stop-map    one location page — that stop centred, neighbours shown faintly
 */

(function () {
  'use strict';

  var data = window.TRIP_ROUTE;
  if (!data || typeof L === 'undefined') return;

  var full = document.getElementById('route-map');
  var mini = document.getElementById('stop-map');
  var el = full || mini;
  if (!el) return;

  var TILES = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
  var ATTRIB = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  var css = getComputedStyle(document.documentElement);
  var colour = {
    road: (css.getPropertyValue('--sea') || '#14607d').trim(),
    ferry: (css.getPropertyValue('--rust') || '#c2542c').trim(),
    detour: (css.getPropertyValue('--sand') || '#d8a24a').trim(),
  };

  var map = L.map(el, {
    scrollWheelZoom: false, // don't hijack the page scroll on the way past
    zoomControl: true,
  });
  L.tileLayer(TILES, { attribution: ATTRIB, maxZoom: 18 }).addTo(map);
  map.on('click', function () { map.scrollWheelZoom.enable(); });
  map.on('mouseout', function () { map.scrollWheelZoom.disable(); });

  var bounds = L.latLngBounds([]);

  // ---- route lines -------------------------------------------------------

  data.legs.forEach(function (leg) {
    var style = leg.ferry
      ? { color: colour.ferry, weight: 3, opacity: .9, dashArray: '7 7' }
      : leg.detour
        ? { color: colour.detour, weight: 3, opacity: .85, dashArray: '2 7', lineCap: 'round' }
        : { color: colour.road, weight: 4, opacity: .85 };

    var line = L.polyline(leg.points, style).addTo(map);
    line.bindTooltip(leg.label, { sticky: true });
    leg.points.forEach(function (p) { bounds.extend(p); });
  });

  // ---- stop pins ---------------------------------------------------------

  var current = el.getAttribute('data-current');

  data.stops.forEach(function (stop) {
    var isCurrent = stop.slug === current;
    var icon = L.divIcon({
      className: '',
      html: '<div class="pin"><span>' + stop.number + '</span></div>',
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -28],
    });

    var marker = L.marker(stop.coords, {
      icon: icon,
      title: stop.name,
      zIndexOffset: isCurrent ? 1000 : 0,
      opacity: mini && !isCurrent ? 0.55 : 1,
    }).addTo(map);

    marker.bindPopup(
      '<div class="pop-eyebrow">Stop ' + stop.number + ' &middot; ' + esc(stop.days) + '</div>' +
      '<div class="pop-title">' + esc(stop.name) + '</div>' +
      '<div class="pop-meta">' + esc(stop.nights) + ' &middot; ' + esc(stop.region) + '</div>' +
      (isCurrent
        ? '<div class="pop-meta"><em>You are here</em></div>'
        : '<a class="pop-link" href="' + stop.href + '">Open this stop</a>')
    );

    bounds.extend(stop.coords);
  });

  // ---- day-trip waypoints ------------------------------------------------

  data.waypoints.forEach(function (w) {
    L.marker(w.coords, {
      icon: L.divIcon({
        className: '',
        html: '<div class="pin is-waypoint"></div>',
        iconSize: [17, 17],
        iconAnchor: [8, 8],
        popupAnchor: [0, -8],
      }),
      opacity: mini ? 0.6 : 1,
    })
      .addTo(map)
      .bindPopup('<div class="pop-title">' + esc(w.name) + '</div><div class="pop-meta">' + esc(w.note) + '</div>');
    bounds.extend(w.coords);
  });

  // ---- framing -----------------------------------------------------------

  if (mini && current) {
    var here = data.stops.filter(function (s) { return s.slug === current; })[0];
    if (here) map.setView(here.coords, 8);
    else map.fitBounds(bounds, { padding: [30, 30] });
  } else {
    map.fitBounds(bounds, { padding: [34, 34] });
  }

  window.addEventListener('resize', debounce(function () { map.invalidateSize(); }, 200));

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function debounce(fn, ms) {
    var t;
    return function () { clearTimeout(t); t = setTimeout(fn, ms); };
  }
})();
