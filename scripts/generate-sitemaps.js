#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const BASE_URL = 'https://schplay.com';
const SITEMAP_XML_PATH = path.join(ROOT, 'sitemap.xml');
const SITEMAP_TXT_PATH = path.join(ROOT, 'sitemap.txt');

const EXCLUDED_PATHS = new Set([
  'blog/post-template.html'
]);

const WEEKLY_TOP_LEVEL = new Set([
  'allgames.html',
  'gamesforkids.html',
  'logic.html',
  'multiplayer.html',
  'new.html',
  'newgames.html',
  'numbers.html',
  'oldgames.html',
  'skill.html',
  'sports.html',
  'strategy.html'
]);

const toIsoDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const listDirectHtmlFiles = (dirPath, prefix = '') => {
  if (!fs.existsSync(dirPath)) {
    return [];
  }

  return fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.html'))
    .map((entry) => path.posix.join(prefix, entry.name));
};

const parseExistingSitemapXml = () => {
  const metaByPath = new Map();

  if (!fs.existsSync(SITEMAP_XML_PATH)) {
    return metaByPath;
  }

  const xml = fs.readFileSync(SITEMAP_XML_PATH, 'utf8');
  const urlBlocks = [...xml.matchAll(/<url>\s*([\s\S]*?)\s*<\/url>/g)];

  for (const blockMatch of urlBlocks) {
    const block = blockMatch[1];
    const locMatch = block.match(/<loc>([^<]+)<\/loc>/);
    if (!locMatch) {
      continue;
    }

    const absoluteUrl = locMatch[1].trim();
    const normalizedPath = absoluteUrl.replace(`${BASE_URL}/`, '');

    const lastmodMatch = block.match(/<lastmod>([^<]+)<\/lastmod>/);
    const changefreqMatch = block.match(/<changefreq>([^<]+)<\/changefreq>/);
    const priorityMatch = block.match(/<priority>([^<]+)<\/priority>/);

    metaByPath.set(normalizedPath, {
      lastmod: lastmodMatch ? lastmodMatch[1].trim() : '',
      changefreq: changefreqMatch ? changefreqMatch[1].trim() : '',
      priority: priorityMatch ? priorityMatch[1].trim() : ''
    });
  }

  return metaByPath;
};

const getDefaultMeta = (pagePath, today) => {
  if (pagePath === 'index.html') {
    return { lastmod: today, changefreq: 'daily', priority: '1.0' };
  }

  if (pagePath.startsWith('games/')) {
    return { lastmod: today, changefreq: 'weekly', priority: '0.8' };
  }

  if (WEEKLY_TOP_LEVEL.has(pagePath)) {
    return { lastmod: today, changefreq: 'weekly', priority: '0.9' };
  }

  return { lastmod: today, changefreq: 'monthly', priority: '0.6' };
};

const buildTargetPagePaths = () => {
  const gamePages = listDirectHtmlFiles(path.join(ROOT, 'games'), 'games').sort();
  const topLevelPages = listDirectHtmlFiles(ROOT, '').sort();
  const blogPages = listDirectHtmlFiles(path.join(ROOT, 'blog'), 'blog').sort();

  const orderedPaths = [...gamePages, ...topLevelPages, ...blogPages];
  const deduped = [];
  const seen = new Set();

  for (const pagePath of orderedPaths) {
    if (EXCLUDED_PATHS.has(pagePath) || seen.has(pagePath)) {
      continue;
    }
    seen.add(pagePath);
    deduped.push(pagePath);
  }

  return deduped;
};

const writeSitemapXml = (entries) => {
  const lines = ['<?xml version="1.0" encoding="utf-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];

  for (const entry of entries) {
    lines.push('  <url>');
    lines.push(`    <loc>${BASE_URL}/${entry.path}</loc>`);
    lines.push(`    <lastmod>${entry.lastmod}</lastmod>`);
    lines.push(`    <changefreq>${entry.changefreq}</changefreq>`);
    lines.push(`    <priority>${entry.priority}</priority>`);
    lines.push('  </url>');
  }

  lines.push('</urlset>');
  lines.push('');

  fs.writeFileSync(SITEMAP_XML_PATH, lines.join('\n'));
};

const writeSitemapTxt = (entries) => {
  const lines = entries.map((entry) => `${BASE_URL}/${entry.path}`);
  lines.push('');
  fs.writeFileSync(SITEMAP_TXT_PATH, lines.join('\n'));
};

const main = () => {
  const today = toIsoDate(new Date());
  const existingMeta = parseExistingSitemapXml();
  const pagePaths = buildTargetPagePaths();

  const entries = pagePaths.map((pagePath) => {
    const defaults = getDefaultMeta(pagePath, today);
    const existing = existingMeta.get(pagePath);

    return {
      path: pagePath,
      lastmod: existing && existing.lastmod ? existing.lastmod : defaults.lastmod,
      changefreq: existing && existing.changefreq ? existing.changefreq : defaults.changefreq,
      priority: existing && existing.priority ? existing.priority : defaults.priority
    };
  });

  writeSitemapXml(entries);
  writeSitemapTxt(entries);

  console.log(`Updated sitemaps with ${entries.length} URLs.`);
};

main();
