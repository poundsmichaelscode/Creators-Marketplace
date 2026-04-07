'use client';
import { FormEvent, useState } from 'react';
import { api } from '@/lib/api/client';
import { useAuthStore } from '@/stores/auth-store';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const setToken = useAuthStore((s) => s.setToken);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const res = await api<{ access: string }>('/auth/login/', { method: 'POST', body: JSON.stringify({ email, password }) });
    setToken(res.access);
    router.push('/dashboard');
  }

  return (
    <main className="container-page py-20">
      <form onSubmit={handleSubmit} className="mx-auto max-w-md card p-8">
        <h1 className="text-2xl font-bold">Sign in</h1>
        <div className="mt-6 space-y-4">
          <input className="input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="input" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="btn-primary w-full">Login</button>
        </div>
      </form>
    </main>
  );
}
