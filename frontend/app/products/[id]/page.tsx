import { api } from '@/lib/api/client';
import CheckoutButton from './purchase-button';

type Product = { id: string; title: string; description: string; short_description: string; price_amount: string; currency: string; creator_slug: string };

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await api<Product>(`/products/${id}/`);
  return (
    <main className="container-page py-10">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <section>
          <div className="aspect-video rounded-3xl bg-slate-800" />
          <h1 className="mt-6 text-4xl font-bold">{product.title}</h1>
          <p className="mt-4 text-lg text-slate-400">{product.short_description}</p>
          <article className="prose prose-invert mt-8 max-w-none">
            <p>{product.description}</p>
          </article>
        </section>
        <aside className="card h-fit p-6">
          <p className="text-sm text-slate-400">Created by {product.creator_slug}</p>
          <p className="mt-4 text-3xl font-semibold">{product.currency} {product.price_amount}</p>
          <CheckoutButton productId={product.id} />
          <ul className="mt-6 space-y-2 text-sm text-slate-400">
            <li>Instant delivery after payment</li>
            <li>Secure checkout powered by Stripe</li>
            <li>Access from your orders dashboard</li>
          </ul>
        </aside>
      </div>
    </main>
  );
}
