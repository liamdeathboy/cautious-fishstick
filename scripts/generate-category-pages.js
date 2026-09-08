#!/usr/bin/env node

/**
 * Generates the six SEO genre landing pages as <slug>/index.html at the site root
 * (served as clean trailing-slash URLs, e.g. /puzzle-games-unblocked/).
 *
 * Game selection: data/game-content-manual.json is the pool (real curated pages, each
 * with href + image); data/game-overrides.json supplies the display name. The `genre`
 * field in overrides is too noisy for automatic bucketing ("Racing - Skill" holds
 * "Math games for Dummies"), so each category below carries a hand-picked slug list.
 * Any slug not found in the pool is reported and skipped. Re-run after catalog changes:
 *
 *     node scripts/generate-category-pages.js
 *
 * scripts/generate-sitemaps.js lists these slugs in EXTRA_DIRECTORY_PAGES, so the sitemap
 * picks them up automatically once their index.html exists.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OVERRIDES_PATH = path.join(ROOT, 'data', 'game-overrides.json');
const MANUAL_PATH = path.join(ROOT, 'data', 'game-content-manual.json');
const COMPONENT_VERSION = '2026-04-01-mobile-1';
const OG_IMAGE = 'https://schplay.com/images/logo.webp';
const MAX_CARDS = 18;

const CATEGORIES = [
  {
    slug: '2-player-games-unblocked',
    title: '2 Player Games Unblocked - Play Free on Chromebook',
    h1: '2 Player Games Unblocked',
    description:
      'Play 2 player games unblocked free at Schplay. Challenge a friend on any Chromebook or school laptop - no download needed.',
    valueProp:
      'Challenge a friend in your browser - no download, works on any school Chromebook.',
    gridHeading: 'Popular 2 Player Games',
    include: [
      '1v1lol', 'rooftopsnipers', 'tanktrouble', 'getaway-shootout', 'gunmayhem',
      'houseofhazards', 'hideandsmash', 'boxingrandom', 'basketballstars', 'soccer-random',
      'fireboy-and-watergirl-firetemple', 'bad-icecream-1', 'bad-icecream-2', 'bad-icecream-3',
      'minescraftter-two-player', 'redpool-legend-2-player', 'juicy-tic-tac-toe-battle',
      'swords-and-sandals-2'
    ]
  },
  {
    slug: 'io-games-unblocked',
    title: 'IO Games Unblocked - Play Free on Chromebook',
    h1: 'IO Games Unblocked',
    description:
      'Play IO games unblocked free at Schplay. Browser-based multiplayer IO games that work on any Chromebook or school laptop.',
    valueProp:
      'Multiplayer IO games in your browser - no download, works on any school Chromebook.',
    gridHeading: 'Popular IO Games',
    include: [
      'agario', 'slitherio', 'holeio', 'paperio2', 'evowars', 'bit-gun-io', 'pacxon'
    ]
  },
  {
    slug: 'shooting-games-unblocked',
    title: 'Unblocked Shooting Games - Play Free on Chromebook',
    h1: 'Unblocked Shooting Games',
    description:
      'Play unblocked shooting games free at Schplay. Browser-based shooters that work on any Chromebook or school laptop - no download.',
    valueProp: 'Browser-based shooters - no download, works on any school Chromebook.',
    gridHeading: 'Popular Shooting Games',
    include: [
      '1v1lol', 'quake3', 'pixelgun', 'ngon', 'galaga', 'duckhunt', 'gunspin',
      'deep-freeze', '10-minutes-till-dawn', 'getaway-shootout', 'gunmayhem', 'z-machine',
      'super-tank-hero', 'camouflage-and-sniper', 'the-binding-of-isaac', 'stickman-and-guns',
      'imposter-assassin-3d', 'candy-cat-shot'
    ]
  },
  {
    slug: 'puzzle-games-unblocked',
    title: 'Unblocked Puzzle Games - Play Free on Chromebook',
    h1: 'Unblocked Puzzle Games',
    description:
      'Play unblocked puzzle games free at Schplay. Brain-training puzzle games that work on any Chromebook or school laptop - no download.',
    valueProp:
      'Brain-training puzzles in your browser - no download, works on any school Chromebook.',
    gridHeading: 'Popular Puzzle Games',
    include: [
      '2048', 'tetris', 'blockblast', 'bloxors', 'cut-the-rope', 'minesweeper',
      'cupcake2048', 'bejeweled2', 'worldshardestgame', 'worldshardestgame2',
      'angrybirdshalloween', 'civiballs1', 'connect-pipe-color-puzzle-game', 'gyroball',
      'towerblaster', 'towermaster', 'watermelon-merge-3', 'draw-the-hill'
    ]
  },
  {
    slug: 'arcade-games-unblocked',
    title: 'Arcade Games Unblocked - Play Free on Chromebook',
    h1: 'Arcade Games Unblocked',
    description:
      'Play arcade games unblocked free at Schplay. Classic and modern arcade games that work on any Chromebook or school laptop.',
    valueProp:
      'Classic and modern arcade games - no download, works on any school Chromebook.',
    gridHeading: 'Popular Arcade Games',
    include: [
      'pacman', 'doodlejump', 'flappy-bird', 'crossyroad', 'subwaysurfer', 'templerun2',
      'jetpack-joyride', 'duckhunt', 'galaga', 'googlesnake', 'snake', 'slope2', 'air-slip',
      'flappy-2048', 'learntofly', 'learntofly2', 'gunspin', 'curveball'
    ]
  },
  {
    slug: 'racing-games-unblocked',
    title: 'Racing Games Unblocked - Play Free on Chromebook',
    h1: 'Racing Games Unblocked',
    description:
      'Play racing games unblocked free at Schplay. Fast-paced browser racing games that work on any Chromebook or school laptop.',
    valueProp:
      'Fast-paced racing in your browser - no download, works on any school Chromebook.',
    gridHeading: 'Popular Racing Games',
    include: [
      'drifthunters', 'drivemad', 'dunebuggy', 'motox3m', 'real-driving-simulator',
      'bus-school-park-driver', 'duck-life-3', 'ducklife1', 'ducklife2', 'duck-life-5',
      'jelly-drift', 'speed-stars', 'crush-cars-3d', 'cool-cars-run-3d', 'car-survival-3d',
      'mega-car-jumps', 'happy-wheels', 'tug-of-war-with-cars'
    ]
  }
];

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const rootAsset = (value) => {
  if (!value) return value;
  if (/^https?:\/\//i.test(value)) return value;
  return '/' + value.replace(/^\/+/, '');
};

const usableImage = (image) => Boolean(image) && (/^https?:\/\//i.test(image) || /\.\w{2,5}$/.test(image));

const buildPool = () => {
  const overrides = JSON.parse(fs.readFileSync(OVERRIDES_PATH, 'utf8'));
  const manual = JSON.parse(fs.readFileSync(MANUAL_PATH, 'utf8'));

  const pool = new Map();
  for (const [slug, meta] of Object.entries(manual)) {
    const href = meta && meta.href;
    const image = meta && meta.image;
    if (!href || !usableImage(image)) continue;
    pool.set(slug, {
      slug,
      name: (overrides[slug] && overrides[slug].name) || meta.name || slug,
      genre: (overrides[slug] && overrides[slug].genre) || '',
      href: rootAsset(href),
      image: rootAsset(image)
    });
  }
  return pool;
};

const selectGames = (category, pool) => {
  const chosen = [];
  const missing = [];

  for (const slug of category.include) {
    const game = pool.get(slug);
    if (game) {
      chosen.push(game);
    } else {
      missing.push(slug);
    }
  }

  chosen.sort((a, b) => a.name.localeCompare(b.name));
  return { games: chosen.slice(0, MAX_CARDS), missing };
};

const otherCategoryChips = (currentSlug) =>
  CATEGORIES.filter((c) => c.slug !== currentSlug)
    .map((c) => `        <a class="category-chip" href="/${c.slug}/">${escapeHtml(c.h1.replace(/ Unblocked$/i, '').replace(/^Unblocked /i, ''))}</a>`)
    .concat('        <a class="category-chip" href="/allgames.html">All Games</a>')
    .join('\n');

const renderCard = (game) =>
  `          <a class="game-card" href="${escapeHtml(game.href)}"><img src="${escapeHtml(game.image)}" alt="${escapeHtml(game.name)} unblocked" loading="lazy" decoding="async"><h3>${escapeHtml(game.name)}</h3></a>`;

const renderPage = (category, games) => {
  const url = `https://schplay.com/${category.slug}/`;
  const title = escapeHtml(category.title);
  const description = escapeHtml(category.description);
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.h1,
    description: category.description,
    url,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://schplay.com/' },
        { '@type': 'ListItem', position: 2, name: 'All Games', item: 'https://schplay.com/allgames.html' },
        { '@type': 'ListItem', position: 3, name: category.h1, item: url }
      ]
    }
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="stylesheet" href="/css/monocraft.css">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="index, follow">
    <meta name="description" content="${description}">
    <meta name="theme-color" content="#0f1a2a">
    <title>${title}</title>
    <link rel="canonical" href="${url}">
    <link rel="icon" href="/images/favicon.ico" sizes="any">
    <link rel="apple-touch-icon" href="/images/favicon-32x32.png">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Schplay">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:url" content="${url}">
    <meta property="og:image" content="${OG_IMAGE}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${OG_IMAGE}">
    <link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" as="style" onload="this.onload=null;this.rel='stylesheet'" crossorigin="anonymous">
    <noscript><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" crossorigin="anonymous"></noscript>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=optional" as="style" onload="this.onload=null;this.rel='stylesheet'">
    <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=optional"></noscript>
    <link rel="stylesheet" href="/css/new-style.css">
    <link rel="stylesheet" href="/css/restyle.css">
    <link rel="stylesheet" href="/css/user-choice.css">
    <script type="application/ld+json">
${JSON.stringify(jsonLd, null, 4)}
    </script>
    <style>
        .game-breadcrumb {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 8px;
            font-size: 0.9rem;
            margin: 4px 0 14px;
            color: #9fb3c8;
        }
        .game-breadcrumb a { color: #9fb3c8; text-decoration: none; }
        .game-breadcrumb a:hover { color: #fff; text-decoration: underline; }
        .game-breadcrumb .breadcrumb-sep { color: #52657d; }
        .game-breadcrumb [aria-current="page"] { color: #dbe6f2; }

        .game-title-block { margin: 0 0 18px; }
        .game-title {
            font-size: clamp(1.6rem, 3vw, 2.3rem);
            line-height: 1.15;
            margin: 0 0 6px;
            color: #fff;
            letter-spacing: -0.01em;
        }
        .game-subtitle { margin: 0; color: #9fb3c8; font-size: 1rem; max-width: 70ch; }

        .games-grid-section { margin-top: 8px; }
        .games-grid-section .section-header {
            display: flex;
            align-items: baseline;
            justify-content: space-between;
            gap: 12px;
            margin-bottom: 12px;
        }
        .games-grid-section .section-header h2 { font-size: 1.15rem; margin: 0; color: #fff; }
        .games-grid-section .games-count { color: #9fb3c8; font-size: 0.9rem; }

        .category-browse {
            margin: 32px 0 8px;
            padding: 22px;
            background-color: #1c2a3e;
            border-radius: 16px;
        }
        .category-browse-title { font-size: 1.15rem; margin: 0 0 14px; color: #fff; }
        .category-browse-links { display: flex; flex-wrap: wrap; gap: 10px; }
        .category-browse-links .category-chip {
            display: inline-flex;
            align-items: center;
            padding: 8px 16px;
            border-radius: 999px;
            background-color: #24384f;
            color: #dbe6f2;
            font-weight: 600;
            font-size: 0.92rem;
            text-decoration: none;
            transition: background-color 0.15s ease, color 0.15s ease;
        }
        .category-browse-links .category-chip:hover { background-color: #2f9bff; color: #fff; }

        .category-back { margin: 20px 0 0; }
        .category-back a { color: #9fb3c8; text-decoration: none; font-weight: 600; }
        .category-back a:hover { color: #fff; text-decoration: underline; }
    </style>
</head>
<body>
  <header id="site-header" role="banner">
    <div id="navbar-placeholder"></div>
  </header>

  <main class="container" role="main">

    <nav class="game-breadcrumb" aria-label="Breadcrumb">
      <a href="/">Home</a>
      <span class="breadcrumb-sep" aria-hidden="true">›</span>
      <a href="/allgames.html">Games</a>
      <span class="breadcrumb-sep" aria-hidden="true">›</span>
      <span aria-current="page">${escapeHtml(category.h1)}</span>
    </nav>

    <div class="game-title-block">
      <h1 class="game-title">${escapeHtml(category.h1)}</h1>
      <p class="game-subtitle">${escapeHtml(category.valueProp)}</p>
    </div>

    <section class="games-grid-section" aria-labelledby="category-grid-title">
      <div class="section-header">
        <h2 id="category-grid-title">${escapeHtml(category.gridHeading)}</h2>
        <span class="games-count">${games.length} games</span>
      </div>
      <nav class="games-grid" aria-label="${escapeHtml(category.h1)}">
${games.map(renderCard).join('\n')}
      </nav>
    </section>

    <nav class="category-browse" aria-label="Browse unblocked games by category">
      <h2 class="category-browse-title">More Unblocked Game Categories</h2>
      <div class="category-browse-links">
${otherCategoryChips(category.slug)}
      </div>
    </nav>

    <p class="category-back"><a href="/">← Back to all unblocked games</a></p>
  </main>

  <footer id="site-footer" role="contentinfo">
    <div id="footer-placeholder"></div>
  </footer>

  <script src="/js/load-components.js?v=${COMPONENT_VERSION}" defer data-component-root="/"></script>
  <script src="/js/lazy-media.js" defer></script>
</body>
</html>
`;
};

const main = () => {
  const pool = buildPool();
  const summary = [];

  for (const category of CATEGORIES) {
    const { games, missing } = selectGames(category, pool);
    const dir = path.join(ROOT, category.slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), renderPage(category, games));
    let line = `${category.slug.padEnd(28)} ${String(games.length).padStart(2)} games`;
    if (missing.length) line += `   (skipped, not in pool: ${missing.join(', ')})`;
    summary.push(line);
  }

  console.log('Generated category pages:\n' + summary.map((l) => '  ' + l).join('\n'));
};

main();
