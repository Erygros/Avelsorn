(() => {
    const strip = document.querySelector('.audience-strip');
    const links = Array.from(document.querySelectorAll('.audience-links a'));
    const boxes = links.map(link => {
        const box = link.getBoundingClientRect();
        const label = link.querySelector('span').getBoundingClientRect();
        const arrow = link.querySelector('svg').getBoundingClientRect();
        return {text: link.textContent, href: link.getAttribute('href'),
            width: box.width, height: box.height, fontSize: getComputedStyle(link).fontSize,
            insideViewport: box.left >= -1 && box.right <= innerWidth + 1,
            labelFits: label.right <= arrow.left,
            top: box.top, left: box.left};
    });
    return {
        path: location.pathname, viewport: innerWidth, documentWidth: document.documentElement.scrollWidth,
        title: document.title, canonical: document.querySelector('link[rel="canonical"]')?.href,
        description: document.querySelector('meta[name="description"]')?.content,
        headings: Array.from(document.querySelectorAll('h1'), e => e.textContent),
        stripTitle: strip?.querySelector('h2')?.textContent,
        links: boxes,
        serviceLinks: Array.from(document.querySelectorAll('.audience-services a'), a => a.getAttribute('href')),
        breadcrumbs: document.querySelector('.breadcrumbs')?.textContent,
        structuredData: Array.from(document.querySelectorAll('script[type="application/ld+json"]'), s => JSON.parse(s.textContent)),
    };
})();
