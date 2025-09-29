(function() {
    const resolvePath = (path) => {
        const resolver = window.SCHPLAY_RESOLVE_ASSET_PATH;
        if (typeof resolver === 'function') {
            return resolver(path);
        }
        return path;
    };

    const navData = {
        strategy: [
            { name: 'Antbuster', href: 'games/antbuster.html', imgSrc: 'images/antbuster.webp' },
            { name: 'Bloons TD 5', href: 'games/bloonstd5.html', imgSrc: 'images/btd5.webp' },
            { name: 'Mr Mine', href: 'games/mrmine.html', imgSrc: 'images/mrmine.webp' },
            { name: 'Minecraft Tower Defense', href: 'games/minecraft-tower-defence.html', imgSrc: 'images/minecrafttowerdefense.webp' },
            { name: 'Sort the Court', href: 'games/sort-the-court.html', imgSrc: 'images/sortthecourt.webp' }
        ],
        skill: [
            { name: '10 Minutes Till Dawn', href: 'games/10-minutes-till-dawn.html', imgSrc: 'images/10mintilldawn.webp' },
            { name: 'Ace Gangster', href: 'games/acegangster.html', imgSrc: 'images/acegangster.webp' },
            { name: 'Curve Ball', href: 'games/curveball.html', imgSrc: 'images/curveball.webp' },
            { name: 'Gunspin', href: 'games/gunspin.html', imgSrc: 'images/gunspin.webp' },
            { name: 'OvO', href: 'games/ovo.html', imgSrc: 'images/ovo.webp' }
        ],
        numbers: [
            { name: '2048', href: 'games/2048.html', imgSrc: 'images/2048.webp' },
            { name: 'Bejeweled 2', href: 'games/bejeweled2.html', imgSrc: 'images/bejeweled2.webp' },
            { name: 'Block Blast', href: 'games/blockblast.html', imgSrc: 'images/blockblast.webp' },
            { name: 'Minesweeper', href: 'games/minesweeper.html', imgSrc: 'images/minesweeper.webp' },
            { name: 'Pool', href: 'games/pool.html', imgSrc: 'images/pool.webp' }
        ],
        classic: [
            { name: 'Bad Time Simulator', href: 'games/bad-time-simulator.html', imgSrc: 'images/badtimesimulator.webp' },
            { name: 'Cat Mario', href: 'games/catmario.html', imgSrc: 'images/catmario.webp' },
            { name: 'Club Penguin', href: 'games/clubpenguin.html', imgSrc: 'images/clubpenguin.webp' },
            { name: 'DBZ Devolution', href: 'games/dbz.html', imgSrc: 'images/dbz.webp' },
            { name: 'Pacman', href: 'games/pacman.html', imgSrc: 'images/pacman.webp' }
        ],
        twoPlayer: [
            { name: 'Getaway Shootout', href: 'games/getaway-shootout.html', imgSrc: 'images/getawayshootout.webp' },
            { name: 'Gun Mayhem', href: 'games/gun-mayhem.html', imgSrc: 'images/gunmayhem.webp' },
            { name: 'House of Hazards', href: 'games/houseofhazards.html', imgSrc: 'images/houseofhazards.webp' },
            { name: 'Rooftop Snipers', href: 'games/rooftopsnipers.html', imgSrc: 'images/rooftopsnipers.webp' },
            { name: 'Fireboy and Watergirl', href: 'games/fireboy-and-watergirl-firetemple.html', imgSrc: 'images/fireboyandwatergirl.webp' }
        ],
        sports: [
            { name: 'Drive Mad', href: 'games/drivemad.html', imgSrc: 'images/drivemad.webp' },
            { name: 'Dune Buggy', href: 'games/dunebuggy.html', imgSrc: 'images/dunebuggy.webp' },
            { name: 'Soccer Random', href: 'games/soccer-random.html', imgSrc: 'images/soccerrandom.webp' },
            { name: 'Pool', href: 'games/pool.html', imgSrc: 'images/pool.webp' },
            { name: 'Curve Ball', href: 'games/curveball.html', imgSrc: 'images/curveball.webp' }
        ],
        logic: [
            { name: 'Idle Breakout', href: 'games/idle-breakout.html', imgSrc: 'images/idlebreakout.webp' },
            { name: 'Bloxors', href: 'games/bloxors.html', imgSrc: 'images/bloxors.webp' },
            { name: 'Minesweeper', href: 'games/minesweeper.html', imgSrc: 'images/minesweeper.webp' },
            { name: 'Pandemic 2', href: 'games/pandemic2.html', imgSrc: 'images/pandemic2.webp' },
            { name: 'Riddle School', href: 'games/riddleschool-all-games.html', imgSrc: 'images/riddleschool.webp' }
        ],
        multiplayer: [
            { name: 'Slither.io', href: 'games/slitherio.html', imgSrc: 'images/slitherio.webp' },
            { name: 'Hole.io', href: 'games/holeio.html', imgSrc: 'images/holeio.webp' },
            { name: 'Agar.io', href: 'games/agario.html', imgSrc: 'images/agario.webp' },
            { name: 'Gun Mayhem', href: 'games/gun-mayhem.html', imgSrc: 'images/gunmayhem.webp' },
            { name: 'Rooftop Snipers', href: 'games/rooftopsnipers.html', imgSrc: 'images/rooftopsnipers.webp' }
        ]
    };

    const isTouchInput = () => window.matchMedia('(hover: none), (pointer: coarse)').matches;

    const initDropdowns = () => {
        const navElements = document.querySelectorAll('.nav-link[data-category]');

        if (!navElements.length) {
            return;
        }

        navElements.forEach(navElement => {
            const categoryKey = navElement.dataset.category;
            const games = navData[categoryKey];
            const parentItem = navElement.closest('.nav-item');

            if (!games || !parentItem) {
                return;
            }

            parentItem.classList.add('has-dropdown');

            const dropdown = document.createElement('div');
            dropdown.classList.add('nav-dropdown');
            dropdown.hidden = true;
            dropdown.setAttribute('role', 'menu');

            games.slice(0, 5).forEach(game => {
                const gameLink = document.createElement('a');
                gameLink.href = resolvePath(game.href);
                gameLink.classList.add('nav-dropdown-item');
                gameLink.setAttribute('role', 'menuitem');
                gameLink.innerHTML = `<img src="${resolvePath(game.imgSrc)}" alt="${game.name}"><span>${game.name}</span>`;
                dropdown.appendChild(gameLink);
            });

            const viewAll = document.createElement('a');
            const viewAllPath = navElement.dataset.viewAll || navElement.getAttribute('href');
            viewAll.href = resolvePath(viewAllPath);
            viewAll.classList.add('view-all-button', 'nav-view-all');
            viewAll.textContent = `View all ${navElement.querySelector('span').textContent.trim()}`;
            viewAll.setAttribute('role', 'menuitem');
            dropdown.appendChild(viewAll);

            parentItem.appendChild(dropdown);

            const setOpenState = (isOpen) => {
                parentItem.classList.toggle('open', isOpen);
                dropdown.hidden = !isOpen;
                navElement.setAttribute('aria-expanded', isOpen);
            };

            parentItem.addEventListener('mouseenter', () => {
                if (!isTouchInput()) {
                    setOpenState(true);
                }
            });

            parentItem.addEventListener('mouseleave', () => {
                if (!isTouchInput()) {
                    setOpenState(false);
                }
            });

            parentItem.addEventListener('focusout', (event) => {
                if (!parentItem.contains(event.relatedTarget)) {
                    setOpenState(false);
                }
            });

            navElement.addEventListener('focus', () => setOpenState(true));

            navElement.addEventListener('click', (event) => {
                if (isTouchInput()) {
                    const willOpen = !parentItem.classList.contains('open');
                    if (willOpen) {
                        event.preventDefault();
                    }
                    setOpenState(willOpen);
                }
            });
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDropdowns);
    } else {
        initDropdowns();
    }
})();
