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

// o que retorna no caso de passar uma URL sem links? (se isso for possivel)
// TODO: desconectar db
// TODO: interface no terminal para digitar a URL (incluindo o formato em que se deve fazer o input da URL - com http ou https?)

async function indexAllPages(url) {
  const basePath = extractBasePath(url);
  const standardUrl = normalizeUrl(url, basePath);
  const urlId = createUrlId(standardUrl);

  if (!await db.isKnownUrl(urlId)) {
    await db.createLink(urlId, standardUrl, basePath, null);
    await db.createQueue(standardUrl, urlId);

    let firstItem = await db.getFirstFromQueue();

    while (firstItem !== null) {
      const link = firstItem.url;
      if (extractBasePath(link) === basePath) {
        const urlsLink = await getLinks(link);
        await Promise.all(urlsLink.map(async url => {
          const normalizedUrl = normalizeUrl(url, basePath);
          if (normalizedUrl[0] !== '#' && normalizedUrl !== '') {
            const linkId = createUrlId(normalizedUrl);
            const checkUrl = await db.isKnownUrl(linkId);
            if (!checkUrl) {
              await db.createQueue(normalizedUrl, urlId);
              await db.createLink(linkId, normalizedUrl, urlId, link);
            }
          }
        }));
      }
      firstItem = await db.getFirstFromQueue();
    }
  }
  const savedLinks = await db.getSavedLinks(urlId);
  return savedLinks;
}

indexAllPages('https://nubank.com.br/').then(console.log);

module.exports = {
  createUrlId,
  extractBasePath,
  normalizeUrl,
  indexAllPages,
}
