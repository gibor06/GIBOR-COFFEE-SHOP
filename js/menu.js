document.addEventListener('DOMContentLoaded', () => {
    const menuCards = document.querySelectorAll('.menu-card');

    menuCards.forEach(card => {
        card.addEventListener('click', () => {
            const name = card.dataset.name;
            const img = card.dataset.img;
            const price = parseInt(card.dataset.price, 10);
            const category = card.dataset.category || 'drink';

            if (typeof openPopup === 'function') {
                openPopup(name, img, price, category);
            }
        });
    });
});
