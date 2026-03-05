function main() {
    injectOrbitStyles();

    const sliders = [
        slider1(),
        slider2()
    ].filter(Boolean);

    sliders.forEach(startOrbitAnimation);
}

function slider1() {
    return createAnimationConfig(
        'skills-section',
        [
            './img/1.webp',
            './img/2.webp',
            './img/3.webp',
            './img/4.webp',
            './img/5.webp',
            './img/6.webp',
            './img/7.webp',
            './img/8.webp',
            './img/9.webp',
            './img/10.webp',
            './img/11.webp',
            './img/12.webp',
            './img/13.webp',
            './img/14.webp'
        ],
        {
            radius: 380,
            imageSize: 220,
            centerX: 1.08,
            centerY: 0.52,
            sensitivity: 0.0011,
            lag: 0.11,
            damping: 0.935,
            maxVelocity: 0.055
        }
    );
}

function slider2() {
    return createAnimationConfig(
        'works-section',
        [
            './img/1.webp',
            './img/2.webp',
            './img/3.webp'
        ],
        {
            radius: 300,
            imageSize: 180,
            centerX: 1.04,
            centerY: 0.5,
            sensitivity: 0.0009,
            lag: 0.1,
            damping: 0.93,
            maxVelocity: 0.05
        }
    );
}

function injectOrbitStyles() {
    if (document.querySelector('#orbit-anim-style')) {
        return;
    }

    const style = document.createElement('style');
    style.id = 'orbit-anim-style';
    style.textContent = `
        .orbit-scope {
            position: relative;
            isolation: isolate;
            overflow: visible;
        }

        .orbit-scope > .orbit-content-lift {
            position: relative;
            z-index: 1;
        }

        .orbit-layer {
            position: absolute;
            inset: -45% -12% -45% -12%;
            overflow: visible;
            pointer-events: none;
            z-index: 0;
        }

        .orbit-item {
            position: absolute;
            border-radius: 0;
            border: 0;
            object-fit: contain;
            user-select: none;
            opacity: 0.92;
            will-change: transform;
        }
    `;

    document.head.appendChild(style);
}

function createAnimationConfig(targetId, imagePaths, options = {}) {
    return {
        targetId,
        imagePaths,
        options: {
            radius: options.radius ?? 330,
            imageSize: options.imageSize ?? 200,
            centerX: options.centerX ?? 1.06,
            centerY: options.centerY ?? 0.56,
            startAngle: options.startAngle ?? 0,
            sensitivity: options.sensitivity ?? 0.00095,
            lag: options.lag ?? 0.12,
            damping: options.damping ?? 0.93,
            maxVelocity: options.maxVelocity ?? 0.052
        }
    };
}

function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function setupOrbitScope(target) {
    target.classList.add('orbit-scope');

    const layer = document.createElement('div');
    layer.className = 'orbit-layer';
    target.appendChild(layer);

    Array.from(target.children).forEach((child) => {
        if (child !== layer) {
            child.classList.add('orbit-content-lift');
        }
    });

    return layer;
}

function createOrbitItems(layer, imagePaths, imageSize) {
    return imagePaths.map((src) => {
        const img = document.createElement('img');
        img.className = 'orbit-item';
        img.src = src;
        img.alt = '';
        img.width = imageSize;
        img.height = imageSize;
        layer.appendChild(img);
        return img;
    });
}

function applyOrbitFrame(items, target, options, angle) {
    const width = target.clientWidth;
    const height = target.clientHeight;
    const centerX = width * options.centerX;
    const centerY = height * options.centerY;
    const step = (Math.PI * 2) / items.length;

    items.forEach((item, index) => {
        const itemAngle = angle + step * index;
        const x = centerX + Math.cos(itemAngle) * options.radius;
        const y = centerY + Math.sin(itemAngle) * options.radius;

        let renderWidth = options.imageSize;
        let renderHeight = options.imageSize;

        if (item.naturalWidth > 0 && item.naturalHeight > 0) {
            const scale = options.imageSize / Math.max(item.naturalWidth, item.naturalHeight);
            renderWidth = Math.round(item.naturalWidth * scale);
            renderHeight = Math.round(item.naturalHeight * scale);
        }

        item.style.width = `${renderWidth}px`;
        item.style.height = `${renderHeight}px`;
        item.style.transform = `translate(${x - renderWidth / 2}px, ${y - renderHeight / 2}px)`;
    });
}

function startOrbitAnimation(config) {
    const target = document.getElementById(config.targetId);
    if (!target || !config.imagePaths.length) {
        return;
    }

    const layer = setupOrbitScope(target);
    const items = createOrbitItems(layer, config.imagePaths, config.options.imageSize);

    if (!items.length) {
        return;
    }

    let angle = config.options.startAngle;
    let currentVelocity = 0;
    let targetVelocity = 0;
    let lastScrollY = window.scrollY;

    layer.style.opacity = '1';

    function onScroll() {
        const nextScrollY = window.scrollY;
        const delta = nextScrollY - lastScrollY;
        lastScrollY = nextScrollY;

        targetVelocity += delta * config.options.sensitivity;
        targetVelocity = clamp(
            targetVelocity,
            -config.options.maxVelocity,
            config.options.maxVelocity
        );
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    function animate() {
        currentVelocity += (targetVelocity - currentVelocity) * config.options.lag;
        targetVelocity *= config.options.damping;

        if (Math.abs(targetVelocity) < 0.00003) {
            targetVelocity = 0;
        }
        if (Math.abs(currentVelocity) < 0.00003) {
            currentVelocity = 0;
        }

        angle += currentVelocity;
        applyOrbitFrame(items, target, config.options, angle);

        requestAnimationFrame(animate);
    }

    applyOrbitFrame(items, target, config.options, angle);
    requestAnimationFrame(animate);
}

main();
