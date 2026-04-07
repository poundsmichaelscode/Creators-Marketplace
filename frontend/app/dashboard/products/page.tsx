'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api/client';

export default function DashboardProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  useEffect(() => { api<any[]>('/products/').then(setProducts).catch(() => setProducts([])); }, []);

  async function createProduct(e: React.FormEvent) {
    e.preventDefault();
    const slug = title.toLowerCase().replace(/\s+/g, '-');
    const created = await api<any>('/products/', {
      method: 'POST',
      body: JSON.stringify({ title, slug, product_type: 'template', price_amount: '29.00', currency: 'USD', short_description: 'New digital product' }),
    });
    setProducts((prev) => [created, ...prev]);
    setTitle('');
  }

  return (
    <main className="container-page space-y-8 py-10">
      <h1 className="text-3xl font-bold">Products</h1>
      <form onSubmit={createProduct} className="card flex gap-3 p-4">
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="input" placeholder="Product title" />
        <button className="btn-primary">Create</button>
      </form>
      <div className="space-y-3">
        {products.map((product) => (
          <div key={product.id} className="card flex items-center justify-between p-4">
            <div>
              <p className="font-medium">{product.title}</p>
              <p className="text-sm text-slate-400">{product.status}</p>
            </div>
            <button
              className="btn-secondary"
              onClick={async () => {
                const updated = await api<any>(`/products/${product.id}/publish/`, { method: 'POST' });
                setProducts((items) => items.map((item) => item.id === updated.id ? updated : item));
              }}
            >
              Publish
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
