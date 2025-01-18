import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export let useReferralList = create(
  persist(
    (set, get) => ({
      providers: [],
      addProvider: (provider) => {
        let { providers } = get();
        let newProviders = providers.filter((p) => p.id !== provider.id);

        if (newProviders.length === providers.length) {
          newProviders.push(provider);
        }

        set({ providers: newProviders });
      },
      removeProvider: (id) => {
        let { providers } = get();
        set({ providers: providers.filter((p) => p.id !== id) });
      },
      setProviderNote: (id, note) => {
        let { providers } = get();
        set({ providers: providers.map((p) => (p.id === id ? { ...p, note } : p)) });
      },
      clear: () => {
        set({ providers: [] });
      },
    }),
    { name: 'referralList' },
  ),
);

window.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    useReferralList.persist.rehydrate();
  }
});
