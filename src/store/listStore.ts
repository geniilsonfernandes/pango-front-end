import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ListDTO } from '@/service/api';

interface ListHeaderState {
  showPrice: boolean;
  setShowPrice: (showPrice: boolean) => void;
  list: ListDTO | undefined;
  setList: (list: ListDTO | undefined) => void;
}

export const useListStore = create<ListHeaderState>()(
  persist(
    (set) => ({
      showPrice: false,
      setShowPrice: (showPrice) => set({ showPrice }),
      list: undefined,
      setList: (list) => set({ list }),
    }),
    {
      name: 'list-header-store',
    }
  )
);
