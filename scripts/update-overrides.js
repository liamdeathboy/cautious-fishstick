#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

const overridesPath = path.join(__dirname, '..', 'data', 'game-overrides.json');
const overrides = JSON.parse(fs.readFileSync(overridesPath, 'utf8'));

const updates = {
  '2048': {
    release: 'Mar 09, 2014',
    genre: 'Puzzle · Number Merge',
    platforms: 'Browser, Mobile',
    controls: [
      { input: 'Arrow keys', action: 'slide the grid in one direction' },
      { input: 'Swipe', action: 'swipe on touch screens to merge tiles' },
      { input: 'R', action: 'restart with a fresh board' }
    ]
  },
  'idle-breakout': {
    release: 'Jun 22, 2019',
    genre: 'Idle · Brick Breaker',
    platforms: 'Browser',
    controls: [
      { input: 'Mouse', action: 'buy upgrades and trigger power-ups' },
      { input: 'Space', action: 'toggle auto-launch' },
      { input: 'P', action: 'pause or resume the run' }
    ]
  },
  boxingrandom: {
    release: 'Jun 17, 2020',
    genre: 'Sports · Party Fighter',
    platforms: 'Browser, Mobile',
    controls: [
      { input: 'W / Arrow Up', action: 'jump and throw punches' },
      { input: 'E / Arrow Right', action: 'lean forward for a jab' },
      { input: 'Mobile Tap', action: 'tap the on-screen buttons to swing' }
    ]
  },
  basketballstars: {
    release: 'Feb 11, 2016',
    genre: 'Sports · Basketball',
    platforms: 'Browser, Mobile',
    controls: [
      { input: 'Arrow keys', action: 'move, steal, and contest shots' },
      { input: 'Z / X', action: 'shoot or block depending on offense' },
      { input: 'Space', action: 'dash or activate a special' }
    ]
  },
  '10-minutes-till-dawn': {
    release: 'May 24, 2022',
    genre: 'Action · Roguelite Shooter',
    platforms: 'Browser, PC',
    controls: [
      { input: 'W / A / S / D', action: 'dash around incoming hordes' },
      { input: 'Mouse', action: 'aim and fire your weapon' },
      { input: 'R', action: 'reload when the clip runs dry' }
    ]
  },
  '1v1lol': {
    release: 'Dec 05, 2019',
    genre: 'Shooter · Build Arena',
    platforms: 'Browser, Mobile',
    controls: [
      { input: 'W / A / S / D', action: 'move and strafe' },
      { input: 'Mouse', action: 'aim, shoot, and build' },
      { input: 'Shift', action: 'toggle crouch for smaller profile' }
    ]
  },
  LastBreathTrio: {
    release: 'Mar 15, 2021',
    genre: 'Action · Bullet Hell Mod',
    platforms: 'Browser, PC',
    controls: [
      { input: 'Arrow keys', action: 'dodge within the soul box' },
      { input: 'Z / Enter', action: 'select and confirm menu options' },
      { input: 'X / Shift', action: 'cancel or open the item menu' }
    ]
  },
  Rejuvenation: {
    release: 'Oct 09, 2022',
    genre: 'Action · Undertale Fan Game',
    platforms: 'Browser, PC',
    controls: [
      { input: 'Arrow keys', action: 'evade attacks and navigate menus' },
      { input: 'Z', action: 'confirm and attack' },
      { input: 'X', action: 'cancel or open options' }
    ]
  },
  TheFinalExperiment: {
    release: 'Jan 18, 2024',
    genre: 'Action · Undertale Mod',
    platforms: 'Browser, PC',
    controls: [
      { input: 'Arrow keys', action: 'move the soul and dodge' },
      { input: 'Z / Enter', action: 'confirm selections' },
      { input: 'X / Shift', action: 'cancel or flee' }
    ]
  },
  acegangster: {
    release: 'Apr 14, 2008',
    genre: 'Action · Crime Sim',
    platforms: 'Browser',
    controls: [
      { input: 'Mouse', action: 'navigate menus and interact' },
      { input: 'Arrow keys', action: 'drive vehicles through the city' },
      { input: 'Space', action: 'enter buildings or confirm actions' }
    ]
  },
  adventurecapitalist: {
    release: 'Feb 20, 2014',
    genre: 'Idle · Tycoon',
    platforms: 'Browser, Mobile',
    controls: [
      { input: 'Mouse', action: 'collect profits and buy managers' },
      { input: 'Hotkeys 1-9', action: 'bulk purchase upgrades' },
      { input: 'Space', action: 'toggle speed-up boosts when available' }
    ]
  },
  agario: {
    release: 'Apr 28, 2015',
    genre: 'Arcade · Multiplayer Arena',
    platforms: 'Browser, Mobile',
    controls: [
      { input: 'Mouse', action: 'steer your cell across the map' },
      { input: 'Space', action: 'split to lunge at opponents' },
      { input: 'W', action: 'eject mass to feed allies or fire viruses' }
    ]
  },
  angrybirdshalloween: {
    release: 'Oct 21, 2010',
    genre: 'Puzzle · Physics',
    platforms: 'Browser, Mobile',
    controls: [
      { input: 'Mouse / Touch', action: 'drag to set sling angle and power' },
      { input: 'Space', action: 'activate bird abilities mid-flight' },
      { input: 'R', action: 'reset the current level' }
    ]
  },
  antbuster: {
    release: 'Jun 18, 2007',
    genre: 'Tower Defense · Strategy',
    platforms: 'Browser',
    controls: [
      { input: 'Mouse', action: 'place towers and upgrade them' },
      { input: '1-3', action: 'quick-build different turret types' },
      { input: 'Space', action: 'toggle fast-forward' }
    ]
  },
  'arcade-wizard': {
    release: 'May 12, 2023',
    genre: 'Action · Roguelite',
    platforms: 'Browser',
    controls: [
      { input: 'W / A / S / D', action: 'dash between arcade cabinets' },
      { input: 'Mouse', action: 'aim spells and fire orbs' },
      { input: 'Q / E', action: 'swap relics or cast specials' }
    ]
  },
  'bad-icecream-1': {
    release: 'Dec 05, 2010',
    genre: 'Action · Maze Co-op',
    platforms: 'Browser',
    controls: [
      { input: 'Arrow keys', action: 'move player one' },
      { input: 'Space', action: 'shoot or break ice blocks' },
      { input: 'W / A / S / D', action: 'control player two in co-op' }
    ]
  },
  'bad-icecream-2': {
    release: 'Dec 09, 2012',
    genre: 'Action · Maze',
    platforms: 'Browser',
    controls: [
      { input: 'Arrow keys', action: 'guide your ice cream hero' },
      { input: 'Space', action: 'freeze or shatter block tiles' },
      { input: 'W / A / S / D', action: 'co-op movement for player two' }
    ]
  },
  'bad-icecream-3': {
    release: 'Dec 11, 2013',
    genre: 'Action · Arcade Maze',
    platforms: 'Browser',
    controls: [
      { input: 'Arrow keys', action: 'sprint through fruit-filled mazes' },
      { input: 'Space', action: 'create and break ice walls' },
      { input: 'W / A / S / D', action: 'second player cooperative controls' }
    ]
  },
  'bad-time-simulator': {
    release: 'Jun 06, 2016',
    genre: 'Action · Boss Rush',
    platforms: 'Browser, PC',
    controls: [
      { input: 'Arrow keys', action: 'maneuver the heart to dodge attacks' },
      { input: 'Z / Enter', action: 'select fight or item options' },
      { input: 'X / Shift', action: 'cancel or open the menu' }
    ]
  },
  bejeweled2: {
    release: 'Nov 05, 2004',
    genre: 'Puzzle · Match-3',
    platforms: 'Browser, Mobile',
    controls: [
      { input: 'Mouse', action: 'swap adjacent gems to match three' },
      { input: 'Space', action: 'pause and review objectives' },
      { input: 'H', action: 'highlight available moves when stuck' }
    ]
  },
  blockblast: {
    release: 'Sep 12, 2022',
    genre: 'Puzzle · Block Fit',
    platforms: 'Browser, Mobile',
    controls: [
      { input: 'Mouse / Touch', action: 'drag shapes into the grid' },
      { input: 'R', action: 'rotate pieces when variant allows' },
      { input: 'Undo', action: 'use limited undos to adjust placement' }
    ]
  },
  bloonstd5: {
    release: 'Nov 15, 2011',
    genre: 'Tower Defense · Strategy',
    platforms: 'Browser, Mobile',
    controls: [
      { input: 'Mouse', action: 'place monkeys and upgrade defenses' },
      { input: 'Space', action: 'start the next round' },
      { input: 'Number keys', action: 'quick-select favorite towers' }
    ]
  },
  bloxors: {
    release: 'Jan 30, 2007',
    genre: 'Puzzle · Spatial Logic',
    platforms: 'Browser',
    controls: [
      { input: 'Arrow keys', action: 'roll the block around the platform' },
      { input: 'Space', action: 'switch between linked blocks when available' },
      { input: 'R', action: 'restart the current level' }
    ]
  },
  catmario: {
    release: 'Feb 13, 2007',
    genre: 'Platformer · Troll',
    platforms: 'Browser, PC',
    controls: [
      { input: 'Arrow keys', action: 'move and jump through traps' },
      { input: 'Z', action: 'jump higher in some builds' },
      { input: 'R', action: 'retry quickly after unexpected deaths' }
    ]
  },
  clubpenguin: {
    release: 'Oct 24, 2005',
    genre: 'Virtual World · Social',
    platforms: 'Browser',
    controls: [
      { input: 'Mouse', action: 'move your penguin and interact with items' },
      { input: 'Keyboard', action: 'chat and use emotes' },
      { input: 'Arrow keys', action: 'play mini-games like sled racing' }
    ]
  },
  crossyroad: {
    release: 'Nov 20, 2014',
    genre: 'Arcade · Endless Hopper',
    platforms: 'Browser, Mobile',
    controls: [
      { input: 'Arrow keys / WASD', action: 'hop forward and sidestep traffic' },
      { input: 'Space', action: 'pause and swap characters' },
      { input: 'Tap', action: 'jump on mobile screens' }
    ]
  },
  'csgo-clicker': {
    release: 'Aug 22, 2015',
    genre: 'Idle · Case Opener',
    platforms: 'Browser',
    controls: [
      { input: 'Mouse', action: 'open cases and manage your inventory' },
      { input: 'Space', action: 'speed through case animations' },
      { input: 'Ctrl + S', action: 'save local progress' }
    ]
  },
  cupcake2048: {
    release: 'Apr 01, 2014',
    genre: 'Puzzle · Number Merge',
    platforms: 'Browser',
    controls: [
      { input: 'Arrow keys', action: 'slide tile stacks to merge cupcakes' },
      { input: 'Swipe', action: 'play on touch screens with smooth swipes' },
      { input: 'U', action: 'undo the previous move in supported builds' }
    ]
  },
  curveball: {
    release: 'Aug 19, 2006',
    genre: 'Arcade · 3D Pong',
    platforms: 'Browser',
    controls: [
      { input: 'Mouse', action: 'move the paddle and apply spin' },
      { input: 'Click', action: 'serve the ball when ready' },
      { input: 'Space', action: 'pause between rounds' }
    ]
  },
  'cut-the-rope': {
    release: 'Oct 04, 2010',
    genre: 'Puzzle · Physics',
    platforms: 'Browser, Mobile',
    controls: [
      { input: 'Mouse / Touch', action: 'swipe to cut ropes precisely' },
      { input: 'R', action: 'restart puzzle instantly' },
      { input: 'Space', action: 'pause and review candy path' }
    ]
  },
  dbz: {
    release: 'Nov 05, 2007',
    genre: 'Action · Fighting',
    platforms: 'Browser',
    controls: [
      { input: 'Arrow keys', action: 'move and dash' },
      { input: 'Z / X / C', action: 'perform attacks and ki blasts' },
      { input: 'Space', action: 'charge energy or transform' }
    ]
  },
  'deep-freeze': {
    release: 'Dec 12, 2006',
    genre: 'Action · Platform Shooter',
    platforms: 'Browser',
    controls: [
      { input: 'Arrow keys', action: 'move and climb' },
      { input: 'Space', action: 'fire your freeze ray' },
      { input: 'Ctrl', action: 'drop collected power-ups' }
    ]
  },
  doodlejump: {
    release: 'Apr 06, 2009',
    genre: 'Arcade · Vertical Jumper',
    platforms: 'Browser, Mobile',
    controls: [
      { input: 'Arrow keys / Tilt', action: 'steer the doodle between platforms' },
      { input: 'Space', action: 'fire at monsters' },
      { input: 'Tap', action: 'shoot on touch screens' }
    ]
  },
  'draw-the-hill': {
    release: 'Jul 18, 2021',
    genre: 'Puzzle · Line Rider',
    platforms: 'Browser, Mobile',
    controls: [
      { input: 'Mouse / Touch', action: 'draw slopes for the sled' },
      { input: 'R', action: 'reset the run instantly' },
      { input: 'Space', action: 'start the vehicle down your track' }
    ]
  },
  drifthunters: {
    release: 'Sep 22, 2017',
    genre: 'Racing · Drifting',
    platforms: 'Browser',
    controls: [
      { input: 'Arrow keys / WASD', action: 'steer, accelerate, and brake' },
      { input: 'Space', action: 'engage the handbrake for big drifts' },
      { input: 'Shift', action: 'shift gears in manual mode' }
    ]
  },
  drivemad: {
    release: 'Nov 03, 2022',
    genre: 'Driving · Physics',
    platforms: 'Browser, Mobile',
    controls: [
      { input: 'W / Up Arrow', action: 'accelerate the monster truck' },
      { input: 'S / Down Arrow', action: 'reverse or brake before obstacles' },
      { input: 'Space', action: 'reset the level when you flip' }
    ]
  },
  'duck-life-3': {
    release: 'Apr 19, 2011',
    genre: 'Simulation · Racing',
    platforms: 'Browser',
    controls: [
      { input: 'Arrow keys', action: 'train running, flying, and swimming' },
      { input: 'Mouse', action: 'manage upgrades between events' },
      { input: 'Space', action: 'jump hurdles during races' }
    ]
  },
  'duck-life-5': {
    release: 'Sep 18, 2014',
    genre: 'Endless Runner · Adventure',
    platforms: 'Browser',
    controls: [
      { input: 'Arrow keys', action: 'glide and dodge obstacles' },
      { input: 'Mouse', action: 'upgrade gear and pets' },
      { input: 'Space', action: 'use power-ups mid-flight' }
    ]
  },
  duckhunt: {
    release: 'Oct 18, 1984',
    genre: 'Arcade · Light Gun',
    platforms: 'Browser, Arcade',
    controls: [
      { input: 'Mouse', action: 'aim and shoot ducks' },
      { input: 'R', action: 'reload after each round' },
      { input: 'Space', action: 'start the next wave' }
    ]
  },
  ducklife1: {
    release: 'Apr 29, 2009',
    genre: 'Simulation · Racing',
    platforms: 'Browser',
    controls: [
      { input: 'Arrow keys', action: 'train each discipline' },
      { input: 'Mouse', action: 'feed your duck and buy seeds' },
      { input: 'Space', action: 'jump during competitions' }
    ]
  },
  ducklife2: {
    release: 'Jun 15, 2010',
    genre: 'Simulation · Racing',
    platforms: 'Browser',
    controls: [
      { input: 'Arrow keys', action: 'steer in training mini-games' },
      { input: 'Mouse', action: 'upgrade hats and skills' },
      { input: 'Space', action: 'leap over hazards' }
    ]
  },
  dunebuggy: {
    release: 'Mar 12, 2007',
    genre: 'Racing · Stunt',
    platforms: 'Browser',
    controls: [
      { input: 'Arrow keys', action: 'drive and balance the buggy' },
      { input: 'Space', action: 'jump over obstacles' },
      { input: 'Shift', action: 'boost for short bursts' }
    ]
  },
  'electric-man-2': {
    release: 'Aug 10, 2007',
    genre: 'Action · Stick Fighting',
    platforms: 'Browser',
    controls: [
      { input: 'W / A / S / D', action: 'move fluidly around arenas' },
      { input: 'Q / W / E', action: 'unleash slow-motion attacks' },
      { input: 'Arrow keys', action: 'perform standard punches and kicks' }
    ]
  },
  'fireboy-and-watergirl-firetemple': {
    release: 'Mar 15, 2013',
    genre: 'Puzzle · Co-op Platformer',
    platforms: 'Browser',
    controls: [
      { input: 'Arrow keys', action: 'move Fireboy' },
      { input: 'W / A / S / D', action: 'guide Watergirl' },
      { input: 'Space', action: 'trigger levers or reset levels' }
    ]
  },
  'flappy-2048': {
    release: 'Mar 20, 2014',
    genre: 'Arcade · Mashup',
    platforms: 'Browser',
    controls: [
      { input: 'Space / Click', action: 'flap and thread through gaps' },
      { input: 'M', action: 'mute background audio' },
      { input: 'P', action: 'pause a hectic run' }
    ]
  },
  'flappy-bird': {
    release: 'May 24, 2013',
    genre: 'Arcade · Endless Flyer',
    platforms: 'Browser, Mobile',
    controls: [
      { input: 'Space / Click', action: 'flap to stay aloft' },
      { input: 'Tap', action: 'keep airborne on touch devices' },
      { input: 'P', action: 'pause mid-flight' }
    ]
  },
  fnaf: {
    release: 'Aug 08, 2014',
    genre: 'Horror · Survival',
    platforms: 'Browser, PC',
    controls: [
      { input: 'Mouse', action: 'check cameras and close doors' },
      { input: 'Space', action: 'toggle the flashlight in hallways' },
      { input: 'Ctrl', action: 'mute the call quickly' }
    ]
  },
  'friday-night-funkin': {
    release: 'Nov 01, 2020',
    genre: 'Rhythm · Battle',
    platforms: 'Browser, PC',
    controls: [
      { input: 'Arrow keys', action: 'hit notes on beat' },
      { input: 'W / A / S / D', action: 'alternate controls for lefty players' },
      { input: 'Enter', action: 'pause and swap songs' }
    ]
  },
  galaga: {
    release: 'Sep 24, 1981',
    genre: 'Arcade · Shooter',
    platforms: 'Browser, Arcade',
    controls: [
      { input: 'Arrow keys', action: 'move the fighter horizontally' },
      { input: 'Space', action: 'fire lasers at incoming enemies' },
      { input: 'P', action: 'pause between stages' }
    ]
  },
  geodash: {
    release: 'Aug 13, 2013',
    genre: 'Platformer · Rhythm',
    platforms: 'Browser, Mobile',
    controls: [
      { input: 'Space / Up Arrow', action: 'jump to avoid spikes' },
      { input: 'Hold', action: 'fly ships smoothly through portals' },
      { input: 'Z / X', action: 'set practice checkpoints' }
    ]
  },
  'getaway-shootout': {
    release: 'Aug 27, 2018',
    genre: 'Action · Party Platformer',
    platforms: 'Browser',
    controls: [
      { input: 'W / E', action: 'hop left or right for player one' },
      { input: 'U / O', action: 'hop for player two' },
      { input: 'R / I', action: 'use weapons when collected' }
    ]
  },
  googlesnake: {
    release: 'Sep 01, 2013',
    genre: 'Arcade · Classic',
    platforms: 'Browser, Mobile',
    controls: [
      { input: 'Arrow keys', action: 'guide the snake' },
      { input: 'W / A / S / D', action: 'optional movement keys' },
      { input: 'Space', action: 'pause to change themes' }
    ]
  },
  gravityguy: {
    release: 'Nov 10, 2010',
    genre: 'Runner · Gravity Flip',
    platforms: 'Browser, Mobile',
    controls: [
      { input: 'Space', action: 'flip gravity instantly' },
      { input: 'Click', action: 'tap to flip on mobile' },
      { input: 'P', action: 'pause during tight chases' }
    ]
  },
  gunmayhem: {
    release: 'Nov 11, 2011',
    genre: 'Action · Arena Brawler',
    platforms: 'Browser',
    controls: [
      { input: 'Arrow keys', action: 'move player one' },
      { input: 'Z / X', action: 'shoot or throw bombs' },
      { input: 'W / A / S / D', action: 'control player two in matches' }
    ]
  },
  gunspin: {
    release: 'May 05, 2020',
    genre: 'Arcade · Physics Shooter',
    platforms: 'Browser, Mobile',
    controls: [
      { input: 'Mouse / Tap', action: 'fire to keep momentum' },
      { input: 'R', action: 'retry quickly after a fall' },
      { input: 'Space', action: 'toggle slow motion when unlocked' }
    ]
  },
  gyroball: {
    release: 'Jul 14, 2006',
    genre: 'Puzzle · Balance',
    platforms: 'Browser',
    controls: [
      { input: 'Arrow keys', action: 'tilt the board to roll the ball' },
      { input: 'Space', action: 'reset when you fall off' },
      { input: 'P', action: 'pause to check the course' }
    ]
  },
  'happy-wheels': {
    release: 'Jun 24, 2010',
    genre: 'Action · Physics',
    platforms: 'Browser',
    controls: [
      { input: 'Arrow keys', action: 'accelerate and balance' },
      { input: 'Space', action: 'primary action for each character' },
      { input: 'Shift / Ctrl', action: 'trigger secondary abilities' }
    ]
  },
  'henry-stickman': {
    release: 'Jan 15, 2009',
    genre: 'Adventure · Interactive Story',
    platforms: 'Browser',
    controls: [
      { input: 'Mouse', action: 'choose branching story options' },
      { input: 'Space', action: 'skip cutscenes after completion' },
      { input: 'R', action: 'retry a decision quickly' }
    ]
  },
  hideandsmash: {
    release: 'Apr 02, 2023',
    genre: 'Action · Party Brawler',
    platforms: 'Browser',
    controls: [
      { input: 'W / A / S / D', action: 'sprint around the map' },
      { input: 'Mouse', action: 'aim and throw props' },
      { input: 'Space', action: 'activate disguises or perks' }
    ]
  },
  holeio: {
    release: 'Jun 24, 2018',
    genre: 'Arcade · Battle Royale',
    platforms: 'Browser, Mobile',
    controls: [
      { input: 'Mouse / Touch', action: 'drag the hole around the city' },
      { input: 'Space', action: 'recenter on your hole instantly' },
      { input: 'Tab', action: 'check leaderboard standings' }
    ]
  },
  houseofhazards: {
    release: 'Sep 18, 2020',
    genre: 'Party · Trap Runner',
    platforms: 'Browser',
    controls: [
      { input: 'W / A / S / D', action: 'move player characters' },
      { input: 'Space', action: 'interact with traps or furniture' },
      { input: 'Arrow keys', action: 'control trap triggers when spectating' }
    ]
  },
  'idle-shark': {
    release: 'Jul 07, 2022',
    genre: 'Idle · Tycoon',
    platforms: 'Browser',
    controls: [
      { input: 'Mouse', action: 'collect coins and upgrade habitats' },
      { input: 'Hotkeys 1-5', action: 'buy upgrades in bulk' },
      { input: 'Space', action: 'toggle auto-collectors' }
    ]
  },
  'jetpack-joyride': {
    release: 'Sep 01, 2011',
    genre: 'Arcade · Endless Runner',
    platforms: 'Browser, Mobile',
    controls: [
      { input: 'Mouse / Tap', action: 'hold to rise, release to fall' },
      { input: 'Space', action: 'activate gadgets on desktop versions' },
      { input: 'Arrow keys', action: 'steer certain vehicles' }
    ]
  },
  learntofly: {
    release: 'May 16, 2009',
    genre: 'Arcade · Launch',
    platforms: 'Browser',
    controls: [
      { input: 'Arrow keys', action: 'tilt and control pitch' },
      { input: 'Space', action: 'use boosts mid-flight' },
      { input: 'Mouse', action: 'handle menus and upgrades' }
    ]
  },
  learntofly2: {
    release: 'Jun 16, 2011',
    genre: 'Arcade · Launch Sequel',
    platforms: 'Browser',
    controls: [
      { input: 'Left / Right', action: 'steer the penguin in the air' },
      { input: 'Space', action: 'activate sled boosts' },
      { input: '1-3', action: 'trigger gadgets' }
    ]
  },
  learntofly3: {
    release: 'Feb 19, 2016',
    genre: 'Arcade · Rocket Builder',
    platforms: 'Browser',
    controls: [
      { input: 'Arrow keys', action: 'stabilize in zero-g' },
      { input: 'Space', action: 'fire stage boosters' },
      { input: 'Shift', action: 'deploy special modules' }
    ]
  },
  marippy: {
    release: 'Jan 12, 2015',
    genre: 'Arcade · Crossover',
    platforms: 'Browser',
    controls: [
      { input: 'Space / Click', action: 'flap between pipes' },
      { input: 'R', action: 'restart quickly after collisions' },
      { input: 'P', action: 'pause to catch your breath' }
    ]
  },
  minecraft: {
    release: 'May 10, 2021',
    genre: 'Sandbox · Survival',
    platforms: 'Browser, PC',
    controls: [
      { input: 'W / A / S / D', action: 'move across the world' },
      { input: 'Mouse', action: 'look, mine, and place blocks' },
      { input: 'E', action: 'open inventory and craft' }
    ]
  },
  'minecraft-tower-defence': {
    release: 'Oct 03, 2011',
    genre: 'Tower Defense · Strategy',
    platforms: 'Browser',
    controls: [
      { input: 'Mouse', action: 'dig paths and place turrets' },
      { input: 'Space', action: 'start the next monster wave' },
      { input: '1-5', action: 'select tower types quickly' }
    ]
  },
  'minecraft-tower-defence-2': {
    release: 'Dec 15, 2012',
    genre: 'Tower Defense · Sandbox',
    platforms: 'Browser',
    controls: [
      { input: 'Mouse', action: 'build walls and defenses' },
      { input: 'Space', action: 'call waves early for bonus gold' },
      { input: 'Tab', action: 'switch between day and night upgrades' }
    ]
  },
  minesweeper: {
    release: 'Nov 08, 1990',
    genre: 'Puzzle · Logic',
    platforms: 'Browser, PC',
    controls: [
      { input: 'Mouse', action: 'reveal tiles or place flags' },
      { input: 'Space', action: 'chord-click to clear safe squares' },
      { input: 'F2', action: 'start a new board instantly' }
    ]
  },
  'monkey-mart': {
    release: 'Nov 11, 2022',
    genre: 'Management · Idle',
    platforms: 'Browser, Mobile',
    controls: [
      { input: 'Mouse / Touch', action: 'stock shelves and serve bananas' },
      { input: 'Arrow keys', action: 'guide workers precisely on desktop' },
      { input: 'Space', action: 'speed up time during rush hour' }
    ]
  },
  motherload: {
    release: 'Nov 04, 2004',
    genre: 'Adventure · Mining',
    platforms: 'Browser',
    controls: [
      { input: 'Arrow keys', action: 'drill and navigate tunnels' },
      { input: 'Space', action: 'use tools or bombs' },
      { input: 'Ctrl', action: 'open the upgrade bay at the surface' }
    ]
  },
  motox3m: {
    release: 'May 04, 2015',
    genre: 'Racing · Stunt',
    platforms: 'Browser, Mobile',
    controls: [
      { input: 'Arrow keys', action: 'lean and accelerate' },
      { input: 'Space', action: 'brake or reset quickly' },
      { input: 'Shift', action: 'perform flips in-air' }
    ]
  },
  mrmine: {
    release: 'Oct 30, 2020',
    genre: 'Idle · Mining',
    platforms: 'Browser, PC',
    controls: [
      { input: 'Mouse', action: 'assign workers and collect resources' },
      { input: 'Hotkeys 1-6', action: 'buy drill upgrades quickly' },
      { input: 'Space', action: 'toggle auto-battle for monsters' }
    ]
  },
  ngon: {
    release: 'Jul 15, 2020',
    genre: 'Shooter · Sandbox',
    platforms: 'Browser, PC',
    controls: [
      { input: 'W / A / S / D', action: 'move around the arena' },
      { input: 'Mouse', action: 'aim and fire custom weapons' },
      { input: 'Q / E', action: 'switch weapon parts on the fly' }
    ]
  },
  oiligarchy: {
    release: 'May 15, 2008',
    genre: 'Strategy · Simulation',
    platforms: 'Browser',
    controls: [
      { input: 'Mouse', action: 'drill wells and set policies' },
      { input: 'Space', action: 'advance to the next decade' },
      { input: 'Tab', action: 'review market data' }
    ]
  },
  ovo: {
    release: 'Feb 18, 2021',
    genre: 'Platformer · Parkour',
    platforms: 'Browser, Mobile',
    controls: [
      { input: 'Arrow keys', action: 'run and wall-jump' },
      { input: 'Space', action: 'perform slam moves' },
      { input: 'C', action: 'dash through obstacles' }
    ]
  },
  pacman: {
    release: 'May 22, 1980',
    genre: 'Arcade · Maze Chase',
    platforms: 'Browser, Arcade',
    controls: [
      { input: 'Arrow keys', action: 'navigate the maze' },
      { input: 'P', action: 'pause between rounds' },
      { input: 'M', action: 'toggle retro sound effects' }
    ]
  },
  pacxon: {
    release: 'Dec 17, 2007',
    genre: 'Arcade · Territory Capture',
    platforms: 'Browser',
    controls: [
      { input: 'Arrow keys', action: 'fill in the board with walls' },
      { input: 'Space', action: 'pause and plan your route' },
      { input: 'P', action: 'mute or resume music' }
    ]
  },
  pandemic2: {
    release: 'Jul 17, 2008',
    genre: 'Strategy · Simulation',
    platforms: 'Browser',
    controls: [
      { input: 'Mouse', action: 'mutate your pathogen and manage regions' },
      { input: 'Space', action: 'toggle fast-forward' },
      { input: 'Tab', action: 'cycle through world stats' }
    ]
  },
  'papas-games': {
    release: 'Aug 07, 2007',
    genre: 'Simulation · Cooking',
    platforms: 'Browser',
    controls: [
      { input: 'Mouse', action: 'prepare orders and multi-task stations' },
      { input: 'Space', action: 'flip or serve certain items' },
      { input: 'Number keys', action: 'swap quickly between stations' }
    ]
  },
  paperio2: {
    release: 'Sep 12, 2018',
    genre: 'Arcade · Territory',
    platforms: 'Browser, Mobile',
    controls: [
      { input: 'Arrow keys / WASD', action: 'draw loops to claim land' },
      { input: 'Mouse', action: 'steer by dragging on desktop' },
      { input: 'Space', action: 'pause to review rankings' }
    ]
  },
  pixelgun: {
    release: 'May 02, 2013',
    genre: 'Shooter · Sandbox',
    platforms: 'Browser, Mobile',
    controls: [
      { input: 'W / A / S / D', action: 'move through arenas' },
      { input: 'Mouse', action: 'aim and fire weapons' },
      { input: 'Number keys', action: 'swap equipped gear' }
    ]
  },
  pool: {
    release: 'Jan 10, 2008',
    genre: 'Sports · Billiards',
    platforms: 'Browser',
    controls: [
      { input: 'Mouse', action: 'aim the cue and set power' },
      { input: 'Space', action: 'take the shot' },
      { input: 'Q / E', action: 'add spin to the cue ball' }
    ]
  },
  'pregnancy-test': {
    release: 'Mar 08, 2021',
    genre: 'Novelty · Simulation',
    platforms: 'Browser, Mobile',
    controls: [
      { input: 'Mouse / Touch', action: 'swipe through prompts' },
      { input: 'Space', action: 'toggle randomizer speed' },
      { input: 'Enter', action: 'lock in a result' }
    ]
  },
  pvz: {
    release: 'May 05, 2009',
    genre: 'Strategy · Tower Defense',
    platforms: 'Browser, PC',
    controls: [
      { input: 'Mouse', action: 'plant defenses and collect sun' },
      { input: 'Space', action: 'collect sun quickly in some modes' },
      { input: 'Shovel hotkey', action: 'dig up plants instantly' }
    ]
  },
  'rb-college': {
    release: 'Aug 21, 2023',
    genre: 'Sports · Football Sim',
    platforms: 'Browser, Mobile',
    controls: [
      { input: 'Mouse', action: 'call plays and manage the roster' },
      { input: 'Arrow keys', action: 'aim passes on desktop' },
      { input: 'Space', action: 'snap the ball or dive' }
    ]
  },
  retrobowl: {
    release: 'Jan 17, 2020',
    genre: 'Sports · Football Sim',
    platforms: 'Browser, Mobile',
    controls: [
      { input: 'Mouse / Touch', action: 'throw passes and choose plays' },
      { input: 'Arrow keys', action: 'move ball carriers' },
      { input: 'Space', action: 'slow time during clutch moments' }
    ]
  },
  'riddleschool-all-games': {
    release: 'Mar 01, 2016',
    genre: 'Adventure · Point & Click',
    platforms: 'Browser',
    controls: [
      { input: 'Mouse', action: 'collect items and solve puzzles' },
      { input: 'Space', action: 'skip dialogue after completion' },
      { input: 'I', action: 'open inventory quickly' }
    ]
  },
  rooftopsnipers: {
    release: 'Jan 17, 2017',
    genre: 'Action · Duel',
    platforms: 'Browser',
    controls: [
      { input: 'W / E', action: 'jump and shoot for player one' },
      { input: 'I / O', action: 'jump and shoot for player two' },
      { input: 'R', action: 'restart the round instantly' }
    ]
  },
  run2: {
    release: 'Dec 12, 2011',
    genre: 'Runner · Platform',
    platforms: 'Browser',
    controls: [
      { input: 'Arrow keys', action: 'run and jump between walls' },
      { input: 'Space', action: 'pause and swap characters' },
      { input: 'Shift', action: 'toggle slow motion practice' }
    ]
  },
  run3: {
    release: 'Jun 05, 2014',
    genre: 'Runner · Sci-Fi',
    platforms: 'Browser',
    controls: [
      { input: 'Arrow keys', action: 'guide the runner through tunnels' },
      { input: 'Space', action: 'select alternate characters' },
      { input: 'Shift', action: 'toggle speed boost' }
    ]
  },
  shuffle: {
    release: 'May 11, 2007',
    genre: 'Arcade · Physics',
    platforms: 'Browser',
    controls: [
      { input: 'Mouse', action: 'flick pucks across the table' },
      { input: 'Space', action: 'change aim angle precisely' },
      { input: 'P', action: 'pause to analyze opponent moves' }
    ]
  },
  slitherio: {
    release: 'Mar 30, 2016',
    genre: 'Arcade · Multiplayer Snake',
    platforms: 'Browser, Mobile',
    controls: [
      { input: 'Mouse', action: 'steer your snake smoothly' },
      { input: 'Space', action: 'speed boost at the cost of length' },
      { input: 'Tap', action: 'boost on touch devices' }
    ]
  },
  snailiad: {
    release: 'Jul 18, 2011',
    genre: 'Metroidvania · Adventure',
    platforms: 'Browser',
    controls: [
      { input: 'Arrow keys', action: 'crawl and aim your shell cannon' },
      { input: 'Z / X', action: 'fire and jump' },
      { input: 'A / S', action: 'toggle abilities like shell shield' }
    ]
  },
  snake: {
    release: 'Dec 01, 1997',
    genre: 'Arcade · Classic',
    platforms: 'Browser, Mobile',
    controls: [
      { input: 'Arrow keys', action: 'change direction instantly' },
      { input: 'Space', action: 'pause the game' },
      { input: 'M', action: 'toggle sound' }
    ]
  },
  snowline: {
    release: 'Dec 18, 2006',
    genre: 'Puzzle · Drawing',
    platforms: 'Browser',
    controls: [
      { input: 'Mouse', action: 'draw slopes for Santa' },
      { input: 'Space', action: 'start the sleigh ride' },
      { input: 'R', action: 'clear the path to redraw' }
    ]
  },
  'soccer-random': {
    release: 'Aug 25, 2020',
    genre: 'Sports · Physics',
    platforms: 'Browser',
    controls: [
      { input: 'W', action: 'jump and kick for player one' },
      { input: 'Up Arrow', action: 'jump and kick for player two' },
      { input: 'Space', action: 'randomize stadium modifiers' }
    ]
  },
  'sort-the-court': {
    release: 'Nov 22, 2016',
    genre: 'Simulation · Decision',
    platforms: 'Browser, PC',
    controls: [
      { input: 'Y / N keys', action: 'approve or deny citizens' },
      { input: 'Space', action: 'advance dialog quickly' },
      { input: 'Arrow keys', action: 'browse the royal ledger' }
    ]
  },
  spelunky: {
    release: 'Dec 21, 2008',
    genre: 'Roguelike · Platformer',
    platforms: 'Browser, PC',
    controls: [
      { input: 'Arrow keys', action: 'run and climb' },
      { input: 'Z / X / C', action: 'jump, whip, and use items' },
      { input: 'Space', action: 'throw ropes or bombs' }
    ]
  },
  'spending-elonmusk-money': {
    release: 'Jun 25, 2020',
    genre: 'Simulation · Clicker',
    platforms: 'Browser',
    controls: [
      { input: 'Mouse', action: 'buy outrageous items quickly' },
      { input: 'Space', action: 'auto-purchase toggles' },
      { input: 'Backspace', action: 'undo the last big spend' }
    ]
  },
  stacktris: {
    release: 'Oct 14, 2019',
    genre: 'Arcade · Stacking',
    platforms: 'Browser, Mobile',
    controls: [
      { input: 'Mouse / Tap', action: 'drop blocks at the right timing' },
      { input: 'Space', action: 'slow down for precision drops' },
      { input: 'R', action: 'restart after tower collapses' }
    ]
  },
  stealthiselection: {
    release: 'Oct 20, 2020',
    genre: 'Simulation · Parody',
    platforms: 'Browser',
    controls: [
      { input: 'Mouse', action: 'drag resources to states' },
      { input: 'Space', action: 'pause and plan strategy' },
      { input: 'Enter', action: 'end the current turn' }
    ]
  },
  stickmangolf: {
    release: 'Sep 30, 2010',
    genre: 'Sports · Golf',
    platforms: 'Browser, Mobile',
    controls: [
      { input: 'Arrow keys', action: 'aim and adjust power' },
      { input: 'Space', action: 'swing when the meter peaks' },
      { input: 'Shift', action: 'apply spin for trick shots' }
    ]
  },
  subwaysurfer: {
    release: 'May 24, 2012',
    genre: 'Arcade · Endless Runner',
    platforms: 'Browser, Mobile',
    controls: [
      { input: 'Arrow keys', action: 'dash between lanes and roll' },
      { input: 'Space', action: 'activate hoverboards' },
      { input: 'Swipe', action: 'perform moves on touch devices' }
    ]
  },
  'super-sonic': {
    release: 'Aug 03, 2008',
    genre: 'Action · Platformer',
    platforms: 'Browser',
    controls: [
      { input: 'Arrow keys', action: 'run and jump through loops' },
      { input: 'Space', action: 'spin dash to break barriers' },
      { input: 'Shift', action: 'activate super form when available' }
    ]
  },
  supermario63: {
    release: 'Jun 10, 2009',
    genre: 'Platformer · Fan Game',
    platforms: 'Browser',
    controls: [
      { input: 'Arrow keys', action: 'move Mario' },
      { input: 'Z / X / C', action: 'jump, spin, and use FLUDD' },
      { input: 'Space', action: 'talk to Toads and interact' }
    ]
  },
  'swords-and-sandals-2': {
    release: 'Mar 12, 2008',
    genre: 'RPG · Gladiator',
    platforms: 'Browser',
    controls: [
      { input: 'Mouse', action: 'select attacks and skill upgrades' },
      { input: 'Space', action: 'confirm battle actions' },
      { input: 'Tab', action: 'review armor and stats' }
    ]
  },
  tanktrouble: {
    release: 'Apr 14, 2009',
    genre: 'Action · Tank Duel',
    platforms: 'Browser',
    controls: [
      { input: 'Arrow keys', action: 'drive and aim (player 1)' },
      { input: 'Q / W / E', action: 'control tank for player 2' },
      { input: 'I / J / K', action: 'controls for player 3 in local matches' }
    ]
  },
  templerun2: {
    release: 'Jan 17, 2013',
    genre: 'Arcade · Endless Runner',
    platforms: 'Browser, Mobile',
    controls: [
      { input: 'Arrow keys', action: 'turn corners and slide under hazards' },
      { input: 'Space', action: 'use power-ups' },
      { input: 'Tilt / A / D', action: 'lean to collect coins' }
    ]
  },
  tetris: {
    release: 'Jun 06, 1984',
    genre: 'Puzzle · Falling Blocks',
    platforms: 'Browser, Console',
    controls: [
      { input: 'Arrow keys', action: 'move tetrominoes and soft drop' },
      { input: 'Up Arrow', action: 'rotate pieces clockwise' },
      { input: 'Space', action: 'hard drop for instant placement' }
    ]
  },
  'the-big-adventure-of-owatas-life': {
    release: 'May 29, 2008',
    genre: 'Platformer · Comedy',
    platforms: 'Browser',
    controls: [
      { input: 'Arrow keys', action: 'move Owata through hazards' },
      { input: 'Space', action: 'jump over troll traps' },
      { input: 'S', action: 'use special items when found' }
    ]
  },
  'the-binding-of-isaac': {
    release: 'Sep 28, 2011',
    genre: 'Roguelike · Shooter',
    platforms: 'Browser, PC',
    controls: [
      { input: 'W / A / S / D', action: 'move Isaac through rooms' },
      { input: 'Arrow keys', action: 'fire tears in four directions' },
      { input: 'Space', action: 'activate items' }
    ]
  },
  towerblaster: {
    release: 'Aug 04, 2003',
    genre: 'Puzzle · Tower Building',
    platforms: 'Browser',
    controls: [
      { input: 'Mouse', action: 'swap blocks with the tower' },
      { input: 'Space', action: 'discard unwanted bricks' },
      { input: 'H', action: 'toggle hints' }
    ]
  },
  towermaster: {
    release: 'Feb 11, 2018',
    genre: 'Puzzle · Stack',
    platforms: 'Browser, Mobile',
    controls: [
      { input: 'Mouse / Tap', action: 'stack platforms at the right moment' },
      { input: 'Space', action: 'slow down block speed' },
      { input: 'R', action: 'retry instantly after falls' }
    ]
  },
  'undertale(demo)': {
    release: 'Oct 31, 2013',
    genre: 'RPG · Bullet Hell',
    platforms: 'Browser, PC',
    controls: [
      { input: 'Arrow keys', action: 'move the soul in battle and explore' },
      { input: 'Z / Enter', action: 'confirm and attack' },
      { input: 'X / Shift', action: 'cancel or open the menu' }
    ]
  },
  vex: {
    release: 'Sep 15, 2013',
    genre: 'Platformer · Precision',
    platforms: 'Browser, Mobile',
    controls: [
      { input: 'Arrow keys / WASD', action: 'run, jump, and slide' },
      { input: 'Space', action: 'restart at the last checkpoint' },
      { input: 'M', action: 'mute the soundtrack' }
    ]
  },
  worldshardestgame: {
    release: 'Mar 10, 2008',
    genre: 'Puzzle · Precision',
    platforms: 'Browser',
    controls: [
      { input: 'Arrow keys', action: 'navigate through deadly mazes' },
      { input: 'Space', action: 'pause and plan your path' },
      { input: 'R', action: 'restart to chase faster times' }
    ]
  },
  worldshardestgame2: {
    release: 'Oct 09, 2008',
    genre: 'Puzzle · Precision',
    platforms: 'Browser',
    controls: [
      { input: 'Arrow keys', action: 'guide the red square' },
      { input: 'Space', action: 'pause mid-level' },
      { input: 'R', action: 'retry from checkpoint' }
    ]
  }
};

Object.entries(updates).forEach(([slug, patch]) => {
  if (!overrides[slug]) {
    overrides[slug] = {};
  }
Object.assign(overrides[slug], patch);
});

const overwritten = Object.keys(updates).length;

fs.writeFileSync(overridesPath, JSON.stringify(overrides, null, 2));
console.log(`Applied overrides for ${overwritten} games.`);
