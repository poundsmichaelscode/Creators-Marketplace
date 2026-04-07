import { ProductCard } from '@/components/marketplace/product-card';
import { api } from '@/lib/api/client';

type Product = {
  id: string; title: string; slug: string; short_description: string; price_amount: string; currency: string;
};

export default async function ProductsPage() {
  const products = await api<Product[]>('/products/').catch(() => []);
  return (
    <main className="container-page py-10">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold">Marketplace</h1>
          <p className="mt-2 text-slate-400">Explore published digital products from creators.</p>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </main>
  );
}
