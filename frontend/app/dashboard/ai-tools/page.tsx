'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api/client';

export default function AIToolsPage() {
  const [prompt, setPrompt] = useState('Generate a high-converting product description for my template bundle.');
  const [history, setHistory] = useState<any[]>([]);

  async function run() {
    await api('/ai/generate/', { method: 'POST', body: JSON.stringify({ generation_type: 'description', prompt }) });
    const next = await api<any[]>('/ai/history/').catch(() => []);
    setHistory(next);
  }

  useEffect(() => { api<any[]>('/ai/history/').then(setHistory).catch(() => setHistory([])); }, []);

  return (
    <main className="container-page grid gap-8 py-10 lg:grid-cols-[0.8fr_1.2fr]">
      <section className="card p-6">
        <h1 className="text-2xl font-bold">AI Assistant</h1>
        <textarea className="input mt-4 min-h-48" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
        <button className="btn-primary mt-4" onClick={run}>Generate</button>
      </section>
      <section className="card p-6">
        <h2 className="text-xl font-semibold">Generation history</h2>
        <div className="mt-4 space-y-4">
          {history.map((item) => (
            <div key={item.id} className="rounded-2xl border border-slate-800 p-4">
              <p className="text-sm text-brand">{item.generation_type}</p>
              <p className="mt-2 text-sm text-slate-400">{item.prompt}</p>
              <p className="mt-4 whitespace-pre-wrap">{item.result_text || item.status}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
