import { fetchTranscript } from './index';

describe('fetchTranscript', () => {
  const oldFetch = global.fetch;
  const mockFetch = jest.fn();

  beforeEach(() => {
    process.env.APIFY_TOKEN = 'token';
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => [{ transcript: 'hello', metadata: { title: 't' } }]
    } as any);
    (global as any).fetch = mockFetch;
  });

  afterEach(() => {
    (global as any).fetch = oldFetch;
    mockFetch.mockReset();
  });

  it('returns transcript and metadata', async () => {
    const result = await fetchTranscript('http://example.com');
    expect(result).toEqual({ transcript: 'hello', metadata: { title: 't' } });
    expect(mockFetch).toHaveBeenCalled();
  });

  it('throws if token missing', async () => {
    delete process.env.APIFY_TOKEN;
    await expect(fetchTranscript('http://example.com')).rejects.toThrow();
  });
});
