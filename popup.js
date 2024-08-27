document.getElementById('scrape-button').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.scripting.executeScript(
            {
                target: { tabId: tabs[0].id },
                function: scrapeLinks,
            },
            (results) => {
                const data = results[0].result;
                const internalLinksList = document.getElementById('internal-links-list');
                const externalLinksList = document.getElementById('external-links-list');
                const brokenLinksList = document.getElementById('broken-links-list');

                internalLinksList.innerHTML = data.internalLinks.map(link => `<div class="link">${link}</div>`).join('');
                externalLinksList.innerHTML = data.externalLinks.map(link => `<div class="link">${link}</div>`).join('');
                brokenLinksList.innerHTML = data.brokenLinks.map(link => `<div class="link">${link}</div>`).join('');
            }
        );
    });
});

function scrapeLinks() {    
    const internalLinks = [];
    const externalLinks = [];
    const brokenLinks = [];
    const baseUrl = window.location.origin;

    document.querySelectorAll('a').forEach(link => {
        const href = link.href;
        if (href.startsWith(baseUrl)) {
            internalLinks.push(href);
        } else if (href.startsWith('http')) {
            externalLinks.push(href);
        }

        fetch(href).then(response => {
            if (!response.ok) {
                brokenLinks.push(href);
            }
        }).catch(() => {
            brokenLinks.push(href);
        });
    });

    return { internalLinks, externalLinks, brokenLinks };
}
