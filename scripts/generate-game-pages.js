#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const GAMES_DIR = path.join(ROOT, 'games');
const FLASH_DIR = path.join(GAMES_DIR, 'flash');
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
const SITE_KEYWORDS = 'schplay, cool, math, maths, game, games, puzzle, puzzles, free, online, strategy, skill, shapes, colors, logic, memory, board, read, reading, spell, spelling, geography, science, learning fun, fun activities for kids, learning games, education games';
const TEACHER_TAGLINE = 'This classroom-friendly activity is perfect for teachers and learning fun.';

function buildKeywords() {
  return SITE_KEYWORDS;
}

const FLASH_PATH_OVERRIDES = {
  'gunmayhem': 'flash/gun-mayham.swf',
  'the-binding-of-isaac': 'flash/iboi.swf'
};

let flashEntriesCache = null;

function sanitizeKey(input = '') {
  return input
    .toLowerCase()
    .replace(/\.swf$/i, '')
    .replace(/[^a-z0-9]+/g, '');
}

function loadFlashEntries() {
  if (!fs.existsSync(FLASH_DIR)) {
    return [];
  }

  const entries = fs.readdirSync(FLASH_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.swf'))
    .map((entry) => ({ name: entry.name, key: sanitizeKey(entry.name) }));

  return entries;
}

function getFlashEntries() {
  if (!flashEntriesCache) {
    flashEntriesCache = loadFlashEntries();
  }
  return flashEntriesCache;
}

function normalizeFlashPath(value = '') {
  const normalized = value.replace(/\\/g, '/').replace(/^\.\//, '').replace(/^\//, '');
  if (!normalized || normalized.includes('..') || !normalized.toLowerCase().endsWith('.swf')) {
    return '';
  }
  return normalized;
}

function findFlashSwf(slug, override = {}) {
  if (override && override.flashSwf) {
    const normalized = normalizeFlashPath(override.flashSwf);
    if (normalized) {
      return normalized;
    }
  }

  const overridePath = FLASH_PATH_OVERRIDES[slug];
  if (overridePath) {
    return overridePath;
  }

  const entries = getFlashEntries();
  if (!entries.length) {
    return '';
  }

  const slugKey = sanitizeKey(slug);
  if (!slugKey) {
    return '';
  }

  const exact = entries.find((entry) => entry.key === slugKey);
  if (exact) {
    return `flash/${exact.name}`;
  }

  const partial = entries.find((entry) => entry.key.includes(slugKey) || slugKey.includes(entry.key));
  if (partial) {
    return `flash/${partial.name}`;
  }

  return '';
}

function resolveGameEmbed(slug, dataIframeSrc, override = {}) {
  const overrideSrc = override.iframeSrc ? normalizeIframeSrc(override.iframeSrc, slug) : '';
  if (overrideSrc) {
    return { type: 'iframe', src: overrideSrc };
  }

  const candidate = normalizeIframeSrc(dataIframeSrc, slug);
  if (candidate) {
    if (/^https?:/i.test(candidate) || candidate.startsWith('//')) {
      return { type: 'iframe', src: candidate };
    }
    const candidatePath = path.join(GAMES_DIR, candidate);
    if (fs.existsSync(candidatePath)) {
      return { type: 'iframe', src: candidate };
    }
  }

  const flashSwf = findFlashSwf(slug, override);
  if (flashSwf) {
    return { type: 'flash', swf: flashSwf };
  }

  if (candidate) {
    return { type: 'iframe', src: candidate };
  }

  return { type: 'iframe', src: `${slug}/index.html` };
}

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

function normalizeKeywords() {
  return SITE_KEYWORDS;
}

function sanitizeCopy(value = '') {
  return value
    .replace(/unblocked/gi, '')
    .replace(/free and\s*/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function buildMetaDescription(data, override) {
  const base = override?.metaDescription || data.metaDescription || pickHeroParagraph(data, override) || `Play ${data.name} on Schplay.`;
  const sanitized = sanitizeCopy(base);
  const updated = formatUpdated(data.slug || '', override);
  return `${sanitized} ${TEACHER_TAGLINE} Updated ${updated} on Schplay.`;
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
  const description = sanitizeCopy(override?.schemaDescription || data.metaDescription || data.heroParagraph || `Play ${data.name} online.`);
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

function buildStoryPlaybook(game) {
  const { name } = game;
  return {
    teacherToolkit: {
      heading: `Teacher Toolkit for ${name}`,
      intro: `${name} turns each dialogue choice into a close-reading exercise that spotlights classroom discussion norms, family prompts, and privacy-first play sessions.`,
      cards: [
        {
          title: 'Close-reading pause',
          body: `Project a pivotal decision in ${name} and have students cite the exact line that justifies their vote before advancing the story.`
        },
        {
          title: 'Family empathy prompt',
          body: `Send home a one-sentence journal starter such as "What would our family choose in ${name}, and why?" so caregivers can join the conversation.`
        },
        {
          title: 'Privacy-first storytelling',
          body: `${name} runs fully in the browser with no logins; remind learners to close the tab when finished and avoid sharing screenshots that might reveal classmates’ choices.`
        }
      ]
    },
    curriculum: {
      heading: 'Curriculum Alignment & Family Bridges',
      intro: `Use the narrative structure in ${name} to blend ELA analysis, SEL reflection, and digital citizenship reminders.`,
      rows: [
        {
          title: 'ELA & Narrative Structure',
          standard: 'CCSS.ELA-LITERACY.RL.7.3',
          description: `Chart how ${name}’s branching dialogue reveals character motives, citing text evidence to support each claim.`
        },
        {
          title: 'Family Empathy Talk',
          standard: 'CASEL Relationship Skills',
          description: `Share a weekly choice from ${name} for families to debate, reinforcing perspective-taking beyond class time.`
        },
        {
          title: 'Digital Citizenship',
          standard: 'ISTE 2.2a',
          description: `Discuss why we keep play sessions private and avoid posting story spoilers or names from ${name}.`
        }
      ]
    },
    faq: {
      heading: `${name} Classroom FAQ`,
      intro: `Answer the top questions families and admins raise about using ${name} during instruction.`,
      items: [
        {
          question: `How can ${name} support literacy lessons?`,
          answer: `Treat every branch in ${name} as a text-dependent question. Students must cite dialogue or codex entries before the class votes on the next move.`
        },
        {
          question: `What family prompt works with ${name}?`,
          answer: `Send home a "What would we choose?" scenario so caregivers can discuss empathy, stakes, and character motivation together.`
        },
        {
          question: `Is ${name} safe for classroom devices?`,
          answer: `${name} plays entirely in-browser with no accounts. Remind students not to share screenshots that include classmates’ names and to close the tab when done.`
        }
      ]
    }
  };
}

function buildStrategyPlaybook(game) {
  const { name } = game;
  return {
    teacherToolkit: {
      heading: `Teacher Toolkit for ${name}`,
      intro: `${name} is a systems-thinking sandbox, so you can highlight classroom strategy, invite quick family scoreboards, and reinforce privacy without extra setup.`,
      cards: [
        {
          title: 'Data-to-strategy huddles',
          body: `Have squads screenshot their resource charts in ${name}, label gains/losses, and propose a new tactic before unpausing.`
        },
        {
          title: 'Family cost-benefit chat',
          body: `Send home a single image of your current build in ${name} and ask families which upgrade they would fund and why.`
        },
        {
          title: 'Privacy-first coaching',
          body: `${name} runs with no accounts, so remind students never to share save files publicly and to discuss tactics without posting personal details.`
        }
      ]
    },
    curriculum: {
      heading: 'Curriculum Alignment & Family Bridges',
      intro: `Tie the planning loops in ${name} to math modeling, real-world budgeting, and digital citizenship.`,
      rows: [
        {
          title: 'Math & Systems Thinking',
          standard: 'CCSS.MATH.PRACTICE.MP4',
          description: `Model rate-of-change as teams justify why ${name}’s next upgrade offers the best return on investment.`
        },
        {
          title: 'Family Economics',
          standard: 'PTA National Standard 4',
          description: `Invite families to compare ${name} upgrades to real budgeting decisions so students connect gameplay to home conversations.`
        },
        {
          title: 'Digital Citizenship',
          standard: 'ISTE 1.2c',
          description: `Highlight why sharing links or codes from ${name} should happen only inside trusted classroom spaces.`
        }
      ]
    },
    faq: {
      heading: `${name} Classroom FAQ`,
      intro: `Share how ${name} reinforces planning and safe play for administrators and families.`,
      items: [
        {
          question: `How does ${name} support instruction?`,
          answer: `Students analyze resource spikes and bottlenecks in ${name}, then defend which upgrades or defenses to prioritize—a perfect formative assessment.`
        },
        {
          question: `How can families join in without extra accounts?`,
          answer: `Send home a "What would you build next?" screenshot so caregivers can compare strategies using the same privacy-friendly browser version.`
        },
        {
          question: `Does ${name} protect student privacy?`,
          answer: `${name} plays locally in the browser, so no usernames or birthdates are collected. Remind students not to share save files in public chats.`
        }
      ]
    }
  };
}

function buildPuzzlePlaybook(game) {
  const { name } = game;
  return {
    teacherToolkit: {
      heading: `Teacher Toolkit for ${name}`,
      intro: `${name} doubles as a logic lab—ideal for bell ringers that surface problem-solving wins, family challenges, and privacy reminders.`,
      cards: [
        {
          title: 'Visible thinking huddle',
          body: `Ask learners to narrate two moves ahead in ${name}, highlighting math vocabulary like "combine" and "double".`
        },
        {
          title: 'Family puzzler',
          body: `Print or screenshot a tricky board from ${name} and invite families to predict the next best move at home.`
        },
        {
          title: 'Privacy in practice',
          body: `${name} requires zero logins. Reinforce that students should only share puzzles, not personal windows or tabs.`
        }
      ]
    },
    curriculum: {
      heading: 'Curriculum Alignment & Family Bridges',
      intro: `Link the logic of ${name} to math practices, home conversations, and digital safety.`,
      rows: [
        {
          title: 'Logic & Perseverance',
          standard: 'CCSS.MATH.PRACTICE.MP1',
          description: `Have students explain how each move in ${name} changes the board and evaluate alternate plans.`
        },
        {
          title: 'Family Strategy Share',
          standard: 'PTA National Standard 3',
          description: `Encourage families to compare puzzle-solving approaches so students verbalize reasoning beyond class.`
        },
        {
          title: 'Digital Safety',
          standard: 'ISTE 2.1d',
          description: `Model how to capture only the game board from ${name} before sharing, keeping other tabs private.`
        }
      ]
    },
    faq: {
      heading: `${name} Classroom FAQ`,
      intro: `Clarify how ${name} supports logic practice, family outreach, and privacy.`,
      items: [
        {
          question: `What classroom benefit does ${name} provide?`,
          answer: `${name} lets students test hypotheses quickly—perfect for math talk routines and error analysis.`
        },
        {
          question: `How can families engage with ${name}?`,
          answer: `Send home a weekly screenshot and ask families to jot the first two moves they would try, then compare notes in class.`
        },
        {
          question: `Does ${name} keep student information private?`,
          answer: `Yes. ${name} runs offline-friendly in the browser with no accounts or tracking beyond basic analytics.`
        }
      ]
    }
  };
}

function buildMathPlaybook(game) {
  const { name } = game;
  return {
    teacherToolkit: {
      heading: `Teacher Toolkit for ${name}`,
      intro: `${name} reinforces numeracy while giving you ready-made family prompts and privacy reminders.`,
      cards: [
        {
          title: 'Mental-math spotlight',
          body: `Pause after a big calculation in ${name} and ask students to explain the number patterns they spotted.`
        },
        {
          title: 'Family number talk',
          body: `Share a daily target score from ${name} so families can predict how many moves remain.`
        },
        {
          title: 'Privacy & focus',
          body: `Because ${name} doesn’t use accounts, it’s easy to remind learners to close other tabs and keep only the grid visible.`
        }
      ]
    },
    curriculum: {
      heading: 'Curriculum Alignment & Family Bridges',
      intro: `Connect ${name} to math fluency, home conversations, and digital citizenship.`,
      rows: [
        {
          title: 'Numeracy & Fluency',
          standard: 'CCSS.MATH.CONTENT.5.NBT.B.7',
          description: `Use ${name} to practice adding, subtracting, multiplying, or dividing within contextual scenarios.`
        },
        {
          title: 'Family Math Talk',
          standard: 'PTA National Standard 1',
          description: `Ask families to describe where they see math outside school using examples from ${name}.`
        },
        {
          title: 'Privacy & Accuracy',
          standard: 'ISTE 2.1a',
          description: `Set expectations for sharing only anonymized game boards from ${name} when discussing solutions.`
        }
      ]
    },
    faq: {
      heading: `${name} Classroom FAQ`,
      intro: `Answer top questions about using ${name} for numeracy and safe play.`,
      items: [
        {
          question: `How does ${name} reinforce math standards?`,
          answer: `Each turn in ${name} requires composing and decomposing numbers, which mirrors the strategies from our math block.`
        },
        {
          question: `What at-home challenge fits ${name}?`,
          answer: `Families can estimate how many steps remain to hit a target score, then compare to the student’s prediction.`
        },
        {
          question: `Is ${name} private enough for school-issued devices?`,
          answer: `${name} runs without sign-ins, so no personal data leaves the Chromebook. Just remind students to share boards, not browser tabs.`
        }
      ]
    }
  };
}

function buildSportsPlaybook(game) {
  const { name } = game;
  return {
    teacherToolkit: {
      heading: `Teacher Toolkit for ${name}`,
      intro: `${name} blends hand-eye coordination, data literacy, and community building—all while staying friendly for families and privacy policies.`,
      cards: [
        {
          title: 'Shot-selection film study',
          body: `After each round in ${name}, have players justify their shot choice using stats vocabulary.`
        },
        {
          title: 'Family highlight reel',
          body: `Encourage students to retell one clutch play from ${name} at home, focusing on teamwork language.`
        },
        {
          title: 'Privacy-first competition',
          body: `Remind learners that ${name} uses local multiplayer, so no gamer tags or personal data ever leave the room.`
        }
      ]
    },
    curriculum: {
      heading: 'Curriculum Alignment & Family Bridges',
      intro: `Use ${name} to pair PE standards with math talk and digital citizenship.`,
      rows: [
        {
          title: 'Physical Literacy & Data',
          standard: 'SHAPE America S4.M1',
          description: `Analyze how timing, angle, and stamina in ${name} influence the outcome, then set a practice goal.`
        },
        {
          title: 'Family Fan Chat',
          standard: 'PTA National Standard 6',
          description: `Invite families to compare ${name} strategies to real-world sports decisions.`
        },
        {
          title: 'Digital Citizenship',
          standard: 'ISTE 2.3b',
          description: `Review why we keep any recorded matches of ${name} private and celebrate sportsmanship online.`
        }
      ]
    },
    faq: {
      heading: `${name} Classroom FAQ`,
      intro: `Explain the learning value, home tie-ins, and safety plan for ${name}.`,
      items: [
        {
          question: `How does ${name} help in PE or advisory?`,
          answer: `${name} sparks conversations about tactics, pacing, and resilience—great for SEL check-ins.`
        },
        {
          question: `How can families engage with ${name}?`,
          answer: `Share a "What would you do?" clip from ${name} so families can talk through choices together.`
        },
        {
          question: `Does ${name} keep information private?`,
          answer: `${name} offers local/co-op play without usernames, so remind students to only share highlights with trusted people.`
        }
      ]
    }
  };
}

function buildRacingPlaybook(game) {
  const { name } = game;
  return {
    teacherToolkit: {
      heading: `Teacher Toolkit for ${name}`,
      intro: `${name} channels velocity, focus, and reflection—perfect for science starters, family chats, and privacy reminders.`,
      cards: [
        {
          title: 'Focus sprints',
          body: `Use 60-second runs of ${name} to discuss reaction time and how small adjustments keep the avatar safe.`
        },
        {
          title: 'Family speed challenge',
          body: `Send a quick note inviting families to beat the class ghost run in ${name} and discuss how they stayed calm.`
        },
        {
          title: 'Privacy check-in',
          body: `Remind students that ${name} is browser-based; no logins means they should only share score screenshots, not entire desktops.`
        }
      ]
    },
    curriculum: {
      heading: 'Curriculum Alignment & Family Bridges',
      intro: `Tie ${name} to STEM concepts, home conversations, and digital well-being.`,
      rows: [
        {
          title: 'STEM & Motion',
          standard: 'NGSS MS-PS2-2',
          description: `Relate steering in ${name} to balanced and unbalanced forces.`
        },
        {
          title: 'Family Drive-Time Prompt',
          standard: 'PTA National Standard 2',
          description: `Encourage caregivers to discuss safe speeds and reaction time after students explain ${name}.`
        },
        {
          title: 'Digital Well-being',
          standard: 'ISTE 1.1c',
          description: `Set timers and screen breaks around ${name} so focus stays healthy.`
        }
      ]
    },
    faq: {
      heading: `${name} Classroom FAQ`,
      intro: `Clarify how ${name} boosts STEM thinking while keeping privacy in check.`,
      items: [
        {
          question: `How does ${name} support science standards?`,
          answer: `Use ${name} to explain momentum, friction, and cause/effect when turns go well or poorly.`
        },
        {
          question: `Any family tie-ins for ${name}?`,
          answer: `Families can hold a "calmest hands" contest to see who keeps steady control the longest, then discuss strategies.`
        },
        {
          question: `Is ${name} safe to run on school laptops?`,
          answer: `Yes—${name} loads locally and stores nothing beyond basic progress. A screenshot of the final score is all that’s needed.`
        }
      ]
    }
  };
}

function buildPlatformerPlaybook(game) {
  const { name } = game;
  return {
    teacherToolkit: {
      heading: `Teacher Toolkit for ${name}`,
      intro: `${name} rewards sequencing and perseverance, making it a natural fit for classroom goal-setting, family storytelling, and privacy cues.`,
      cards: [
        {
          title: 'Checkpoint retros',
          body: `After a tricky jump in ${name}, have students outline the three steps they took to succeed.`
        },
        {
          title: 'Family walkthroughs',
          body: `Encourage students to narrate one favorite level from ${name} to a family member, emphasizing grit.`
        },
        {
          title: 'Private progress logs',
          body: `Because ${name} saves locally, have learners jot progress in journals instead of posting it online.`
        }
      ]
    },
    curriculum: {
      heading: 'Curriculum Alignment & Family Bridges',
      intro: `Map ${name} to writing, SEL, and digital citizenship.`,
      rows: [
        {
          title: 'Story Sequencing',
          standard: 'CCSS.ELA-LITERACY.W.3.3',
          description: `Retell level objectives from ${name} with clear beginning, middle, and end.`
        },
        {
          title: 'Family Level Design Chat',
          standard: 'PTA National Standard 1',
          description: `Ask families which obstacle felt toughest and why.`
        },
        {
          title: 'Digital Citizenship',
          standard: 'ISTE 2.1b',
          description: `Review why walkthrough videos of ${name} should avoid showing open tabs or student faces.`
        }
      ]
    },
    faq: {
      heading: `${name} Classroom FAQ`,
      intro: `Answer key classroom, family, and privacy questions for ${name}.`,
      items: [
        {
          question: `What learning benefit comes from ${name}?`,
          answer: `${name} makes students break goals into micro-steps, a skill that transfers to writing and math.`
        },
        {
          question: `How can families connect to ${name}?`,
          answer: `Have students describe one obstacle course to caregivers and brainstorm coping strategies.`
        },
        {
          question: `Is ${name} okay for privacy policies?`,
          answer: `${name} runs without accounts and never asks for chat handles, so it fits tight privacy rules.`
        }
      ]
    }
  };
}

function buildActionPlaybook(game) {
  const { name } = game;
  return {
    teacherToolkit: {
      heading: `Teacher Toolkit for ${name}`,
      intro: `${name} demands quick decisions, perfect for cause-and-effect mini-lessons, family debriefs, and privacy reminders.`,
      cards: [
        {
          title: 'Risk-reward map',
          body: `Have students sketch two options they faced in ${name} and explain the safer path.`
        },
        {
          title: 'Family debrief prompt',
          body: `Encourage learners to tell caregivers about a tense moment in ${name} and how they stayed calm.`
        },
        {
          title: 'Privacy & play',
          body: `${name} uses local saves, so reiterate that no chat handles or personal info should be shared when discussing strategies.`
        }
      ]
    },
    curriculum: {
      heading: 'Curriculum Alignment & Family Bridges',
      intro: `Blend the fast decisions in ${name} with science design, SEL, and digital safety.`,
      rows: [
        {
          title: 'STEM & Systems',
          standard: 'NGSS MS-ETS1-2',
          description: `Analyze how changing one variable in ${name} impacts the outcome.`
        },
        {
          title: 'Family SEL Check',
          standard: 'CASEL Self-Management',
          description: `Ask families to discuss breathing or focus routines that help during tough game moments.`
        },
        {
          title: 'Privacy & Safety',
          standard: 'ISTE 2.3a',
          description: `Model how to talk about action games like ${name} without sharing gamer tags.`
        }
      ]
    },
    faq: {
      heading: `${name} Classroom FAQ`,
      intro: `Explain the learning purpose and privacy guardrails for ${name}.`,
      items: [
        {
          question: `How does ${name} help in class?`,
          answer: `Students justify their move sequences in ${name}, showing you how well they can plan under pressure.`
        },
        {
          question: `How can families join the fun responsibly?`,
          answer: `Share a quick SEL prompt about keeping calm during ${name} so families can practice breathing or focus skills together.`
        },
        {
          question: `Is ${name} compliant with privacy expectations?`,
          answer: `${name} avoids logins and only stores progress locally, so it meets strict school privacy rules.`
        }
      ]
    }
  };
}

function buildCreativePlaybook(game) {
  const { name } = game;
  return {
    teacherToolkit: {
      heading: `Teacher Toolkit for ${name}`,
      intro: `${name} invites design thinking, family showcases, and privacy-friendly publishing.`,
      cards: [
        {
          title: 'Prototype critiques',
          body: `Use build phases in ${name} as mini design reviews—students name one strength and one next step.`
        },
        {
          title: 'Family studio tour',
          body: `Encourage learners to walk caregivers through their latest ${name} build and explain its purpose.`
        },
        {
          title: 'Ownership & privacy',
          body: `${name} saves locally, so discuss how to share creations without exposing other windows or chat tabs.`
        }
      ]
    },
    curriculum: {
      heading: 'Curriculum Alignment & Family Bridges',
      intro: `Tie ${name} to engineering standards, home celebrations, and digital ownership.`,
      rows: [
        {
          title: 'Design Thinking',
          standard: 'NGSS 3-5-ETS1-2',
          description: `Document constraints, brainstorms, and iterations from ${name}.`
        },
        {
          title: 'Family Showcase',
          standard: 'PTA National Standard 5',
          description: `Host a gallery walk of ${name} creations families can react to at home.`
        },
        {
          title: 'Digital Ownership',
          standard: 'ISTE 1.6b',
          description: `Credit original creators and keep personal data out of shared screenshots from ${name}.`
        }
      ]
    },
    faq: {
      heading: `${name} Classroom FAQ`,
      intro: `Give a quick overview of how ${name} fits design learning, home pride, and privacy.`,
      items: [
        {
          question: `Why use ${name} in class?`,
          answer: `Students plan, prototype, and reflect on builds in ${name}, mirroring the engineering design cycle.`
        },
        {
          question: `How do families stay connected?`,
          answer: `Send an invitation for families to tour the latest ${name} creation through photos or narrated slides.`
        },
        {
          question: `Does ${name} respect privacy?`,
          answer: `Yes—no logins or uploads are required. Screenshots can be cropped to show only the build.`
        }
      ]
    }
  };
}

function buildMusicPlaybook(game) {
  const { name } = game;
  return {
    teacherToolkit: {
      heading: `Teacher Toolkit for ${name}`,
      intro: `${name} channels rhythm literacy, family sing-alongs, and privacy-friendly sharing.`,
      cards: [
        {
          title: 'Beat mapping',
          body: `Chart how ${name} uses patterns of four and eight, then connect the beats to poetry or percussion.`
        },
        {
          title: 'Family jam session',
          body: `Send home a challenge for families to clap or snap along to a section of ${name}.`
        },
        {
          title: 'Audio-only sharing',
          body: `Remind students to record audio reactions to ${name} instead of filming the whole desktop.`
        }
      ]
    },
    curriculum: {
      heading: 'Curriculum Alignment & Family Bridges',
      intro: `Link ${name} to music standards, home performance, and privacy.`,
      rows: [
        {
          title: 'Arts & Timing',
          standard: 'National Core Arts MU:Pr4.2',
          description: `Analyze how phrasing and tempo cues in ${name} inform performance choices.`
        },
        {
          title: 'Family Rhythm Share',
          standard: 'PTA National Standard 1',
          description: `Invite families to record a short clapping pattern inspired by ${name}.`
        },
        {
          title: 'Privacy & Audio',
          standard: 'ISTE 2.1d',
          description: `Keep cameras off when sharing ${name} sessions; audio captures the learning without extra data.`
        }
      ]
    },
    faq: {
      heading: `${name} Classroom FAQ`,
      intro: `Outline the arts benefits, family tie-ins, and privacy plan for ${name}.`,
      items: [
        {
          question: `How does ${name} aid music fluency?`,
          answer: `Learners match on-screen prompts in ${name} to rhythmic notation, strengthening steady beat and subdivision.`
        },
        {
          question: `Can families participate without the game?`,
          answer: `Yes—share a beat pattern from ${name} so families can clap it back at home.`
        },
        {
          question: `Does ${name} require accounts or recordings?`,
          answer: `No. ${name} works offline and only needs basic key inputs, so privacy policies remain intact.`
        }
      ]
    }
  };
}

function buildDefaultPlaybook(game) {
  const { name } = game;
  return {
    teacherToolkit: {
      heading: `Teacher Toolkit for ${name}`,
      intro: `${name} reinforces focus and reflection—easy to fold into classroom routines, home updates, and privacy briefings.`,
      cards: [
        {
          title: 'Goal setting minute',
          body: `Have students name one micro-skill they will practice during ${name} and report back after the round.`
        },
        {
          title: 'Family check-in',
          body: `Share a "ask me about" prompt tied to ${name} so families can hear what perseverance looked like.`
        },
        {
          title: 'Privacy reminder',
          body: `${name} needs no login, but reinforce that students should share only scores or reflections—not open tabs.`
        }
      ]
    },
    curriculum: {
      heading: 'Curriculum Alignment & Family Bridges',
      intro: `Even quick play in ${name} can link SEL, home partnerships, and digital citizenship.`,
      rows: [
        {
          title: 'Focus & SEL',
          standard: 'CASEL Self-Management',
          description: `Track breathing, focus, or grit strategies used while playing ${name}.`
        },
        {
          title: 'Family Conversation',
          standard: 'PTA National Standard 1',
          description: `Send concise updates families can discuss, such as "Ask how I stayed calm in ${name}."`
        },
        {
          title: 'Digital Safety',
          standard: 'ISTE 2.1d',
          description: `Model how to capture only the scoreboard or reflection from ${name} before sharing.`
        }
      ]
    },
    faq: {
      heading: `${name} Classroom FAQ`,
      intro: `Cover the essentials administrators care about—learning value, family outreach, and privacy—for ${name}.`,
      items: [
        {
          question: `What learning happens inside ${name}?`,
          answer: `Students plan, act, and reflect quickly in ${name}, which translates into better executive-function routines.`
        },
        {
          question: `How do we keep families looped in?`,
          answer: `Share weekly prompts that describe how ${name} builds grit so caregivers can celebrate progress.`
        },
        {
          question: `Is ${name} compliant with privacy rules?`,
          answer: `${name} collects zero login data; only the classroom device records play, and screenshots can be cropped to scores only.`
        }
      ]
    }
  };
}

const CLASSROOM_PLAYBOOKS = [
  {
    key: 'story',
    triggers: ['visual novel', 'story', 'narrative', 'dialogue', 'lore', 'chapter', 'read', 'novel'],
    buildContent: buildStoryPlaybook
  },
  {
    key: 'music',
    triggers: ['music', 'rhythm', 'song', 'fnf', 'dance', 'melody'],
    buildContent: buildMusicPlaybook
  },
  {
    key: 'creative',
    triggers: ['sandbox', 'creative', 'craft', 'design', 'builder', 'minecraft'],
    buildContent: buildCreativePlaybook
  },
  {
    key: 'sports',
    triggers: ['sport', 'basketball', 'soccer', 'football', 'golf', 'tennis', 'baseball', 'hockey'],
    buildContent: buildSportsPlaybook
  },
  {
    key: 'racing',
    triggers: ['racing', 'drift', 'drive', 'car', 'kart', 'runner', 'slope', 'moto'],
    buildContent: buildRacingPlaybook
  },
  {
    key: 'strategy',
    triggers: ['strategy', 'tycoon', 'tower defense', 'management', 'idle', 'resource', 'sim', 'simulation'],
    buildContent: buildStrategyPlaybook
  },
  {
    key: 'math',
    triggers: ['math', 'number', 'fraction', 'algebra', 'count', 'sum'],
    buildContent: buildMathPlaybook
  },
  {
    key: 'puzzle',
    triggers: ['puzzle', 'logic', 'brain', 'match', 'merge', 'wordle'],
    buildContent: buildPuzzlePlaybook
  },
  {
    key: 'platformer',
    triggers: ['platformer', 'platform', 'adventure', 'jump', 'quest', 'explore', 'run'],
    buildContent: buildPlatformerPlaybook
  },
  {
    key: 'action',
    triggers: ['action', 'battle', 'fight', 'shoot', 'combat', 'survival', 'arena'],
    buildContent: buildActionPlaybook
  },
  {
    key: 'default',
    triggers: [],
    buildContent: buildDefaultPlaybook
  }
];

function pickPlaybook(gameContext, override = {}) {
  const manual = override.learningProfile;
  if (manual) {
    const manualPlaybook = CLASSROOM_PLAYBOOKS.find((profile) => profile.key === manual);
    if (manualPlaybook) {
      return manualPlaybook;
    }
  }

  const haystack = [
    gameContext.slug,
    gameContext.genre,
    gameContext.description,
    gameContext.heroParagraph,
    ...(Array.isArray(gameContext.instructions) ? gameContext.instructions : []),
    ...(Array.isArray(gameContext.sections) ? gameContext.sections.map((section) => `${section.heading} ${section.body}`) : [])
  ].join(' ').toLowerCase();

  for (const profile of CLASSROOM_PLAYBOOKS) {
    if (profile.triggers.some((trigger) => haystack.includes(trigger))) {
      return profile;
    }
  }

  return CLASSROOM_PLAYBOOKS[CLASSROOM_PLAYBOOKS.length - 1];
}

function buildLearningContent(gameContext, override = {}) {
  const playbook = pickPlaybook(gameContext, override);
  const content = playbook.buildContent(gameContext) || buildDefaultPlaybook(gameContext);
  return normalizeLearningContent(content, gameContext);
}

function normalizeLearningContent(content, gameContext) {
  if (!content || typeof content !== 'object') {
    return buildDefaultPlaybook(gameContext);
  }

  const fallback = buildDefaultPlaybook(gameContext);
  const teacherToolkit = {
    heading: content.teacherToolkit?.heading || fallback.teacherToolkit.heading,
    intro: content.teacherToolkit?.intro || fallback.teacherToolkit.intro,
    cards: Array.isArray(content.teacherToolkit?.cards) && content.teacherToolkit.cards.length
      ? content.teacherToolkit.cards
      : fallback.teacherToolkit.cards
  };

  const curriculum = {
    heading: content.curriculum?.heading || fallback.curriculum.heading,
    intro: content.curriculum?.intro || fallback.curriculum.intro,
    rows: Array.isArray(content.curriculum?.rows) && content.curriculum.rows.length
      ? content.curriculum.rows
      : fallback.curriculum.rows
  };

  const faq = {
    heading: content.faq?.heading || fallback.faq.heading,
    intro: content.faq?.intro || fallback.faq.intro,
    items: Array.isArray(content.faq?.items) && content.faq.items.length
      ? content.faq.items
      : fallback.faq.items
  };

  return { teacherToolkit, curriculum, faq };
}

function renderTeacherToolkitSection(id, toolkit) {
  if (!toolkit || !Array.isArray(toolkit.cards) || !toolkit.cards.length) {
    return '';
  }

  const cardsHtml = toolkit.cards.map(({ title, body }) => `
        <article class="learning-card" role="listitem">
          <h3>${escapeHtml(title)}</h3>
          <p>${escapeHtml(body)}</p>
        </article>`).join('');

  return `
    <section class="game-learning teacher-toolkit" aria-labelledby="${escapeHtml(id)}-teacher-title">
      <div class="learning-header">
        <p class="learning-eyebrow">Teacher Toolkit</p>
        <h2 id="${escapeHtml(id)}-teacher-title">${escapeHtml(toolkit.heading)}</h2>
        <p>${escapeHtml(toolkit.intro)}</p>
      </div>
      <div class="learning-grid" role="list">
        ${cardsHtml}
      </div>
    </section>`;
}

function renderCurriculumSection(id, curriculum) {
  if (!curriculum || !Array.isArray(curriculum.rows) || !curriculum.rows.length) {
    return '';
  }

  const rowsHtml = curriculum.rows.map(({ title, standard, description }) => `
        <article class="learning-card" role="listitem">
          <span class="learning-standard">${escapeHtml(standard)}</span>
          <h3>${escapeHtml(title)}</h3>
          <p>${escapeHtml(description)}</p>
        </article>`).join('');

  return `
    <section class="game-learning curriculum-grid" aria-labelledby="${escapeHtml(id)}-curriculum-title">
      <div class="learning-header">
        <p class="learning-eyebrow">Curriculum Alignment</p>
        <h2 id="${escapeHtml(id)}-curriculum-title">${escapeHtml(curriculum.heading)}</h2>
        <p>${escapeHtml(curriculum.intro)}</p>
      </div>
      <div class="learning-grid" role="list">
        ${rowsHtml}
      </div>
    </section>`;
}

function renderFaqSection(id, faq) {
  if (!faq || !Array.isArray(faq.items) || !faq.items.length) {
    return '';
  }

  const itemsHtml = faq.items.map(({ question, answer }) => `
        <details>
          <summary>${escapeHtml(question)}</summary>
          <p>${escapeHtml(answer)}</p>
        </details>`).join('');

  return `
    <section class="game-learning learning-faq" aria-labelledby="${escapeHtml(id)}-faq-title">
      <div class="learning-header">
        <p class="learning-eyebrow">Family & Classroom FAQ</p>
        <h2 id="${escapeHtml(id)}-faq-title">${escapeHtml(faq.heading)}</h2>
        <p>${escapeHtml(faq.intro)}</p>
      </div>
      <div class="learning-faq-list" role="list">
        ${itemsHtml}
      </div>
    </section>`;
}

function buildFaqSchema(canonical, name, faqItems) {
  if (!Array.isArray(faqItems) || !faqItems.length) {
    return null;
  }

  const mainEntity = faqItems.map(({ question, answer }) => {
    const q = sanitizeCopy(question || '');
    const a = sanitizeCopy(answer || '');
    if (!q || !a) {
      return null;
    }
    return {
      '@type': 'Question',
      name: q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: a
      }
    };
  }).filter(Boolean).slice(0, 6);

  if (!mainEntity.length) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    url: canonical,
    name: `${name} Classroom FAQ`,
    mainEntity
  };
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
  const embedConfig = resolveGameEmbed(slug, data.iframeSrc, override);
  const embedElementId = embedConfig.type === 'flash' ? `${id}-flash-player` : `${id}-iframe`;
  let embedHtml;
  let embedExtraStyles = '';
  if (embedConfig.type === 'flash') {
    embedExtraStyles = `
        .game-player-card .flash-container {
            width: 100%;
            height: 640px;
            border: none;
            border-radius: 12px;
            background-color: #000;
            overflow: hidden;
        }

        .game-player-card .flash-container:fullscreen,
        .game-player-card .flash-container:-webkit-full-screen,
        .game-player-card .flash-container:-moz-full-screen,
        .game-player-card .flash-container:-ms-fullscreen {
            width: 100vw;
            height: 100vh;
            border-radius: 0;
        }

        @media (max-width: 1100px) {
            .game-player-card .flash-container {
                height: 520px;
            }
        }`;

    embedHtml = `
        <div id="${escapeHtml(embedElementId)}" class="flash-container" role="presentation"></div>
        <script src="https://unpkg.com/@ruffle-rs/ruffle"></script>
        <script>
          window.RufflePlayer = window.RufflePlayer || {};
          window.addEventListener('load', function () {
            var mount = document.getElementById('${escapeHtml(embedElementId)}');
            if (!mount || mount.dataset.ruffleLoaded === 'true') {
              return;
            }
            if (!window.RufflePlayer || typeof window.RufflePlayer.newest !== 'function') {
              return;
            }
            var ruffle = window.RufflePlayer.newest();
            if (!ruffle) {
              return;
            }
            var player = ruffle.createPlayer();
            player.style.width = '100%';
            player.style.height = '100%';
            mount.innerHTML = '';
            mount.appendChild(player);
            mount.dataset.ruffleLoaded = 'true';
            var loadResult;
            try {
              loadResult = player.load(${JSON.stringify(embedConfig.swf)});
            } catch (err) {
              mount.dataset.ruffleLoaded = 'false';
              console.error('Failed to load Flash game:', err);
              return;
            }
            if (loadResult && typeof loadResult.catch === 'function') {
              loadResult.catch(function (error) {
                mount.dataset.ruffleLoaded = 'false';
                console.error('Failed to load Flash game:', error);
              });
            }
          });
        </script>`;
  } else {
    embedHtml = `
        <iframe id="${escapeHtml(embedElementId)}" src="${escapeHtml(embedConfig.src)}" title="Play ${escapeHtml(name)}" allowfullscreen loading="lazy"></iframe>`;
  }
  const keywords = buildKeywords({ ...data, slug, name }, override);
  const metaDescription = buildMetaDescription({ ...data, slug, name }, override);
  const seoTitle = buildSeoTitle({ ...data, slug, name }, override);
  const canonical = buildCanonical(slug, override);
  const imageUrl = absoluteImageUrl(override.image || data.image || override.img);
  const schema = buildSchema(slug, { ...data, slug, name }, override, details, imageUrl);
  const masterTitle = `Tips to Master ${name}`;
  const { masterHeading, masterIntro, body } = renderMetaSections(sections, masterTitle, name, instructions);

  const gameContext = {
    slug,
    name,
    genre: details.genre,
    description: data.metaDescription || '',
    heroParagraph,
    instructions,
    sections
  };

  const learningContent = buildLearningContent(gameContext, override);
  const teacherToolkitHtml = renderTeacherToolkitSection(id, learningContent.teacherToolkit);
  const curriculumHtml = renderCurriculumSection(id, learningContent.curriculum);
  const faqHtml = renderFaqSection(id, learningContent.faq);
  const faqSchema = buildFaqSchema(canonical, name, learningContent.faq.items);
  const schemaEntries = faqSchema ? [schema, faqSchema] : [schema];
  const schemaJson = JSON.stringify(schemaEntries.length === 1 ? schemaEntries[0] : schemaEntries, null, 12);

  const instructionsHtml = renderInstructions(instructions);
  const controlsHtml = renderControls(controls);

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="index, follow">
    <meta name="description" content="${escapeHtml(metaDescription)}">
    <meta name="keywords" content="${escapeHtml(normalizeKeywords())}">
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
${schemaJson.replace(/^/gm, '        ')}
    </script>
    <style>
${slopeStyle}${embedExtraStyles}
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
          <button class="game-fullscreen-toggle" type="button" aria-controls="${escapeHtml(embedElementId)}" aria-label="Toggle fullscreen">
            <i class="fas fa-expand" aria-hidden="true"></i>
            <span>Fullscreen</span>
          </button>
        </div>
${embedHtml}
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

${teacherToolkitHtml}
${curriculumHtml}
${faqHtml}

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

    const gameViewport = document.getElementById('${escapeHtml(embedElementId)}');
    const fullscreenButton = document.querySelector('.game-player-card .game-fullscreen-toggle');

    if (gameViewport && fullscreenButton) {
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

      const requestViewportFullscreen = () => {
        const fsElement = gameViewport;
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
          requestViewportFullscreen();
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
