import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export let useSelectedCompany = create(
  persist(
    (set) => ({
      id: null,
      set: (id) => set({ id }),
    }),
    { name: 'eligibilityCompany' },
  ),
);
