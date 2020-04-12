const httpRequest = require('../src/httpRequest');
const fetch = require('node-fetch');

jest.mock('node-fetch', () => jest.fn())

describe('getHtml', () => {
  it('should call fetch with website url', async () => {
    const text = jest.fn();
    text.mockReturnValue('html text');
    fetch.mockReturnValue(Promise.resolve({ text }));
    const result = await httpRequest.getHtml('https://test.com');

    expect(result).toBe('html text');

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith('https://test.com');
    expect(text).toHaveBeenCalledTimes(1);
  });
});

describe('extractAllLinks', () => {
  it('should extract urls from html', () => {
    const links = httpRequest.extractAllLinks('<html><body>' +
      '<a href="https://example.com">test</a>' +
      '</body></html>')

    expect(links).toStrictEqual(['https://example.com'])
  });

  it('should ignore a tags without href', () => {
    const links = httpRequest.extractAllLinks('<html><body>' +
      '<a>test</a>' +
      '</body></html>')

    expect(links).toStrictEqual([])
  });
});