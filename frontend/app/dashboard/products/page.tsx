"use client";
import { useEffect, useMemo, useState } from 'react';
import { api, ApiError } from '@/lib/api/client';

type Product = {
  id: string;
  title: string;
  slug: string;
  short_description?: string;
  description?: string;
  product_type: string;
  status: string;
  price_amount: string;
  currency: string;
  thumbnail_url?: string;
  delivery_type?: string;
};

const initialForm = {
  title: '',
  slug: '',
  short_description: '',
  description: '',
  product_type: 'template',
  price_amount: '29.00',
  currency: 'USD',
  thumbnail_url: '',
  delivery_type: 'file_download',
};

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
}

export default function DashboardProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const previewPrice = useMemo(() => `${form.currency} ${form.price_amount}`, [form]);

  async function loadProducts() {
    const result = await api<Product[]>('/products/?mine=1');
    setProducts(result);
  }

  useEffect(() => { loadProducts().catch(() => setProducts([])); }, []);

  async function createProduct(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const created = await api<Product>('/products/', {
        method: 'POST',
        body: JSON.stringify({ ...form, slug: form.slug || slugify(form.title) }),
      });
      setProducts((prev) => [created, ...prev]);
      setForm(initialForm);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to create product.');
    } finally {
      setLoading(false);
    }
  }

  async function mutateProduct(productId: string, action: 'publish' | 'archive') {
    const updated = await api<Product>(`/products/${productId}/${action}/`, { method: 'POST' });
    setProducts((items) => items.map((item) => item.id === updated.id ? updated : item));
  }

  return (
    <main className="container-page grid gap-8 py-10 xl:grid-cols-[1.05fr_0.95fr]">
      <section className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Digital products</h1>
          <p className="mt-2 text-slate-400">Add new digital goods, define pricing, set delivery type, and publish your catalog.</p>
        </div>
        <form onSubmit={createProduct} className="card grid gap-4 p-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="label">Product title</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: slugify(e.target.value) })} className="input" placeholder="Premium UI Template Pack" required />
          </div>
          <div>
            <label className="label">Slug</label>
            <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="input" placeholder="premium-ui-template-pack" />
          </div>
          <div>
            <label className="label">Product type</label>
            <select className="input" value={form.product_type} onChange={(e) => setForm({ ...form, product_type: e.target.value })}>
              <option value="course">Course</option>
              <option value="music">Music</option>
              <option value="template">Template</option>
              <option value="code">Code</option>
              <option value="ebook">Ebook</option>
              <option value="bundle">Bundle</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="label">Short description</label>
            <input value={form.short_description} onChange={(e) => setForm({ ...form, short_description: e.target.value })} className="input" placeholder="A concise one-line pitch for your product." />
          </div>
          <div className="md:col-span-2">
            <label className="label">Full description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input min-h-40" placeholder="Describe what is included, outcomes, files, bonuses and ideal buyers." />
          </div>
          <div>
            <label className="label">Price</label>
            <input value={form.price_amount} onChange={(e) => setForm({ ...form, price_amount: e.target.value })} className="input" />
          </div>
          <div>
            <label className="label">Currency</label>
            <select className="input" value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}>
              <option value="USD">USD</option>
              <option value="NGN">NGN</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
          <div>
            <label className="label">Delivery type</label>
            <select className="input" value={form.delivery_type} onChange={(e) => setForm({ ...form, delivery_type: e.target.value })}>
              <option value="file_download">File download</option>
              <option value="external_link">External link</option>
              <option value="license_key">License key</option>
            </select>
          </div>
          <div>
            <label className="label">Thumbnail URL</label>
            <input value={form.thumbnail_url} onChange={(e) => setForm({ ...form, thumbnail_url: e.target.value })} className="input" placeholder="https://..." />
          </div>
          {error ? <p className="md:col-span-2 rounded-xl border border-rose-900 bg-rose-950/40 px-3 py-2 text-sm text-rose-300">{error}</p> : null}
          <button className="btn-primary md:col-span-2" disabled={loading}>{loading ? 'Creating product...' : 'Add digital product'}</button>
        </form>
      </section>

      <section className="space-y-6">
        <div className="card p-6">
          <p className="text-sm uppercase tracking-[0.2em] text-brand">Preview</p>
          <h2 className="mt-3 text-2xl font-bold">{form.title || 'Your product title'}</h2>
          <p className="mt-2 text-slate-400">{form.short_description || 'A concise pitch for your digital product will appear here.'}</p>
          <div className="mt-4 flex items-center gap-3"><span className="badge">{form.product_type}</span><span className="badge">{previewPrice}</span></div>
          <p className="mt-4 text-sm text-slate-500">{form.description || 'Long-form description preview.'}</p>
        </div>
        <div className="space-y-3">
          {products.map((product) => (
            <div key={product.id} className="card p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold">{product.title}</h3>
                    <span className="badge">{product.status}</span>
                    <span className="badge">{product.currency} {product.price_amount}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-400">{product.short_description}</p>
                  <p className="mt-2 text-xs text-slate-500">/{product.slug}</p>
                </div>
                <div className="flex gap-2">
                  {product.status !== 'published' ? <button type="button" className="btn-primary" onClick={() => mutateProduct(product.id, 'publish')}>Publish</button> : null}
                  {product.status !== 'archived' ? <button type="button" className="btn-secondary" onClick={() => mutateProduct(product.id, 'archive')}>Archive</button> : null}
                </div>
              </div>
            </div>
          ))}
          {!products.length ? <div className="card p-6 text-sm text-slate-400">No products yet. Create your first digital product to populate this list.</div> : null}
        </div>
      </section>
    </main>
  );
}
