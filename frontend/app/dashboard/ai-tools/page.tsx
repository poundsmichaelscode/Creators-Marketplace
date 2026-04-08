"use client";
import { useEffect, useState } from 'react';
import { api, ApiError } from '@/lib/api/client';

type Generation = { id: string; generation_type: string; prompt: string; result_text: string; status: string; created_at: string };
type Product = { id: string; title: string; short_description?: string };

const templates = {
  description: 'Generate a high-converting product description for my digital product. Focus on the transformation, included files, and who it is for.',
  captions: 'Write 5 launch captions for Instagram and X. Include hooks and a clear CTA.',
  email: 'Write a short product launch email with a strong subject line and conversion-focused body.',
  seo: 'Generate an SEO title, meta description, and 10 keywords for this product page.',
};

export default function AIToolsPage() {
  const [generationType, setGenerationType] = useState<'description' | 'captions' | 'email' | 'seo'>('description');
  const [prompt, setPrompt] = useState(templates.description);
  const [productId, setProductId] = useState('');
  const [history, setHistory] = useState<Generation[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState('');
  const [running, setRunning] = useState(false);

  async function loadData() {
    const [historyResult, productResult] = await Promise.all([
      api<Generation[]>('/ai/history/').catch(() => []),
      api<Product[]>('/products/?mine=1').catch(() => []),
    ]);
    setHistory(historyResult);
    setProducts(productResult);
  }

  useEffect(() => { loadData(); }, []);

  async function run() {
    setRunning(true);
    setError('');
    try {
      const product = products.find((item) => item.id === productId);
      const enrichedPrompt = product ? `${prompt}\n\nProduct context: ${product.title}${product.short_description ? ` - ${product.short_description}` : ''}` : prompt;
      await api('/ai/generate/', { method: 'POST', body: JSON.stringify({ generation_type: generationType, prompt: enrichedPrompt, product_id: productId || undefined }) });
      await loadData();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to run AI generation.');
    } finally {
      setRunning(false);
    }
  }

  return (
    <main className="container-page grid gap-8 py-10 xl:grid-cols-[0.95fr_1.05fr]">
      <section className="card p-6">
        <h1 className="text-2xl font-bold">AI creator assistant</h1>
        <p className="mt-2 text-slate-400">Generate product descriptions, social captions, SEO metadata, and launch emails directly from your dashboard.</p>
        <div className="mt-6 space-y-4">
          <div>
            <label className="label">Generation type</label>
            <select className="input" value={generationType} onChange={(e) => {
              const next = e.target.value as keyof typeof templates;
              setGenerationType(next);
              setPrompt(templates[next]);
            }}>
              <option value="description">Product description</option>
              <option value="captions">Social captions</option>
              <option value="email">Launch email</option>
              <option value="seo">SEO copy</option>
            </select>
          </div>
          <div>
            <label className="label">Linked product</label>
            <select className="input" value={productId} onChange={(e) => setProductId(e.target.value)}>
              <option value="">No linked product</option>
              {products.map((product) => <option key={product.id} value={product.id}>{product.title}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Prompt</label>
            <textarea className="input min-h-56" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          </div>
          {error ? <p className="rounded-xl border border-rose-900 bg-rose-950/40 px-3 py-2 text-sm text-rose-300">{error}</p> : null}
          <button className="btn-primary" onClick={run} disabled={running}>{running ? 'Generating...' : 'Generate copy'}</button>
        </div>
      </section>
      <section className="card p-6">
        <h2 className="text-xl font-semibold">Generation history</h2>
        <div className="mt-4 space-y-4">
          {history.map((item) => (
            <div key={item.id} className="rounded-2xl border border-slate-800 p-4">
              <div className="flex items-center gap-2"><span className="badge">{item.generation_type}</span><span className="badge">{item.status}</span></div>
              <p className="mt-3 text-sm text-slate-400">{item.prompt}</p>
              <p className="mt-4 whitespace-pre-wrap">{item.result_text || 'Queued for worker processing...'}</p>
            </div>
          ))}
          {!history.length ? <div className="rounded-2xl border border-slate-800 p-4 text-sm text-slate-400">No AI generations yet. Run your first one to populate this history.</div> : null}
        </div>
      </section>
    </main>
  );
}
