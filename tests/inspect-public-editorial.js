(async () => {
    const main = document.querySelector('main');
    return {
        path: location.pathname,
        title: document.title,
        viewport: innerWidth,
        documentWidth: document.documentElement.scrollWidth,
        headings: Array.from(main?.querySelectorAll('h1,h2,h3') ?? [], e => ({level: e.tagName, text: e.textContent.trim()})),
        text: main?.innerText,
        decorativeLabels: document.querySelectorAll('.eyebrow,.audience-label,.pricing-label,.auth-art').length,
        imageDisclosures: Array.from(document.querySelectorAll('figcaption'), e => e.textContent),
        fakeDecorativeIcons: document.querySelectorAll('.service-icon').length,
        internalLinks: Array.from(main?.querySelectorAll('a[href^="/"]') ?? [], e => ({text: e.textContent.trim(), href: e.getAttribute('href')})),
    };
})();
