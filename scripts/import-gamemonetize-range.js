#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const ROOT = path.resolve(__dirname, '..');
const SQL_PATH = path.join(ROOT, 'v8_2_arcade cms_28k_games_gamemonetize.com', 'Database 28k games.sql');
const GAMES_DATA_PATH = path.join(ROOT, 'js', 'games-data.js');
const MANUAL_PATH = path.join(ROOT, 'data', 'game-content-manual.json');
const OVERRIDES_PATH = path.join(ROOT, 'data', 'game-overrides.json');
const GAMES_DIR = path.join(ROOT, 'games');
const OUTPUT_SLUGS_PATH = '/tmp/gm_imported_slugs.txt';

const startId = Number(process.argv[2] || 11);
const endId = Number(process.argv[3] || 60);

if (!Number.isInteger(startId) || !Number.isInteger(endId) || startId < 1 || endId < startId) {
  console.error('Usage: node scripts/import-gamemonetize-range.js <startId> <endId>');
  process.exit(1);
}

function parseSqlTuple(line) {
  const values = [];
  let index = 0;

  const readEscaped = (char) => {
    if (char === 'n') return '\n';
    if (char === 'r') return '\r';
    if (char === 't') return '\t';
    return char;
  };

  if (!line.startsWith('(')) {
    throw new Error(`Invalid SQL tuple: ${line.slice(0, 80)}`);
  }

  index += 1;
  while (index < line.length) {
    while (index < line.length && /\s/.test(line[index])) index += 1;
    if (line[index] === ')') break;

    if (line[index] === "'") {
      index += 1;
      let value = '';
      while (index < line.length) {
        const char = line[index];
        if (char === '\\') {
          value += readEscaped(line[index + 1] || '');
          index += 2;
          continue;
        }
        if (char === "'") {
          index += 1;
          break;
        }
        value += char;
        index += 1;
      }
      values.push(value);
    } else {
      const start = index;
      while (index < line.length && line[index] !== ',' && line[index] !== ')') index += 1;
      const raw = line.slice(start, index).trim();
      values.push(raw === 'NULL' ? null : raw);
    }

    while (index < line.length && /\s/.test(line[index])) index += 1;
    if (line[index] === ',') index += 1;
  }

  return values;
}

