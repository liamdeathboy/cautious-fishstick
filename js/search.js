document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchResultsContainer = document.createElement('div');
    searchResultsContainer.id = 'searchResults';
    searchInput.parentElement.appendChild(searchResultsContainer);

    const games = [
    { name: 'Deep Freeze', href: 'games/deep-freeze.html', imgSrc: 'images/deepfreeze.webp' },
    { name: 'Doodle Jump', href: 'games/doodlejump.html', imgSrc: 'images/doodlejump.webp' },
    { name: 'Duck Life 3', href: 'games/duck-life-3.html', imgSrc: 'images/ducklife3.webp' },
    { name: 'Duck Life 5', href: 'games/duck-life-5.html', imgSrc: 'images/ducklife5.webp' },
    { name: 'Duck Hunt', href: 'games/duckhunt.html', imgSrc: 'images/duckhunt.webp' },
    { name: 'Duck Life 2', href: 'games/ducklife2.html', imgSrc: 'images/ducklife2.webp' },
    { name: 'Dune Buggy', href: 'games/dunebuggy.html', imgSrc: 'images/dunebuggy.webp' },
    { name: 'Electric Man 2', href: 'games/electric-man-2.html', imgSrc: 'images/electricman2.webp' },
    { name: 'Fireboy and Watergirl Fire Temple', href: 'games/fireboy-and-watergirl-firetemple.html', imgSrc: 'images/fireboywatergirlfiretemple.webp' },
    { name: 'Flappy 2048', href: 'games/flappy-2048.html', imgSrc: 'images/flappy2048.webp' },
    { name: 'Flappy Bird', href: 'games/flappy-bird.html', imgSrc: 'images/flappybird.webp' },
    { name: 'Bad Time Simulator', href: 'games/bad-time-simulator.html', imgSrc: 'images/badtimesimulator.webp' },
    { name: 'Bejeweled 2', href: 'games/bejeweled2.html', imgSrc: 'images/bejeweled2.webp' },
    { name: 'Bloxors', href: 'games/bloxors.html', imgSrc: 'images/bloxors.webp' },
    { name: 'Cat Mario', href: 'games/catmario.html', imgSrc: 'images/catmario.webp' },
    { name: 'Club Penguin', href: 'games/clubpenguin.html', imgSrc: 'images/clubpenguin.webp' },
    { name: 'Curveball', href: 'games/curveball.html', imgSrc: 'images/curveball.webp' },
    { name: 'Antbuster', href: 'games/antbuster.html', imgSrc: 'images/antbuster.webp' },
    { name: 'Arcade Wizard', href: 'games/arcade-wizard.html', imgSrc: 'images/arcadewizard.webp' },
    { name: 'Bad Ice Cream 1', href: 'games/bad-icecream-1.html', imgSrc: 'images/badicecream1.webp' },
    { name: 'Bad Ice Cream 2', href: 'games/bad-icecream-2.html', imgSrc: 'images/badicecream2.webp' },
    { name: 'Bad Ice Cream 3', href: 'games/bad-icecream-3.html', imgSrc: 'images/badicecream3.webp' },
    { name: 'Agar.io', href: 'games/agario.html', imgSrc: 'images/agario.webp' },
    { name: 'Angry Birds Halloween', href: 'games/angrybirdshalloween.html', imgSrc: 'images/angrybirdshalloween.webp' },
    { name: 'Ace Gangster', href: 'games/acegangster.html', imgSrc: 'images/acegangster.webp' },
    { name: '10 Minutes Till Dawn', href: 'games/10-minutes-till-dawn.html', imgSrc: 'images/10mintilldawn.webp' },
    { name: '1v1.lol', href: 'games/1v1lol.html', imgSrc: 'https://play-lh.googleusercontent.com/QYGRIDJbyVO7L7jH8CwiKJ4NumTGgcTVqU3ITooLWxro-eeNns1RZ0uwGGFe-r8M4co' },
    { name: 'Slope', href: 'games/slope.html', imgSrc: 'images/slope.webp' },
    { name: 'Retro Bowl [New Verison]', href: 'games/retrobowl.html', imgSrc: 'images/retrobowl.webp' },
    { name: 'Block Blast', href: 'games/blockblast.html', imgSrc: 'images/blockblast.webp' },
    { name: 'Idle Breakout', href: 'games/idle-breakout.html', imgSrc: 'images/idlebreakout.webp' },
    { name: 'Gunspin', href: 'games/gunspin.html', imgSrc: 'images/gunspin.webp' },
    { name: 'Learn To Fly', href: 'games/learntofly.html', imgSrc: 'games/learntofly/icon.png' },
    { name: 'Learn To Fly 2', href: 'games/learntofly2.html', imgSrc: 'images/learntofly2.webp' },
    { name: 'Learn To Fly 3', href: 'games/learntofly3.html', imgSrc: 'images/learntofly3.webp' },
    { name: 'House Of Hazards', href: 'games/houseofhazards.html', imgSrc: 'images/houseofhazards.webp' },
    { name: 'Hole.io', href: 'games/holeio.html', imgSrc: 'images/holeio.webp' },
    { name: 'Cut The Rope', href: 'games/cut-the-rope.html', imgSrc: 'images/cuttherope.webp' },
    { name: 'Tank Trouble', href: 'games/tanktrouble.html', imgSrc: 'images/tanktrouble.webp' },
    { name: 'Drift Hunters', href: 'games/drifthunters.html', imgSrc: 'images/drifthunters.webp' },
    { name: 'Volley Random', href: 'games/volleyrandom.html', imgSrc: 'images/volleyrandom.webp' },
    { name: 'Draw The Hill', href: 'games/draw-the-hill.html', imgSrc: 'images/drawthehill.webp' },
    { name: 'Getaway Shootout', href: 'games/getaway-shootout.html', imgSrc: 'images/getawayshootout.webp' },
    { name: 'Crossy Road', href: 'games/crossyroad.html', imgSrc: 'images/crossyroad.webp' },
    { name: 'Rooftop Sniper', href: 'games/rooftopsnipers.html', imgSrc: 'images/rooftopsnipers.webp' },
    { name: 'Boxing Random', href: 'games/boxingrandom.html', imgSrc: 'images/boxingrandom.webp' },
    { name: 'Adventure Capitalist', href: 'games/adventurecapitalist.html', imgSrc: 'images/adventurecapitalist.webp' },
    { name: 'Hide & Smash', href: 'games/hideandsmash.html', imgSrc: 'images/hideandsmash.webp' },
    { name: 'MonkeyMart', href: 'games/monkey-mart.html', imgSrc: 'images/monkeymart.webp' },
    { name: 'Retro Bowl College FIXED!', href: 'games/rb-college.html', imgSrc: 'images/retrobowlcollege.webp' },
    { name: 'Minecraft (Eagler)', href: 'games/minecraft.html', imgSrc: 'images/mc.webp' },
    { name: 'Bloons TD5', href: 'games/bloonstd5.html', imgSrc: 'images/btd5.webp' },
    { name: 'Mr Mine', href: 'games/mrmine.html', imgSrc: 'images/mrmine.webp' },
    { name: 'Run 2', href: 'games/run2.html', imgSrc: 'images/run2.webp' },
    { name: 'Run 3', href: 'games/run3.html', imgSrc: 'images/run3.webp' },
    { name: 'Spend Elon\'s Money', href: 'games/spending-elonmusk-money.html', imgSrc: 'images/elonmusk.webp' },
    { name: 'Plants V Zombies (Full)', href: 'games/pvz.html', imgSrc: 'images/pvz.webp' },
    { name: 'Mine Sweeper', href: 'games/minesweeper.html', imgSrc: 'images/minesweeper.webp' },
    { name: 'Pixel Gun', href: 'games/pixelgun.html', imgSrc: 'images/pixelgun.webp' },
    { name: 'Google Snake', href: 'games/googlesnake.html', imgSrc: 'images/googlesnake.webp' },
    { name: 'N Gon', href: 'games/ngon.html', imgSrc: 'images/ngon.webp' },
    { name: 'OVO', href: 'games/ovo.html', imgSrc: 'images/ovo.webp' },
    { name: 'Basketball Stars', href: 'games/basketballstars.html', imgSrc: 'images/basketballstars.webp' },
    { name: 'Stacktris', href: 'games/stacktris.html', imgSrc: 'images/stacktris.webp' },
    { name: 'FNAF', href: 'games/fnaf.html', imgSrc: 'images/fnaf.webp' },
    { name: 'DBZ Devolution', href: 'games/dbz.html', imgSrc: 'images/dbz.webp' },
    { name: 'Drive Mad', href: 'games/drivemad.html', imgSrc: 'images/drivemad.webp' },
    { name: 'Papa\'s Games', href: 'games/papas-games.html', imgSrc: 'images/papasgame.webp' },
    { name: 'Stickman Games', href: 'games/henry-stickman.html', imgSrc: 'https://cdn2.steamgriddb.com/icon/9f61408e3afb633e50cdf1b20de6f466.png' },
    { name: 'Vex\'s Games', href: 'games/vex.html', imgSrc: 'https://play-lh.googleusercontent.com/0OnVFzHIMuLLeMjvACoNzxRbungfOH1zH4hUWQnIg5KfM2va_mFssFuRGq26WqWA' },
    { name: '2048', href: 'games/2048.html', imgSrc: 'images/2048.webp' },
    { name: 'Paper.io 2', href: 'games/paperio2.html', imgSrc: 'images/paperio2.webp' },
    { name: '1', href: 'games/2048.html', imgSrc: 'images/2048_logo.svg.png' },
    { name: 'Subway Surfers', href: 'games/subwaysurfer.html', imgSrc: 'https://img.poki.com/cdn-cgi/image/quality=78,width=314,height=314,fit=cover,f=auto/81a0a3f18cf0ee129e56edb50fc52c3b.png' },
    { name: 'Soccer Random', href: 'games/soccer-random.html', imgSrc: 'https://play-lh.googleusercontent.com/G1PIlb6HWKSaDre0XpUcmKGps9T4iamsSlwrogB3EJzYv4bz0M2am4D17MtGzndaOOU' },
    { name: 'MotoX3M Games', href: 'games/motox3m.html', imgSrc: 'images/motocross.webp' },
    { name: 'Cookie Clicker', href: 'games/cookieclicker.html', imgSrc: 'https://play-lh.googleusercontent.com/Z1MOuuiD05ZN5LkVmMEvKF0mqAc-FknaQ2j8s4dZiO-LSPQX4EEA3RVJdlQEtxe96ok' },
    { name: 'CSGO Case Opener', href: 'games/csgo-clicker.html', imgSrc: 'images/csgoclicker.webp' },
    { name: 'Crossy Road', href: 'games/crossyroad.html', imgSrc: 'https://upload.wikimedia.org/wikipedia/en/7/71/Crossy_Road_icon.jpeg' },
    { name: 'Temple Run 2', href: 'games/templerun2.html', imgSrc: 'https://play-lh.googleusercontent.com/go4XqS4mYs-G2tZymiVLF4wJYXIi5QrvwixNRzssk4G_vRBHrAdg4E1ddNwy9c2cZA' },
    { name: 'Stickman Golf', href: 'games/stickmangolf.html', imgSrc: 'https://image.spreadshirtmedia.com/image-server/v1/products/T1459A839PA3861PT28D12687618W6161H10000/views/1,width=550,height=550,appearanceId=839,backgroundColor=F2F2F2/golf-stickman-sticker.webp' },
    { name: 'Pandemic 2', href: 'games/pandemic2.html', imgSrc: 'images/pandemic2.webp' },
    { name: 'Riddle School Games', href: 'games/riddleschool-all-games.html', imgSrc: 'https://i.ytimg.com/vi/Ls5rT-7_4d4/sddefault.jpg' },
    { name: 'Cupcake 2048', href: 'games/cupcake2048.html', imgSrc: 'images/cupcake2048.webp' },
    { name: 'Jetpack Joyride', href: 'games/jetpack-joyride.html', imgSrc: 'images/jetpackjoyride.webp' },
    { name: 'Geometry Dash', href: 'games/geodash.html', imgSrc: 'images/geodash.webp' },
    { name: 'Duck Life 1', href: 'games/ducklife1.html', imgSrc: 'images/ducklife1.webp' },
    { name: 'Friday Night Funkin', href: 'games/friday-night-funkin.html', imgSrc: 'images/fridaynightfunkin.webp' },
    { name: 'Galaga', href: 'games/galaga.html', imgSrc: 'images/galaga.webp' },
    { name: 'Gravity Guy', href: 'games/gravityguy.html', imgSrc: 'images/gravityguy.webp' },
    { name: 'Gun Mayhem', href: 'games/gunmayhem.html', imgSrc: 'images/gunmayhem.webp' },
    { name: 'Gyroball', href: 'games/gyroball.html', imgSrc: 'images/gyroball.webp' },
    { name: 'Happy Wheels', href: 'games/happy-wheels.html', imgSrc: 'images/happywheels.webp' },
    { name: 'Henry Stickman: Full Collection', href: 'games/henry-stickman.html', imgSrc: 'images/henrystickman.webp' },
    { name: 'Idle Shark', href: 'games/idle-shark.html', imgSrc: 'images/idleshark.webp' },
    { name: 'Marippy', href: 'games/marippy.html', imgSrc: 'images/marippy.webp' },
    { name: 'Minecraft Tower Defense', href: 'games/minecraft-tower-defence.html', imgSrc: 'images/minecrafttowerdefense.webp' },
    { name: 'Minecraft Tower Defense 2', href: 'games/minecraft-tower-defence-2.html', imgSrc: 'images/minecrafttowerdefense2.webp' },
    { name: 'Motherload', href: 'games/motherload.html', imgSrc: 'images/motherload.webp' },
    { name: 'N Gon', href: 'games/ngon.html', imgSrc: 'images/ngon.webp' },
    { name: 'Oiligarchy', href: 'games/oiligarchy.html', imgSrc: 'images/oiligarchy.webp' },
    { name: 'Pacman', href: 'games/pacman.html', imgSrc: 'images/pacman.webp' },
    { name: 'Pacxon', href: 'games/pacxon.html', imgSrc: 'images/pacxon.webp' },
    { name: 'Pool', href: 'games/pool.html', imgSrc: 'images/pool.webp' },
    { name: 'Pregnancy Test', href: 'games/pregnancy-test.html', imgSrc: 'images/pregnancytest.webp' },
    { name: 'Shuffle', href: 'games/shuffle.html', imgSrc: 'images/shuffle.webp' },
    { name: 'Slither.io', href: 'games/slitherio.html', imgSrc: 'images/slitherio.webp' },
    { name: 'Snailiad', href: 'games/snailiad.html', imgSrc: 'images/snailiad.webp' },
    { name: 'Snake', href: 'games/snake.html', imgSrc: 'images/snake.webp' },
    { name: 'Snowline', href: 'games/snowline.html', imgSrc: 'images/nowline.webp' },
    { name: 'Sort the Court', href: 'games/sort-the-court.html', imgSrc: 'images/sortthecourt.webp' },
    { name: 'Spelunky', href: 'games/spelunky.html', imgSrc: 'images/spelunky.webp' },
    { name: 'Steal This Election', href: 'games/stealthiselection.html', imgSrc: 'images/stealthiselection.webp' },
    { name: 'Supersonic', href: 'games/super-sonic.html', imgSrc: 'images/supersonic.webp' },
    { name: 'Super Mario 63', href: 'games/supermario63.html', imgSrc: 'images/supermario63.webp' },
    { name: 'Swords and Sandals 2', href: 'games/swords-and-sandals-2.html', imgSrc: 'images/swordsandsandals2.webp' },
    { name: 'Tetris', href: 'games/tetris.html', imgSrc: 'images/tetris.webp' },
    { name: 'The Big Adventure of Owata\'s Life', href: 'games/the-big-adventure-of-owatas-life.html', imgSrc: 'images/thebigadventureofowataslife.webp' },
    { name: 'The Binding of Isaac', href: 'games/the-binding-of-isaac.html', imgSrc: 'images/thebindingofisaac.webp' },
    { name: 'Tower Blaster', href: 'games/towerblaster.html', imgSrc: 'images/towerblaster.webp' },
    { name: 'Tower Master', href: 'games/towermaster.html', imgSrc: 'images/towermaster.webp' },
    { name: 'World\'s Hardest Game', href: 'games/worldshardestgame.html', imgSrc: 'images/worldshardestgame.webp' },
    { name: 'World\'s Hardest Game 2', href: 'games/worldshardestgame2.html', imgSrc: 'images/worldshardestgame2.webp' },
    { name: 'Undertale (Demo)', href: 'games/undertale(demo).html', imgSrc: 'images/undertale.webp' },
    { name: 'Undertale: Rejuvenation Mod', href: 'games/Rejuvenation.html', imgSrc: 'images/rejuvenation.webp' },
    { name: 'Last Breath Trio Mod', href: 'games/LastBreathTrio.html', imgSrc: 'images/lastbreathtrio.webp' },
    { name: 'The Final Experiment Mod', href: 'games/TheFinalExperiment.html', imgSrc: 'images/thefinalexperiment.webp' },
    ];

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        searchResultsContainer.innerHTML = '';

        if (searchTerm.length === 0) {
            searchResultsContainer.style.display = 'none';
            return;
        }

        const filteredGames = games.filter(game => game.name.toLowerCase().includes(searchTerm));

        if (filteredGames.length > 0) {
            searchResultsContainer.style.display = 'block';
            filteredGames.forEach(game => {
                const gameElement = document.createElement('a');
                gameElement.href = game.href;
                gameElement.classList.add('search-result');
                gameElement.innerHTML = `
                    <img src="${game.imgSrc}" alt="${game.name}">
                    <span>${game.name}</span>
                `;
                searchResultsContainer.appendChild(gameElement);
            });

            const viewAllButton = document.createElement('a');
            viewAllButton.href = 'allgames.html';
            viewAllButton.classList.add('view-all-button');
            viewAllButton.textContent = 'View all games';
            searchResultsContainer.appendChild(viewAllButton);
        } else {
            searchResultsContainer.style.display = 'none';
        }
    });

    document.addEventListener('click', function(event) {
        if (!searchInput.contains(event.target)) {
            searchResultsContainer.style.display = 'none';
        }
    });
});
