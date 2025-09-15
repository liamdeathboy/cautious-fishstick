document.addEventListener('DOMContentLoaded', function() {
    const games = [
        { name: 'Deep Freeze', url: '../games/deep-freeze.html', img: 'images/deepfreeze.webp' },
        { name: 'Doodle Jump', url: '../games/doodlejump.html', img: 'images/doodlejump.webp' },
        { name: 'Duck Life 3', url: '../games/duck-life-3.html', img: 'images/ducklife3.webp' },
        { name: 'Duck Life 5', url: '../games/duck-life-5.html', img: 'images/ducklife5.webp' },
        { name: 'Duck Hunt', url: '../games/duckhunt.html', img: 'images/duckhunt.webp' },
        { name: 'Duck Life 2', url: '../games/ducklife2.html', img: 'images/ducklife2.webp' },
        { name: 'Dune Buggy', url: '../games/dunebuggy.html', img: 'images/dunebuggy.webp' },
        { name: 'Electric Man 2', url: '../games/electric-man-2.html', img: 'images/electricman2.webp' },
        { name: 'Fireboy and Watergirl Fire Temple', url: '../games/fireboy-and-watergirl-firetemple.html', img: 'images/fireboywatergirlfiretemple.webp' },
        { name: 'Flappy 2048', url: '../games/flappy-2048.html', img: 'images/flappy2048.webp' },
        { name: 'Flappy Bird', url: '../games/flappy-bird.html', img: 'images/flappybird.webp' },
        { name: 'Bad Time Simulator', url: '../games/bad-time-simulator.html', img: 'images/badtimesimulator.webp' },
        { name: 'Bejeweled 2', url: '../games/bejeweled2.html', img: 'images/bejeweled2.webp' },
        { name: 'Bloxors', url: '../games/bloxors.html', img: 'images/bloxors.webp' },
        { name: 'Cat Mario', url: '../games/catmario.html', img: 'images/catmario.webp' },
        { name: 'Club Penguin', url: '../games/clubpenguin.html', img: 'images/clubpenguin.webp' },
        { name: 'Curveball', url: '../games/curveball.html', img: 'images/curveball.webp' },
        { name: 'Antbuster', url: '../games/antbuster.html', img: 'images/antbuster.webp' },
        { name: 'Arcade Wizard', url: '../games/arcade-wizard.html', img: 'images/arcadewizard.webp' },
        { name: 'Bad Ice Cream 1', url: '../games/bad-icecream-1.html', img: 'images/badicecream1.webp' },
        { name: 'Bad Ice Cream 2', url: '../games/bad-icecream-2.html', img: 'images/badicecream2.webp' },
        { name: 'Bad Ice Cream 3', url: '../games/bad-icecream-3.html', img: 'images/badicecream3.webp' },
        { name: 'Agar.io', url: '../games/agario.html', img: 'images/agario.webp' },
        { name: 'Angry Birds Halloween', url: '../games/angrybirdshalloween.html', img: 'images/angrybirdshalloween.webp' },
        { name: 'Ace Gangster', url: '../games/acegangster.html', img: 'images/acegangster.webp' },
        { name: '10 Minutes Till Dawn', url: '../games/10-minutes-till-dawn.html', img: 'images/10mintilldawn.webp' },
        { name: '1v1.lol', url: '../games/1v1lol.html', img: 'https://play-lh.googleusercontent.com/QYGRIDJbyVO7L7jH8CwiKJ4NumTGgcTVqU3ITooLWxro-eeNns1RZ0uwGGFe-r8M4co' },
        { name: 'Slope', url: '../games/slope.html', img: 'images/slope.webp' },
        { name: 'Retro Bowl', url: '../games/retrobowl.html', img: 'images/retrobowl.webp' },
        { name: 'Block Blast', url: '../games/blockblast.html', img: 'images/blockblast.webp' },
        { name: 'Idle Breakout', url: '../games/idle-breakout.html', img: 'images/idlebreakout.webp' },
        { name: 'Gunspin', url: '../games/gunspin.html', img: 'images/gunspin.webp' },
        { name: 'Learn To Fly', url: '../games/learntofly.html', img: 'games/learntofly/icon.png' },
        { name: 'Learn To Fly 2', url: '../games/learntofly2.html', img: 'images/learntofly2.webp' },
        { name: 'Learn To Fly 3', url: '../games/learntofly3.html', img: 'images/learntofly3.webp' },
        { name: 'House Of Hazards', url: '../games/houseofhazards.html', img: 'images/houseofhazards.webp' },
        { name: 'Hole.io', url: '../games/holeio.html', img: 'images/holeio.webp' },
        { name: 'Cut The Rope', url: '../games/cut-the-rope.html', img: 'images/cuttherope.webp' },
        { name: 'Tank Trouble', url: '../games/tanktrouble.html', img: 'images/tanktrouble.webp' },
        { name: 'Drift Hunters', url: '../games/drifthunters.html', img: 'images/drifthunters.webp' },
        { name: 'Volley Random', url: '../games/volleyrandom.html', img: 'images/volleyrandom.webp' },
        { name: 'Draw The Hill', url: '../games/draw-the-hill.html', img: 'images/drawthehill.webp' },
        { name: 'Getaway Shootout', url: '../games/getaway-shootout.html', img: 'images/getawayshootout.webp' },
        { name: 'Crossy Road', url: '../games/crossyroad.html', img: 'images/crossyroad.webp' },
        { name: 'Rooftop Sniper', url: '../games/rooftopsnipers.html', img: 'images/rooftopsnipers.webp' },
        { name: 'Boxing Random', url: '../games/boxingrandom.html', img: 'images/boxingrandom.webp' },
        { name: 'Adventure Capitalist', url: '../games/adventurecapitalist.html', img: 'images/adventurecapitalist.webp' },
        { name: 'Hide & Smash', url: '../games/hideandsmash.html', img: 'images/hideandsmash.webp' },
        { name: 'MonkeyMart', url: '../games/monkey-mart.html', img: 'images/monkeymart.webp' },
        { name: 'Retro Bowl College FIXED!', url: '../games/rb-college.html', img: 'images/retrobowlcollege.webp' },
        { name: 'Minecraft (Eagler)', url: '../games/minecraft.html', img: 'images/mc.webp' },
        { name: 'Bloons TD5', url: '../games/bloonstd5.html', img: 'images/btd5.webp' },
        { name: 'Mr Mine', url: '../games/mrmine.html', img: 'images/mrmine.webp' },
        { name: 'Run 2', url: '../games/run2.html', img: 'images/run2.webp' },
        { name: 'Run 3', url: '../games/run3.html', img: 'images/run3.webp' },
        { name: 'Spend Elon\'s Money', url: '../games/spending-elonmusk-money.html', img: 'images/elonmusk.webp' },
        { name: 'Plants V Zombies (Full)', url: '../games/pvz.html', img: 'images/pvz.webp' },
        { name: 'Mine Sweeper', url: '../games/minesweeper.html', img: 'images/minesweeper.webp' },
        { name: 'Pixel Gun', url: '../games/pixelgun.html', img: 'images/pixelgun.webp' },
        { name: 'Google Snake', url: '../games/googlesnake.html', img: 'images/googlesnake.webp' },
        { name: 'N Gon', url: '../games/ngon.html', img: 'images/ngon.webp' },
        { name: 'OVO', url: '../games/ovo.html', img: 'images/ovo.webp' },
        { name: 'Basketball Stars', url: '../games/basketballstars.html', img: 'images/basketballstars.webp' },
        { name: 'Stacktris', url: '../games/stacktris.html', img: 'images/stacktris.webp' },
        { name: 'FNAF', url: '../games/fnaf.html', img: 'images/fnaf.webp' },
        { name: 'DBZ Devolution', url: '../games/dbz.html', img: 'images/dbz.webp' },
        { name: 'Drive Mad', url: '../games/drivemad.html', img: 'images/drivemad.webp' },
        { name: 'Papa\'s Games', url: '../games/papas-games.html', img: 'images/papasgame.webp' },
        { name: 'Stickman Games', url: '../games/henry-stickman.html', img: 'https://cdn2.steamgriddb.com/icon/9f61408e3afb633e50cdf1b20de6f466.png' },
        { name: 'Vex\'s Games', url: '../games/vex.html', img: 'https://play-lh.googleusercontent.com/0OnVFzHIMuLLeMjvACoNzxRbungfOH1zH4hUWQnIg5KfM2va_mFssFuRGq26WqWA' },
        { name: '2048', url: '../games/2048.html', img: 'images/2048.webp' },
        { name: 'Paper.io 2', url: '../games/paperio2.html', img: 'images/paperio2.webp' },
        { name: 'Subway Surfers', url: '../games/subwaysurfer.html', img: 'https://img.poki.com/cdn-cgi/image/quality=78,width=314,height=314,fit=cover,f=auto/81a0a3f18cf0ee129e56edb50fc52c3b.png' },
        { name: 'Soccer Random', url: '../games/soccer-random.html', img: 'https://play-lh.googleusercontent.com/G1PIlb6HWKSaDre0XpUcmKGps9T4iamsSlwrogB3EJzYv4bz0M2am4D17MtGzndaOOU' },
        { name: 'MotoX3M Games', url: '../games/motox3m.html', img: 'images/motocross.webp' },
        { name: 'Cookie Clicker', url: '../games/cookieclicker.html', img: 'https://play-lh.googleusercontent.com/Z1MOuuiD05ZN5LkVmMEvKF0mqAc-FknaQ2j8s4dZiO-LSPQX4EEA3RVJdlQEtxe96ok' },
        { name: 'CSGO Case Opener', url: '../games/csgo-clicker.html', img: 'images/csgoclicker.webp' },
        { name: 'Crossy Road', url: '../games/crossyroad.html', img: 'https://upload.wikimedia.org/wikipedia/en/7/71/Crossy_Road_icon.jpeg' },
        { name: 'Temple Run 2', url: '../games/templerun2.html', img: 'https://play-lh.googleusercontent.com/go4XqS4mYs-G2tZymiVLF4wJYXIi5QrvwixNRzssk4G_vRBHrAdg4E1ddNwy9c2cZA' },
        { name: 'Stickman Golf', url: '../games/stickmangolf.html', img: 'https://image.spreadshirtmedia.com/image-server/v1/products/T1459A839PA3861PT28D12687618W6161H10000/views/1,width=550,height=550,appearanceId=839,backgroundColor=F2F2F2/golf-stickman-sticker.webp' },
        { name: 'Pandemic 2', url: '../games/pandemic2.html', img: 'images/pandemic2.webp' },
        { name: 'Riddle School Games', url: '../games/riddleschool-all-games.html', img: 'https://i.ytimg.com/vi/Ls5rT-7_4d4/sddefault.jpg' },
        { name: 'Cupcake 2048', url: '../games/cupcake2048.html', img: 'images/cupcake2048.webp' },
        { name: 'Jetpack Joyride', url: '../games/jetpack-joyride.html', img: 'images/jetpackjoyride.webp' },
        { name: 'Geometry Dash', url: '../games/geodash.html', img: 'images/geodash.webp' },
        { name: 'Duck Life 1', url: '../games/ducklife1.html', img: 'images/ducklife1.webp' },
        { name: 'Friday Night Funkin', url: '../games/friday-night-funkin.html', img: 'images/fridaynightfunkin.webp' },
        { name: 'Galaga', url: '../games/galaga.html', img: 'images/galaga.webp' },
        { name: 'Gravity Guy', url: '../games/gravityguy.html', img: 'images/gravityguy.webp' },
        { name: 'Gun Mayhem', url: '../games/gunmayhem.html', img: 'images/gunmayhem.webp' },
        { name: 'Gyroball', url: '../games/gyroball.html', img: 'images/gyroball.webp' },
        { name: 'Happy Wheels', url: '../games/happy-wheels.html', img: 'images/happywheels.webp' },
        { name: 'Henry Stickman: Full Collection', url: '../games/henry-stickman.html', img: 'images/henrystickman.webp' },
        { name: 'Idle Shark', url: '../games/idle-shark.html', img: 'images/idleshark.webp' },
        { name: 'Marippy', url: '../games/marippy.html', img: 'images/marippy.webp' },
        { name: 'Minecraft Tower Defense', url: '../games/minecraft-tower-defence.html', img: 'images/minecrafttowerdefense.webp' },
        { name: 'Minecraft Tower Defense 2', url: '../games/minecraft-tower-defence-2.html', img: 'images/minecrafttowerdefense2.webp' },
        { name: 'Motherload', url: '../games/motherload.html', img: 'images/motherload.webp' },
        { name: 'N Gon', url: '../games/ngon.html', img: 'images/ngon.webp' },
        { name: 'Oiligarchy', url: '../games/oiligarchy.html', img: 'images/oiligarchy.webp' },
        { name: 'Pacman', url: '../games/pacman.html', img: 'images/pacman.webp' },
        { name: 'Pacxon', url: '../games/pacxon.html', img: 'images/pacxon.webp' },
        { name: 'Pandemic 2', url: '../games/pandemic2.html', img: 'images/pandemic2.webp' },
        { name: 'Pool', url: '../games/pool.html', img: 'images/pool.webp' },
        { name: 'Pregnancy Test', url: '../games/pregnancy-test.html', img: 'images/pregnancytest.webp' },
        { name: 'Shuffle', url: '../games/shuffle.html', img: 'images/shuffle.webp' },
        { name: 'Slither.io', url: '../games/slitherio.html', img: 'images/slitherio.webp' },
        { name: 'Snailiad', url: '../games/snailiad.html', img: 'images/snailiad.webp' },
        { name: 'Snake', url: '../games/snake.html', img: 'images/snake.webp' },
        { name: 'Snowline', url: '../games/snowline.html', img: 'images/nowline.webp' },
        { name: 'Sort the Court', url: '../games/sort-the-court.html', img: 'images/sortthecourt.webp' },
        { name: 'Spelunky', url: '../games/spelunky.html', img: 'images/spelunky.webp' },
        { name: 'Steal This Election', url: '../games/stealthiselection.html', img: 'images/stealthiselection.webp' },
        { name: 'Supersonic', url: '../games/super-sonic.html', img: 'images/supersonic.webp' },
        { name: 'Super Mario 63', url: '../games/supermario63.html', img: 'images/supermario63.webp' },
        { name: 'Swords and Sandals 2', url: '../games/swords-and-sandals-2.html', img: 'images/swordsandsandals2.webp' },
        { name: 'Tetris', url: '../games/tetris.html', img: 'images/tetris.webp' },
        { name: 'The Big Adventure of Owata\'s Life', url: '../games/the-big-adventure-of-owatas-life.html', img: 'images/thebigadventureofowataslife.webp' },
        { name: 'The Binding of Isaac', url: '../games/the-binding-of-isaac.html', img: 'images/thebindingofisaac.webp' },
        { name: 'Tower Blaster', url: '../games/towerblaster.html', img: 'images/towerblaster.webp' },
        { name: 'Tower Master', url: '../games/towermaster.html', img: 'images/towermaster.webp' },
        { name: 'World\'s Hardest Game', url: '../games/worldshardestgame.html', img: 'images/worldshardestgame.webp' },
        { name: 'World\'s Hardest Game 2', url: '../games/worldshardestgame2.html', img: 'images/worldshardestgame2.webp' },
        { name: 'Undertale (Demo)', url: '../games/undertale(demo).html', img: 'images/undertale.webp' },
        { name: 'Undertale: Rejuvenation Mod', url: '../games/Rejuvenation.html', img: 'images/rejuvenation.webp' },
        { name: 'Last Breath Trio Mod', url: '../games/LastBreathTrio.html', img: 'images/lastbreathtrio.webp' },
        { name: 'The Final Experiment Mod', url: '../games/TheFinalExperiment.html', img: 'images/thefinalexperiment.webp' },
    ];

    const youMightLikeGrid = document.getElementById('you-might-like-grid');

    // Shuffle the games array
    const shuffledGames = games.sort(() => 0.5 - Math.random());

    // Get the first 20 games
    const selectedGames = shuffledGames.slice(0, 20);

    // Create and append the game cards
    selectedGames.forEach(game => {
        const gameCard = document.createElement('a');
        gameCard.href = game.url;
        gameCard.classList.add('game-card');
        gameCard.dataset.gif = game.gif || '';

        const img = document.createElement('img');
        img.src = game.img;
        img.alt = game.name;

        const h3 = document.createElement('h3');
        h3.textContent = game.name;

        gameCard.appendChild(img);
        gameCard.appendChild(h3);

        youMightLikeGrid.appendChild(gameCard);
    });
});
