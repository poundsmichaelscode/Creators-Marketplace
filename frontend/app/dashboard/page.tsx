import { api } from '@/lib/api/client';
import { StatCard } from '@/components/dashboard/stat-card';

export default async function DashboardPage() {
  const summary = await api<{ revenue: number; top_products: { product__title: string; count: number }[] }>('/analytics/summary/').catch(() => ({ revenue: 0, top_products: [] }));
  return (
    <main className="container-page space-y-8 py-10">
      <div>
        <h1 className="text-3xl font-bold">Creator Dashboard</h1>
        <p className="mt-2 text-slate-400">Monitor sales, products, and creator activity.</p>
      </div>
      <section className="grid gap-6 md:grid-cols-3">
        <StatCard title="Revenue" value={`$${summary.revenue || 0}`} />
        <StatCard title="Top products tracked" value={summary.top_products.length} />
        <StatCard title="AI tools" value="Ready" hint="Descriptions, captions, and more" />
      </section>
      <section className="card p-6">
        <h2 className="text-xl font-semibold">Top products</h2>
        <div className="mt-4 space-y-3">
          {summary.top_products.map((item) => (
            <div key={item.product__title} className="flex items-center justify-between rounded-xl border border-slate-800 p-3">
              <span>{item.product__title}</span><span className="text-slate-400">{item.count} sales</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
