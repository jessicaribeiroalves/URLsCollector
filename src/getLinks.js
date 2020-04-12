const { getHtml, extractAllLinks } = require('./httpRequest');

async function getLinks(url) {
  console.log(url);
  const html = await getHtml(url);
  const links = await extractAllLinks(html);
  return links;
};

module.exports = {
  getLinks
}