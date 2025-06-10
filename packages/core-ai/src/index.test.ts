/* eslint-disable */
import {
  coreAiPlaceholder,
  summarizeTranscript,
  generateEmbedding,
} from './index';

beforeEach(() => {
  jest.resetAllMocks();
});

test('coreAiPlaceholder returns core-ai', () => {
  expect(coreAiPlaceholder()).toBe('core-ai');
});

test('summarizeTranscript uses OpenRouter when available', async () => {
  const fetchMock = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ choices: [{ message: { content: 'summary' } }] }),
  });
  global.fetch = fetchMock as any;
  process.env.OPENROUTER_API_KEY = 'key';

  const summary = await summarizeTranscript('hello');
  expect(summary).toBe('summary');
  expect(fetchMock).toHaveBeenCalledWith(
    expect.stringContaining('openrouter'),
    expect.any(Object),
  );
});

test('summarizeTranscript falls back to DeepSeek', async () => {
  const fetchMock = jest
    .fn()
    .mockRejectedValueOnce(new Error('fail'))
    .mockResolvedValueOnce({
      ok: true,
      json: async () => ({ choices: [{ message: { content: 'ds' } }] }),
    });
  global.fetch = fetchMock as any;
  process.env.OPENROUTER_API_KEY = 'key';
  process.env.DEEPSEEK_API_KEY = 'dkey';

  const summary = await summarizeTranscript('hello');
  expect(summary).toBe('ds');
  expect(fetchMock.mock.calls[1][0]).toContain('deepseek');
});

test('generateEmbedding fetches embedding', async () => {
  const fetchMock = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({ data: [{ embedding: [1, 2, 3] }] }),
  });
  global.fetch = fetchMock as any;
  process.env.OPENROUTER_API_KEY = 'key';

  const result = await generateEmbedding('hi');
  expect(result).toEqual([1, 2, 3]);
  expect(fetchMock).toHaveBeenCalledWith(
    expect.stringContaining('embeddings'),
    expect.any(Object),
  );
});
