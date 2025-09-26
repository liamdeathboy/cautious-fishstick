(function() {
    const renderAllGames = () => {
        const games = (window.SCHPLAY_GAMES && window.SCHPLAY_GAMES.list)
            ? [...window.SCHPLAY_GAMES.list]
            : [];

        const grid = document.getElementById('all-games-grid');
        const countLabel = document.getElementById('all-games-count');

        if (!grid) {
            return;
        }

        if (countLabel) {
            countLabel.textContent = games.length ? `${games.length} games` : 'No games available';
        }

        if (!games.length) {
            return;
        }

        games.sort((a, b) => a.name.localeCompare(b.name));

        const fragment = document.createDocumentFragment();

        games.forEach(game => {
            const card = document.createElement('a');
            card.className = 'game-card game-card-large';
            card.href = game.href;

            const media = document.createElement('div');
            media.className = 'game-card-media';

            const image = document.createElement('img');
            image.src = game.img;
            image.alt = game.name;
            image.loading = 'lazy';
            image.decoding = 'async';
            media.appendChild(image);

            const info = document.createElement('div');
            info.className = 'game-info';

            const title = document.createElement('h3');
            title.textContent = game.name;
            info.appendChild(title);

            card.appendChild(media);
            card.appendChild(info);

            fragment.appendChild(card);
        });

        grid.appendChild(fragment);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderAllGames);
    } else {
        renderAllGames();
    }
})();
