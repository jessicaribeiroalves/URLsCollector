const {
  createUrlId,
  extractBasePath,
  indexAllPages,
  normalizeUrl
} = require('../src/index');
const {
  createLink,
  createQueue,
  getItemFromQueue,
  getSavedLinks,
  isKnownUrl
} = require('../src/db');
const { getLinks } = require('../src/getLinks');

jest.mock('../src/db', () => ({
  createLink: jest.fn(),
  createQueue: jest.fn(),
  getItemFromQueue: jest.fn(),
  getSavedLinks: jest.fn(),
  isKnownUrl: jest.fn(),
}));

jest.mock('../src/getLinks', () => ({
  getLinks: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks()
})

describe('createUrlId', () => {
  it('should return URL string without http protocol', () => {
    const url = 'https://example.com/about';
    const results = createUrlId(url);

    expect(results).toBe('example.com/about');
  });

  it('should return undefined', () => {
    const url = 'mailto:someone@example.com';
    const results = createUrlId(url);

    expect(results).toBe(url);
  });
});

describe('extractBasePath', () => {
  it('should return the URL base path when passed URL attends regex requisites', () => {
    const url = 'https://example.com/about';
    const results = extractBasePath(url);

    expect(results).toBe('https://example.com');
  });

  it('should return undefined when passed URL doesnt attend regex requisites', () => {
    const url = 'mailto:someone@example.com';
    const results = extractBasePath(url);

    expect(results).toBe(undefined);
  });
});

describe('normalizeUrl', () => {
  it('should return normalized URL when first character is a slash', () => {
    const url = '/about';
    const basePath = 'https://example.com';
    const results = normalizeUrl(url, basePath);

    expect(results).toBe('https://example.com/about');
  });

  it('should return normalized URL when last character is a slash', () => {
    const url = 'https://example.com/about/';
    const basePath = 'https://example.com';
    const results = normalizeUrl(url, basePath);

    expect(results).toBe('https://example.com/about');
  });
});

describe('indexAllPages', () => {
  it('should return saved links array if URL is already known', async () => {
    const check = true;
    const savedLinks = ['url1', 'url2', 'url3'];
    const url = 'https://example.com';
    const urlId = 'example.com';

    isKnownUrl.mockReturnValue(Promise.resolve(check));
    getSavedLinks.mockReturnValue(Promise.resolve(savedLinks));

    const results = await indexAllPages(url)

    expect(isKnownUrl).toHaveBeenCalledTimes(1);
    expect(isKnownUrl).toHaveBeenCalledWith(urlId);
    expect(getSavedLinks).toHaveBeenCalledTimes(1);
    expect(getSavedLinks).toHaveBeenCalledWith(urlId);
    expect(results).toStrictEqual(savedLinks);
  });

  it('should save URL in the database if URL is not known yet', async () => {
    const check = false;
    const url = 'https://example.com';
    const urlId = 'example.com';
    const standardUrl = 'https://example.com';
    const basePath = 'https://example.com'
    const parentUrl = null;

    isKnownUrl.mockReturnValue(Promise.resolve(check));
    createLink.mockReturnValue(Promise.resolve());
    createQueue.mockReturnValue(Promise.resolve());
    getItemFromQueue.mockReturnValue(Promise.resolve(null));
    getSavedLinks.mockReturnValue(Promise.resolve([]));

    await indexAllPages(url);

    expect(createLink).toHaveBeenCalledTimes(1);
    expect(createLink).toHaveBeenCalledWith(urlId, standardUrl, basePath, parentUrl);
    expect(createQueue).toHaveBeenCalledTimes(1);
    expect(createQueue).toHaveBeenCalledWith(standardUrl, urlId);
  });

  describe('with items on queue', () => {
    beforeEach(() => {
      isKnownUrl.mockReturnValue(Promise.resolve(false));
      createLink.mockReturnValue(Promise.resolve());
      createQueue.mockReturnValue(Promise.resolve());
    });

    it('should ignore links that don\'t match base path', async () => {
      const queueItem = {
        url: 'https://anotherexample.com'
      }
      const url = 'https://example.com';
      const urlId = 'example.com';
      const standardUrl = 'https://example.com';
      const basePath = 'https://example.com'
      const parentUrl = null;

      getItemFromQueue.mockReturnValueOnce(Promise.resolve(queueItem));
      getItemFromQueue.mockReturnValue(Promise.resolve(null));
      getSavedLinks.mockReturnValue(Promise.resolve([]));

      await indexAllPages(url);

      expect(getItemFromQueue).toHaveBeenCalledTimes(2);
      expect(createLink).toHaveBeenCalledTimes(1);
      expect(createLink).toHaveBeenCalledWith(urlId, standardUrl, basePath, parentUrl);
      expect(createQueue).toHaveBeenCalledTimes(1);
      expect(createQueue).toHaveBeenCalledWith(standardUrl, urlId);
    });

    it('should call getLinks on basePath matching', async () => {
      const queueItem = {
        url: 'https://example.com'
      }
      const standardUrl = 'https://example.com';
      const basePath = 'https://example.com';
      const linksUrl = ['url1', 'url2', 'url3'];
      const parentUrl = null;
      const url = 'https://example.com';
      const urlId = 'example.com';

      getItemFromQueue.mockReturnValueOnce(Promise.resolve(queueItem));
      getItemFromQueue.mockReturnValue(Promise.resolve(null));
      getSavedLinks.mockReturnValue(Promise.resolve([]));
      getLinks.mockReturnValue(Promise.resolve(linksUrl));

      await indexAllPages(url);

      expect(getItemFromQueue).toHaveBeenCalledTimes(2);
      expect(createLink).toHaveBeenCalledTimes(4);
      expect(createLink).toHaveBeenCalledWith(urlId, standardUrl, basePath, parentUrl);
      expect(createQueue).toHaveBeenCalledTimes(4);
      expect(createQueue).toHaveBeenCalledWith(standardUrl, urlId);
    });

    it('should discard/not save URL that is an empty string or start with #', async () => {
      const queueItem = {
        url: 'https://example.com'
      }
      const standardUrl = 'https://example.com';
      const basePath = 'https://example.com';
      const linksUrl = ['url1', 'url2', 'url3', '', '#contact'];
      const parentUrl = null;
      const url = 'https://example.com';
      const urlId = 'example.com';

      getItemFromQueue.mockReturnValueOnce(Promise.resolve(queueItem));
      getItemFromQueue.mockReturnValue(Promise.resolve(null));
      getSavedLinks.mockReturnValue(Promise.resolve([]));
      getLinks.mockReturnValue(Promise.resolve(linksUrl));

      await indexAllPages(url);

      expect(getItemFromQueue).toHaveBeenCalledTimes(2);
      expect(isKnownUrl).toHaveBeenCalledTimes(4);
      expect(createLink).toHaveBeenCalledTimes(4);
      expect(createLink).toHaveBeenCalledWith(urlId, standardUrl, basePath, parentUrl);
      expect(createQueue).toHaveBeenCalledTimes(4);
      expect(createQueue).toHaveBeenCalledWith(standardUrl, urlId);
    });

    it('should discard/not save the link that is already known', async () => {
      const queueItem = {
        url: 'https://example.com'
      }
      const standardUrl = 'https://example.com';
      const basePath = 'https://example.com';
      const linksUrl = ['url1', 'url2', 'url3', 'url3'];
      const parentUrl = null;
      const url = 'https://example.com';
      const urlId = 'example.com';

      getItemFromQueue.mockReturnValueOnce(Promise.resolve(queueItem));
      getItemFromQueue.mockReturnValue(Promise.resolve(null));
      getSavedLinks.mockReturnValue(Promise.resolve([]));
      getLinks.mockReturnValue(Promise.resolve(linksUrl));

      isKnownUrl.mockReturnValueOnce(Promise.resolve(false));
      isKnownUrl.mockReturnValueOnce(Promise.resolve(false));
      isKnownUrl.mockReturnValueOnce(Promise.resolve(false));
      isKnownUrl.mockReturnValueOnce(Promise.resolve(false));
      isKnownUrl.mockReturnValueOnce(Promise.resolve(true));

      await indexAllPages(url);

      expect(getItemFromQueue).toHaveBeenCalledTimes(2);
      expect(isKnownUrl).toHaveBeenCalledTimes(5);
      expect(createLink).toHaveBeenCalledTimes(4);
      expect(createLink).toHaveBeenCalledWith(urlId, standardUrl, basePath, parentUrl);
      expect(createQueue).toHaveBeenCalledTimes(4);
      expect(createQueue).toHaveBeenCalledWith(standardUrl, urlId);
    });
  });
});