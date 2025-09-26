(function() {
    const MAX_ITEMS = 20;

    const renderGames = () => {
        const pool = (window.SCHPLAY_GAMES && Array.isArray(window.SCHPLAY_GAMES.list))
            ? window.SCHPLAY_GAMES.list
            : [];
        const grid = document.getElementById('you-might-like-grid');

        if (!grid || !pool.length) {
            return false;
        }

        if (grid.children.length) {
            return true;
        }

        const shuffled = [...pool].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, MAX_ITEMS);

        const fragment = document.createDocumentFragment();

        selected.forEach(game => {
            const gameCard = document.createElement('a');
            gameCard.href = game.href;
            gameCard.classList.add('game-card');
            gameCard.dataset.gif = game.gif || '';

            const img = document.createElement('img');
            img.src = game.img;
            img.alt = game.name;

            const h3 = document.createElement('h3');
            h3.textContent = game.name;

            gameCard.appendChild(img);
            gameCard.appendChild(h3);

            fragment.appendChild(gameCard);
        });

        grid.appendChild(fragment);
        return true;
    };

    const initialise = () => {
        if (renderGames()) {
            return;
        }

        const onReady = () => {
            if (renderGames()) {
                document.removeEventListener('schplay:games-ready', onReady);
            }
        };

        document.addEventListener('schplay:games-ready', onReady);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialise);
    } else {
        initialise();
    }
})();
