#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const GAMES_DIR = path.join(ROOT, 'games');
const RAW_CONTENT_PATH = path.join(ROOT, 'data', 'game-content-raw.json');
const MANUAL_CONTENT_PATH = path.join(ROOT, 'data', 'game-content-manual.json');
const OVERRIDES_PATH = path.join(ROOT, 'data', 'game-overrides.json');
const GAMES_DATA_PATH = path.join(ROOT, 'js', 'games-data.js');
const SLOPE_HTML_PATH = path.join(GAMES_DIR, 'slope.html');

const slopeHtml = fs.readFileSync(SLOPE_HTML_PATH, 'utf8');
const slopeStyle = (() => {
  const styleStart = slopeHtml.indexOf('<style>');
  const styleEnd = slopeHtml.indexOf('</style>');
  if (styleStart === -1 || styleEnd === -1 || styleEnd <= styleStart) {
    throw new Error('Could not extract inline style block from slope.html');
  }
  return slopeHtml.slice(styleStart + '<style>'.length, styleEnd).replace(/^/gm, '        ');
})();

const requestedSlugs = process.argv.slice(2).map((arg) => arg.replace(/\.html$/i, '').toLowerCase());

function loadJson(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }
  const content = fs.readFileSync(filePath, 'utf8');
  return content ? JSON.parse(content) : {};
}

function loadGameList() {
  const code = fs.readFileSync(GAMES_DATA_PATH, 'utf8');
  const sandbox = { window: { SCHPLAY_GAMES: {} } };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: 'games-data.js' });
  return sandbox.window.SCHPLAY_GAMES.list || [];
}

function escapeHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function slugToId(slug) {
  return slug.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}

function slugToConst(slug) {
  const base = slug.toUpperCase().replace(/[^A-Z0-9]+/g, '_');
  return `GAME_${base}`;
}

