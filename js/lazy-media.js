(() => {
  if (window.SCHPLAY_LAZY_MEDIA_INIT) {
    return;
  }

  window.SCHPLAY_LAZY_MEDIA_INIT = true;

  const options = { rootMargin: '200px 0px', threshold: 0.01 };
  let observer = null;

  const loadImage = (img) => {
    const src = img.getAttribute('data-src');
    if (!src) return;
    img.src = src;
    img.removeAttribute('data-src');
  };

  const loadBackground = (node) => {
    const bg = node.getAttribute('data-bg');
    if (!bg) return;
    node.style.backgroundImage = 'url(' + bg + ')';
    node.removeAttribute('data-bg');
  };

  const onIntersect = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting || entry.intersectionRatio > 0) {
        if (entry.target.tagName === 'IMG') {
          loadImage(entry.target);
        } else {
          loadBackground(entry.target);
        }
        if (observer) {
          observer.unobserve(entry.target);
        }
      }
    });
  };

  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver(onIntersect, options);
  }

  const registerLazyNodes = (root) => {
    const scope = root || document;
    const images = scope.querySelectorAll('img[data-src]');
    const backgrounds = scope.querySelectorAll('[data-bg]');

    if (observer) {
      images.forEach((node) => observer.observe(node));
      backgrounds.forEach((node) => observer.observe(node));
    } else {
      images.forEach(loadImage);
      backgrounds.forEach(loadBackground);
    }
  };

  registerLazyNodes(document);

  document.addEventListener('DOMContentLoaded', () => registerLazyNodes(document));

  const mo = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (!(node instanceof HTMLElement)) return;
        if (node.tagName === 'IMG' && node.hasAttribute('data-src')) {
          registerLazyNodes(node);
        } else {
          registerLazyNodes(node);
        }
      });
    });
  });

  mo.observe(document.documentElement, { childList: true, subtree: true });
})();
