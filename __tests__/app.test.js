const { createUrlId, extractBasePath, normalizeUrl } = require('../src/app');

jest.mock('../src/db', () => { });

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

// describe('indexAllPages', () => {
//   it('should ')
// });