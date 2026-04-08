"use client";
import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';
import { api, ApiError } from '@/lib/api/client';
import { useRouter } from 'next/navigation';
import { SocialButtons, mergeSocialProviders } from '@/components/auth/social-buttons';

type SocialProvider = { name: string; label: string; url: string; enabled: boolean };

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ first_name: '', last_name: '', username: '', email: '', role: 'creator', password: '', confirm_password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [providers, setProviders] = useState<SocialProvider[]>(mergeSocialProviders());

  useEffect(() => {
    api<SocialProvider[]>('/auth/social-providers/')
      .then((data) => setProviders(mergeSocialProviders(data)))
      .catch(() => setProviders(mergeSocialProviders()));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (form.password !== form.confirm_password) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      await api('/auth/register/', { method: 'POST', body: JSON.stringify(form) });
      setSuccess('Account created successfully. Redirecting to sign in...');
      setTimeout(() => router.push('/login'), 800);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Unable to create account.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container-page grid min-h-[calc(100vh-4rem)] items-center gap-10 py-10 lg:grid-cols-[1fr_1fr]">
      <section>
        <span className="badge">Start selling today</span>
        <h1 className="mt-4 text-4xl font-bold">Create your creator storefront account</h1>
        <p className="mt-4 max-w-xl text-lg text-slate-400">Join as a creator or buyer, publish products, build high-converting landing pages, and manage sales from one clean workspace.</p>
      </section>
      <section className="card p-8">
        <h2 className="text-2xl font-bold">Create account</h2>
        <div className="mt-4">
          <SocialButtons providers={providers} />
        </div>
        <div className="my-6 flex items-center gap-3 text-sm text-slate-500"><div className="h-px flex-1 bg-slate-800" />or<div className="h-px flex-1 bg-slate-800" /></div>
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label">First name</label>
            <input className="input" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} />
          </div>
          <div>
            <label className="label">Last name</label>
            <input className="input" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} />
          </div>
          <div>
            <label className="label">Username</label>
            <input className="input" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="creatorhandle" />
          </div>
          <div>
            <label className="label">Role</label>
            <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="creator">Creator</option>
              <option value="buyer">Buyer</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="label">Email</label>
            <input className="input" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" type="password" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <div>
            <label className="label">Confirm password</label>
            <input className="input" type="password" required minLength={8} value={form.confirm_password} onChange={(e) => setForm({ ...form, confirm_password: e.target.value })} />
          </div>
          {error ? <p className="md:col-span-2 rounded-xl border border-rose-900 bg-rose-950/40 px-3 py-2 text-sm text-rose-300">{error}</p> : null}
          {success ? <p className="md:col-span-2 rounded-xl border border-emerald-900 bg-emerald-950/40 px-3 py-2 text-sm text-emerald-300">{success}</p> : null}
          <button className="btn-primary md:col-span-2" disabled={loading}>{loading ? 'Creating account...' : 'Create account'}</button>
        </form>
        <p className="mt-6 text-sm text-slate-400">Already have an account? <Link href="/login" className="text-brand underline-offset-4 hover:underline">Sign in</Link></p>
      </section>
    </main>
  );
}
