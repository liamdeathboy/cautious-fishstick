#!/usr/bin/env node
// Rebuilds the static (crawlable, no-JS) game links that Google uses to discover pages:
//
//   1. Every game page's "More Free Unblocked Games" grid. It used to list the same ~27
//      games on every page, so hundreds of games had a single inbound link (the sitemap
//      doesn't count) and sat in Search Console as "Discovered - currently not indexed".
//      Each page now links a few popular games plus its alphabetical neighbours and a
//      handful of evenly spread games, so every game gets ~20 inbound links and any page
//      is a couple of hops from any other.
//   2. The server-rendered grid on allgames.html, which now lists every game (the JS on
//      that page still replaces it with the enhanced version for visitors).
//
// Idempotent: safe to re-run after adding games (the deploy workflow runs it).

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(__dirname, '..');
const BASE_URL = 'https://schplay.com/';

const POPULAR = ['slope', '1v1lol', 'retrobowl', 'basketballstars', 'ovo', 'minecraft'];
const NEIGHBOURS_EACH_SIDE = 5;
const STRIDES = [0.13, 0.29, 0.47, 0.61, 0.79, 0.91];

const MORE_GAMES_OPEN = '<nav class="games-grid" aria-label="More free unblocked games">';
const ALL_GAMES_OPEN = '<div class="games-grid all-games-grid" id="all-games-grid" aria-live="polite">';

const escapeHtml = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const loadCatalog = () => {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'js', 'games-data.js'), 'utf8'), sandbox);
  return sandbox.window.SCHPLAY_GAMES.list;
};

// Resolve a catalog entry to the URL Google should index (following rel=canonical), or
// null when the page is missing, noindex, or canonicalises outside the site.
const indexableTarget = (href) => {
  const file = path.join(ROOT, href);
  if (!fs.existsSync(file)) {
    return null;
  }
  const html = fs.readFileSync(file, 'utf8');
  if (/<meta\s+name=["']robots["']\s+content=["'][^"']*noindex/i.test(html)) {
    return null;
  }
  const canonical = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
  if (!canonical) {
    return href;
  }
  return canonical[1].startsWith(BASE_URL) ? canonical[1].slice(BASE_URL.length) : null;
};

const buildGames = () => {
  const seen = new Set();
  const games = [];
  for (const entry of loadCatalog()) {
    const target = indexableTarget(entry.href);
    if (!target || seen.has(target)) {
      continue;
    }
    seen.add(target);
    games.push({ name: entry.name, file: entry.href, target, img: entry.img });
  }
  return games.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));
};

// Paths in the catalog are root-relative; game pages live one level down in /games/.
const fromGamesDir = (p) => (/^(?:https?:)?\/\//.test(p) || p.startsWith('/') ? p : `../${p}`);

const card = (game, rel, indent) =>
  `${indent}<a class="game-card" href="${escapeHtml(rel(game.target))}"><img src="${escapeHtml(rel(game.img))}" alt="${escapeHtml(game.name)} unblocked" loading="lazy" decoding="async"><h3>${escapeHtml(game.name)}</h3></a>`;

const pickLinks = (games, index, bySlug) => {
  const n = games.length;
  const picks = [];
  const add = (game) => {
    if (game && game !== games[index] && !picks.includes(game)) {
      picks.push(game);
    }
  };
  POPULAR.forEach((slug) => add(bySlug.get(slug)));
  for (let d = 1; d <= NEIGHBOURS_EACH_SIDE; d += 1) {
    add(games[(index + d) % n]);
    add(games[(index - d + n) % n]);
  }
  STRIDES.forEach((s) => add(games[(index + Math.round(s * n)) % n]));
  return picks;
};

const replaceBlock = (html, open, close, inner) => {
  const start = html.indexOf(open);
  if (start === -1) {
    return null;
  }
  const end = html.indexOf(close, start + open.length);
  if (end === -1) {
    return null;
  }
  return `${html.slice(0, start + open.length)}\n${inner}\n${html.slice(end)}`;
};

const main = () => {
  const games = buildGames();
  const bySlug = new Map(games.map((g) => [path.basename(g.file, '.html'), g]));

  let updated = 0;
  let skipped = 0;
  games.forEach((game, index) => {
    if (!game.file.startsWith('games/')) {
      return;
    }
    const file = path.join(ROOT, game.file);
    const html = fs.readFileSync(file, 'utf8');
    const inner = pickLinks(games, index, bySlug).map((g) => card(g, fromGamesDir, '          ')).join('\n');
    const next = replaceBlock(html, MORE_GAMES_OPEN, '      </nav>', `${inner}`);
    if (next === null) {
      skipped += 1;
      return;
    }
    if (next !== html) {
      fs.writeFileSync(file, next);
      updated += 1;
    }
  });

  const allGamesPath = path.join(ROOT, 'allgames.html');
  const allGames = fs.readFileSync(allGamesPath, 'utf8');
  const grid = games.map((g) => card(g, (p) => p, '        ')).join('\n');
  const nextAllGames = replaceBlock(allGames, ALL_GAMES_OPEN, '      </div>', grid);
  if (nextAllGames === null) {
    throw new Error('Could not find the static grid in allgames.html');
  }
  fs.writeFileSync(allGamesPath, nextAllGames);

  console.log(`Internal links: ${games.length} games, ${updated} game pages updated, ${skipped} without a More Games grid.`);
};

main();
