import Link from 'next/link';

type Product = {
  id: string;
  title: string;
  slug: string;
  short_description?: string;
  price_amount: string;
  currency: string;
  thumbnail_url?: string;
};

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`} className="card overflow-hidden">
      <div className="aspect-video bg-slate-800" />
      <div className="space-y-2 p-4">
        <h3 className="font-semibold">{product.title}</h3>
        <p className="text-sm text-slate-400">{product.short_description}</p>
        <p className="text-sm font-medium text-brand">{product.currency} {product.price_amount}</p>
      </div>
    </Link>
  );
}
