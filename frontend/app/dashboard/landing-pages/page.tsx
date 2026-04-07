'use client';
import { useState } from 'react';
import { api } from '@/lib/api/client';

const defaultSchema = {
  version: 1,
  sections: [
    { id: 'hero_1', type: 'hero', props: { headline: 'Your headline', subheadline: 'Your product pitch', ctaLabel: 'Buy now' } },
    { id: 'features_1', type: 'features', props: { items: [{ title: 'Feature one' }, { title: 'Feature two' }] } }
  ]
};

export default function LandingPagesPage() {
  const [title, setTitle] = useState('Creator launch page');
  const [slug, setSlug] = useState('creator-launch-page');
  const [schema, setSchema] = useState(JSON.stringify(defaultSchema, null, 2));

  async function savePage() {
    await api('/landing-pages/', { method: 'POST', body: JSON.stringify({ title, slug, schema: JSON.parse(schema), theme: { mode: 'dark' } }) });
    alert('Saved');
  }

  return (
    <main className="container-page grid gap-8 py-10 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="card p-6">
        <h1 className="text-2xl font-bold">Landing Page Builder</h1>
        <div className="mt-4 space-y-4">
          <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
          <input className="input" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="Slug" />
          <textarea className="input min-h-96 font-mono" value={schema} onChange={(e) => setSchema(e.target.value)} />
          <button onClick={savePage} className="btn-primary">Save page</button>
        </div>
      </section>
      <section className="card p-6">
        <h2 className="text-xl font-semibold">Preview concept</h2>
        <div className="mt-6 rounded-2xl border border-slate-800 p-6">
          <p className="text-sm uppercase tracking-[0.2em] text-brand">Hero section</p>
          <h3 className="mt-3 text-3xl font-bold">Your headline</h3>
          <p className="mt-3 text-slate-400">Your product pitch</p>
          <button className="btn-primary mt-6">Buy now</button>
        </div>
      </section>
    </main>
  );
}
