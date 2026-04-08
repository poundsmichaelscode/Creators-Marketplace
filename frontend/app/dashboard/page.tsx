import Link from 'next/link';
import { StatCard } from '@/components/dashboard/stat-card';

export default function DashboardHomePage() {
  return (
    <main className="container-page space-y-8 py-10">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-brand">Creator workspace</p>
          <h1 className="text-3xl font-bold">Dashboard overview</h1>
          <p className="mt-2 text-slate-400">Manage digital products, landing pages, and AI-powered launch assets.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/products" className="btn-primary">Manage products</Link>
          <Link href="/dashboard/landing-pages" className="btn-secondary">Build landing page</Link>
        </div>
      </div>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Published products" value="4" hint="Your storefront catalog" />
        <StatCard title="Landing pages" value="3" hint="One-click publish pages" />
        <StatCard title="AI generations" value="28" hint="Copy assets created" />
        <StatCard title="Revenue" value="$3,840" hint="Mock dashboard metric" />
      </section>
      <section className="grid gap-4 lg:grid-cols-3">
        <Link href="/dashboard/products" className="card p-6"><h2 className="text-xl font-semibold">Digital products</h2><p className="mt-2 text-slate-400">Add title, pricing, descriptions, previews and publish status.</p></Link>
        <Link href="/dashboard/landing-pages" className="card p-6"><h2 className="text-xl font-semibold">Landing page builder</h2><p className="mt-2 text-slate-400">Build structured launch pages with hero, features, testimonials and FAQ sections.</p></Link>
        <Link href="/dashboard/ai-tools" className="card p-6"><h2 className="text-xl font-semibold">AI launch assistant</h2><p className="mt-2 text-slate-400">Generate descriptions, captions, promo blurbs and SEO copy.</p></Link>
      </section>
    </main>
  );
}
