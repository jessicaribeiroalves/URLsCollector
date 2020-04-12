const getLinks = require('../src/app');
const cheerio = require('cheerio');
const fetch = require('node-fetch');

jest.mock('cheerio');
jest.mock('node-fetch');

test("fetches results from google books api", () => {
  return getLinks.then(response => {
    expect(response).toEqual();
  });
});