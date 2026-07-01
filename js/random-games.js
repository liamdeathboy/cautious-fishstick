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
            gameCard.className = 'bento-card';
            if (game.gif) gameCard.dataset.gif = game.gif;

            const img = document.createElement('img');
            img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
            img.dataset.src = game.img;
            img.alt = game.name + ' unblocked';
            img.loading = 'lazy';
            img.decoding = 'async';

            const label = document.createElement('div');
            label.className = 'bento-label';
            const h3 = document.createElement('h3');
            h3.textContent = game.name;
            label.appendChild(h3);

            gameCard.appendChild(img);
            gameCard.appendChild(label);

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
