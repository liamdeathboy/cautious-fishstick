/**
 * Optimized Main JavaScript for Schplay
 * Handles game management, search, time tracking, and UI interactions
 */

// Game data structure
const gameData = {
  games: [
    { name: "Deep Freeze", image: "images/deepfreeze.webp", url: "../games/deep-freeze.html" },
    { name: "Doodle Jump", image: "images/doodlejump.webp", url: "../games/doodlejump.html" },
    { name: "Duck Life 3", image: "images/ducklife3.webp", url: "../games/duck-life-3.html" },
    { name: "Duck Life 5", image: "images/ducklife5.webp", url: "../games/duck-life-5.html" },
    { name: "Duck Hunt", image: "images/duckhunt.webp", url: "../games/duckhunt.html" },
    { name: "Duck Life 2", image: "images/ducklife2.webp", url: "../games/ducklife2.html" },
    { name: "Dune Buggy", image: "images/dunebuggy.webp", url: "../games/dunebuggy.html" },
    { name: "Electric Man 2", image: "images/electricman2.webp", url: "../games/electric-man-2.html" },
    { name: "Fireboy and Watergirl Fire Temple", image: "images/fireboywatergirlfiretemple.webp", url: "../games/fireboy-and-watergirl-firetemple.html" },
    { name: "Flappy 2048", image: "images/flappy2048.webp", url: "../games/flappy-2048.html" },
    { name: "Flappy Bird", image: "images/flappybird.webp", url: "../games/flappybird.html" },
    { name: "Bad Time Simulator", image: "images/badtimesimulator.webp", url: "../games/bad-time-simulator.html" },
    { name: "Bejeweled 2", image: "images/bejeweled2.webp", url: "../games/bejeweled2.html" },
    { name: "Bloxors", image: "images/bloxors.webp", url: "../games/bloxors.html" },
    { name: "Cat Mario", image: "images/catmario.webp", url: "../games/catmario.html" },
    { name: "Club Penguin", image: "images/clubpenguin.webp", url: "../games/clubpenguin.html" },
    { name: "Curveball", image: "images/curveball.webp", url: "../games/curveball.html" },
    { name: "Adastra", image: "images/adastra.webp", url: "../games/adastra.html" },
    { name: "Antbuster", image: "images/antbuster.webp", url: "../games/antbuster.html" },
    { name: "Arcade Wizard", image: "images/arcadewizard.webp", url: "../games/arcadewizard.html" },
    { name: "Bad Ice Cream 1", image: "images/badicecream1.webp", url: "../games/bad-icecream-1.html" },
    { name: "Bad Ice Cream 2", image: "images/badicecream2.webp", url: "../games/bad-icecream-2.html" },
    { name: "Bad Ice Cream 3", image: "images/badicecream3.webp", url: "../games/bad-icecream-3.html" },
    { name: "Agar.io", image: "images/agario.webp", url: "../games/agario.html" },
    { name: "Angry Birds Halloween", image: "images/angrybirdshalloween.webp", url: "../games/angrybirdshalloween.html" },
    { name: "Ace Gangster", image: "images/acegangster.webp", url: "../games/acegangster.html" },
    { name: "10 Minutes Till Dawn", image: "images/10mintilldawn.webp", url: "../games/10-minutes-till-dawn.html" },
    { name: "1v1.lol", image: "https://play-lh.googleusercontent.com/QYGRIDJbyVO7L7jH8CwiKJ4NumTGgcTVqU3ITooLWxro-eeNns1RZ0uwGGFe-r8M4co", url: "../games/1v1lol.html" },
    { name: "Slope", image: "images/slope.webp", url: "../games/slope.html" },
    { name: "Slope 2", image: "images/slope2.webp", url: "../games/slope2.html" },
    { name: "Retro Bowl", image: "images/retrobowl.webp", url: "../games/retrobowl.html" },
    { name: "Block Blast", image: "images/blockblast.webp", url: "../games/blockblast.html" },
    { name: "Idle Breakout", image: "images/idlebreakout.webp", url: "../games/idle-breakout.html" },
    { name: "Gunspin", image: "images/gunspin.webp", url: "../games/gunspin.html" },
    { name: "Learn To Fly", image: "games/learntofly/icon.png", url: "../games/learntofly.html" },
    { name: "Learn To Fly 2", image: "images/learntofly2.webp", url: "../games/learntofly2.html" },
    { name: "Learn To Fly 3", image: "images/learntofly3.webp", url: "../games/learntofly3.html" },
    { name: "House Of Hazards", image: "images/houseofhazards.webp", url: "../games/houseofhazards.html" },
    { name: "Hole.io", image: "images/holeio.webp", url: "../games/holeio.html" },
    { name: "Cut The Rope", image: "images/cuttherope.webp", url: "../games/cut-the-rope.html" },
    { name: "Tank Trouble", image: "images/tanktrouble.webp", url: "../games/tanktrouble.html" },
    { name: "Drift Hunters", image: "images/drifthunters.webp", url: "../games/drifthunters.html" },
    { name: "Draw The Hill", image: "images/drawthehill.webp", url: "../games/draw-the-hill.html" },
    { name: "Getaway Shootout", image: "images/getawayshootout.webp", url: "../games/getaway-shootout.html" },
    { name: "Crossy Road", image: "images/crossyroad.webp", url: "../games/crossyroad.html" },
    { name: "Rooftop Sniper", image: "images/rooftopsnipers.webp", url: "../games/rooftopsnipers.html" },
    { name: "Boxing Random", image: "images/boxingrandom.webp", url: "../games/boxingrandom" },
    { name: "Adventure Capitalist", image: "images/adventurecapitalist.webp", url: "../games/adventurecapitalist.html" },
    { name: "Hide & Smash", image: "images/hideandsmash.webp", url: "../games/hideandsmash.html" },
    { name: "MonkeyMart", image: "images/monkeymart.webp", url: "../games/monkey-mart.html" },
    { name: "Retro Bowl College", image: "images/retrobowlcollege.webp", url: "../games/rb-college.html" },
    { name: "Minecraft (Eagler)", image: "images/mc.webp", url: "../games/minecraft.html" },
    { name: "Bloons TD5", image: "images/btd5.webp", url: "../games/bloonstd5.html" },
    { name: "Mr Mine", image: "images/mrmine.webp", url: "../games/mrmine.html" },
    { name: "Run 2", image: "images/run2.webp", url: "../games/run2.html" },
    { name: "Run 3", image: "images/run3.webp", url: "../games/run3.html" },
    { name: "Spend Elon's Money", image: "images/elonmusk.webp", url: "../games/spending-elonmusk-money.html" },
    { name: "Plants V Zombies (Full)", image: "images/pvz.webp", url: "../games/pvz.html" },
    { name: "Mine Sweeper", image: "images/minesweeper.webp", url: "../games/minesweeper.html" },
        { name: "Pizza Tower", image: "images/pizzatower.webp", url: "../games/pizzatower.html" },
{ name: "Pixel Gun", image: "images/pixelgun.webp", url: "../games/pixelgun.html" },
    { name: "Google Snake", image: "images/googlesnake.webp", url: "../games/googlesnake.html" },
    { name: "N Gon", image: "images/ngon.webp", url: "../games/ngon.html" },
    { name: "OVO", image: "images/ovo.webp", url: "../games/ovo.html" },
    { name: "Basketball Stars", image: "images/basketballstars.webp", url: "../games/basketballstars.html" },
    { name: "Stacktris", image: "images/stacktris.webp", url: "../games/stacktris.html" },
    { name: "FNAF", image: "images/fnaf.webp", url: "../games/fnaf.html" },
    { name: "DBZ Devolution", image: "images/dbz.webp", url: "../games/dbz.html" },
    { name: "Drive Mad", image: "images/drivemad.webp", url: "../games/drivemad.html" },
    { name: "Papa's Games", image: "images/papasgame.webp", url: "../games/papas-games.html" },
    { name: "Stickman Games", image: "https://cdn2.steamgriddb.com/icon/9f61408e3afb633e50cdf1b20de6f466.png", url: "../games/henry-stickman.html" },
    { name: "Vex's Games", image: "https://play-lh.googleusercontent.com/0OnVFzHIMuLLeMjvACoNzxRbungfOH1zH4hUWQnIg5KfM2va_mFssFuRGq26WqWA", url: "../games/vex.html" },
    { name: "2048", image: "images/2048.webp", url: "../games/2048.html" },
    { name: "Paper.io 2", image: "images/paperio2.webp", url: "../games/paperio2.html" },
    { name: "Bitlife", image: "https://play-lh.googleusercontent.com/fUM-UyywXxjC8soxAZdIlxJrlRRXmql8wkE426SHzft4lJycSKVd2jCYQQX1BEG9Xw", url: "../games/bitlife.html" },
    { name: "Subway Surfers", image: "https://img.poki.com/cdn-cgi/image/quality=78,width=314,height=314,fit=cover,f=auto/81a0a3f18cf0ee129e56edb50fc52c3b.png", url: "../games/subwaysurfer.html" },
    { name: "Basketball Random", image: "https://play-lh.googleusercontent.com/gP8T5Z1O-ngxIloiwcBZzrzyLPYDp0R_1BDNKUDZboIRPVImeyWI8-7aExvB9gAGNKc=w240-h480-rw", url: "../games/basketball-random.html" },
    { name: "Soccer Random", image: "https://play-lh.googleusercontent.com/G1PIlb6HWKSaDre0XpUcmKGps9T4iamsSlwrogB3EJzYv4bz0M2am4D17MtGzndaOOU", url: "../games/soccer-random.html" },
    { name: "MotoX3M Games", image: "images/motocross.webp", url: "../games/motox3m.html" },
    { name: "CSGO Case Opener", image: "images/csgoclicker.webp", url: "../games/csgo-clicker.html" },
    { name: "Temple Run 2", image: "https://play-lh.googleusercontent.com/go4XqS4mYs-G2tZymiVLF4wJYXIi5QrvwixNRzssk4G_vRBHrAdg4E1ddNwy9c2cZA", url: "../games/templerun2.html" },
    { name: "Stickman Golf", image: "https://image.spreadshirtmedia.com/image-server/v1/products/T1459A839PA3861PT28D12687618W6161H10000/views/1,width=550,height=550,appearanceId=839,backgroundColor=F2F2F2/golf-stickman-sticker.webp", url: "../games/stickmangolf.html" },
    { name: "Pandemic 2", image: "images/pandemic2.webp", url: "../games/pandemic2.html" },
    { name: "Riddle School Games", image: "https://i.ytimg.com/vi/Ls5rT-7_4d4/sddefault.jpg", url: "../games/riddleschool-all-games.html" },
    { name: "Cupcake 2048", image: "images/cupcake2048.webp", url: "../games/cupcake2048.html" },
    { name: "Jetpack Joyride", image: "images/jetpackjoyride.webp", url: "../games/jetpack-joyride.html" },
    { name: "Geometry Dash", image: "images/geodash.webp", url: "../games/geodash.html" },
    { name: "Duck Life 1", image: "images/ducklife1.webp", url: "../games/ducklife1.html" },
    { name: "Sand Boxels", image: "https://sandboxels.r74n.com/icons/icon.png", url: "../games/sandboxels.html" },
    { name: "Galaga", image: "images/galaga.webp", url: "../games/galaga.html" },
    { name: "Gravity Guy", image: "images/gravityguy.webp", url: "../games/gravityguy.html" },
    { name: "Gun Mayhem", image: "images/gunmayhem.webp", url: "../games/gunmayhem.html" },
    { name: "Gyroball", image: "images/gyroball.webp", url: "../games/gyroball.html" },
    { name: "Happy Wheels", image: "images/happywheels.webp", url: "../games/happy-wheels.html" },
    { name: "Henry Stickman: Full Collection", image: "images/henrystickman.webp", url: "../games/henry-stickman.html" },
    { name: "Idle Shark", image: "images/idleshark.webp", url: "../games/idle-shark.html" },
    { name: "Marippy", image: "images/marippy.webp", url: "../games/marippy.html" },
    { name: "Minecraft Tower Defense", image: "images/minecrafttowerdefense.webp", url: "../games/minecraft-tower-defence.html" },
    { name: "Minecraft Tower Defense 2", image: "images/minecrafttowerdefense2.webp", url: "../games/minecraft-tower-defence-2.html" },
    { name: "Motherload", image: "images/motherload.webp", url: "../games/motherload.html" },
    { name: "Oiligarchy", image: "images/oiligarchy.webp", url: "../games/oiligarchy.html" },
    { name: "Pacman", image: "images/pacman.webp", url: "../games/pacman.html" },
    { name: "Pacxon", image: "images/pacxon.webp", url: "../games/pacxon.html" },
        { name: "Quake III Arena", image: "images/quake3.webp", url: "../games/quake3.html" },
{ name: "Pool", image: "images/pool.webp", url: "../games/pool.html" },
    { name: "Pregnancy Test", image: "images/pregnancytest.webp", url: "../games/pregnancy-test.html" },
    { name: "Shuffle", image: "images/shuffle.webp", url: "../games/shuffle.html" },
    { name: "Slither.io", image: "images/slitherio.webp", url: "../games/slitherio.html" },
    { name: "Snailiad", image: "images/snailiad.webp", url: "../games/snailiad.html" },
    { name: "Snake", image: "images/snake.webp", url: "../games/snake.html" },
    { name: "Snowline", image: "images/nowline.webp", url: "../games/snowline.html" },
    { name: "Sort the Court", image: "images/sortthecourt.webp", url: "../games/sort-the-court.html" },
    { name: "Steal This Election", image: "images/stealthiselection.webp", url: "../games/stealthiselection.html" },
    { name: "Supersonic", image: "images/supersonic.webp", url: "../games/super-sonic.html" },
    { name: "Super Mario 63", image: "images/supermario63.webp", url: "../games/supermario63.html" },
    { name: "Swords and Sandals 2", image: "images/swordsandsandals2.webp", url: "../games/swords-and-sandals-2.html" },
    { name: "Tetris", image: "images/tetris.webp", url: "../games/tetris.html" },
    { name: "The Big Adventure of Owata's Life", image: "images/thebigadventureofowataslife.webp", url: "../games/the-big-adventure-of-owataslife.html" },
    { name: "The Binding of Isaac", image: "images/thebindingofisaac.webp", url: "../games/the-binding-of-isaac.html" },
    { name: "Tower Blaster", image: "images/towerblaster.webp", url: "../games/towerblaster.html" },
    { name: "Tower Master", image: "images/towermaster.webp", url: "../games/towermaster.html" },
    { name: "World's Hardest Game 2", image: "images/worldshardestgame2.webp", url: "../games/worldshardestgame2.html" },
    { name: "Undertale (Demo)", image: "images/undertale.webp", url: "../games/undertale(demo).html" },
    { name: "Undertale: Rejuvenation Mod", image: "images/rejuvenation.webp", url: "../games/Rejuvenation.html" },
    { name: "Last Breath Trio Mod", image: "images/lastbreathtrio.webp", url: "../games/LastBreathTrio.html" },
    { name: "The Final Experiment Mod", image: "images/thefinalexperiment.webp", url: "../games/TheFinalExperiment.html" }
  ]
};

