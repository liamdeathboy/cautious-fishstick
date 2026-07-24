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

        // Clear any server-rendered (static, crawlable) cards before rendering the
        // JS-enhanced, lazy-loaded versions so nothing is duplicated.
        grid.innerHTML = '';

        const fragment = document.createDocumentFragment();

        games.forEach(game => {
            const card = document.createElement('a');
            card.className = 'bento-card';
            card.href = game.href;
            card.title = 'Play ' + game.name + ' unblocked';

            const image = document.createElement('img');
            image.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
            image.dataset.src = game.img;
            image.alt = game.name + ' unblocked';
            image.loading = 'lazy';
            image.decoding = 'async';

            const label = document.createElement('div');
            label.className = 'bento-label';
            const title = document.createElement('h3');
            title.textContent = game.name;
            label.appendChild(title);

            card.appendChild(image);
            card.appendChild(label);

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
