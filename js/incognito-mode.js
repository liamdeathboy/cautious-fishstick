(function() {
    const CLASS_NAME = 'incognito-mode';
    const STORAGE_KEY = 'schplayIncognito';
    const FAVICON_URL = 'https://ssl.gstatic.com/classroom/favicon.ico';

    const getToggles = () => Array.from(document.querySelectorAll('[data-incognito-toggle]'));

    const createStylesheetLink = () => {
        let link = document.getElementById('incognito-theme');
        if (link) {
            return link;
        }
        link = document.createElement('link');
        link.id = 'incognito-theme';
        link.rel = 'stylesheet';
        link.href = 'css/incognito.css';
        link.disabled = true;
        document.head.appendChild(link);
        return link;
    };

    const getFaviconLinks = () => Array.from(document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]'));

    const rememberOriginalFavicons = (links) => {
        links.forEach(link => {
            if (!link.dataset.originalHref) {
                link.dataset.originalHref = link.href;
            }
        });
    };

    const setFavicon = (links, incognito) => {
        links.forEach(link => {
            if (incognito) {
                rememberOriginalFavicons([link]);
                link.href = FAVICON_URL;
            } else if (link.dataset.originalHref) {
                link.href = link.dataset.originalHref;
            }
        });
    };

    const applyState = (shouldEnable) => {
        const styleLink = createStylesheetLink();
        const faviconLinks = getFaviconLinks();

        styleLink.disabled = !shouldEnable;
        document.body.classList.toggle(CLASS_NAME, shouldEnable);
        setFavicon(faviconLinks, shouldEnable);

        getToggles().forEach(toggle => {
            toggle.setAttribute('aria-pressed', shouldEnable ? 'true' : 'false');
        });

        window.localStorage.setItem(STORAGE_KEY, shouldEnable ? '1' : '0');
    };

    const handleToggleClick = (event) => {
        event.preventDefault();
        const currentlyEnabled = document.body.classList.contains(CLASS_NAME);
        applyState(!currentlyEnabled);
    };

    const bindToggles = () => {
        getToggles().forEach(toggle => {
            if (toggle.dataset.incognitoBound === 'true') {
                toggle.setAttribute('aria-pressed', document.body.classList.contains(CLASS_NAME) ? 'true' : 'false');
                return;
            }

            toggle.dataset.incognitoBound = 'true';
            toggle.setAttribute('role', 'button');
            toggle.setAttribute('aria-pressed', document.body.classList.contains(CLASS_NAME) ? 'true' : 'false');
            toggle.addEventListener('click', handleToggleClick);
        });
    };

    const init = () => {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored === '1') {
            applyState(true);
        } else {
            createStylesheetLink();
        }

        bindToggles();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    document.addEventListener('schplay:navigation-ready', bindToggles);
})();
