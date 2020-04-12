const cheerio = require('cheerio');
const fetch = require('node-fetch');

async function getHtml(url) {
  const response = await fetch(url);
  const html = await response.text();
  return html
}

function extractAllLinks(html) {
  const $ = cheerio.load(html);
  const links = [];
  $('a').each((i, el) => {
    if ($(el).attr('href')) {
      links.push($(el).attr('href'));
    }
  });
  return links
}

module.exports = {
  extractAllLinks,
  getHtml
}