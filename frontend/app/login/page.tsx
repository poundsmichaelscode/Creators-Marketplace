"use client";
import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { api, ApiError } from '@/lib/api/client';
import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'next/navigation';
import { SocialButtons, mergeSocialProviders } from '@/components/auth/social-buttons';

type SocialProvider = { name: string; label: string; url: string; enabled: boolean };

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [providers, setProviders] = useState<SocialProvider[]>(mergeSocialProviders());
  const router = useRouter();
  const setToken = useAuthStore((s) => s.setToken);

  useEffect(() => {
    api<SocialProvider[]>('/auth/social-providers/')
      .then((data) => setProviders(mergeSocialProviders(data)))
      .catch(() => setProviders(mergeSocialProviders()));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api<{ access: string; refresh?: string }>('/auth/login/', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setToken(res.access);
      if (typeof window !== 'undefined' && res.refresh) localStorage.setItem('refreshToken', res.refresh);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to sign in.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container-page grid min-h-[calc(100vh-4rem)] items-center gap-10 py-10 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="space-y-6">
        <span className="badge">Creators Marketplace</span>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Sell digital products, launch faster, and market with AI.</h1>
        <p className="max-w-xl text-lg text-slate-400">Access your creator dashboard to manage products, build conversion-focused landing pages, and generate marketing copy in seconds.</p>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ['Product catalog', 'Courses, templates, music, code and more.'],
            ['Landing builder', 'Section-based pages with publish-ready previews.'],
            ['AI copy', 'Descriptions, captions and launch assets.'],
          ].map(([title, body]) => (
            <div key={title} className="card p-4"><h2 className="font-semibold">{title}</h2><p className="mt-2 text-sm text-slate-400">{body}</p></div>
          ))}
        </div>
      </section>

      <section className="card p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-400">Use your email and password or connect with a configured social provider.</p>
        </div>
        <SocialButtons providers={providers} />
        <div className="my-6 flex items-center gap-3 text-sm text-slate-500"><div className="h-px flex-1 bg-slate-800" />or<div className="h-px flex-1 bg-slate-800" /></div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="label mb-0">Password</label>
              <span className="text-xs text-slate-500">Minimum 8 characters</span>
            </div>
            <input className="input" placeholder="Enter your password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
          </div>
          {error ? <p className="rounded-xl border border-rose-900 bg-rose-950/40 px-3 py-2 text-sm text-rose-300">{error}</p> : null}
          <button className="btn-primary w-full" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
        </form>
        <p className="mt-6 text-sm text-slate-400">New here? <Link href="/signup" className="text-brand underline-offset-4 hover:underline">Create an account</Link></p>
      </section>
    </main>
  );
}
