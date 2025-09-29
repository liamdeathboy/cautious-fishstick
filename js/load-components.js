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

    // Load navbar
    fetch(resolveAssetPath('navbar.html'))
        .then(response => response.text())
        .then(data => {
            document.getElementById("navbar-placeholder").innerHTML = data;

            applyRootPaths(document.getElementById('navbar-placeholder'));

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
        });
});
