export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatCompletionResponse {
  choices: { message?: { content?: string } }[];
}

/**
 * Summarize a transcript using OpenRouter. If the request fails, fall back to
 * DeepSeek. Both services follow the OpenAI-compatible chat completion API.
 *
 * Environment variables:
 * - OPENROUTER_API_KEY
 * - DEEPSEEK_API_KEY
 */
export async function summarizeTranscript(transcript: string): Promise<string> {
  const systemPrompt =
    'You are a helpful assistant that summarizes transcripts in a concise manner.';
  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    {
      role: 'user',
      content: `Summarize the following transcript:\n${transcript}`,
    },
  ];

  const openrouterKey = process.env.OPENROUTER_API_KEY;
  if (openrouterKey) {
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openrouterKey}`,
        },
        body: JSON.stringify({
          model: 'openai/gpt-3.5-turbo',
          messages,
        }),
      });

      if (res.ok) {
        const data = (await res.json()) as ChatCompletionResponse;
        const summary = data.choices?.[0]?.message?.content?.trim();
        if (summary) return summary;
      } else {
        throw new Error(`OpenRouter failed: ${res.status}`);
      }
    } catch (err) {
      console.error('OpenRouter summarization failed:', err);
    }
  }

  const deepseekKey = process.env.DEEPSEEK_API_KEY;
  if (!deepseekKey) {
    throw new Error('DEEPSEEK_API_KEY is not set');
  }

  const dsRes = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${deepseekKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages,
    }),
  });

  if (!dsRes.ok) {
    throw new Error(`DeepSeek failed: ${dsRes.status}`);
  }

  const dsData = (await dsRes.json()) as ChatCompletionResponse;
  const summary = dsData.choices?.[0]?.message?.content?.trim();
  if (!summary) {
    throw new Error('No summary returned from DeepSeek');
  }
  return summary;
}

/**
 * Generate an embedding using the `openai-embedding-3` model via OpenRouter.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not set');
  }

  const res = await fetch('https://openrouter.ai/api/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'openai/embedding-3-small',
      input: text,
    }),
  });

  if (!res.ok) {
    throw new Error(`Embedding request failed: ${res.status}`);
  }

  const data = (await res.json()) as { data?: { embedding?: number[] }[] };
  const embedding = data.data?.[0]?.embedding;
  if (!embedding) {
    throw new Error('No embedding returned');
  }
  return embedding;
}

export function coreAiPlaceholder() {
  return 'core-ai';
}
