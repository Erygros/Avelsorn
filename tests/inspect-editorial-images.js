(async () => {
    const images = Array.from(document.querySelectorAll('.editorial-photo img'));
    const results = [];
    for (const img of images) {
        img.scrollIntoView({ block: 'center', behavior: 'instant' });
        await img.decode();
        const rect = img.getBoundingClientRect();
        const resource = performance.getEntriesByName(img.currentSrc).at(-1);
        results.push({
            alt: img.alt,
            source: img.currentSrc,
            loaded: img.complete && img.naturalWidth > 0,
            width: rect.width,
            height: rect.height,
            undistorted: Math.abs(rect.width / rect.height - img.naturalWidth / img.naturalHeight) < 0.01,
            withinViewport: rect.left >= -1 && rect.right <= innerWidth + 1,
            encodedBytes: resource?.encodedBodySize,
            sizes: img.sizes,
            loading: img.loading,
        });
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
    return {
        path: location.pathname,
        viewport: innerWidth,
        documentWidth: document.documentElement.scrollWidth,
        count: images.length,
        placeholderGraphics: document.querySelectorAll('.direction-graphic,.article-art').length,
        images: results,
    };
})();
