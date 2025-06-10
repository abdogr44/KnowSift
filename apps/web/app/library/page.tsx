'use client';
import { useEffect, useState } from 'react';
import { createClient, PostgrestError } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface Transcript {
  id: number;
  transcript: string;
  metadata: Record<string, unknown> | null;
}

export default function LibraryPage() {
  const [items, setItems] = useState<Transcript[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);

  const PAGE_SIZE = 10;

  // Subscribe to realtime updates
  useEffect(() => {
    const channel = supabase
      .channel('public:transcripts')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'transcripts' },
        (payload) => {
          setItems((current) => [payload.new as Transcript, ...current]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function loadData(query: string, pageIndex: number) {
    setLoading(true);
    setError(null);
    const from = pageIndex * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let { data, error: fetchError } = await supabase
      .from('transcripts')
      .select('*')
      .order('id', { ascending: false })
      .range(from, to);

    // Full-text search
    if (query.trim()) {
      const result = await supabase
        .from('transcripts')
        .select('*')
        .order('id', { ascending: false })
        .textSearch('transcript', query)
        .range(from, to);
      if (!result.error) {
        data = result.data;
      }
    }

    // Vector search via RPC (assumes a function named vector_search exists)
    if (query.trim()) {
      const { data: vectorData } = await supabase.rpc('vector_search', {
        query,
        match_count: PAGE_SIZE,
      });
      if (vectorData && vectorData.length > 0) {
        data = vectorData as Transcript[];
      }
    }

    if (fetchError) {
      setError((fetchError as PostgrestError).message);
    } else {
      setItems(data || []);
    }
    setLoading(false);
  }

  // Initial load and refresh when search or page changes
  useEffect(() => {
    loadData(search, page).catch((err) => setError(String(err)));
  }, [search, page]);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Library</h1>
      <input
        type="text"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(0);
        }}
        placeholder="Search transcripts"
        className="border p-2 rounded w-full"
      />
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}
      <ul className="space-y-2">
        {items.map((t) => (
          <li key={t.id} className="border p-2 rounded">
            {t.metadata?.title && (
              <p className="font-semibold">{String(t.metadata.title)}</p>
            )}
            <p className="text-sm whitespace-pre-wrap">{t.transcript}</p>
          </li>
        ))}
      </ul>
      <div className="flex justify-between pt-2">
        <button
          disabled={page === 0}
          onClick={() => setPage((p) => Math.max(0, p - 1))}
        >
          Previous
        </button>
        <button onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>
    </div>
  );
}
