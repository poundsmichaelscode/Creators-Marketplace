"use client";
import { useEffect, useMemo, useState } from 'react';
import { api, ApiError } from '@/lib/api/client';

type BuilderSection = { id: string; type: string; props: Record<string, any> };
type Product = { id: string; title: string };
type LandingPage = { id: string; title: string; slug: string; status: string; schema: { sections: BuilderSection[] } };

const sectionTemplates: Record<string, BuilderSection> = {
  hero: { id: 'hero_1', type: 'hero', props: { headline: 'Launch your flagship digital product', subheadline: 'A conversion-focused page built for creators.', ctaLabel: 'Buy now' } },
  features: { id: 'features_1', type: 'features', props: { items: [{ title: 'Instant download' }, { title: 'High-converting sections' }, { title: 'Creator-owned brand' }] } },
  testimonials: { id: 'testimonials_1', type: 'testimonials', props: { quote: 'This template helped me launch in a weekend.', author: 'Happy Creator' } },
  faq: { id: 'faq_1', type: 'faq', props: { items: [{ question: 'What is included?', answer: 'All files listed on the product page.' }] } },
};

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
}

export default function LandingPagesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [title, setTitle] = useState('Creator launch page');
  const [slug, setSlug] = useState('creator-launch-page');
  const [productId, setProductId] = useState('');
  const [themeMode, setThemeMode] = useState('dark');
  const [schema, setSchema] = useState<{ version: number; sections: BuilderSection[] }>({ version: 1, sections: [sectionTemplates.hero, sectionTemplates.features] });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function loadData() {
    const [productResults, pageResults] = await Promise.all([
      api<Product[]>('/products/?mine=1').catch(() => []),
      api<LandingPage[]>('/landing-pages/').catch(() => []),
    ]);
    setProducts(productResults);
    setPages(pageResults);
  }

  useEffect(() => { loadData(); }, []);

  const previewHero = useMemo(() => schema.sections.find((section) => section.type === 'hero'), [schema]);

  function addSection(type: keyof typeof sectionTemplates) {
    const template = sectionTemplates[type];
    setSchema((prev) => ({ ...prev, sections: [...prev.sections, { ...template, id: `${type}_${Date.now()}` }] }));
  }

  function updateHero(key: 'headline' | 'subheadline' | 'ctaLabel', value: string) {
    setSchema((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => section.type === 'hero' ? { ...section, props: { ...section.props, [key]: value } } : section),
    }));
  }

  async function savePage() {
    setSaving(true);
    setError('');
    try {
      const payload = { title, slug, product: productId || null, schema, theme: { mode: themeMode } };
      await api('/landing-pages/', { method: 'POST', body: JSON.stringify(payload) });
      setTitle('Creator launch page');
      setSlug('creator-launch-page');
      setProductId('');
      setSchema({ version: 1, sections: [sectionTemplates.hero, sectionTemplates.features] });
      await loadData();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to save landing page.');
    } finally {
      setSaving(false);
    }
  }

  async function publishPage(id: string) {
    await api(`/landing-pages/${id}/publish/`, { method: 'POST' });
    await loadData();
  }

  return (
    <main className="container-page grid gap-8 py-10 xl:grid-cols-[1.05fr_0.95fr]">
      <section className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Landing page builder</h1>
          <p className="mt-2 text-slate-400">Create launch pages with reusable sections and publish them for your digital products.</p>
        </div>
        <div className="card p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="label">Page title</label>
              <input className="input" value={title} onChange={(e) => { setTitle(e.target.value); setSlug(slugify(e.target.value)); }} />
            </div>
            <div>
              <label className="label">Slug</label>
              <input className="input" value={slug} onChange={(e) => setSlug(e.target.value)} />
            </div>
            <div>
              <label className="label">Attach product</label>
              <select className="input" value={productId} onChange={(e) => setProductId(e.target.value)}>
                <option value="">No linked product</option>
                {products.map((product) => <option key={product.id} value={product.id}>{product.title}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Theme mode</label>
              <select className="input" value={themeMode} onChange={(e) => setThemeMode(e.target.value)}>
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>
            <div className="md:col-span-2 grid gap-4 rounded-2xl border border-slate-800 p-4 md:grid-cols-3">
              <div>
                <label className="label">Hero headline</label>
                <input className="input" value={previewHero?.props.headline || ''} onChange={(e) => updateHero('headline', e.target.value)} />
              </div>
              <div>
                <label className="label">Hero subheadline</label>
                <input className="input" value={previewHero?.props.subheadline || ''} onChange={(e) => updateHero('subheadline', e.target.value)} />
              </div>
              <div>
                <label className="label">CTA label</label>
                <input className="input" value={previewHero?.props.ctaLabel || ''} onChange={(e) => updateHero('ctaLabel', e.target.value)} />
              </div>
            </div>
            <div className="md:col-span-2 flex flex-wrap gap-2">
              <button type="button" className="btn-secondary" onClick={() => addSection('hero')}>Add hero</button>
              <button type="button" className="btn-secondary" onClick={() => addSection('features')}>Add features</button>
              <button type="button" className="btn-secondary" onClick={() => addSection('testimonials')}>Add testimonials</button>
              <button type="button" className="btn-secondary" onClick={() => addSection('faq')}>Add FAQ</button>
            </div>
            <div className="md:col-span-2">
              <label className="label">Schema JSON</label>
              <textarea className="input min-h-80 font-mono text-sm" value={JSON.stringify(schema, null, 2)} onChange={(e) => { try { setSchema(JSON.parse(e.target.value)); setError(''); } catch { setError('Schema must be valid JSON before saving.'); } }} />
            </div>
            {error ? <p className="md:col-span-2 rounded-xl border border-rose-900 bg-rose-950/40 px-3 py-2 text-sm text-rose-300">{error}</p> : null}
            <button type="button" onClick={savePage} className="btn-primary md:col-span-2" disabled={saving}>{saving ? 'Saving page...' : 'Save landing page'}</button>
          </div>
        </div>
      </section>
      <section className="space-y-6">
        <div className="card p-6">
          <p className="text-sm uppercase tracking-[0.2em] text-brand">Live preview</p>
          <div className="mt-4 rounded-3xl border border-slate-800 p-6">
            <h2 className="text-3xl font-bold">{previewHero?.props.headline || 'Hero headline'}</h2>
            <p className="mt-3 text-slate-400">{previewHero?.props.subheadline || 'Subheadline preview'}</p>
            <button className="btn-primary mt-6">{previewHero?.props.ctaLabel || 'Buy now'}</button>
          </div>
        </div>
        <div className="space-y-3">
          {pages.map((page) => (
            <div key={page.id} className="card p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2"><h3 className="font-semibold">{page.title}</h3><span className="badge">{page.status}</span></div>
                  <p className="mt-1 text-sm text-slate-400">/{page.slug}</p>
                </div>
                {page.status !== 'published' ? <button type="button" className="btn-primary" onClick={() => publishPage(page.id)}>Publish</button> : null}
              </div>
            </div>
          ))}
          {!pages.length ? <div className="card p-6 text-sm text-slate-400">No landing pages yet. Save your first page to see it here.</div> : null}
        </div>
      </section>
    </main>
  );
}
