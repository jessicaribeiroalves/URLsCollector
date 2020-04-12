const { getLinks } = require('../src/getLinks');

const { getHtml, extractAllLinks } = require('../src/httpRequest')

jest.mock('../src/httpRequest', () => ({
  getHtml: jest.fn(),
  extractAllLinks: jest.fn()
}));

describe('getLinks', () => {
  it('should call getHtml(), extractAllLinks() and return a links array', async () => {
    // setup
    const html = 'html text';
    const url = 'https://www.google.com';
    const links = ['url1', 'url2', 'url3'];
    getHtml.mockReturnValue(Promise.resolve(html));
    extractAllLinks.mockReturnValue(Promise.resolve(links))

    // execution
    const results = await getLinks(url);

    // assertions
    expect(getHtml).toHaveBeenCalledTimes(1);
    expect(getHtml).toHaveBeenCalledWith(url);
    expect(extractAllLinks).toHaveBeenCalledTimes(1);
    expect(extractAllLinks).toHaveBeenCalledWith(html);
    expect(results).toStrictEqual(links)
  });
});