/**
 * Photo loader.
 *
 * Every photo slot on the site is a `<figure class="photo">` carrying a
 * pipe-separated list of candidate Wikipedia article titles:
 *
 *   <div class="photo" data-wiki="Cabot Trail|Cape Breton Highlands National Park"
 *        data-fallback="Cabot Trail"></div>
 *
 * On load we make ONE batched request per page to the Wikipedia API for the
 * lead image of every candidate, then fill each slot with the first candidate
 * that actually has one. Images are therefore always real, correctly-subject
 * and freely licensed, with a credit link back to the source article.
 *
 * Two escape hatches:
 *   - `data-photo="assets/img/foo.jpg"` on the slot wins outright, so you can
 *     drop your own photographs in without touching this file.
 *   - If nothing resolves, the slot keeps its CSS fallback pattern and the
 *     caption from `data-fallback`. Nothing ever renders as a broken image.
 */

(function () {
  'use strict';

  var API = 'https://en.wikipedia.org/w/api.php';
  var THUMB_WIDTH = 1100;
  var BATCH = 40; // API caps `titles` at 50 for anonymous callers
  var TIMEOUT = 8000;

  var slots = Array.prototype.slice.call(document.querySelectorAll('.photo[data-wiki], .photo[data-photo]'));
  if (!slots.length) return;

  /** Slots with an explicit local image skip the API entirely. */
  var remaining = [];
  slots.forEach(function (slot) {
    var local = slot.getAttribute('data-photo');
    if (local) {
      place(slot, local, null, null);
    } else {
      remaining.push(slot);
    }
  });
  if (!remaining.length) return;

  var wanted = [];
  var seen = Object.create(null);
  remaining.forEach(function (slot) {
    candidates(slot).forEach(function (title) {
      var k = key(title);
      if (!seen[k]) { seen[k] = true; wanted.push(title); }
    });
  });

  var found = Object.create(null); // normalised title -> {src, page, title}

  Promise.all(chunk(wanted, BATCH).map(fetchBatch))
    .then(fill)
    .catch(fill); // a total network failure still needs the fallbacks drawn

  // ---------------------------------------------------------------- helpers

  function candidates(slot) {
    return (slot.getAttribute('data-wiki') || '')
      .split('|')
      .map(function (s) { return s.trim(); })
      .filter(Boolean);
  }

  /** Wikipedia titles are case-insensitive after the first letter, and treat _ as space. */
  function key(t) {
    return String(t).replace(/_/g, ' ').trim().toLowerCase();
  }

  function chunk(arr, n) {
    var out = [];
    for (var i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
    return out;
  }

  function fetchBatch(titles) {
    var url = API +
      '?action=query&format=json&origin=*&formatversion=2' +
      '&prop=pageimages&piprop=thumbnail&pithumbsize=' + THUMB_WIDTH +
      '&redirects=1&titles=' + encodeURIComponent(titles.join('|'));

    return withTimeout(fetch(url, { credentials: 'omit' }))
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (!data || !data.query) return;
        var q = data.query;

        // Map every alias the API resolved (normalised + redirected) back to
        // the final page title, so a candidate like "Halifax Citadel" still
        // finds the image on "Citadel Hill (Fort George)".
        var alias = Object.create(null);
        [].concat(q.normalized || [], q.redirects || []).forEach(function (m) {
          alias[key(m.from)] = m.to;
        });

        var byTitle = Object.create(null);
        (q.pages || []).forEach(function (p) {
          if (p.thumbnail && p.thumbnail.source) {
            byTitle[key(p.title)] = {
              src: p.thumbnail.source,
              page: 'https://en.wikipedia.org/wiki/' + encodeURIComponent(String(p.title).replace(/ /g, '_')),
              title: p.title,
            };
          }
        });

        titles.forEach(function (t) {
          var target = t;
          // Follow the alias chain (normalise -> redirect) at most a few hops.
          for (var i = 0; i < 4 && alias[key(target)]; i++) target = alias[key(target)];
          var hit = byTitle[key(target)];
          if (hit) found[key(t)] = hit;
        });
      })
      .catch(function () { /* one failed batch must not sink the rest */ });
  }

  function withTimeout(promise) {
    return new Promise(function (resolve, reject) {
      var done = false;
      var timer = setTimeout(function () {
        if (!done) { done = true; reject(new Error('timeout')); }
      }, TIMEOUT);
      promise.then(function (v) {
        if (!done) { done = true; clearTimeout(timer); resolve(v); }
      }, function (e) {
        if (!done) { done = true; clearTimeout(timer); reject(e); }
      });
    });
  }

  function fill() {
    remaining.forEach(function (slot) {
      var hit = null;
      var list = candidates(slot);
      for (var i = 0; i < list.length; i++) {
        if (found[key(list[i])]) { hit = found[key(list[i])]; break; }
      }
      if (hit) place(slot, hit.src, hit.page, hit.title);
      else slot.classList.add('is-empty');
    });
  }

  function place(slot, src, creditHref, creditTitle) {
    var img = document.createElement('img');
    img.loading = 'lazy';
    img.decoding = 'async';
    img.alt = slot.getAttribute('data-alt') || slot.getAttribute('data-fallback') || '';
    img.addEventListener('load', function () { img.classList.add('is-loaded'); });
    img.addEventListener('error', function () {
      img.remove();
      slot.classList.add('is-empty');
    });
    img.src = src;
    slot.appendChild(img);

    if (creditHref) {
      var a = document.createElement('a');
      a.className = 'photo-credit';
      a.href = creditHref;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = 'Wikimedia — ' + creditTitle;
      slot.appendChild(a);
    }
  }
})();
