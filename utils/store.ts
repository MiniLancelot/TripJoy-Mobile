import { create } from 'zustand';

type TabStore = {
  sharedId: string | null;
  setSharedId: (id: string) => void;
};

export const useTabStore = create<TabStore>((set) => ({
  sharedId: null,
  setSharedId: (id: string) => set({ sharedId: id }),
}));