import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ListHeaderState {
  showPrice: boolean;
  setShowPrice: (showPrice: boolean) => void;
}

export const useList = create<ListHeaderState>()(
  persist(
    (set) => ({
      showPrice: false,
      setShowPrice: (showPrice) => set({ showPrice }),
    }),
    {
      name: 'list-header-store',
    }
  )
);