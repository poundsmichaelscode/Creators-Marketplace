'use client';
import { api } from '@/lib/api/client';

export default function CheckoutButton({ productId }: { productId: string }) {
  async function handlePurchase() {
    const res = await api<{ url: string }>('/payments/checkout/session/', {
      method: 'POST',
      body: JSON.stringify({ product_id: productId }),
    });
    window.location.href = res.url;
  }

  return <button onClick={handlePurchase} className="btn-primary mt-6 w-full">Buy now</button>;
}