function normalizeIframeSrc(src = '', slug) {
  if (!src) {
    if (slug) {
      return `${slug}/index.html`;
    }
    return '';
  }
  if (/^https?:/i.test(src) || src.startsWith('//')) {
    return src;
  }
  let cleaned = src
    .replace(/^\.\//, '')
    .replace(/^\.\.\/games\//, '')
    .replace(/^\.\.\//, '')
    .replace(/^\//, '');
  if (cleaned.startsWith('games/')) {
    cleaned = cleaned.replace(/^games\//, '');
  }
  if (!cleaned && slug) {
    cleaned = `${slug}/index.html`;
  }
  return cleaned;
}

function absoluteImageUrl(imgPath = '') {
  if (!imgPath) return '';
  if (/^https?:/i.test(imgPath) || imgPath.startsWith('//')) {
    return imgPath;
  }
  const normalized = imgPath.replace(/^\.\//, '').replace(/^\.\.\//, '');
  return `https://schplay.com/${normalized.replace(/^\//, '')}`;
}

function mergeContent(base, manual = {}) {
  if (!base && !manual) return null;
  return {
    ...base,
    ...manual,
    instructions: manual.instructions || base?.instructions || [],
    sections: manual.sections || base?.sections || [],
    lists: {
      ...(base?.lists || {}),
      ...(manual?.lists || {})
    },
    heroParagraph: manual.heroParagraph || base?.heroParagraph || manual.metaDescription || base?.metaDescription || ''
  };
}

function inferGenre(text) {
  const source = (text || '').toLowerCase();
  if (!source) return 'Arcade · Skill';
  if (source.includes('tower defense')) return 'Tower Defense · Strategy';
  if (source.includes('idle') || source.includes('incremental')) return 'Idle · Incremental';
  if (source.includes('clicker')) return 'Idle · Clicker';
  if (source.includes('puzzle') || source.includes('logic')) return 'Puzzle · Brain';
  if (source.includes('platform')) return 'Platformer · Adventure';
  if (source.includes('runner') || source.includes('endless')) return 'Arcade · Endless Runner';
  if (source.includes('driving') || source.includes('racing') || source.includes('car')) return 'Racing · Skill';
  if (source.includes('shoot') || source.includes('battle') || source.includes('gun')) return 'Action · Shooter';
  if (source.includes('sport') || source.includes('basketball') || source.includes('soccer') || source.includes('football')) return 'Sports · Arcade';
  if (source.includes('strategy')) return 'Strategy · Tactics';
  if (source.includes('adventure') || source.includes('quest')) return 'Adventure · Story';
  if (source.includes('casino') || source.includes('card') || source.includes('blackjack')) return 'Card · Casino';
  if (source.includes('sandbox') || source.includes('creative')) return 'Sandbox · Creative';
  if (source.includes('survival') || source.includes('zombie')) return 'Action · Survival';
  if (source.includes('simulation') || source.includes('tycoon')) return 'Simulation · Management';
  if (source.includes('maze') || source.includes('escape')) return 'Puzzle · Escape';
  if (source.includes('music') || source.includes('rhythm')) return 'Rhythm · Music';
  if (source.includes('quiz') || source.includes('trivia')) return 'Trivia · Knowledge';
  return 'Arcade · Skill';
}

function inferPlatforms(text) {
  const source = (text || '').toLowerCase();
  const platforms = new Set(['Browser']);
  if (source.includes('mobile') || source.includes('touch') || source.includes('tablet') || source.includes('phone')) {
    platforms.add('Mobile');
  }
  if (source.includes('controller')) {
    platforms.add('Gamepad');
  }
  return Array.from(platforms).join(', ');
}

function seededRandom(slug) {
  let hash = 0;
  for (let i = 0; i < slug.length; i += 1) {
    hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
  }
  return () => {
    hash = (hash * 1664525 + 1013904223) >>> 0;
    return hash / 0xffffffff;
  };
}

function formatRating(slug, override) {
  if (override && override.rating) {
    return override.rating;
  }
  const rand = seededRandom(slug);
  const score = (4 + Math.round(rand() * 9) / 10).toFixed(1);
  const votes = (Math.floor(rand() * 88000) + 12000).toLocaleString('en-US');
  return `⭐ ${score} / 5 (${votes} votes)`;
}

function formatUpdated(slug, override) {
  if (override && override.updated) return override.updated;
  const rand = seededRandom(`${slug}-updated`);
  const month = 7 + Math.floor(rand() * 3); // Aug-Oct 2025
  const day = 1 + Math.floor(rand() * 28);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const year = 2025;
  return `${months[month % 12]} ${day.toString().padStart(2, '0')}, ${year}`;
}

function formatRelease(slug, override) {
  if (override && override.release) return override.release;
  return '2010s';
}

function pickHeroParagraph(data, override) {
  if (override && override.heroParagraph) return override.heroParagraph;
  if (data.heroParagraph) return data.heroParagraph;
  if (data.metaDescription) return data.metaDescription;
  return `Play ${data.name} online.`;
}

function ensureInstructionParagraphs(data, override) {
  if (override && Array.isArray(override.instructions) && override.instructions.length) {
    return override.instructions;
  }
  if (Array.isArray(data.instructions) && data.instructions.length) {
    return data.instructions;
  }
  if (data.metaDescription) {
    return [data.metaDescription];
  }
  return [`Dive into ${data.name} and start playing instantly.`];
}

function ensureSections(data, override) {
  if (override && Array.isArray(override.sections) && override.sections.length) {
    return override.sections;
  }
  if (Array.isArray(data.sections) && data.sections.length) {
    return data.sections;
  }
  return [];
}

function inferControls(slug, data, override) {
  if (override && Array.isArray(override.controls) && override.controls.length) {
    return override.controls;
  }
  const source = (data.plainText || '').toLowerCase();
  const controls = [];
  const addControl = (input, action) => {
    if (!controls.some((item) => item.input === input)) {
      controls.push({ input, action });
    }
  };
  if (/arrow key/.test(source) || /left key/.test(source) || /right key/.test(source)) {
    addControl('Arrow keys', 'move and steer');
  }
  if (/wasd/.test(source)) {
    addControl('W / A / S / D', 'move and dodge');
  }
  if (/space/.test(source) || /spacebar/.test(source)) {
    addControl('Space', 'jump or trigger actions');
  }
  if (/mouse/.test(source) || /click/.test(source)) {
    addControl('Mouse', 'aim or interact');
  }
  if (/touch/.test(source) || /tap/.test(source)) {
    addControl('Tap', 'use abilities on mobile screens');
  }
  if (/shift/.test(source)) {
    addControl('Shift', 'activate boost or sprint');
  }
  if (/ctrl/.test(source)) {
    addControl('Ctrl', 'special move');
  }
  if (/enter/.test(source)) {
    addControl('Enter', 'confirm selections');
  }
  if (/q key/.test(source)) {
    addControl('Q', 'swap ability');
  }
  if (/e key/.test(source)) {
    addControl('E', 'interact or trigger skill');
  }
  if (!controls.length) {
    addControl('Mouse / Keyboard', 'play with the default controls for this title');
  }
  return controls;
}

function buildKeywords(data, override) {
  if (override && override.metaKeywords) {
    return override.metaKeywords;
  }
  if (data.metaKeywords) {
    const extras = ['schplay', 'online play', 'unblocked'];
    const combined = data.metaKeywords.split(',').map((word) => word.trim()).filter(Boolean);
    extras.forEach((term) => {
      if (!combined.includes(term)) combined.push(term);
    });
    return combined.join(', ');
  }
  return `${data.name}, play ${data.name} online, ${data.name} free, ${data.name} unblocked, schplay`;
}

function buildMetaDescription(data, override) {
  if (override && override.metaDescription) return override.metaDescription;
  if (data.metaDescription) {
    return `${data.metaDescription.replace(/\s+/g, ' ').trim()} Updated ${formatUpdated(data.slug || '', override)} on Schplay.`;
  }
  const hero = pickHeroParagraph(data, override);
  return `${hero} Updated ${formatUpdated(data.slug || '', override)} on Schplay.`;
}

function buildSeoTitle(data, override) {
  if (override && override.metaTitle) return override.metaTitle;
  return `Play ${data.name} Online | Schplay`;
}

function buildCanonical(slug, override) {
  if (override && override.canonical) return override.canonical;
  return `https://schplay.com/games/${slug}.html`;
}

function dedupeSentences(paragraphs) {
  const seen = new Set();
  return paragraphs.filter((paragraph) => {
    const key = paragraph.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function formatMetaDetails(slug, data, override) {
  const combinedText = `${data.metaDescription || ''} ${data.heroParagraph || ''} ${data.plainText || ''}`;
  const genre = override?.genre || inferGenre(combinedText);
  const platforms = override?.platforms || inferPlatforms(combinedText);
  const rating = formatRating(slug, override);
  const updated = formatUpdated(slug, override);
  const release = formatRelease(slug, override);
  return { genre, platforms, rating, updated, release };
}

function buildSchema(slug, data, override, metaDetails, imageUrl) {
  const description = override?.schemaDescription || data.metaDescription || data.heroParagraph || `Play ${data.name} online.`;
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoGame',
    name: data.name,
    description,
    genre: metaDetails.genre.split('·').map((part) => part.trim()),
    url: buildCanonical(slug, override),
    image: imageUrl,
    publisher: {
      '@type': 'Organization',
      name: 'Schplay'
    }
  };
}

function renderInstructions(paragraphs) {
  return paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('\n        ');
}

function renderControls(controls) {
  const items = controls.map(({ input, action }) => `<li><strong>${escapeHtml(input)}</strong> &mdash; ${escapeHtml(action)}</li>`);
  return items.join('\n          ');
}

function renderMetaSections(sections, fallbackTitle, gameName, instructions = []) {
  if (!sections.length) {
    return {
      masterHeading: fallbackTitle,
      masterIntro: 'Build your rhythm, practice short sessions, and keep refining your strategy to stay ahead.',
      body: ''
    };
  }

  const filtered = sections.filter(({ heading, body }) => {
    if (!heading || !body) return false;
    const normalizedHeading = heading.trim().toLowerCase();
    if (!normalizedHeading) return false;
    if (normalizedHeading === gameName.toLowerCase()) return false;
    if (normalizedHeading === 'instructions') return false;
    return true;
  });

  if (!filtered.length) {
    return {
      masterHeading: fallbackTitle,
      masterIntro: sections[0]?.body || 'Practice consistently and keep experimenting with tactics to improve.',
      body: ''
    };
  }

  const [first, ...rest] = filtered;
  const masterHeading = fallbackTitle;
  const introCandidates = Array.isArray(instructions) ? instructions.slice() : [];
  introCandidates.push(first.body);
  let masterIntro = 'Practice consistently and keep experimenting with tactics to improve.';
  for (const candidate of introCandidates) {
    if (candidate && typeof candidate === 'string' && candidate.trim() && candidate.trim() !== first.body) {
      masterIntro = candidate;
      break;
    }
  }
  if (masterIntro === 'Practice consistently and keep experimenting with tactics to improve.' && first.body) {
    masterIntro = first.body;
  }
  const body = [{ heading: first.heading, body: first.body }, ...rest].map(({ heading, body: paragraph }) => `
        <h3 class="meta-subheading">${escapeHtml(heading)}</h3>
        <p>${escapeHtml(paragraph)}</p>`).join('');
  return { masterHeading, masterIntro, body };
}

function renderPage(slug, data, override = {}) {
  const id = slugToId(slug);
  const constName = slugToConst(slug);
  const name = data.name || override.name;
  if (!name) {
    throw new Error(`Missing game name for ${slug}`);
  }
  const heroParagraph = pickHeroParagraph({ ...data, slug, name }, override);
  const instructions = dedupeSentences(ensureInstructionParagraphs({ ...data, slug, name }, override)).slice(0, 3);
  const sections = ensureSections({ ...data, slug, name }, override).slice(0, 4);
  const controls = inferControls(slug, data, override).slice(0, 5);
  const details = formatMetaDetails(slug, { ...data, slug, name }, override);
  const iframeSrc = override.iframeSrc || normalizeIframeSrc(data.iframeSrc, slug);
  const keywords = buildKeywords({ ...data, slug, name }, override);
  const metaDescription = buildMetaDescription({ ...data, slug, name }, override);
  const seoTitle = buildSeoTitle({ ...data, slug, name }, override);
  const canonical = buildCanonical(slug, override);
  const imageUrl = absoluteImageUrl(override.image || data.image || override.img);
  const schema = buildSchema(slug, { ...data, slug, name }, override, details, imageUrl);
  const masterTitle = `Tips to Master ${name}`;
  const { masterHeading, masterIntro, body } = renderMetaSections(sections, masterTitle, name, instructions);

  const instructionsHtml = renderInstructions(instructions);
  const controlsHtml = renderControls(controls);

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="index, follow">
    <meta name="description" content="${escapeHtml(metaDescription)}">
    <meta name="keywords" content="${escapeHtml(keywords)}">
    <meta name="theme-color" content="#0f1a2a">
    <title>${escapeHtml(seoTitle)}</title>
    <link rel="canonical" href="${escapeHtml(canonical)}">
    <link rel="icon" type="image/webp" href="/images/favicon.ico">
    <link rel="apple-touch-icon" href="../images/favicon-32x32.png">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Schplay">
    <meta property="og:title" content="${escapeHtml(seoTitle)}">
    <meta property="og:description" content="${escapeHtml(metaDescription)}">
    <meta property="og:url" content="${escapeHtml(canonical)}">
    <meta property="og:image" content="${escapeHtml(imageUrl)}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeHtml(seoTitle)}">
    <meta name="twitter:description" content="${escapeHtml(metaDescription)}">
    <meta name="twitter:image" content="${escapeHtml(imageUrl)}">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../css/new-style.css">
    <link rel="stylesheet" href="../css/restyle.css">
    <link rel="stylesheet" href="../css/user-choice.css">
    <script type="application/ld+json">
${JSON.stringify(schema, null, 12).replace(/^/gm, '        ')}
    </script>
    <style>
${slopeStyle}
    </style>
</head>
<body>
  <header id="site-header" role="banner">
    <div id="navbar-placeholder"></div>
  </header>

  <main class="container" role="main">
    <section class="hero hero-with-ad" aria-labelledby="${escapeHtml(id)}-hero-title">
      <div class="hero-grid">
        <div class="hero-content">
          <h1 id="${escapeHtml(id)}-hero-title">Play ${escapeHtml(name)} Online</h1>
          <p>${escapeHtml(heroParagraph)}</p>
          <div class="hero-actions">
            <a class="hero-primary" href="../allgames.html">Browse all games</a>
            <a class="hero-secondary" href="#how-to-play">View tips &amp; controls</a>
          </div>
        </div>
        <div class="hero-ad" aria-label="Sponsored">
          <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5690564842575659" crossorigin="anonymous"></script>
          <ins class="adsbygoogle"
               style="display:block"
               data-ad-client="ca-pub-5690564842575659"
               data-ad-slot="9885096122"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
          <script>
            (adsbygoogle = window.adsbygoogle || []).push({});
          </script>
        </div>
      </div>
    </section>

    <section class="game-player-section">
      <div class="game-player-card" role="region" aria-label="${escapeHtml(name)} gameplay">
        <div class="game-player-header">
          <button class="game-fullscreen-toggle" type="button" aria-controls="${escapeHtml(id)}-iframe" aria-label="Toggle fullscreen">
            <i class="fas fa-expand" aria-hidden="true"></i>
            <span>Fullscreen</span>
          </button>
        </div>
        <iframe id="${escapeHtml(id)}-iframe" src="${escapeHtml(iframeSrc)}" title="Play ${escapeHtml(name)}" allowfullscreen loading="lazy"></iframe>
      </div>
      <aside class="game-meta-card" id="how-to-play">
        <div class="game-ad-slot" aria-label="Advertisement">
          <p>Ads keep Schplay free for everyone.</p>
          <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5690564842575659" crossorigin="anonymous"></script>
          <ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-5690564842575659" data-ad-slot="5102033888" data-ad-format="auto" data-full-width-responsive="true"></ins>
          <script>
            (adsbygoogle = window.adsbygoogle || []).push({});
          </script>
        </div>
        <div class="meta-callout" role="note">
          <span class="meta-callout-icon" aria-hidden="true">
            <i class="fas fa-shield-check"></i>
          </span>
          <div class="meta-callout-content">
            <p class="meta-callout-eyebrow">Game content reviewed by <strong>Schplay Editors</strong></p>
            <a href="../about.html">Learn about our game review guidelines</a>
          </div>
        </div>
        <dl class="meta-details">
          <div>
            <dt>Genre</dt>
            <dd>${escapeHtml(details.genre)}</dd>
          </div>
          <div>
            <dt>Rating</dt>
            <dd>${escapeHtml(details.rating)}</dd>
          </div>
          <div>
            <dt>Updated</dt>
            <dd>${escapeHtml(details.updated)}</dd>
          </div>
          <div>
            <dt>Release</dt>
            <dd>${escapeHtml(details.release)}</dd>
          </div>
          <div>
            <dt>Platforms</dt>
            <dd>${escapeHtml(details.platforms)}</dd>
          </div>
        </dl>
        <hr class="meta-divider">
        <h2>Instructions</h2>
        ${instructionsHtml}
        <h2>Controls</h2>
        <ul>
          ${controlsHtml}
        </ul>
        <h2>${escapeHtml(masterHeading)}</h2>
        <p>${escapeHtml(masterIntro)}</p>${body}
      </aside>
    </section>

    <section class="games-grid-section" aria-labelledby="${escapeHtml(id)}-recommendations-title">
      <div class="section-header">
        <h2 id="${escapeHtml(id)}-recommendations-title">Players Also Enjoy</h2>
        <span id="${escapeHtml(id)}-recommendations-count" class="games-count" aria-live="polite"></span>
      </div>
      <div class="games-grid" id="${escapeHtml(id)}-recommendations" aria-live="polite"></div>
    </section>
  </main>

  <footer id="site-footer" role="contentinfo">
    <div id="footer-placeholder"></div>
  </footer>

  <script>
    const ${constName}_RECOMMENDATION_COUNT = 12;
    const CURRENT_GAME_NAME = ${JSON.stringify(name)};

    const resolvePath = (path) => {
      if (!path) return path;

      if (/^(?:https?:)?\\/\\//.test(path) || path.startsWith('/')) {
        return path;
      }

      if (path.startsWith('../')) {
        return path;
      }

      const resolver = window.SCHPLAY_RESOLVE_ASSET_PATH;
      if (typeof resolver === 'function') {
        return resolver(path);
      }

      return '../' + path;
    };

    const pickRandomGames = (games, limit) => {
      const sample = games.slice();
      for (let i = sample.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [sample[i], sample[j]] = [sample[j], sample[i]];
      }
      return sample.slice(0, limit);
    };


    let hasRenderedRecommendations = false;

    const renderRecommendations = () => {
      if (hasRenderedRecommendations) {
        return;
      }

      const grid = document.getElementById('${escapeHtml(id)}-recommendations');
      const count = document.getElementById('${escapeHtml(id)}-recommendations-count');
      if (!grid) {
        return;
      }

      const catalog = (window.SCHPLAY_GAMES && window.SCHPLAY_GAMES.list) || [];
      if (!Array.isArray(catalog) || !catalog.length) {
        return;
      }

      const eligibleGames = catalog.filter(({ name, href, img }) => {
        return name && href && img && name !== CURRENT_GAME_NAME;
      });

      const selection = eligibleGames.length
        ? pickRandomGames(eligibleGames, Math.min(${constName}_RECOMMENDATION_COUNT, eligibleGames.length))
        : [];

      grid.innerHTML = '';
      selection.forEach(({ name, href, img }) => {
        const card = document.createElement('a');
        card.className = 'game-card';
        card.href = resolvePath(href);
        card.innerHTML = '<img src="' + resolvePath(img) + '" alt="' + name + '" loading="lazy" decoding="async"><h3>' + name + '</h3>';
        grid.appendChild(card);
      });

      if (count) {
        count.textContent = selection.length ? selection.length + ' games' : '';
      }

      if (!selection.length) {
        const placeholder = document.createElement('p');
        placeholder.textContent = 'Check back soon for more featured games.';
        placeholder.style.color = 'var(--text-muted)';
        placeholder.style.margin = '0';
        placeholder.style.padding = '0.6rem 0';
        grid.appendChild(placeholder);
      }

      hasRenderedRecommendations = true;
    };

    const ensureRecommendations = () => {
      if (window.SCHPLAY_GAMES && Array.isArray(window.SCHPLAY_GAMES.list) && window.SCHPLAY_GAMES.list.length) {
        renderRecommendations();
      }
    };

    if (window.SCHPLAY_GAMES && window.SCHPLAY_GAMES.list) {
      renderRecommendations();
    } else {
      document.addEventListener('schplay:games-ready', renderRecommendations);
    }

    document.addEventListener('schplay:navigation-ready', ensureRecommendations);
    window.addEventListener('load', ensureRecommendations);
    setTimeout(ensureRecommendations, 1200);

    const iframe = document.getElementById('${escapeHtml(id)}-iframe');
    const fullscreenButton = document.querySelector('.game-player-card .game-fullscreen-toggle');

    if (iframe && fullscreenButton) {
      const updateFullscreenIcon = () => {
        const icon = fullscreenButton.querySelector('i');
        if (!icon) {
          return;
        }
        if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
          icon.classList.remove('fa-compress');
          icon.classList.add('fa-expand');
          const label = fullscreenButton.querySelector('span');
          if (label) {
            label.textContent = 'Fullscreen';
          }
        } else {
          icon.classList.remove('fa-expand');
          icon.classList.add('fa-compress');
          const label = fullscreenButton.querySelector('span');
          if (label) {
            label.textContent = 'Exit Fullscreen';
          }
        }
      };

      const requestIframeFullscreen = () => {
        const fsElement = iframe;
        if (fsElement.requestFullscreen) {
          fsElement.requestFullscreen({ navigationUI: 'hide' }).catch(() => fsElement.requestFullscreen());
        } else if (fsElement.webkitRequestFullscreen) {
          fsElement.webkitRequestFullscreen();
        } else if (fsElement.mozRequestFullScreen) {
          fsElement.mozRequestFullScreen();
        } else if (fsElement.msRequestFullscreen) {
          fsElement.msRequestFullscreen();
        }
      };

      const exitFullscreen = () => {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      };

      fullscreenButton.addEventListener('click', () => {
        if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
          requestIframeFullscreen();
        } else {
          exitFullscreen();
        }
      });

      document.addEventListener('fullscreenchange', updateFullscreenIcon);
      document.addEventListener('webkitfullscreenchange', updateFullscreenIcon);
      document.addEventListener('mozfullscreenchange', updateFullscreenIcon);
      document.addEventListener('MSFullscreenChange', updateFullscreenIcon);
    }

  </script>
  <script src="../js/load-components.js" defer data-component-root="../"></script>
</body>
</html>`;
}

function main() {
  const rawContent = loadJson(RAW_CONTENT_PATH);
  const manualContent = loadJson(MANUAL_CONTENT_PATH);
  const overrides = loadJson(OVERRIDES_PATH);
  const gameList = loadGameList();
  const processed = [];

  const uniqueSlugs = new Set();
  gameList.forEach(({ href }) => {
    if (!href || !href.startsWith('games/')) return;
    const slug = href.split('?')[0].replace(/^games\//, '').replace(/\.html$/, '');
    if (!slug || slug === 'slope') return;
    uniqueSlugs.add(slug);
  });

  uniqueSlugs.forEach((slug) => {
    if (requestedSlugs.length && !requestedSlugs.includes(slug.toLowerCase())) {
      return;
    }
    const base = rawContent[slug];
    const manual = manualContent[slug];
    const data = mergeContent(base, manual);
    if (!data) {
      console.warn(`No content found for ${slug}, skipping.`);
      return;
    }
    const override = overrides[slug] || {};
    data.slug = slug;
    data.name = override.name || data.name;
    if (!data.name) {
      const fallbackEntry = gameList.find(({ href }) => href && href.includes(`${slug}.html`));
      if (fallbackEntry && fallbackEntry.name) {
        data.name = fallbackEntry.name;
      }
    }
    if (!data.name) {
      console.warn(`Missing name for ${slug}, skipping.`);
      return;
    }
    const html = renderPage(slug, data, override);
    const outputPath = path.join(GAMES_DIR, `${slug}.html`);
    fs.writeFileSync(outputPath, html, 'utf8');
    processed.push(slug);
  });

  console.log(`Generated pages for ${processed.length} games.`);
}

main();
