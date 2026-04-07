import Link from 'next/link';

export default function HomePage() {
  return (
    <main>
      <section className="container-page py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.2em] text-brand">Sell. Launch. Analyze.</p>
          <h1 className="text-5xl font-bold tracking-tight">Build your creator business with AI-powered commerce.</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-400">
            Sell digital products, publish landing pages, generate marketing copy, and track performance in one platform.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link href="/dashboard" className="btn-primary">Open Dashboard</Link>
            <Link href="/products" className="btn-secondary">Browse Marketplace</Link>
          </div>
        </div>
      </section>
      <section className="container-page grid gap-6 pb-20 md:grid-cols-3">
        {[
          ['Digital products', 'Courses, templates, code, music, ebooks, and bundles.'],
          ['Landing page builder', 'Section-based pages that render fast and stay easy to manage.'],
          ['AI tools', 'Generate descriptions, captions, and promotional copy.'],
        ].map(([title, body]) => (
          <div key={title} className="card p-6"><h2 className="text-xl font-semibold">{title}</h2><p className="mt-3 text-slate-400">{body}</p></div>
        ))}
      </section>
    </main>
  );
}
