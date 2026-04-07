'use client';
import { create } from 'zustand';

type CartItem = { id: string; title: string; price_amount: number; slug: string };

type CartState = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
};

export const useCartStore = create<CartState>((set) => ({
  items: [],
  addItem: (item) => set((state) => ({ items: state.items.some((x) => x.id === item.id) ? state.items : [...state.items, item] })),
  removeItem: (id) => set((state) => ({ items: state.items.filter((x) => x.id !== id) })),
}));
