(function() {
    const resolver = window.SCHPLAY_RESOLVE_ASSET_PATH || ((path) => path);
    const games = (window.SCHPLAY_GAMES && window.SCHPLAY_GAMES.list) ? window.SCHPLAY_GAMES.list : [];
    const MAX_RESULTS = 8;

    const initSearch = () => {
        const searchInput = document.getElementById('searchInput');
        if (!searchInput) {
            return;
        }

        const searchContainer = searchInput.closest('.search-container') || searchInput.parentElement;
        if (!searchContainer) {
            return;
        }

        let searchResultsContainer = searchContainer.querySelector('#searchResults');

        if (!searchResultsContainer) {
            searchResultsContainer = document.createElement('div');
            searchResultsContainer.id = 'searchResults';
            searchResultsContainer.setAttribute('role', 'listbox');
            searchResultsContainer.hidden = true;
            searchContainer.appendChild(searchResultsContainer);
        }

        searchContainer.setAttribute('aria-expanded', 'false');

        const hideResults = () => {
            searchResultsContainer.innerHTML = '';
            searchResultsContainer.hidden = true;
            searchContainer.setAttribute('aria-expanded', 'false');
        };

        const renderResults = (matches) => {
            searchResultsContainer.innerHTML = '';

            if (!matches.length) {
                hideResults();
                return;
            }

            matches.slice(0, MAX_RESULTS).forEach(game => {
                const gameElement = document.createElement('a');
                gameElement.href = resolver(game.href);
                gameElement.classList.add('search-result');
                gameElement.setAttribute('role', 'option');
                gameElement.innerHTML = `
                    <img src="${resolver(game.img)}" alt="${game.name}">
                    <span>${game.name}</span>
                `;
                searchResultsContainer.appendChild(gameElement);
            });

            const viewAllButton = document.createElement('a');
            viewAllButton.href = resolver('allgames.html');
            viewAllButton.classList.add('view-all-button');
            viewAllButton.textContent = 'View all games';
            viewAllButton.setAttribute('role', 'option');
            searchResultsContainer.appendChild(viewAllButton);

            searchResultsContainer.hidden = false;
            searchContainer.setAttribute('aria-expanded', 'true');
        };

        const handleInput = (event) => {
            const searchTerm = event.target.value.trim().toLowerCase();

            if (searchTerm.length < 2) {
                hideResults();
                return;
            }

            const filteredGames = games.filter(game => game.name.toLowerCase().includes(searchTerm));
            renderResults(filteredGames);
        };

        searchInput.addEventListener('input', handleInput);
        searchInput.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                hideResults();
            }
        });

        document.addEventListener('click', (event) => {
            if (!searchContainer.contains(event.target)) {
                hideResults();
            }
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSearch);
    } else {
        initSearch();
    }
})();
