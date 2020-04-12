const { getLinks } = require('./getLinks');
const db = require('./db');

function extractBasePath(url) {
  const re = new RegExp('https?:\/\/([^\/]+)');
  if (re.test(url)) {
    return re.exec(url)[0];
  } else {
    // throw new Error(`Type a valid URL using http. The URL ${url} is not valid`)
    return undefined;
  }
}

// function getFirstFromQueue() {
//   return db.Queue.findOneAndDelete().exec();
// }

// function getSavedLinks(url) {
//   return db.Link.find({ initialUrl: url }).exec();
// }

// async function isKnownUrl(url) {
//   const response = await db.Link.findOne({ link: url }).exec();
//   return response !== null
// }

function normalizeUrl(url, basePath) {
  if (url[0] === '/') {
    url = basePath + url;
  }
  if (url[url.length - 1] === '/') {
    url = url.substring(0, (url.length - 1));
  }
  return url;
}

// TODO: create a condition in case I try to input same URL as initial url
// o que retorna no caso de passar uma URL sem links? (se isso for possivel)
// TODO: desconectar db
// TODO: interface no terminal para digitar a URL

async function indexAllPages(url) {

  const basePath = extractBasePath(url);
  const standardUrl = normalizeUrl(url, basePath);
  await db.createLink(standardUrl, basePath, null);
  await db.createQueue(standardUrl, basePath);

  let firstItem = await db.getFirstFromQueue();

  while (firstItem !== null) {
    const link = firstItem.url;
    if (extractBasePath(link) === basePath) {
      const urlsLink = await getLinks(link);
      await Promise.all(urlsLink.map(async url => {
        const normalizedUrl = normalizeUrl(url, basePath);
        if (normalizedUrl[0] !== '#' && normalizedUrl !== '') {
          const checkUrl = await db.isKnownUrl(normalizedUrl);
          if (!checkUrl) {
            await db.createQueue(normalizedUrl, basePath);
            await db.createLink(normalizedUrl, basePath, link);
          }
        }
      }))
    }
    firstItem = await db.getFirstFromQueue();
  }
  const savedLinks = await db.getSavedLinks(standardUrl);
  return savedLinks;
}

indexAllPages('https://luiz-guilherme.com/').then(console.log);


