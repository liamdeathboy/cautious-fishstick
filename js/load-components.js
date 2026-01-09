const loadComponentsScript = document.currentScript || document.querySelector('script[src*="load-components.js"]');
const componentRoot = loadComponentsScript && loadComponentsScript.dataset.componentRoot ? loadComponentsScript.dataset.componentRoot : '';

const resolveAssetPath = (path) => {
    if (!path) {
        return path;
    }

    if (/^(?:https?:)?\/\//i.test(path)) {
        return path;
    }

    return componentRoot + path;
};

const resolveWithRoot = (path) => {
    if (!path) {
        return path;
    }
    if (path.startsWith('/')) {
        return path;
    }
    return resolveAssetPath(path);
};

window.SCHPLAY_RESOLVE_ASSET_PATH = resolveWithRoot;

document.addEventListener("DOMContentLoaded", function() {
    const loadScriptOnce = (id, src, onLoad) => {
        let script = document.getElementById(id);
        if (script) {
            if (typeof onLoad === 'function') {
                if (script.dataset.loaded === 'true') {
                    onLoad();
                } else {
                    script.addEventListener('load', () => {
                        script.dataset.loaded = 'true';
                        onLoad();
                    }, { once: true });
                }
            }
            return script;
        }

        script = document.createElement('script');
        script.id = id;
        script.src = resolveAssetPath(src);
        if (typeof onLoad === 'function') {
            script.addEventListener('load', () => {
                script.dataset.loaded = 'true';
                onLoad();
            }, { once: true });
        }
        document.body.appendChild(script);
        return script;
    };

    const loadSearchScript = () => {
        loadScriptOnce('search-script', 'js/search.js');
    };

    const ensureGameData = () => {
        if (window.SCHPLAY_GAMES && window.SCHPLAY_GAMES.list) {
            loadSearchScript();
            return;
        }

        loadScriptOnce('games-data-script', 'js/games-data.js', loadSearchScript);
    };

    const ensureIncognito = () => {
        loadScriptOnce('incognito-script', 'js/incognito-mode.js', () => {
            document.dispatchEvent(new CustomEvent('schplay:navigation-ready'));
        });
    };

    const notifyNavigationReady = () => {
        document.dispatchEvent(new CustomEvent('schplay:navigation-ready'));
    };

    const applyRootPaths = (container) => {
        if (!container) return;

        container.querySelectorAll('[data-root-src]').forEach((node) => {
            const path = node.getAttribute('data-root-src');
            const resolved = resolveWithRoot(path);
            if (resolved) {
                node.setAttribute('src', resolved);
            }
        });

        container.querySelectorAll('[data-root-href]').forEach((node) => {
            const path = node.getAttribute('data-root-href');
            const resolved = resolveWithRoot(path);
            if (resolved) {
                node.setAttribute('href', resolved);
            }
        });

        container.querySelectorAll('[data-view-all]').forEach((node) => {
            const path = node.getAttribute('data-view-all');
            const resolved = resolveWithRoot(path);
            if (resolved) {
                node.setAttribute('data-view-all', resolved);
            }
        });
    };

    // Lazy load game iframes so they only boot once a player clicks Play.
    const initLazyGameEmbeds = () => {
        const embeds = document.querySelectorAll('.game-player-card iframe');

        embeds.forEach((iframe) => {
            if (!iframe || iframe.dataset.lazyReady === 'true' || iframe.hasAttribute('data-no-lazy')) {
                return;
            }

            const gameSrc = iframe.getAttribute('data-game-src') || iframe.dataset.gameSrc || iframe.getAttribute('data-src') || iframe.getAttribute('src');
            if (!gameSrc) {
                return;
            }

            iframe.dataset.gameSrc = gameSrc;
            iframe.dataset.lazyReady = 'true';

            if (iframe.getAttribute('src')) {
                iframe.removeAttribute('src');
            }

            iframe.setAttribute('aria-hidden', 'true');
            iframe.setAttribute('tabindex', '-1');

            let wrapper = iframe.parentElement;
            if (!wrapper || !wrapper.classList.contains('game-embed-wrapper')) {
                wrapper = document.createElement('div');
                wrapper.className = 'game-embed-wrapper';
                iframe.parentNode.insertBefore(wrapper, iframe);
                wrapper.appendChild(iframe);
            }

            const overlay = document.createElement('div');
            overlay.className = 'game-lazy-overlay';
            overlay.innerHTML = '<div class="game-lazy-cta"><p>Click play to load the game. We hold it back to keep pages fast.</p><button type="button" class="game-play-button">Play Now</button></div><div class="game-lazy-loading" role="status" aria-live="polite"><div class="game-lazy-spinner"></div><span>Loading game...</span></div>';
            wrapper.appendChild(overlay);

            const playButton = overlay.querySelector('.game-play-button');
            if (iframe.id && playButton) {
                playButton.setAttribute('aria-controls', iframe.id);
            }

            const playerCard = iframe.closest('.game-player-card');
            const fullscreenToggle = playerCard ? playerCard.querySelector('.game-fullscreen-toggle') : null;

            if (fullscreenToggle) {
                fullscreenToggle.setAttribute('disabled', 'true');
                fullscreenToggle.setAttribute('aria-disabled', 'true');
            }

            const startLoad = () => {
                if (overlay.dataset.loading === 'true') {
                    return;
                }

                overlay.dataset.loading = 'true';
                overlay.classList.add('is-loading');

                if (playButton) {
                    playButton.disabled = true;
                }

                const fallback = setTimeout(() => {
                    if (iframe.dataset.gameLoaded === 'true') {
                        return;
                    }
                    overlay.dataset.loading = 'false';
                    overlay.classList.remove('is-loading');
                    if (playButton) {
                        playButton.disabled = false;
                        playButton.textContent = 'Play Now';
                    }
                }, 12000);

                const handleLoad = () => {
                    clearTimeout(fallback);
                    iframe.dataset.gameLoaded = 'true';
                    overlay.remove();
                    if (fullscreenToggle) {
                        fullscreenToggle.removeAttribute('disabled');
                        fullscreenToggle.removeAttribute('aria-disabled');
                    }
                };

                iframe.addEventListener('load', handleLoad, { once: true });

                iframe.src = iframe.dataset.gameSrc;
                iframe.removeAttribute('aria-hidden');
                iframe.removeAttribute('tabindex');
            };

            if (playButton) {
                playButton.addEventListener('click', startLoad);
            }
        });
    };

    initLazyGameEmbeds();

    const lazyLoadOptions = { rootMargin: '200px 0px', threshold: 0.01 };
    let lazyMediaObserver = null;

    const loadLazyImage = (img) => {
        const src = img.getAttribute('data-src');
        if (src) {
            img.src = src;
            img.removeAttribute('data-src');
        }
    };

    const loadLazyBackground = (node) => {
        const bg = node.getAttribute('data-bg');
        if (bg) {
            node.style.backgroundImage = 'url(' + bg + ')';
            node.removeAttribute('data-bg');
        }
    };

    const handleLazyEntries = (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting || entry.intersectionRatio > 0) {
                if (entry.target.tagName === 'IMG') {
                    loadLazyImage(entry.target);
                } else {
                    loadLazyBackground(entry.target);
                }
                lazyMediaObserver && lazyMediaObserver.unobserve(entry.target);
            }
        });
    };

    if ('IntersectionObserver' in window) {
        lazyMediaObserver = new IntersectionObserver(handleLazyEntries, lazyLoadOptions);
    }

    const registerLazyMedia = (root) => {
        const scope = root || document;
        const images = scope.querySelectorAll('img[data-src]');
        const backgrounds = scope.querySelectorAll('[data-bg]');

        if (lazyMediaObserver) {
            images.forEach((img) => lazyMediaObserver.observe(img));
            backgrounds.forEach((node) => lazyMediaObserver.observe(node));
        } else {
            images.forEach(loadLazyImage);
            backgrounds.forEach(loadLazyBackground);
        }
    };

    // Load navbar
    fetch(resolveAssetPath('navbar.html'))
        .then(response => response.text())
        .then(data => {
            document.getElementById("navbar-placeholder").innerHTML = data;

            applyRootPaths(document.getElementById('navbar-placeholder'));
            registerLazyMedia(document.getElementById('navbar-placeholder'));

            ensureGameData();
            ensureIncognito();
            loadScriptOnce('nav-games-script', 'js/nav-games.js');

            const mobileNavToggle = document.querySelector(".mobile-nav-toggle");
            const primaryNav = document.getElementById("primary-navigation");

            if (mobileNavToggle && primaryNav) {
                mobileNavToggle.addEventListener("click", () => {
                    primaryNav.classList.toggle("active");
                    const isExpanded = primaryNav.classList.contains("active");
                    mobileNavToggle.setAttribute("aria-expanded", isExpanded);
                });
            }

            notifyNavigationReady();
        });

    // Load footer
    fetch(resolveAssetPath('footer.html'))
        .then(response => response.text())
        .then(data => {
            const footerContainer = document.getElementById("footer-placeholder");
            footerContainer.innerHTML = data;
            applyRootPaths(footerContainer);
            registerLazyMedia(footerContainer);
        });

    // Run lazy registration on initial content
    registerLazyMedia(document);
});
