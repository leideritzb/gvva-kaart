/* Kaart Gemeente Apeldoorn — Dorpen & Wijken
 * Degen & Leideritz — hetgroteverhaalvanapeldoorn.nl
 * v8
 */
(function() {

  var SVG_URL = 'https://cdn.prod.website-files.com/60edd8e8a792c4b08f5abdb2/6a0b00dbd4d353835654b3ce_kaart-gemeente-apeldoorn.svg';
  var VIEWBOX = '1336 1074 9484 9281';

  var NAMES = {
    'beekbergen':                    'Beekbergen, Lieren & Oosterhuizen',
    'berg-en-bos':                   'Berg & Bos',
    'bouwhof-de-heeze':              'Bouwhof - De Heeze',
    'centrum':                       'Centrum',
    'de-maten':                      'De Maten',
    'de-parken':                     'De Parken, Indische buurt en Loolaan-Noord',
    'het-loo-en-kroondomein':        'Het Loo en Kroondomein',
    'hoenderloo':                    'Hoenderloo',
    'hoog-soeren-en-radio-kootwijk': 'Hoog Soeren & Radio Kootwijk',
    'klarenbeek-en-het-woud':        'Klarenbeek & Het Woud',
    'loenen':                        'Loenen',
    'noord-incl-kerschoten':         'Noord (incl. Kerschoten)',
    'noord-oost':                    'Noord-Oost',
    'oost-en-welgelegen':            'Oost & Welgelegen',
    'orden':                         'Orden',
    'uddel-en-nieuw-milligen':       'Uddel & Nieuw Milligen',
    'ugchelen':                      'Ugchelen',
    'wenum-wiesel-en-beemte':        'Wenum Wiesel & Beemte',
    'west':                          'West',
    'zuid':                          'Zuid'
  };

  function init() {
    var mount = document.getElementById('kaartMount');
    if (!mount) return;

    var style = document.createElement('style');
    style.textContent =
      '.kaart-wrap { position:relative; width:100%; }' +
      '.kaart-wrap svg { width:100%; height:auto; display:block; }' +
      '.wijk-path { cursor:pointer; transition:filter .18s; }' +
      '.wijk-path:hover { filter:brightness(0.82); }' +
      '.wijk-path.actief { filter:brightness(0.72) saturate(1.2); }' +
      '#kaartTooltip { position:fixed; background:#1c1a16; color:#fff; font-size:13px; padding:5px 10px; pointer-events:none; white-space:nowrap; opacity:0; transition:opacity .12s; z-index:9999; border-radius:2px; }';
    document.head.appendChild(style);

    var tooltip = document.createElement('div');
    tooltip.id = 'kaartTooltip';
    document.body.appendChild(tooltip);

    var wrap = document.createElement('div');
    wrap.className = 'kaart-wrap';
    mount.appendChild(wrap);

    var xhr = new XMLHttpRequest();
    xhr.open('GET', SVG_URL, true);
    xhr.onload = function() {
      if (xhr.status !== 200) return;
      var parser = new DOMParser();
      var doc = parser.parseFromString(xhr.responseText, 'image/svg+xml');
      var svgEl = doc.querySelector('svg');
      if (!svgEl) return;

      svgEl.setAttribute('viewBox', VIEWBOX);
      svgEl.removeAttribute('width');
      svgEl.removeAttribute('height');
      wrap.appendChild(svgEl);

      var groups = svgEl.querySelectorAll('#dorpen_en_wijken_kleuren > g');
      groups.forEach(function(g) { g.classList.add('wijk-path'); });

      bindEvents(groups, tooltip);
    };
    xhr.send();
  }

  function bindEvents(groups, tooltip) {

    function clearActive() {
      groups.forEach(function(g) { g.classList.remove('actief'); });
      document.querySelectorAll('[data-slug].wijk-actief').forEach(function(el) {
        el.classList.remove('wijk-actief');
      });
    }

    groups.forEach(function(g) {
      var slug = g.id;
      var naam = NAMES[slug] || slug;

      g.addEventListener('mouseenter', function(e) {
        tooltip.textContent = naam;
        tooltip.style.opacity = '1';
      });
      g.addEventListener('mousemove', function(e) {
        tooltip.style.left = (e.clientX + 14) + 'px';
        tooltip.style.top  = (e.clientY - 36) + 'px';
      });
      g.addEventListener('mouseleave', function() {
        tooltip.style.opacity = '0';
      });
      g.addEventListener('click', function(e) {
        e.preventDefault();
        clearActive();
        g.classList.add('actief');
        var item = document.querySelector('[data-slug="' + slug + '"]');
        if (item) {
          item.classList.add('wijk-actief');
          item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
        window.location = '/dorpen-wijken/' + slug;
      });
    });

    document.addEventListener('mouseenter', function(e) {
      var item = e.target.closest('[data-slug]');
      if (!item) return;
      groups.forEach(function(g) {
        g.classList.toggle('actief', g.id === item.dataset.slug);
      });
    }, true);

    document.addEventListener('mouseleave', function(e) {
      var item = e.target.closest('[data-slug]');
      if (!item) return;
      var a = document.querySelector('[data-slug].wijk-actief');
      groups.forEach(function(g) {
        g.classList.toggle('actief', a && g.id === a.dataset.slug);
      });
    }, true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
