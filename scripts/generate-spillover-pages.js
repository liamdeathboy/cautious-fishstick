#!/usr/bin/env node

/**
 * Generates competitor "alternative" landing pages as <slug>/index.html at the site root
 * (served as clean trailing-slash URLs, e.g. /unblocked-games-76/).
 *
 * Reuses existing site pieces only: the shared page shell, the .games-grid / .game-card
 * component, and the game-page "Players Also Enjoy" section + its render script
 * (js/games-data.js -> window.SCHPLAY_GAMES.list), with neutral ids.
 *
 * Every page carries its own thesis, article body, FAQ and curated game set — these are
 * deliberately NOT name-swapped templates. Claims are limited to things that are
 * structurally verifiable (where a site is hosted, how filters block by host, when Flash
 * was discontinued). Do not add claims here that cannot be checked.
 *
 * GAME_COUNT is the real number of pages in /games/. Keep it honest: comparison pages
 * live or die on it, and index.html's "2,500+" claim does not match the catalog.
 *
 *     node scripts/generate-spillover-pages.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const MANUAL_PATH = path.join(ROOT, 'data', 'game-content-manual.json');
const COMPONENT_VERSION = '2026-04-01-mobile-1';
const OG_IMAGE = 'https://schplay.com/images/logo.webp';
const GAME_COUNT = '280+';

// Games that now live at their own clean root URL rather than under /games/.
const RELOCATED = {
  slope: '/slope-unblocked/',
  '1v1lol': '/1v1-lol-unblocked/',
  minecraft: '/minecraft-unblocked/'
};

const PAGES = [
  {
    slug: 'unblocked-games-66',
    name: 'Unblocked Games 66',
    title: 'Unblocked Games 66 Alternative - Play Free at School',
    metaDescription:
      'Unblocked Games 66 down or blocked? Schplay runs 280+ browser games from one stable domain - no mirrors, no proxy, no download.',
    intro:
      'Unblocked Games 66 is one of the oldest names in school gaming, and one of the most copied. If the version you used has gone dark, started redirecting somewhere unfamiliar, or simply stopped loading on the school network, Schplay runs the same kind of browser games from a single address that does not move.',
    games: ['slope', '1v1lol', 'minecraft', 'retrobowl', 'basketballstars', 'subwaysurfer',
            'drivemad', 'ovo', 'geodash', 'tetris', 'pacman', 'doodlejump'],
    sections: [
      {
        h2: 'There has never been one Unblocked Games 66',
        paras: [
          'The most useful thing to understand about this name is that nobody owns it. "Unblocked Games 66" has been used by dozens of unrelated operators over the years, published on Google Sites, on GitHub Pages, and on Amazon infrastructure, with no connection between them beyond the label. The best-known 66 is commonly grouped with Unblocked Games 76 and 77 as the work of a single operator, but plenty of other sites use the same name with no relation to that trio at all.',
          'That matters when a link breaks. There is no official 66 to go back to and no support page to check. Searching the name returns a rotating cast of mirrors, and the one at the top this week is frequently not the one you were using last month.'
        ]
      },
      {
        h2: 'Why the mirrors keep dying',
        paras: [
          'Filters block at the host level, not the page level. A 66 mirror published on a host that anybody can publish to shares its fate with everything else on that host, so the rule an administrator writes to stop one games page quietly stops several thousand unrelated pages at the same time. The mirror was never meant to last; it is disposable by design.',
          'This is why the advice you get is always "find the new one" rather than "wait for it to come back". Nothing comes back. Someone publishes a fresh copy at a fresh address, it circulates for a few weeks, and the cycle restarts.'
        ]
      },
      {
        h2: 'What Schplay does differently',
        paras: [
          'Schplay is a single owned domain. The URL you bookmark today is the URL that still works next term, because there is no mirror network behind it and nothing to migrate when a host gets flagged. Games load from the same domain you are already on, so there is no second address to get past and no redirect chain between the link and the game.',
          `There is no account, no download, and no installer. The library is ${GAME_COUNT} games that run in the browser on a Chromebook or a school laptop.`
        ]
      },
      {
        h2: 'The honest caveat',
        paras: [
          'No games site is unblockable, and anyone claiming otherwise is selling something. A filter can block schplay.com exactly like it can block any other domain, and if your district decides to, it will. The difference is one stable address that either works or does not, rather than a scavenger hunt for whichever mirror is currently alive.'
        ]
      }
    ],
    faqs: [
      { q: 'Is Unblocked Games 66 gone for good?',
        a: 'The name is still in use by several unrelated sites, so it depends entirely on which one you were using. There is no single official version to come back online.' },
      { q: 'Do I need a proxy or a VPN to use Schplay?',
        a: 'No. Schplay is a games site, not a proxy. Most school acceptable-use policies treat running a proxy very differently from visiting a website, so this is a meaningful distinction.' },
      { q: 'Are the games actually the same ones?',
        a: 'Many overlap. Most sites in this space draw from the same pool of HTML5 titles, so you will find familiar names here. The difference is where they are hosted and whether the address survives.' }
    ]
  },

  {
    slug: 'unblocked-games-67',
    name: 'Unblocked Games 67',
    title: 'Unblocked Games 67 Alternative - Play Free at School',
    metaDescription:
      'Looking for Unblocked Games 67? The numbers are not versions. Play 280+ browser games at Schplay from one domain that does not mirror.',
    intro:
      'If you searched Unblocked Games 67 and landed on something that looked nothing like what you remembered, that is normal. Schplay is a straightforward alternative: one domain, no mirrors, browser games that start when you click them.',
    games: ['slope2', 'geodash', 'ovo', 'vex', 'doodlejump', 'flappy-bird',
            'air-slip', 'jetpack-joyride', 'templerun2', 'subwaysurfer', 'crossyroad', 'gunspin'],
    sections: [
      {
        h2: 'The numbers do not mean anything',
        paras: [
          'There is a 66, a 67, a 76, a 77, a 911, a 6969 and a 666. It is tempting to read those as versions, as though 77 were newer than 76 or 67 were an update to 66. They are not. They are brand differentiation between unrelated operators competing for the same search traffic, and the number tells you nothing about the age, size or quality of the library behind it.',
          'Once you know that, the search results make more sense. You are not looking at one project with many releases. You are looking at many projects that picked adjacent names on purpose, because a student who cannot reach 66 will predictably try 67 next.'
        ]
      },
      {
        h2: 'What that means when a site goes down',
        paras: [
          'Because these are separate operators, there is no continuity between them. Your progress does not carry over. A game that was on 66 may simply not exist on 67. And the mirror you find is often a copy of a copy, with dead thumbnails and games that load to a blank frame because the file they pointed at moved.',
          'Trying the next number up is a reasonable instinct and it does occasionally work, but it works by accident. You are not falling back to a backup; you are landing on an unrelated site that happened to pick an adjacent name, and its uptime has nothing to do with the one you came from.'
        ]
      },
      {
        h2: 'What Schplay does differently',
        paras: [
          `Schplay is not a numbered mirror and is not trying to be the next one. It is a single domain with ${GAME_COUNT} browser games, each on its own permanent page, so a link to a game keeps working and can be bookmarked directly.`,
          'Nothing here asks you to install anything, sign in, or route your traffic through a proxy. You open the page and the game loads on the page.'
        ]
      }
    ],
    faqs: [
      { q: 'Is Unblocked Games 67 a newer version of 66?',
        a: 'No. They are unrelated sites run by different people. The numbers are branding, not version numbers.' },
      { q: 'Will my saved progress transfer?',
        a: 'No. Browser games store progress locally per site, so progress on any other site stays there. Games on Schplay save to your browser on schplay.com.' },
      { q: 'Why do some mirrors show broken images?',
        a: 'They are usually copies of a copy, still pointing at files on a host that has since moved or been taken down.' }
    ]
  },

  {
    slug: 'unblocked-games-76',
    name: 'Unblocked Games 76',
    title: 'Unblocked Games 76 Alternative - Play Free at School',
    metaDescription:
      'Unblocked Games 76 blocked at school? Schplay hosts 280+ browser games on its own domain, not on shared cloud storage that filters catch.',
    intro:
      'Unblocked Games 76 is usually grouped with 66 and 77 as the same operation, and like the rest of that family it depends on cloud hosting that school filters have gotten good at catching. Schplay runs from its own domain instead.',
    games: ['1v1lol', 'quake3', 'pixelgun', 'gunmayhem', 'rooftopsnipers', 'getaway-shootout',
            'deep-freeze', '10-minutes-till-dawn', 'ngon', 'tanktrouble', 'z-machine', 'gunspin'],
    sections: [
      {
        h2: 'What Unblocked Games 76 actually runs on',
        paras: [
          'Unblocked Games 76 is widely reported to share an operator with Unblocked Games 66 and 77, served from Amazon infrastructure rather than a normal website host. That choice is deliberate: cloud storage addresses used to slip past filters that were only looking for known gaming domains.',
          'It worked for a while. It works much less well now, because filter vendors caught up and started matching on the host pattern itself rather than maintaining a list of individual game sites.'
        ]
      },
      {
        h2: 'Why cloud-hosted game sites get caught',
        paras: [
          'A raw Amazon address is a strong signal on a school network. Almost nothing a student legitimately needs during the day is served from a bare cloud-storage URL, so blocking that pattern is cheap for IT and costs them almost no false positives. Many districts now block those hosts wholesale.',
          'The result is that every site sharing that host goes down together, regardless of what is on it. That is the structural weakness of the entire 66 / 76 / 77 family: they share a fate.'
        ]
      },
      {
        h2: 'What Schplay does differently',
        paras: [
          `Schplay is served from schplay.com, a normal domain with a normal certificate, and the games are files on that same domain. There is no cloud-storage address in the chain and no second host to reach before a game will start. The library is ${GAME_COUNT} titles, each with a permanent page.`,
          'That does not make it invisible to a filter. It does mean it is not sharing a blocklist entry with several hundred unrelated sites.'
        ]
      }
    ],
    faqs: [
      { q: 'Are 66, 76 and 77 the same site?',
        a: 'They are commonly reported as the same operator with different branding. They are not versions of each other, and the libraries overlap heavily.' },
      { q: 'Why did 76 stop working when 66 did?',
        a: 'If both are served from the same host, one filter rule takes out both at once. That is the usual explanation for several of these going dark on the same day.' },
      { q: 'Does Schplay need anything installed?',
        a: 'No. Every game runs in the browser tab. There is no extension, no app and no account.' }
    ]
  },

  {
    slug: 'unblocked-games-911',
    name: 'Unblocked Games 911',
    title: 'Unblocked Games 911 Alternative - Play Free at School',
    metaDescription:
      'Unblocked Games 911 not loading? Schplay runs 280+ free browser games from one domain - no Google Sites mirror to hunt down.',
    intro:
      'Unblocked Games 911 is one of the most mirrored names in the category, and most of those mirrors have lived on Google Sites. That is exactly why they keep disappearing. Schplay takes the opposite approach.',
    games: ['slitherio', 'agario', 'holeio', 'paperio2', 'evowars', 'bit-gun-io',
            'boxingrandom', 'soccer-random', 'basketballstars', 'houseofhazards', 'tanktrouble', 'gunmayhem'],
    sections: [
      {
        h2: 'The Google Sites trick, and why it stopped working',
        paras: [
          'For years the reliable way to get a games page past a school filter was to publish it on sites.google.com. Schools whitelist that host because teachers genuinely use it for class material, so a games page hiding there inherited the whitelist. A large share of the 911 mirrors were built exactly this way.',
          'Filter vendors and district IT staff are aware of this now. The common responses are to block individual Google Sites pages as they are reported, or to stop whitelisting the host broadly. Either way the advantage is gone, and the mirrors churn faster than ever because each one only survives until someone notices it.'
        ]
      },
      {
        h2: 'The cost of the treadmill',
        paras: [
          'Chasing mirrors has a real downside beyond the annoyance. When a name is unowned and endlessly copied, the search results fill with pages that are optimised to look like the site you wanted but are not, and there is no way to tell from the result which one is a working game library and which is an empty shell built to collect ad impressions.',
          'You also lose everything each time. Browser games store saves against the address you played them on, so every hop to a new 911 mirror resets your progress to zero, no matter how many hours the last one had in it.'
        ]
      },
      {
        h2: 'What Schplay does differently',
        paras: [
          `Schplay does not publish mirrors. There is one domain, ${GAME_COUNT} games, and a permanent page per game. If the site is reachable, everything on it is reachable, and if it is blocked you know immediately rather than after clicking through four dead copies.`
        ]
      }
    ],
    faqs: [
      { q: 'Why do so many of these sites use Google Sites?',
        a: 'Because schools frequently whitelist sites.google.com for classroom material, so anything published there used to inherit that access.' },
      { q: 'Is Schplay hosted on Google Sites?',
        a: 'No. It runs on its own domain, schplay.com.' },
      { q: 'What happens if Schplay gets blocked at my school?',
        a: 'Then it is blocked, and we will not pretend otherwise. There is no mirror to switch to, which is the trade-off for having one address that does not rot.' }
    ]
  },

  {
    slug: 'unblocked-games-wtf',
    name: 'Unblocked Games WTF',
    title: 'Unblocked Games WTF Alternative - Play Free at School',
    metaDescription:
      'Unblocked Games WTF blocked by name? Filters flag the URL itself. Schplay runs 280+ browser games from a domain that reads clean.',
    intro:
      'Unblocked Games WTF has a problem the other sites in this category do not: the name itself trips filters. Schplay hosts the same sort of browser games on a domain that does not set off a keyword rule before anyone has looked at the content.',
    games: ['slope', 'geodash', 'retrobowl', 'drivemad', 'motox3m', 'happy-wheels',
            'bad-time-simulator', 'friday-night-funkin', 'baldi-plus', 'cookie-clicker-working-2026', 'monkey-mart', 'idle-breakout'],
    sections: [
      {
        h2: 'The URL is the problem, not the games',
        paras: [
          'Most school content filters do keyword matching on the URL and page title before they ever evaluate what is actually on the page. A domain containing "wtf" hits profanity and mature-language rules at a large number of districts automatically, and it does so regardless of whether a single game on the site is objectionable.',
          'It also compounds. Two of the strongest signals a filter looks for are the word "unblocked" in a hostname and profanity in a hostname. A site carrying both is close to the easiest possible block decision an administrator will make all week.'
        ]
      },
      {
        h2: 'Why "unblocked" in a domain is a liability',
        paras: [
          'It is worth saying plainly, because it applies to a lot of this category. Putting "unblocked" in a hostname announces the purpose of the site to the filter. It is a fast way to get found by students searching for it, and an equally fast way to get catalogued by the software trying to stop them.',
          'The sites that survive longest in school environments tend to be the ones whose names give away the least. That is not a trick, and it will not defeat a filter that has actually looked at the site — it just means the decision gets made on the content rather than on four letters in the address bar.'
        ]
      },
      {
        h2: 'What Schplay does differently',
        paras: [
          `Schplay is a plain, unremarkable domain name with no profanity and no filter-bait in it. That is not a guarantee of anything, but it means the site gets evaluated on what it is rather than rejected by a pattern match on the address. Behind it are ${GAME_COUNT} browser games, no account and no download.`
        ]
      }
    ],
    faqs: [
      { q: 'Why is Unblocked Games WTF blocked when other game sites are not?',
        a: 'Profanity in the hostname is matched by most filters before page content is considered, so the domain can be blocked on the name alone.' },
      { q: 'Does changing the site I use get me around my school filter?',
        a: 'Sometimes, briefly. It is not a reliable strategy, and using a proxy to force it usually breaks the acceptable-use policy you agreed to.' },
      { q: 'Is Schplay appropriate for school?',
        a: 'It is a games site, so plenty of schools will still block it during class time. It carries no profanity in the name and no proxy tooling.' }
    ]
  },

  {
    slug: 'classroom-6x-unblocked',
    name: 'Classroom 6x',
    title: 'Classroom 6x Alternative - Play Free Games at School',
    metaDescription:
      'Classroom 6x blocked or slow? Schplay hosts 280+ browser games on its own domain, with no mirror network behind it.',
    intro:
      'Classroom 6x is one of the more heavily promoted names in school gaming, cross-linked with a wider network of mirrors under other brands. Schplay is a simpler proposition: one domain, one library, no network.',
    games: ['2048', 'tetris', 'blockblast', 'minesweeper', 'bloxors', 'cut-the-rope',
            'worldshardestgame', 'bejeweled2', 'pacman', 'googlesnake', 'towerblaster', 'stacktris'],
    sections: [
      {
        h2: 'Classroom 6x is part of a network, not a standalone site',
        paras: [
          'The project behind several of these brands promotes them together. The public repository for the widely forked 3kh0 games project advertises Classroom 6x, Unblocked Games 76 and Unblocked Games 66 EZ alongside its own domains as part of one network. Whichever of those names you arrive through, you are often looking at variations of the same library.',
          'That is not a scandal, but it is worth knowing, because it explains why switching between them so rarely helps. When one goes down for a network-level reason, the alternatives you are being pointed at are frequently the same thing wearing a different name.'
        ]
      },
      {
        h2: 'Naming a games site after classroom software',
        paras: [
          'Branding a games hub with a word like "classroom" is a deliberate attempt to look like sanctioned school software in a filter log and in a teacher\'s glance at a screen. It buys a little time. It also means that once a district does catalogue it, the entry tends to be permanent, because it reads to an administrator as intentional evasion rather than an oversight.',
          'There is a second cost that is easy to miss. Names built to be mistaken for school tools are also the names most likely to be impersonated, so searching for one turns up a crowd of lookalikes with no reliable way to tell which is the site people were actually recommending.'
        ]
      },
      {
        h2: 'What Schplay does differently',
        paras: [
          `Schplay does not pretend to be a learning tool and does not run a mirror network. It is a games site on a games domain with ${GAME_COUNT} titles, each on a permanent page. There is nothing to work around and no second brand to fall back to.`
        ]
      }
    ],
    faqs: [
      { q: 'Is Classroom 6x related to 3kh0?',
        a: 'The 3kh0 project\'s own public repository lists Classroom 6x among the sites in its network, alongside Unblocked Games 76 and 66 EZ.' },
      { q: 'Will a different mirror get me back in?',
        a: 'Often not, because the alternatives promoted alongside it are commonly the same library on a related host.' },
      { q: 'Does Schplay have the same games?',
        a: 'Many overlap, since most of this category draws on the same pool of HTML5 titles. The library here is ' + GAME_COUNT + ' games.' }
    ]
  },

  {
    slug: '3kh0-alternative',
    name: '3kh0',
    title: '3kh0 Alternative - Play Free Unblocked Games at School',
    metaDescription:
      '3kh0 mirror down? It runs on GitHub and GitLab Pages, which districts block wholesale. Schplay hosts 280+ games on its own domain.',
    intro:
      '3kh0 is probably the best known open-source project in school gaming, which is both its strength and the reason its mirrors keep vanishing. Schplay is not a fork of anything and is not published on a shared code host.',
    games: ['retrobowl', 'geodash', '1v1lol', 'slope', 'minecraft', 'basketballstars',
            'drivemad', 'ovo', 'subwaysurfer', 'doodlejump', 'agario', 'tetris'],
    sections: [
      {
        h2: 'What 3kh0 is',
        paras: [
          '3kh0 is an open-source unblocked games project distributed largely through GitHub Pages and GitLab Pages, with a cluster of associated domains it cross-promotes. Because the code is public, anyone can fork it and publish their own copy in a few minutes, which is why there are so many near-identical 3kh0 sites at different addresses.',
          'That openness is genuinely useful. It is also the thing that makes any single 3kh0 address unreliable.'
        ]
      },
      {
        h2: 'Why github.io and gitlab.io mirrors die together',
        paras: [
          'Forking is fast for students and equally fast for anyone trying to stop them. Because it is trivial to spin up a games page on a code host, districts increasingly block github.io and gitlab.io at the host level rather than playing whack-a-mole with individual forks. One rule takes out every copy at once, including the original.',
          'Forks also decay. A copy taken a year ago keeps pointing at asset paths and game files that the upstream project has since moved, which is why so many mirrors load the menu fine and then fail on the game itself.'
        ]
      },
      {
        h2: 'What Schplay does differently',
        paras: [
          `Schplay is a maintained site on its own domain rather than a fork someone published and walked away from. Game files, thumbnails and pages are served together from schplay.com, so a game either works or it does not — it will not half-load because an upstream repository reorganised. The library is ${GAME_COUNT} titles.`
        ]
      }
    ],
    faqs: [
      { q: 'Which 3kh0 mirror is the real one?',
        a: 'There is no single authoritative one. The project is open source and widely forked, so many addresses are legitimate copies of varying ages.' },
      { q: 'Why does a 3kh0 mirror show the menu but fail to load games?',
        a: 'Usually a stale fork still pointing at files that moved in the upstream project.' },
      { q: 'Is Schplay open source?',
        a: 'No. It is a maintained site on one domain, which is the trade-off: you cannot fork it, and it also will not go stale on you.' }
    ]
  },

  {
    slug: 'tyrones-unblocked-games',
    name: "Tyrone's Unblocked Games",
    title: "Tyrone's Unblocked Games Alternative - Play Free at School",
    metaDescription:
      "Tyrone's Unblocked Games games not loading? Much of that era was Flash, discontinued in 2020. Schplay runs 280+ HTML5 games that still work.",
    intro:
      "Tyrone's Unblocked Games is one of the older names in this category, and a lot of what made it good was a deep Flash library. Flash has been gone since the end of 2020. Schplay runs games that still work in a current browser.",
    games: ['pacman', 'tetris', 'duckhunt', 'curveball', 'bloxors', 'worldshardestgame',
            'learntofly', 'learntofly2', 'catmario', 'clubpenguin', 'papas-games', 'supermario63'],
    sections: [
      {
        h2: 'The Flash problem',
        paras: [
          'Adobe discontinued Flash Player at the end of 2020, and browsers removed the ability to run it entirely. That single change broke the majority of what the classic school-gaming sites were built on. Sites from that era that were never rebuilt now present long menus of games that simply will not start, because the file behind the link is a .swf that nothing can play.',
          'This is the most common reason an old favourite "stopped working" and no proxy or mirror will fix it. The game is not blocked. The technology it needed no longer exists in the browser.'
        ]
      },
      {
        h2: 'What actually survived',
        paras: [
          'Two things came through. Some classics were genuinely rebuilt in HTML5, which is why you can still play a working Pacman or Tetris today. Others survive through emulation projects that reinterpret the original Flash files in modern browsers, with mixed fidelity depending on the title.',
          'What did not survive is the long tail. A large number of Flash games from that period were never ported by anyone and are effectively gone outside of archive projects.'
        ]
      },
      {
        h2: 'What Schplay does differently',
        paras: [
          `Every game listed on Schplay is one that runs in a current browser. The library is ${GAME_COUNT} titles and it skews toward HTML5 builds and maintained ports rather than a long menu of dead Flash links, so a game you click is a game that starts.`
        ]
      }
    ],
    faqs: [
      { q: 'Why do old unblocked games sites not work any more?',
        a: 'Most were built on Flash, which Adobe discontinued at the end of 2020 and browsers removed. The links remain but the files cannot run.' },
      { q: 'Can I still play Flash games anywhere?',
        a: 'Some survive through emulation projects that run the original files in modern browsers, with varying results by title. Many were never ported at all.' },
      { q: 'Are the classics on Schplay the real versions?',
        a: 'They are browser builds and maintained ports of those games. They run without Flash.' }
    ]
  },

  {
    slug: 'coolmathgames-alternative',
    name: 'Coolmath Games',
    title: 'Coolmath Games Alternative - Play Free Games at School',
    metaDescription:
      'Coolmath Games blocked at your school? It usually is, because it is famous. Schplay runs 280+ browser games with no account and no app.',
    intro:
      'Coolmath Games is a legitimate, long-running platform and it is worth saying so. It is also on more district blocklists than almost any other gaming site, precisely because everyone knows the name. Schplay is a smaller, arcade-leaning alternative that asks nothing of you before you play.',
    games: ['2048', 'bloxors', 'worldshardestgame', 'worldshardestgame2', 'minesweeper', 'cut-the-rope',
            'tetris', 'bejeweled2', 'civiballs1', 'towerblaster', 'blockblast', 'cupcake2048'],
    sections: [
      {
        h2: 'Coolmath is not the problem — its fame is',
        paras: [
          'Almost everything else on this page is about sites that get blocked for hiding on a shared host. Coolmath Games is the opposite case. It is a real company, it has been running for decades, it is education-branded, and none of that helps, because being the single most recognisable gaming destination for students is exactly what puts a domain on a blocklist by name.',
          'If your school has blocked one gaming site and only one, this is usually the one. It is not a judgement about the content. It is that an administrator building a list starts with the name they already know.'
        ]
      },
      {
        h2: 'An honest comparison',
        paras: [
          'Coolmath has the deeper library for logic, maths and puzzle games specifically, and a lot of its catalogue is genuinely good at that. If puzzle and strategy is what you are after, it is a strong site and this page is not going to pretend otherwise.',
          'Schplay is smaller and skews differently. The strengths here are arcade, reflex, driving, sports and two-player games, with a solid puzzle section rather than a definitive one. Pick on that basis rather than on which page ranked higher.'
        ]
      },
      {
        h2: 'Where Schplay is genuinely easier',
        paras: [
          `There is no account, no app prompt and no download at any point. Every game is a page you can link directly to and a frame that starts on the page. The library is ${GAME_COUNT} titles, all browser-based, on a Chromebook or a school laptop.`,
          'It is also a much less well-known name, which — purely as a practical matter — means it appears on fewer blocklists.'
        ]
      }
    ],
    faqs: [
      { q: 'Why is Coolmath Games blocked at my school?',
        a: 'Usually because it is the best-known student gaming site, so it is the first entry on most manually built blocklists. It is not a content judgement.' },
      { q: 'Is Schplay better than Coolmath Games?',
        a: 'For puzzle and logic specifically, Coolmath has the deeper catalogue. Schplay is stronger on arcade, driving, sports and two-player games, and needs no account.' },
      { q: 'Does Schplay have maths games too?',
        a: 'There is a numbers and logic section, though it is smaller than a site built specifically around maths.' }
    ]
  },

  {
    slug: 'totally-science-alternative',
    name: 'Totally Science',
    title: 'Totally Science Alternative - Play Free Games at School',
    metaDescription:
      'Totally Science down? It bundled proxy tools with games, which carries different risk. Schplay is games only - 280+ titles, no proxy.',
    intro:
      'Totally Science became well known for pairing a games library with proxy and unblocker tooling. That combination is the reason it drew attention, and it is a meaningful difference from what Schplay does. Schplay is a games site and nothing else.',
    games: ['slope', '1v1lol', 'minecraft', 'geodash', 'retrobowl', 'subwaysurfer',
            'basketballstars', 'drivemad', 'slitherio', 'agario', 'ovo', 'tetris'],
    sections: [
      {
        h2: 'Games sites and proxies are not the same thing',
        paras: [
          'This distinction gets blurred constantly in this category and it is worth being precise about. A games site hosts games. A proxy routes your traffic through an intermediary so that a filter sees the intermediary instead of where you are actually going. Several of the best-known school-gaming brands, Totally Science among them, have offered both.',
          'That matters because school acceptable-use policies almost always treat them differently. Visiting a games site during a free period is, at most, against the rules about when you can play games. Deliberately routing traffic to defeat a filter is usually written up separately and more seriously, and it is the kind of thing that shows up in network logs clearly.'
        ]
      },
      {
        h2: 'Why proxy-bundled sites are unstable',
        paras: [
          'Proxies also attract far more attention than games do. A site that only serves games is one entry on a category list. A site offering a proxy is an active circumvention tool, and filter vendors prioritise those, which is a large part of why sites in that bracket cycle through domains so quickly.',
          'The knock-on effect is that the games get treated as collateral. When the domain is burned for the proxy, the library goes with it, and anything you had saved in a browser game on that address goes too.'
        ]
      },
      {
        h2: 'What Schplay does differently',
        paras: [
          `Schplay does not proxy anything, does not bundle an unblocker, and has no tooling for getting around a network filter. It is ${GAME_COUNT} browser games on one domain. If your school blocks it, it is blocked, and there is nothing here designed to change that.`,
          'For a lot of people that is the point: something you can open at lunch without it being a separate category of decision.'
        ]
      }
    ],
    faqs: [
      { q: 'Does Schplay include a proxy or unblocker?',
        a: 'No. It hosts games only. There is no proxy, no VPN and no circumvention tooling.' },
      { q: 'Is using a proxy at school actually a problem?',
        a: 'Usually yes. Most acceptable-use policies treat deliberately defeating a filter far more seriously than visiting a games site, and proxy traffic is visible in network logs.' },
      { q: 'Why did Totally Science keep changing domains?',
        a: 'Sites offering circumvention tools are prioritised by filter vendors, so their domains tend to be flagged much faster than a plain games site.' }
    ]
  }
];

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const rootAsset = (v) => (/^https?:\/\//i.test(v) ? v : '/' + String(v).replace(/^\/+/, ''));

const buildPool = () => {
  const manual = JSON.parse(fs.readFileSync(MANUAL_PATH, 'utf8'));
  const pool = new Map();
  for (const [slug, meta] of Object.entries(manual)) {
    const href = meta && meta.href;
    const image = meta && meta.image;
    if (!href || !image) continue;
    if (!/^https?:\/\//i.test(image) && !/\.\w{2,5}$/.test(image)) continue;
    pool.set(slug, {
      slug,
      name: meta.name || slug,
      href: RELOCATED[slug] || rootAsset(href),
      image: rootAsset(image)
    });
  }
  return pool;
};

const renderCard = (g) =>
  `          <a class="game-card" href="${esc(g.href)}"><img src="${esc(g.image)}" alt="${esc(g.name)} unblocked" loading="lazy" decoding="async"><h3>${esc(g.name)}</h3></a>`;

const renderPage = (page, pool) => {
  const url = `https://schplay.com/${page.slug}/`;
  const t = esc(page.title);
  const d = esc(page.metaDescription);

  const games = page.games.map((s) => pool.get(s)).filter(Boolean);
  const missing = page.games.filter((s) => !pool.has(s));

  const article = page.sections
    .map(
      (s) => `
    <section class="alt-section">
      <h2>${esc(s.h2)}</h2>
${s.paras.map((p) => `      <p>${esc(p)}</p>`).join('\n')}
    </section>`
    )
    .join('\n');

  const faqHtml = page.faqs
    .map(
      (f) => `        <div class="alt-faq-item">
          <h3>${esc(f.q)}</h3>
          <p>${esc(f.a)}</p>
        </div>`
    )
    .join('\n');

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: page.title,
      description: page.metaDescription,
      url,
      breadcrumb: {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://schplay.com/' },
          { '@type': 'ListItem', position: 2, name: page.title, item: url }
        ]
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: page.faqs.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a }
      }))
    }
  ];

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <link rel="stylesheet" href="/css/monocraft.css">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="index, follow">
    <meta name="description" content="${d}">
    <meta name="theme-color" content="#0f1a2a">
    <title>${t}</title>
    <link rel="canonical" href="${url}">
    <link rel="icon" href="/images/favicon.ico" sizes="any">
    <link rel="apple-touch-icon" href="/images/favicon-32x32.png">
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="Schplay">
    <meta property="og:title" content="${t}">
    <meta property="og:description" content="${d}">
    <meta property="og:url" content="${url}">
    <meta property="og:image" content="${OG_IMAGE}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${t}">
    <meta name="twitter:description" content="${d}">
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

        .alt-intro h1 {
            font-size: clamp(1.6rem, 3vw, 2.3rem);
            line-height: 1.15;
            margin: 0 0 12px;
            color: #fff;
            letter-spacing: -0.01em;
        }
        .alt-intro p { margin: 0; color: #cdd9e6; font-size: 1.05rem; line-height: 1.65; max-width: 72ch; }

        .alt-section { margin-top: 30px; }
        .alt-section h2 { font-size: 1.25rem; margin: 0 0 12px; color: #fff; }
        .alt-section p { color: #b9c8d8; line-height: 1.75; margin: 0 0 14px; max-width: 72ch; }

        .alt-games { margin-top: 34px; }
        .alt-games h2 { font-size: 1.25rem; margin: 0 0 14px; color: #fff; }

        .alt-faq { margin-top: 34px; }
        .alt-faq h2 { font-size: 1.25rem; margin: 0 0 16px; color: #fff; }
        .alt-faq-item { margin-bottom: 18px; }
        .alt-faq-item h3 { font-size: 1rem; margin: 0 0 6px; color: #dbe6f2; }
        .alt-faq-item p { color: #b9c8d8; line-height: 1.7; margin: 0; max-width: 72ch; }

        .alt-cta { margin: 30px 0 0; }
        .alt-cta a { color: #2f9bff; text-decoration: none; font-weight: 700; }
        .alt-cta a:hover { text-decoration: underline; }
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
      <span aria-current="page">${esc(page.name)} Alternative</span>
    </nav>

    <div class="alt-intro">
      <h1>${t}</h1>
      <p>${esc(page.intro)}</p>
    </div>

    <section class="alt-games" aria-labelledby="alt-games-title">
      <h2 id="alt-games-title">Play these right now</h2>
      <nav class="games-grid" aria-label="Games you can play now">
${games.map(renderCard).join('\n')}
      </nav>
    </section>
${article}

    <section class="alt-faq" aria-labelledby="alt-faq-title">
      <h2 id="alt-faq-title">${esc(page.name)}: common questions</h2>
${faqHtml}
    </section>

    <section class="games-grid-section" aria-labelledby="alt-recs-title">
      <div class="section-header">
        <h2 id="alt-recs-title">Players Also Enjoy</h2>
        <span id="alt-recs-count" class="games-count" aria-live="polite"></span>
      </div>
      <div class="games-grid" id="alt-recs" aria-live="polite"></div>
    </section>

    <p class="alt-cta"><a href="/">Browse all ${GAME_COUNT} unblocked games →</a></p>
  </main>

  <footer id="site-footer" role="contentinfo">
    <div id="footer-placeholder"></div>
  </footer>

  <script>
    const RECOMMENDATION_COUNT = 12;

    const resolvePath = (path) => {
      if (!path) return path;
      if (/^(?:https?:)?\\/\\//.test(path) || path.startsWith('/')) return path;
      const resolver = window.SCHPLAY_RESOLVE_ASSET_PATH;
      if (typeof resolver === 'function') return resolver(path);
      return '/' + path;
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
      if (hasRenderedRecommendations) return;

      const grid = document.getElementById('alt-recs');
      const count = document.getElementById('alt-recs-count');
      if (!grid) return;

      const catalog = (window.SCHPLAY_GAMES && window.SCHPLAY_GAMES.list) || [];
      if (!Array.isArray(catalog) || !catalog.length) return;

      const eligibleGames = catalog.filter(({ name, href, img }) => name && href && img);
      const selection = eligibleGames.length
        ? pickRandomGames(eligibleGames, Math.min(RECOMMENDATION_COUNT, eligibleGames.length))
        : [];

      grid.innerHTML = '';
      selection.forEach(({ name, href, img }) => {
        const card = document.createElement('a');
        card.className = 'game-card';
        card.href = resolvePath(href);
        card.innerHTML = '<img  src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==" data-src="' + resolvePath(img) + '" alt="' + name + '" loading="lazy" decoding="async"><h3>' + name + '</h3>';
        grid.appendChild(card);
      });

      if (count) count.textContent = selection.length ? selection.length + ' games' : '';

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
  </script>
  <script src="/js/load-components.js?v=${COMPONENT_VERSION}" defer data-component-root="/"></script>
  <script src="/js/lazy-media.js" defer></script>
</body>
</html>
`;

  const words = page.intro.split(/\s+/).length +
    page.sections.reduce((n, s) => n + s.paras.join(' ').split(/\s+/).length, 0) +
    page.faqs.reduce((n, f) => n + (f.q + ' ' + f.a).split(/\s+/).length, 0);

  return { html, games: games.length, missing, words };
};

const main = () => {
  const pool = buildPool();
  for (const page of PAGES) {
    const { html, games, missing, words } = renderPage(page, pool);
    const dir = path.join(ROOT, page.slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), html);
    let line = `  ${page.slug.padEnd(30)} ${String(games).padStart(2)} games  ${String(words).padStart(4)} words`;
    if (missing.length) line += `   MISSING: ${missing.join(', ')}`;
    console.log(line);
  }
};

main();
