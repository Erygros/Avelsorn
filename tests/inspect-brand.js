(async () => {
    const logos = [];
    for (const img of document.querySelectorAll('.brand img')) {
        img.scrollIntoView({block: 'center', behavior: 'instant'});
        await img.decode();
        const bounds = img.getBoundingClientRect();
        logos.push({
            alt: img.alt,
            source: img.currentSrc,
            loaded: img.complete && img.naturalWidth > 0,
            width: bounds.width,
            height: bounds.height,
            undistorted: Math.abs(bounds.width / bounds.height - 3200 / 712) < 0.01,
            insideViewport: bounds.left >= 0 && bounds.right <= innerWidth,
            accessibleLink: img.closest('a')?.getAttribute('aria-label'),
        });
    }
    window.scrollTo({top: 0, behavior: 'instant'});
    return {
        path: location.pathname,
        title: document.title,
        viewport: innerWidth,
        documentWidth: document.documentElement.scrollWidth,
        font: getComputedStyle(document.body).fontFamily,
        oldBrand: /Markenname in Vorbereitung|Digitale Beratung ·|Klarer weiter\./.test(document.body.innerText),
        oldSignet: document.querySelectorAll('.brand svg,.brand small').length,
        logos,
        icons: Array.from(document.querySelectorAll('link[rel*="icon"]'), e => ({href: e.href, sizes: e.sizes.value})),
    };
})();
