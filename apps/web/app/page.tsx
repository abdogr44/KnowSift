export default function Home() {
  return (
    <main className="p-4">
      <h1 className="text-xl font-bold mb-4">KnowSift</h1>
      <form action="/api/ingest" method="POST" className="space-x-2">
        <input
          type="url"
          name="url"
          placeholder="Video URL"
          className="border p-2"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2">
          Ingest
        </button>
      </form>
    </main>
  );
}
