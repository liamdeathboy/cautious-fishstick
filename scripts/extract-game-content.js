#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const gamesDataPath = path.join(ROOT, 'js', 'games-data.js');
const outputPath = path.join(ROOT, 'data', 'game-content-raw.json');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function loadGameList() {
  const vm = require('node:vm');
  const code = fs.readFileSync(gamesDataPath, 'utf8');
  const sandbox = { window: { SCHPLAY_GAMES: {} } };
  vm.createContext(sandbox);
  vm.runInContext(code, sandbox, { filename: 'games-data.js' });
  const list = sandbox.window.SCHPLAY_GAMES.list;
  if (!Array.isArray(list)) {
    throw new Error('Could not read game list from games-data.js');
  }
  return list;
}

function extractBetween(str, start, end) {
  const startIdx = str.indexOf(start);
  if (startIdx === -1) return '';
  const fromStart = str.slice(startIdx + start.length);
  const endIdx = fromStart.indexOf(end);
  if (endIdx === -1) return '';
  return fromStart.slice(0, endIdx);
}

function decodeHtmlEntities(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function stripHtml(html) {
  const withoutScripts = html.replace(/<script[\s\S]*?<\/script>/gi, '');
  const withoutStyles = withoutScripts.replace(/<style[\s\S]*?<\/style>/gi, '');
  const textOnly = withoutStyles
    .replace(/<br\s*\/?>(\s*)/gi, '\n')
    .replace(/<[^>]+>/g, '');
  return decodeHtmlEntities(textOnly)
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .join('\n');
}

function matchFirst(regex, text) {
  const match = regex.exec(text);
  if (!match) return '';
  return decodeHtmlEntities(match[1].trim());
}

function matchAll(regex, text) {
  const matches = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    matches.push(decodeHtmlEntities(match[1].trim()));
  }
  return matches;
}

function extractInstructions(html) {
  const instructionsMatch = /<div[^>]*class=\"[^\"]*instructions[^\"]*\"[^>]*>([\s\S]*?)<\/div>/i.exec(html);
  if (!instructionsMatch) {
    return [];
  }
  const instructionsHtml = instructionsMatch[1];
  const paragraphs = matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi, instructionsHtml);
  if (paragraphs.length) {
    return paragraphs;
  }
  // fallback: split stripped text into sentences
  const rawText = stripHtml(instructionsHtml);
  if (!rawText) return [];
  return rawText.split(/\n+/).map((line) => line.trim()).filter(Boolean);
}

function extractHeadingSections(html) {
  const sections = [];
  const regex = /<h[23][^>]*>([\s\S]*?)<\/h[23]>\s*<p[^>]*>([\s\S]*?)<\/p>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const heading = decodeHtmlEntities(stripHtml(match[1]));
    const body = decodeHtmlEntities(stripHtml(match[2]));
    if (heading && body) {
      sections.push({ heading, body });
    }
  }
  return sections;
}

function extractListItems(html, selectorClass) {
  const regex = new RegExp(`<ul[^>]*class=\\"[^\\"]*${selectorClass}[^\\"]*\\"[^>]*>([\\s\\S]*?)<\\/ul>`, 'i');
  const match = regex.exec(html);
  if (!match) return [];
  return matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi, match[1]);
}

function gatherContent(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  const title = matchFirst(/<title>([\s\S]*?)<\/title>/i, html);
  const metaDescription = matchFirst(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i, html);
  const metaKeywords = matchFirst(/<meta[^>]*name=["']keywords["'][^>]*content=["']([^"']*)["'][^>]*>/i, html);
  const robots = matchFirst(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']*)["'][^>]*>/i, html);
  const iframeSrc = matchFirst(/<iframe[^>]*src=["']([^"']+)["']/i, html);
  const instructions = extractInstructions(html);
  const sections = extractHeadingSections(html);
  const lists = {
    controls: extractListItems(html, 'controls'),
    metaCode: extractListItems(html, 'meta-code')
  };
  const plainText = stripHtml(html);

  const textBlocks = [];
  if (instructions.length) textBlocks.push(...instructions);
  if (sections.length) {
    sections.forEach(({ heading, body }) => {
      textBlocks.push(`${heading}: ${body}`);
    });
  }
  const heroParagraph = instructions.length ? instructions[0] : metaDescription;

  return {
    title,
    metaDescription,
    metaKeywords,
    robots,
    iframeSrc,
    instructions,
    sections,
    lists,
    heroParagraph,
    plainText,
    rawLength: html.length
  };
}

function main() {
  ensureDir(path.join(ROOT, 'data'));
  const list = loadGameList();
  const result = {};

  list.forEach(({ href, name, img }) => {
    if (!href || !href.startsWith('games/')) {
      return;
    }
    const relativePath = href.split('?')[0];
    const slug = relativePath.replace(/^games\//, '').replace(/\.html$/, '');
    if (!slug) return;
    if (result[slug]) {
      return;
    }
    const filePath = path.join(ROOT, relativePath);
    if (!fs.existsSync(filePath)) {
      console.warn(`Missing file for ${slug} (${relativePath})`);
      return;
    }
    try {
      const content = gatherContent(filePath);
      result[slug] = {
        name,
        href: relativePath,
        image: img,
        ...content
      };
    } catch (error) {
      console.error(`Failed to parse ${relativePath}:`, error.message);
    }
  });

  fs.writeFileSync(outputPath, JSON.stringify(result, null, 2));
  console.log(`Extracted content for ${Object.keys(result).length} games.`);
}

main();
