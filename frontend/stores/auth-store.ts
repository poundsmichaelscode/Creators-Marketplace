'use client';
import { create } from 'zustand';

type User = { id: string; email: string; role: string } | null;

type AuthState = {
  user: User;
  setUser: (user: User) => void;
  setToken: (token: string | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  setToken: (token) => {
    if (typeof window === 'undefined') return;
    if (token) localStorage.setItem('accessToken', token);
    else localStorage.removeItem('accessToken');
  },
}));