// Utility functions
const utils = {
  /**
   * Fisher-Yates shuffle algorithm for randomizing game order
   * @param {Array} array - Array to shuffle
   * @returns {Array} Shuffled array
   */
  shuffleArray: (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },

  /**
   * Format time display in human-readable format
   * @param {number} seconds - Total seconds
   * @returns {string} Formatted time string
   */
  formatTime: (seconds) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${days}d ${hours}h ${minutes}m ${secs}s`;
  },

  /**
   * Create game button HTML element
   * @param {Object} game - Game object with name, image, and url
   * @returns {string} HTML string for game button
   */
  createGameButton: (game) => {
    return `<button class="button">
      <a style="text-decoration:none" href='${game.url}'>
        <img src="${game.image}" alt="${game.name}" loading="lazy"> 
        <span>${game.name}</span>
      </a>
    </button>`;
  },

  /**
   * Debounce function to limit function calls
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function} Debounced function
   */
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
};

// Game management system
const gameManager = {
  /**
   * Initialize the game grid with shuffled games
   */
  init: () => {
    try {
      const shuffledGames = utils.shuffleArray(gameData.games);
      const gameButtonsHTML = shuffledGames.map(utils.createGameButton).join('');
      const gameButtonsContainer = document.getElementById('gameButtons');
      
      if (gameButtonsContainer) {
        gameButtonsContainer.innerHTML = gameButtonsHTML;
      }
    } catch (error) {
      console.error('Error initializing games:', error);
    }
  },

  /**
   * Search through games based on query
   * @param {string} query - Search query
   */
  search: (query) => {
    try {
      const buttons = document.getElementsByClassName("button");
      const searchTerm = query.toLowerCase();
      
      Array.from(buttons).forEach(button => {
        const buttonText = button.textContent.toLowerCase();
        button.style.display = buttonText.includes(searchTerm) ? "flex" : "none";
      });
    } catch (error) {
      console.error('Error searching games:', error);
    }
  }
};

// Time tracking system
const timeTracker = {
  totalTimeSpent: 0,
  intervalId: null,
  
  /**
   * Initialize time tracking
   */
  init: () => {
    try {
      timeTracker.totalTimeSpent = parseInt(localStorage.getItem('totalTimeSpent')) || 0;
      timeTracker.updateDisplay();
      timeTracker.startTracking();
    } catch (error) {
      console.error('Error initializing time tracker:', error);
    }
  },

  /**
   * Update the time display
   */
  updateDisplay: () => {
    try {
      const timeElement = document.getElementById('timeSpent');
      if (timeElement) {
        timeElement.innerHTML = utils.formatTime(timeTracker.totalTimeSpent);
      }
    } catch (error) {
      console.error('Error updating time display:', error);
    }
  },

  /**
   * Start tracking time
   */
  startTracking: () => {
    try {
      timeTracker.intervalId = setInterval(() => {
        timeTracker.totalTimeSpent++;
        localStorage.setItem('totalTimeSpent', timeTracker.totalTimeSpent);
        timeTracker.updateDisplay();
      }, 1000);
    } catch (error) {
      console.error('Error starting time tracking:', error);
    }
  },

  /**
   * Stop tracking time
   */
  stopTracking: () => {
    if (timeTracker.intervalId) {
      clearInterval(timeTracker.intervalId);
      timeTracker.intervalId = null;
    }
  }
};

// Mobile menu management
const mobileMenu = {
  /**
   * Initialize mobile menu functionality
   */
  init: () => {
    try {
      const menuToggle = document.querySelector('.menu-toggle');
      const navbarMenu = document.querySelector('.navbar-menu');
      
      if (menuToggle && navbarMenu) {
        menuToggle.addEventListener('click', () => {
          navbarMenu.classList.toggle('active');
        });
      }

      // Close menu when clicking outside
      document.addEventListener('click', (event) => {
        if (navbarMenu && !event.target.closest('.navbar-container')) {
          navbarMenu.classList.remove('active');
        }
      });

      // Handle window resize
      window.addEventListener('resize', utils.debounce(() => {
        if (window.innerWidth > 768 && navbarMenu) {
          navbarMenu.classList.remove('active');
        }
      }, 250));
    } catch (error) {
      console.error('Error initializing mobile menu:', error);
    }
  }
};

// Main application class
class UnblockedGamesApp {
  constructor() {
    this.isInitialized = false;
  }

  /**
   * Initialize the application
   */
  init() {
    if (this.isInitialized) return;
    
    try {
      // Initialize all systems
      gameManager.init();
      timeTracker.init();
      mobileMenu.init();
      
      // Setup event listeners
      this.setupEventListeners();
      
      // Update footer year
      this.updateFooterYear();
      
      this.isInitialized = true;
      console.log('Schplay initialized successfully');
    } catch (error) {
      console.error('Error initializing application:', error);
    }
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    try {
      // Search functionality with debouncing
      const searchInput = document.getElementById('searchInput');
      if (searchInput) {
        const debouncedSearch = utils.debounce((value) => {
          gameManager.search(value);
        }, 300);
        
        searchInput.addEventListener('input', (e) => {
          debouncedSearch(e.target.value);
        });
      }
    } catch (error) {
      console.error('Error setting up event listeners:', error);
    }
  }

  /**
   * Update footer year
   */
  updateFooterYear() {
    try {
      const yearElement = document.getElementById('year');
      if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
      }
    } catch (error) {
      console.error('Error updating footer year:', error);
    }
  }

  /**
   * Cleanup resources
   */
  destroy() {
    timeTracker.stopTracking();
    this.isInitialized = false;
  }
}

// Initialize app when DOM is ready
let app;

document.addEventListener('DOMContentLoaded', () => {
  app = new UnblockedGamesApp();
  app.init();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (app) {
    app.destroy();
  }
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { UnblockedGamesApp, gameManager, timeTracker, utils };
}
