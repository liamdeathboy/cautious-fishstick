document.addEventListener('DOMContentLoaded', function() {
    const navLinks = {
        'Strategy': [
            { name: 'Antbuster', href: 'games/antbuster.html', imgSrc: 'images/antbuster.webp' },
            { name: 'Bloons TD5', href: 'games/bloonstd5.html', imgSrc: 'images/btd5.webp' },
            { name: 'Mr Mine', href: 'games/mrmine.html', imgSrc: 'images/mrmine.webp' },
            { name: 'Minecraft Tower Defense', href: 'games/minecraft-tower-defence.html', imgSrc: 'images/minecrafttowerdefense.webp' },
            { name: 'Sort the Court', href: 'games/sort-the-court.html', imgSrc: 'images/sortthecourt.webp' }
        ],
        'Skill': [
            { name: '10 Minutes Till Dawn', href: 'games/10-minutes-till-dawn.html', imgSrc: 'images/10mintilldawn.webp' },
            { name: 'Ace Gangster', href: 'games/acegangster.html', imgSrc: 'images/acegangster.webp' },
            { name: 'Curve Ball', href: 'games/curveball.html', imgSrc: 'images/curveball.webp' },
            { name: 'Gunspin', href: 'games/gunspin.html', imgSrc: 'images/gunspin.webp' },
            { name: 'OvO', href: 'games/ovo.html', imgSrc: 'images/ovo.webp' }
        ],
        'Numbers': [
            { name: '2048', href: 'games/2048.html', imgSrc: 'images/2048.webp' },
            { name: 'Bejeweled 2', href: 'games/bejeweled2.html', imgSrc: 'images/bejeweled2.webp' },
            { name: 'Block Blast', href: 'games/blockblast.html', imgSrc: 'images/blockblast.webp' },
            { name: 'Minesweeper', href: 'games/minesweeper.html', imgSrc: 'images/minesweeper.webp' },
            { name: 'Pool', href: 'games/pool.html', imgSrc: 'images/pool.webp' }
        ],
        'Classic': [
            { name: 'Bad Time Simulator', href: 'games/bad-time-simulator.html', imgSrc: 'images/badtimesimulator.webp' },
            { name: 'Cat Mario', href: 'games/catmario.html', imgSrc: 'images/catmario.webp' },
            { name: 'Club Penguin', href: 'games/clubpenguin.html', imgSrc: 'images/clubpenguin.webp' },
            { name: 'DBZ Devolution', href: 'games/dbz.html', imgSrc: 'images/dbz.webp' },
            { name: 'Pacman', href: 'games/pacman.html', imgSrc: 'images/pacman.webp' }
        ],
        '2 Player': [
            { name: 'Getaway Shootout', href: 'games/getaway-shootout.html', imgSrc: 'images/getawayshootout.webp' },
            { name: 'Gun Mayhem', href: 'games/gun-mayhem.html', imgSrc: 'images/gunmayhem.webp' },
            { name: 'House of Hazards', href: 'games/houseofhazards.html', imgSrc: 'images/houseofhazards.webp' },
            { name: 'Rooftop Snipers', href: 'games/rooftopsnipers.html', imgSrc: 'images/rooftopsnipers.webp' },
            { name: 'Fireboy and Watergirl', href: 'games/fireboy-and-watergirl-firetemple.html', imgSrc: 'images/fireboyandwatergirl.webp' }
        ],
        'Sports': [
            { name: 'Drive Mad', href: 'games/drivemad.html', imgSrc: 'images/drivemad.webp' },
            { name: 'Dune Buggy', href: 'games/dunebuggy.html', imgSrc: 'images/dunebuggy.webp' },
            { name: 'Soccer Random', href: 'games/soccer-random.html', imgSrc: 'images/soccerrandom.webp' },
            { name: 'Pool', href: 'games/pool.html', imgSrc: 'images/pool.webp' },
            { name: 'Curve Ball', href: 'games/curveball.html', imgSrc: 'images/curveball.webp' }
        ],
        'Logic': [
            { name: 'Idle Breakout', href: 'games/idle-breakout.html', imgSrc: 'images/idlebreakout.webp' },
            { name: 'Bloxors', href: 'games/bloxors.html', imgSrc: 'images/bloxors.webp' },
            { name: 'Minesweeper', href: 'games/minesweeper.html', imgSrc: 'images/minesweeper.webp' },
            { name: 'Pandemic 2', href: 'games/pandemic2.html', imgSrc: 'images/pandemic2.webp' },
            { name: 'Riddle School', href: 'games/riddleschool-all-games.html', imgSrc: 'images/riddleschool.webp' }
        ],
        'Multiplayer': [
            { name: 'Slither.io', href: 'games/slitherio.html', imgSrc: 'images/slitherio.webp' },
            { name: 'Hole.io', href: 'games/holeio.html', imgSrc: 'images/holeio.webp' },
            { name: 'Agar.io', href: 'games/agario.html', imgSrc: 'images/agario.webp' },
            { name: 'Gun Mayhem', href: 'games/gun-mayhem.html', imgSrc: 'images/gunmayhem.webp' },
            { name: 'Rooftop Snipers', href: 'games/rooftopsnipers.html', imgSrc: 'images/rooftopsnipers.webp' }
        ]
    };

    const navElements = document.querySelectorAll('.header-nav ul li a');

    navElements.forEach(navElement => {
        const category = navElement.childNodes[0].textContent.trim();
        const games = navLinks[category];

        if (games) {
            const dropdown = document.createElement('div');
            dropdown.classList.add('nav-dropdown');

            games.slice(0, 5).forEach(game => {
                const gameLink = document.createElement('a');
                gameLink.href = game.href;
                gameLink.classList.add('nav-dropdown-item');
                gameLink.innerHTML = `<img src="${game.imgSrc}" alt="${game.name}"><span>${game.name}</span>`;
                dropdown.appendChild(gameLink);
            });

            const viewAll = document.createElement('a');
            viewAll.href = `${category.toLowerCase()}.html`;
            viewAll.classList.add('view-all-button');
            viewAll.textContent = `View All ${category}`;
            dropdown.appendChild(viewAll);

            navElement.parentElement.appendChild(dropdown);

            navElement.parentElement.addEventListener('mouseenter', () => {
                dropdown.style.display = 'block';
            });

            navElement.parentElement.addEventListener('mouseleave', () => {
                dropdown.style.display = 'none';
            });
        }
    });
});
