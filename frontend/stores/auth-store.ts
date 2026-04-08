import { create } from 'zustand';

type AuthState = {
  accessToken: string | null;
  setToken: (token: string | null) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null,
  setToken: (token) => {
    if (typeof window !== 'undefined') {
      if (token) localStorage.setItem('accessToken', token);
      else localStorage.removeItem('accessToken');
    }
    set({ accessToken: token });
  },
}));