function decodeEntities(input = '') {
  let output = String(input);
  for (let pass = 0; pass < 4; pass += 1) {
    const previous = output;
    output = output
      .replace(/amp;(?:amp;)?ndash;/gi, ' - ')
      .replace(/amp;(?:amp;)?mdash;/gi, ' - ')
      .replace(/&amp;/gi, '&')
      .replace(/&#038;/g, '&')
      .replace(/&nbsp;/gi, ' ')
      .replace(/&ndash;|&#8211;/gi, ' - ')
      .replace(/&mdash;|&#8212;/gi, ' - ')
      .replace(/&quot;|&ldquo;|&rdquo;/gi, '"')
      .replace(/&#34;/g, '"')
      .replace(/&#39;|&apos;|&rsquo;|&lsquo;/gi, "'")
      .replace(/&lt;/gi, '<')
      .replace(/&gt;/gi, '>');
    if (output === previous) break;
  }
  return output;
}

function stripHtml(input = '') {
  return decodeEntities(String(input))
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<\/p>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function titleFromSlug(slug = '') {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => {
      const lower = part.toLowerCase();
      if (/^\d+d$/.test(lower)) return lower.toUpperCase();
      if (lower === 'io') return 'IO';
      if (lower === 'pc') return 'PC';
      if (lower === 'fps') return 'FPS';
      if (lower === 'diy') return 'DIY';
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(' ')
    .replace(/\b2d\b/g, '2D')
    .replace(/\b3d\b/g, '3D')
    .replace(/\bIo\b/g, 'IO')
    .replace(/\bPc\b/g, 'PC')
    .replace(/\bDiy\b/g, 'DIY');
}

function mostlyUppercase(text = '') {
  const letters = text.replace(/[^A-Za-z]/g, '');
  if (!letters) return false;
  const uppercaseLetters = letters.replace(/[^A-Z]/g, '').length;
  return uppercaseLetters / letters.length > 0.72;
}

function smartTitleCase(text = '') {
  return text
    .toLowerCase()
    .split(/(\s+|[:!/\-])/)
    .map((token) => {
      if (!token || /^\s+$/.test(token) || /[:!/\-]/.test(token)) return token;
      if (/^\d+d$/.test(token)) return token.toUpperCase();
      if (token === 'io') return 'IO';
      if (token === 'pc') return 'PC';
      if (token === 'fps') return 'FPS';
      if (token === 'diy') return 'DIY';
      return token.charAt(0).toUpperCase() + token.slice(1);
    })
    .join('')
    .replace(/\b2d\b/g, '2D')
    .replace(/\b3d\b/g, '3D')
    .replace(/\bIo\b/g, 'IO')
    .replace(/\bPc\b/g, 'PC')
    .replace(/\bDiy\b/g, 'DIY');
}

function normalizeName(name, slug) {
  let output = decodeEntities(name || '')
    .replace(/\bamp(?:;amp)?;?ndash\b/gi, '-')
    .replace(/\bamp(?:;amp)?;?mdash\b/gi, '-')
    .replace(/\s+/g, ' ')
    .trim();

  if (!output || /\bamp\b|&#|&[a-z]+;|\?/.test(output)) {
    output = titleFromSlug(slug);
  }

  if (mostlyUppercase(output)) {
    output = smartTitleCase(output);
  }

  return output.replace(/\s+/g, ' ').trim();
}

function cleanSentence(text = '') {
  return decodeEntities(text)
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;!?])/g, '$1')
    .trim();
}

function loadGameList() {
  const sandbox = { window: { SCHPLAY_GAMES: {} } };
  vm.createContext(sandbox);
  vm.runInContext(fs.readFileSync(GAMES_DATA_PATH, 'utf8'), sandbox, { filename: 'games-data.js' });
  return sandbox.window.SCHPLAY_GAMES.list || [];
}

function extractGameRows() {
  const sql = fs.readFileSync(SQL_PATH, 'utf8');
  const tuples = [];
  let inGamesInsert = false;

  for (const rawLine of sql.split('\n')) {
    const line = rawLine.trim();
    if (line.startsWith('INSERT INTO `gm_games`')) {
      inGamesInsert = true;
      continue;
    }

    if (!inGamesInsert || !line.startsWith('(')) {
      continue;
    }

    tuples.push(line.endsWith(';') ? line.slice(0, -1) : line);

    if (line.endsWith(');')) {
      inGamesInsert = false;
    }
  }

  if (!tuples.length) {
    throw new Error('Could not collect gm_games tuples');
  }

  return tuples
    .map(parseSqlTuple)
    .map((cols) => ({
      gameId: Number(cols[0]),
      slug: String(cols[2] || '').toLowerCase(),
      name: cols[3] || '',
      image: cols[4] || '',
      category: String(cols[6] || ''),
      description: cols[9] || '',
      instructions: cols[10] || '',
      file: cols[11] || '',
      width: Number(cols[13] || 0),
      height: Number(cols[14] || 0)
    }));
}

function classifyGame(row, name) {
  const description = stripHtml(row.description);
  const controlsSource = cleanSentence(row.instructions);
  const haystack = `${name} ${row.slug} ${description} ${controlsSource}`.toLowerCase();

  let type = 'default';
  if (/coloring|color book|paint/.test(haystack)) type = 'coloring';
  else if (/jigsaw/.test(haystack)) type = 'jigsaw';
  else if (/difference|spot the difference/.test(haystack)) type = 'difference';
  else if (/memory/.test(haystack)) type = 'memory';
  else if (/tower defense/.test(haystack)) type = 'tower-defense';
  else if (/clicker/.test(haystack)) type = 'clicker';
  else if (/domino/.test(haystack)) type = 'domino';
  else if (/tic tac toe/.test(haystack)) type = 'tic-tac-toe';
  else if (/(pipe|connect).*(puzzle|color)|puzzle.*pipe/.test(haystack)) type = 'pipe-puzzle';
  else if (/bottle|kettle|water sort|measure/.test(haystack)) type = 'pour-puzzle';
  else if (/merge/.test(haystack)) type = 'merge';
  else if (/music|piano|rhythm/.test(haystack)) type = 'music';
  else if (/doctor|dentist|hospital|examination/.test(haystack)) type = 'doctor';
  else if (/cake|cooking|bake|salon|makeover|dress/.test(haystack)) type = 'creative-life';
  else if (/craft|builder|block craft|minecraft/.test(haystack)) type = 'craft';
  else if (/driving|driver|parking|park|car|bus|racing|race|stunt|truck|simulator/.test(haystack)) type = 'driving';
  else if (/shoot|shooter|sniper|assassin|tank|zombie|battle|attack|hero|gun/.test(haystack)) type = 'action';
  else if (/math|addition|number/.test(haystack)) type = 'math';
  else if (/alphabet/.test(haystack)) type = 'word';
  else if (/jump|platform|runner|adventure|rabbit|flappy|float|portal|blob/.test(haystack)) type = 'platformer';
  else if (/puzzle|logic|hookcube|match/.test(haystack)) type = 'puzzle';
  else if (row.category === '5') type = 'puzzle';
  else if (row.category === '4') type = 'platformer';
  else if (row.category === '3') type = 'action';
  else if (row.category === '2') type = 'driving';

  const profileMap = {
    coloring: 'default',
    jigsaw: 'puzzle',
    difference: 'puzzle',
    memory: 'puzzle',
    'tower-defense': 'strategy',
    clicker: 'strategy',
    domino: 'strategy',
    'tic-tac-toe': 'strategy',
    'pipe-puzzle': 'puzzle',
    'pour-puzzle': 'puzzle',
    merge: 'puzzle',
    music: 'music',
    doctor: 'default',
    'creative-life': 'default',
    craft: 'creative',
    driving: 'racing',
    action: 'action',
    math: 'math',
    word: 'default',
    platformer: 'platformer',
    puzzle: 'puzzle',
    default: 'default'
  };

  let genre = 'Arcade · Skill';
  if (type === 'coloring') genre = 'Creative · Coloring';
  else if (type === 'jigsaw') genre = 'Puzzle · Jigsaw';
  else if (type === 'difference') genre = 'Puzzle · Spot the Difference';
  else if (type === 'memory') genre = 'Puzzle · Memory';
  else if (type === 'tower-defense') genre = 'Tower Defense · Strategy';
  else if (type === 'clicker') genre = 'Idle · Clicker';
  else if (type === 'domino') genre = 'Board · Domino';
  else if (type === 'tic-tac-toe') genre = 'Board · Tic-Tac-Toe';
  else if (type === 'pipe-puzzle' || type === 'pour-puzzle') genre = 'Puzzle · Logic';
  else if (type === 'merge') genre = 'Puzzle · Merge';
  else if (type === 'music') genre = 'Rhythm · Music';
  else if (type === 'doctor') genre = 'Simulation · Care';
  else if (type === 'creative-life') genre = /cake|cook|bake/.test(haystack) ? 'Cooking · Creative' : 'Simulation · Casual';
  else if (type === 'craft') genre = 'Sandbox · Creative';
  else if (type === 'driving') genre = /park|parking|simulator|driver/.test(haystack) ? 'Driving · Simulation' : 'Racing · Skill';
  else if (type === 'action') genre = /assassin|sniper|shoot|tank|gun|zombie/.test(haystack) ? 'Action · Shooter' : 'Action · Combat';
  else if (type === 'math') genre = 'Educational · Math';
  else if (type === 'word') genre = 'Educational · Word';
  else if (type === 'platformer') genre = /flappy|float/.test(haystack) ? 'Arcade · Reflex' : 'Platformer · Adventure';
  else if (type === 'puzzle') genre = 'Puzzle · Brain';

  const platforms = /touch|tap|mobile|screen/.test(haystack) || row.height > row.width ? 'Browser, Mobile' : 'Browser';
  return { type, profile: profileMap[type] || 'default', genre, platforms, controlsSource };
}

function buildHero(name, type) {
  const copy = {
    coloring: `${name} is a relaxed coloring game built around palette choice, brush control, and finishing each page your way.`,
    jigsaw: `${name} turns picture matching into a calm puzzle session where sorting edges and color groups matters.`,
    difference: `${name} rewards quick observation, clean scanning, and calm clicking as hidden changes get harder to spot.`,
    memory: `${name} keeps the pressure on with fast pair matching, pattern recall, and sharper focus each round.`,
    'tower-defense': `${name} is about smart placement, upgrade timing, and defending your route before waves get out of control.`,
    clicker: `${name} is an upgrade loop built around quick taps, efficient spending, and steady score growth.`,
    domino: `${name} rewards planning ahead, keeping the board open, and turning small placements into stronger follow-up turns.`,
    'tic-tac-toe': `${name} keeps every round focused on setup, blocking lines, and forcing the final winning move.`,
    'pipe-puzzle': `${name} is a clean logic challenge built around route planning, color matching, and keeping paths from crossing.`,
    'pour-puzzle': `${name} turns measuring and pouring into a logic puzzle where every move changes the whole board.`,
    merge: `${name} is a satisfying merge puzzle where space control and smart combinations matter more than rushed moves.`,
    music: `${name} is a rhythm challenge built on timing, pattern recognition, and keeping your streak alive.`,
    doctor: `${name} plays like a light care sim where clean steps and steady interactions move each task forward.`,
    'creative-life': `${name} is a casual sim focused on simple steps, playful choices, and finishing each task cleanly.`,
    craft: `${name} mixes block building, resource use, and defense into a creative sandbox loop.`,
    driving: `${name} rewards clean steering, measured speed, and reading the route before you commit.`,
    action: `${name} is built around target priority, quick reactions, and staying in control when the pressure rises.`,
    math: `${name} turns quick thinking into a fast math challenge where accuracy matters as much as speed.`,
    word: `${name} blends quick movement with educational prompts so timing and recognition both matter.`,
    platformer: `${name} is all about timing jumps, reading hazards early, and keeping momentum through each stage.`,
    puzzle: `${name} rewards board reading, efficient moves, and calm resets when a layout starts to collapse.`,
    default: `${name} is a quick browser challenge built around timing, clean control, and repeatable improvement.`
  };
  return copy[type] || copy.default;
}

function buildMetaDescription(name, type) {
  const copy = {
    coloring: `Play ${name} online and fill themed scenes with bright colors, easy tools, and relaxed creative play.`,
    jigsaw: `Play ${name} online and assemble picture puzzles with drag-and-drop controls, clear matching cues, and calm pacing.`,
    difference: `Play ${name} online and spot every hidden change before the timer runs out across cartoon-style scenes.`,
    memory: `Play ${name} online and train your recall with fast card matching, sharper focus, and increasingly tricky rounds.`,
    'tower-defense': `Play ${name} online and defend your route with smarter tower placement, upgrades, and wave management.`,
    clicker: `Play ${name} online and build bigger numbers through fast taps, better upgrades, and tighter resource loops.`,
    domino: `Play ${name} online and outplay the board with smart placements, clean chains, and better endgame control.`,
    'tic-tac-toe': `Play ${name} online and win more rounds through setup plays, clean blocks, and faster reads.`,
    'pipe-puzzle': `Play ${name} online and connect every route cleanly with color matching, path planning, and no crossed lines.`,
    'pour-puzzle': `Play ${name} online and solve bottle-and-volume puzzles with careful pours, planning, and clean resets.`,
    merge: `Play ${name} online and combine matching pieces into bigger clears with smart spacing and efficient merges.`,
    music: `Play ${name} online and follow the rhythm with steady timing, clean inputs, and stronger streaks.`,
    doctor: `Play ${name} online and work through each care step with simple controls and light simulation tasks.`,
    'creative-life': `Play ${name} online and move through playful sim tasks with easy controls, bright visuals, and casual pacing.`,
    craft: `Play ${name} online and build, protect, and expand a block world with creative placement and survival pressure.`,
    driving: `Play ${name} online and handle each route with smoother turns, better braking, and cleaner finishes.`,
    action: `Play ${name} online and clear threats with quick aim, fast reactions, and smart target control.`,
    math: `Play ${name} online and sharpen math skills with quick answers, clear prompts, and repeatable practice.`,
    word: `Play ${name} online and improve recognition skills with fast prompts, clean movement, and short rounds.`,
    platformer: `Play ${name} online and push through each stage with better timing, cleaner jumps, and smarter routes.`,
    puzzle: `Play ${name} online and solve each board with smarter moves, cleaner setups, and better pattern reading.`,
    default: `Play ${name} online on Schplay with quick controls, instant browser play, and repeatable short sessions.`
  };
  return copy[type] || copy.default;
}

function buildInstructionSet(type, controlsSource) {
  const copy = {
    coloring: [
      'Pick a color first, then work one area at a time so the page stays clean and easy to finish.',
      'Use the eraser or brush-size tools when small details need more control.',
      'Try a full pass on the big shapes before you start shading tiny sections.'
    ],
    jigsaw: [
      'Start with edge and corner pieces so the frame gives you a stable base to build from.',
      'Group pieces by color or clothing details before chasing tiny image fragments.',
      'Use short review cycles instead of random dragging when the last pieces get tight.'
    ],
    difference: [
      'Scan the whole image once before clicking so you build a quick map of the biggest changes.',
      'Work from one side to the other instead of bouncing between details and losing track.',
      'Save hints for the final differences when the timer gets tight.'
    ],
    memory: [
      'Flip pairs in a consistent pattern so card positions stay easier to remember.',
      'Focus on one cluster of cards at a time instead of guessing across the full board.',
      'Speed matters, but clean recall beats random clicks once the layouts get harder.'
    ],
    'tower-defense': [
      'Place your first defenses where they cover the longest stretch of the route.',
      'Upgrade the towers doing the most work before you spread resources too thin.',
      'Save one answer for stronger waves so the late-game push does not break your setup.'
    ],
    clicker: [
      'Spend early upgrades on the strongest multiplier instead of spreading coins everywhere.',
      'Watch which action gives the biggest return and build your loop around that.',
      'Short upgrade cycles usually scale better than waiting too long for one huge buy.'
    ],
    domino: [
      'Think one turn ahead before placing a tile so you do not close off your best options.',
      'Protect flexible numbers early because they keep your later turns easier.',
      'If the board starts to lock up, play for position instead of chasing flashy chains.'
    ],
    'tic-tac-toe': [
      'Open with a move that creates future pressure instead of reacting too late.',
      'Block forks early because one missed line can lose the round instantly.',
      'Treat draws as useful resets and look for cleaner setups in the next board.'
    ],
    'pipe-puzzle': [
      'Read the whole board before you drag anything so you do not trap the final route.',
      'Connect the most crowded paths first because they limit the rest of the puzzle.',
      'Reset quickly when lines start crossing instead of patching a weak layout.'
    ],
    'pour-puzzle': [
      'Picture the target volume before every pour so you do not waste a useful container.',
      'Use the largest bottle to create space, then clean up the exact measurements afterward.',
      'When a level stalls, undo early and try a simpler sequence instead of forcing the last step.'
    ],
    merge: [
      'Keep similar pieces close together so strong merges stay available on the next move.',
      'Protect open space because crowded boards remove your best combination options.',
      'Plan the next merge, not just the current one, when scores start climbing.'
    ],
    music: [
      'Lock onto the beat first, then worry about score once your timing feels stable.',
      'Short clean streaks are better than forcing extra notes and breaking rhythm.',
      'Replay tricky patterns until the timing feels automatic instead of rushed.'
    ],
    doctor: [
      'Follow the on-screen order so each tool and treatment step stays easy to track.',
      'Use deliberate clicks or taps when the game asks for precision on small targets.',
      'Finish one task cleanly before jumping ahead to the next patient action.'
    ],
    'creative-life': [
      'Follow the on-screen steps in order so each task stays smooth and easy to finish.',
      'Use short, clean inputs when decorating or preparing items so details stay under control.',
      'Treat each round like a checklist and complete the big steps before the finishing touches.'
    ],
    craft: [
      'Build the basic structure first so you have a safe layout before enemies show up.',
      'Gather easy resources early and avoid overextending when the map opens up.',
      'Keep your strongest defenses near the most exposed parts of the build.'
    ],
    driving: [
      'Set up your turn early so you do not need a heavy correction in the middle of the route.',
      'Brake before tight spaces and accelerate only when the exit line is clear.',
      'Use small steering inputs because smooth control beats panic movement every time.'
    ],
    action: [
      'Identify the biggest threat first so the screen gets easier to control right away.',
      'Keep your movement clean and avoid wasting attacks on low-value targets.',
      'When a round gets hectic, accuracy and timing matter more than raw speed.'
    ],
    math: [
      'Read each prompt fully before answering so speed does not create avoidable mistakes.',
      'Build a steady rhythm instead of rushing one hard question and losing the whole streak.',
      'Replay short sets and track which question types slow you down the most.'
    ],
    word: [
      'Focus on the prompt first, then move with purpose instead of reacting at the last second.',
      'Use repeated short runs to learn the pattern behind each educational challenge.',
      'Clean recognition is more valuable than panic speed once the pace rises.'
    ],
    platformer: [
      'Read the next obstacle before you jump so your landing stays under control.',
      'Protect momentum on safe stretches and slow down only when the route demands it.',
      'Use repeated runs to learn the level rhythm instead of improvising every section.'
    ],
    puzzle: [
      'Take one full look at the board before your first move so the main pattern stands out.',
      'Solve the most restrictive part of the puzzle first because it shapes the rest of the board.',
      'Reset quickly after weak openings and test one cleaner route at a time.'
    ],
    default: [
      'Use the first few seconds of each run to read the objective instead of forcing an early move.',
      'Stick to simple, repeatable choices when the pace increases.',
      'Short retries with one adjustment at a time are the fastest way to improve.'
    ]
  };

  const output = [...(copy[type] || copy.default)];
  const lower = controlsSource.toLowerCase();
  if (/wasd/.test(lower)) {
    output[0] = 'Use W / A / S / D to move with purpose and avoid wasting position on unnecessary corrections.';
  } else if (/arrow/.test(lower)) {
    output[0] = 'Use the Arrow Keys with small inputs so your movement stays clean and predictable.';
  } else if (/drag/.test(lower)) {
    output[0] = 'Drag with short, controlled motions so your aim or placement stays precise.';
  } else if (/mouse/.test(lower) && /aim|shoot/.test(lower)) {
    output[0] = 'Keep the mouse centered on the highest-value target area so you can aim and recover faster.';
  } else if (/tap|touch|screen/.test(lower)) {
    output[0] = 'Use short taps or touch movements so each input stays controlled instead of overcorrected.';
  }

  return output.map(cleanSentence);
}

function buildControls(type, controlsSource) {
  const source = controlsSource.toLowerCase();
  const controls = [];

  const add = (input, action) => {
    if (!controls.some((item) => item.input === input)) {
      controls.push({ input, action });
    }
  };

  if (/wasd/.test(source)) add('W / A / S / D', 'move, jump, or steer through each stage');
  if (/arrow/.test(source)) add('Arrow keys', 'move, jump, or guide your character');
  if (/drag/.test(source)) add('Drag', 'aim, place, or move important game elements');
  if (/mouse/.test(source) && /aim|shoot/.test(source)) add('Mouse', 'aim at targets or steer your line');
  if (/click/.test(source)) add('Click', 'confirm actions or fire at the right moment');
  if (/tap|touch|screen/.test(source)) add('Tap / Touch', 'play on mobile and trigger actions');

  if (type === 'driving') {
    add('Mouse / Touch', 'control steering, braking, or parking inputs');
    add('On-screen controls', 'accelerate, brake, and line up each route');
  } else if (type === 'tower-defense') {
    add('Drag and drop', 'place towers or cards on the board');
    add('Click / Tap', 'upgrade defenses during waves');
  } else if (type === 'music') {
    add('Tap / Click', 'hit notes in time with the rhythm');
  } else if (type === 'memory') {
    add('Click / Tap', 'flip cards and match each pair');
  } else if (type === 'coloring') {
    add('Mouse / Touch', 'pick colors and fill different parts of the page');
  } else if (type === 'jigsaw') {
    add('Drag and drop', 'move pieces into their correct positions');
  } else if (type === 'difference') {
    add('Click / Tap', 'mark each hidden difference');
  } else if (type === 'pipe-puzzle') {
    add('Drag / Swipe', 'connect matching paths without crossing lines');
  } else if (type === 'pour-puzzle') {
    add('Click / Tap', 'pour from one bottle or container into another');
  } else if (type === 'clicker') {
    add('Click / Tap', 'collect value and buy upgrades');
  }

  if (!controls.length) {
    add('Mouse / Touch', 'play with the default controls for this title');
  }

  return controls.slice(0, 3);
}

function appendGamesDataEntries(newEntries) {
  const source = fs.readFileSync(GAMES_DATA_PATH, 'utf8');
  const marker = '\n];\n\nwindow.SCHPLAY_GAMES.ready = true;';
  if (!source.includes(marker)) {
    throw new Error('Could not find insertion marker in js/games-data.js');
  }

  const inserted = newEntries
    .map((entry) => `    { name: ${JSON.stringify(entry.name)}, href: ${JSON.stringify(`games/${entry.slug}.html`)}, img: ${JSON.stringify(entry.image)} },`)
    .join('\n');

  return source.replace(marker, `\n${inserted}\n];\n\nwindow.SCHPLAY_GAMES.ready = true;`);
}

const existingList = loadGameList();
const existingSlugs = new Set(existingList
  .map((entry) => /games\/([^./]+)\.html$/i.exec(entry.href || ''))
  .filter(Boolean)
  .map((match) => match[1]));

const manual = JSON.parse(fs.readFileSync(MANUAL_PATH, 'utf8'));
const overrides = JSON.parse(fs.readFileSync(OVERRIDES_PATH, 'utf8'));
const rows = extractGameRows().filter((row) => row.gameId >= startId && row.gameId <= endId);

if (rows.length !== endId - startId + 1) {
  throw new Error(`Expected ${endId - startId + 1} rows but found ${rows.length} for ids ${startId}-${endId}`);
}

const additions = [];
const skipped = [];

for (const row of rows) {
  const slug = row.slug;
  const pagePath = path.join(GAMES_DIR, `${slug}.html`);
  if (
    existingSlugs.has(slug) ||
    Object.prototype.hasOwnProperty.call(manual, slug) ||
    Object.prototype.hasOwnProperty.call(overrides, slug) ||
    fs.existsSync(pagePath)
  ) {
    skipped.push(slug);
    continue;
  }

  const name = normalizeName(row.name, slug);
  const classification = classifyGame(row, name);
  const heroParagraph = buildHero(name, classification.type);
  const instructions = buildInstructionSet(classification.type, classification.controlsSource);
  const metaDescription = buildMetaDescription(name, classification.type);

  manual[slug] = {
    name,
    href: `games/${slug}.html`,
    image: row.image,
    title: `${name} - Play Free Online`,
    metaDescription,
    metaKeywords: `${cleanSentence(name.toLowerCase())}, ${slug}, browser game, online game, schplay, gamemonetize`,
    heroParagraph,
    instructions,
    sections: [],
    plainText: `${name} - Play Free Online\n${heroParagraph}\n${instructions.join(' ')}`,
    iframeSrc: row.file
  };

  overrides[slug] = {
    name,
    genre: classification.genre,
    platforms: classification.platforms,
    learningProfile: classification.profile,
    controls: buildControls(classification.type, classification.controlsSource),
    ...(name.toLowerCase().endsWith(' online') ? { metaTitle: `${name} | Schplay` } : {})
  };

  additions.push({ slug, name, image: row.image });
  existingSlugs.add(slug);
}

if (!additions.length) {
  fs.writeFileSync(OUTPUT_SLUGS_PATH, '');
  console.log(JSON.stringify({ addedCount: 0, skipped }, null, 2));
  process.exit(0);
}

fs.writeFileSync(GAMES_DATA_PATH, appendGamesDataEntries(additions));
fs.writeFileSync(MANUAL_PATH, `${JSON.stringify(manual, null, 2)}\n`);
fs.writeFileSync(OVERRIDES_PATH, `${JSON.stringify(overrides, null, 2)}\n`);
fs.writeFileSync(OUTPUT_SLUGS_PATH, `${additions.map((entry) => entry.slug).join('\n')}\n`);

console.log(JSON.stringify({
  addedCount: additions.length,
  skippedCount: skipped.length,
  firstAdded: additions[0].slug,
  lastAdded: additions[additions.length - 1].slug
}, null, 2));
