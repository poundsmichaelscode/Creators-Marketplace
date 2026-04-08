import Link from 'next/link';

export function Header() {
  return (
    <header className="border-b border-slate-800 bg-slate-950/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="text-lg font-semibold">Creators Marketplace</Link>
        <nav className="flex items-center gap-4 text-sm text-slate-300">
          <Link href="/products">Marketplace</Link>
          <Link href="/dashboard/products">Products</Link>
          <Link href="/dashboard/landing-pages">Landing Pages</Link>
          <Link href="/dashboard/ai-tools">AI Tools</Link>
          <Link href="/login" className="btn-primary">Sign in</Link>
        </nav>
      </div>
    </header>
  );
}
