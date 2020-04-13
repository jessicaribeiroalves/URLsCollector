const { getLinks } = require('./getLinks');
const db = require('./db');

function createUrlId(url) {
  const re = new RegExp('https?:\/\/(.+)');
  if (re.test(url)) {
    return re.exec(url)[1];
  } else {
    return url;
  }
}

function extractBasePath(url) {
  const re = new RegExp('https?:\/\/([^\/]+)');
  if (re.test(url)) {
    return re.exec(url)[0];
  } else {
    return undefined;
  }
}

function normalizeUrl(url, basePath) {
  if (url[0] === '/') {
    url = basePath + url;
  }
  if (url[url.length - 1] === '/') {
    url = url.substring(0, (url.length - 1));
  }
  return url;
}

async function indexAllPages(url) {
  const basePath = extractBasePath(url);
  const standardUrl = normalizeUrl(url, basePath);
  const urlId = createUrlId(standardUrl);

  if (!await db.isKnownUrl(urlId)) {
    await db.createLink(urlId, standardUrl, basePath, null);
    await db.createQueue(standardUrl, urlId);

    let queueItem = await db.getItemFromQueue();

    while (queueItem !== null) {
      const link = queueItem.url;
      if (extractBasePath(link) === basePath) {
        const linksUrl = await getLinks(link);
        await Promise.all(linksUrl.map(async url => {
          const normalizedUrl = normalizeUrl(url, basePath);
          if (normalizedUrl[0] !== '#' && normalizedUrl !== '') {
            const linkId = createUrlId(normalizedUrl);
            const checkLink = await db.isKnownUrl(linkId);
            if (!checkLink) {
              const parentUrl = createUrlId(link);
              await db.createQueue(normalizedUrl, urlId);
              await db.createLink(linkId, normalizedUrl, urlId, parentUrl);
            }
          }
        }));
      }
      queueItem = await db.getItemFromQueue();
    }
  }
  const savedLinks = await db.getSavedLinks(urlId);
  return savedLinks;
}

module.exports = {
  createUrlId,
  extractBasePath,
  normalizeUrl,
  indexAllPages,
}
