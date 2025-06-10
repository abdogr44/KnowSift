import { fetchTranscript } from './index';

describe('fetchTranscript', () => {
  const oldFetch = global.fetch;
  const mockFetch = jest.fn();

  beforeEach(() => {
    process.env.APIFY_TOKEN = 'token';
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => [{ transcript: 'hello', metadata: { title: 't' } }]
    } as unknown as { ok: boolean; json: () => Promise<unknown> });
    (global as unknown as { fetch: jest.Mock }).fetch = mockFetch;
  });

  afterEach(() => {
    (global as unknown as { fetch: typeof mockFetch }).fetch = oldFetch as typeof mockFetch;
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
