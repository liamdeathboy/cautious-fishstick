document.addEventListener('DOMContentLoaded', function() {
    const gameCards = document.querySelectorAll('.game-card, .game-card-small, .large-card a');
    let hoverTimer;

    gameCards.forEach(card => {
        const img = card.querySelector('img');
        const originalSrc = img.src;
        const gifSrc = card.dataset.gif;

        card.addEventListener('mouseenter', () => {
            hoverTimer = window.setTimeout(() => {
                if (gifSrc) {
                    img.src = gifSrc;
                }
            }, 700);
        });

        card.addEventListener('mouseleave', () => {
            clearTimeout(hoverTimer);
            if (gifSrc) {
                img.src = originalSrc;
            }
        });
    });
});
