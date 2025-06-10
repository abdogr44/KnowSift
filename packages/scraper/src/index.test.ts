import { Scraper } from './index';

describe('Scraper', () => {
  it('scrape returns expected string', () => {
    const scraper = new Scraper();
    expect(scraper.scrape('https://example.com')).toBe('Scraping https://example.com');
  });
});
