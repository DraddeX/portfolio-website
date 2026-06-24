const overlay = document.createElement('div');
overlay.id = 'lightbox';
overlay.innerHTML = '<img id="lightbox-img" />';
document.body.appendChild(overlay);

const lightboxImg = document.getElementById('lightbox-img');

document.querySelectorAll('.gallery img').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        overlay.classList.add('active');
    });
});

overlay.addEventListener('click', () => {
    overlay.classList.remove('active');
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') overlay.classList.remove('active');
});
