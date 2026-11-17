// Screenshots use object-fit: contain, so a screenshot that doesn't match its
// box's shape gets empty bars beside or above/below it. This paints each bar in
// the colour of the screenshot edge next to it, so the bars blend into the image.

const SAMPLES = 24; // pixels sampled along each edge
const edges = new Map(); // img -> { top, bottom, left, right }

function edgeColour(ctx, w, h, side) {
    const reds = [], greens = [], blues = [];

    for (let i = 0; i < SAMPLES; i++) {
        const t = (i + 0.5) / SAMPLES;
        const x = side === 'left' ? 0 : side === 'right' ? w - 1 : Math.floor(t * w);
        const y = side === 'top' ? 0 : side === 'bottom' ? h - 1 : Math.floor(t * h);
        const [r, g, b] = ctx.getImageData(x, y, 1, 1).data;
        reds.push(r); greens.push(g); blues.push(b);
    }

    // Median per channel ignores the odd icon or line on the edge
    const median = values => values.sort((a, b) => a - b)[Math.floor(values.length / 2)];
    return `rgb(${median(reds)}, ${median(greens)}, ${median(blues)})`;
}

function readEdges(img) {
    const w = img.naturalWidth, h = img.naturalHeight;
    if (!w || !h) return;

    // A small copy is enough to read the edge colours
    const scale = Math.min(1, 400 / Math.max(w, h));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(w * scale));
    canvas.height = Math.max(1, Math.round(h * scale));
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    try {
        const cw = canvas.width, ch = canvas.height;
        edges.set(img, {
            top: edgeColour(ctx, cw, ch, 'top'),
            bottom: edgeColour(ctx, cw, ch, 'bottom'),
            left: edgeColour(ctx, cw, ch, 'left'),
            right: edgeColour(ctx, cw, ch, 'right'),
        });
        paint(img);
    } catch {
        // Pixel reading is blocked for images from another domain; keep the default background
    }
}

function paint(img) {
    const e = edges.get(img);
    if (!e || !img.clientHeight) return;

    // Image wider than its box → bars above and below; narrower → left and right
    const imageIsWider = img.naturalWidth / img.naturalHeight > img.clientWidth / img.clientHeight;
    img.style.background = imageIsWider
        ? `linear-gradient(to bottom, ${e.top} 50%, ${e.bottom} 50%)`
        : `linear-gradient(to right, ${e.left} 50%, ${e.right} 50%)`;
}

document.querySelectorAll('.gallery img').forEach(img => {
    if (img.complete) readEdges(img);
    else img.addEventListener('load', () => readEdges(img), { once: true });
});

// Box shapes change with the screen width, so re-pick the bar colours on resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => edges.forEach((_, img) => paint(img)), 150);
});
