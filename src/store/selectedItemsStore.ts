import { create } from 'zustand';
import type { CharacterCardData } from '../api/characters';

interface SelectedItemsState {
  selectedItems: Record<number, CharacterCardData>;
  toggleItem: (item: CharacterCardData) => void;
  clearSelected: () => void;
}

export const useSelectedItemsStore = create<SelectedItemsState>((set) => ({
  selectedItems: {},
  toggleItem: (item) =>
    set((state) => {
      const nextSelectedItems = { ...state.selectedItems };

      if (nextSelectedItems[item.id]) {
        delete nextSelectedItems[item.id];
      } else {
        nextSelectedItems[item.id] = item;
      }

      return { selectedItems: nextSelectedItems };
    }),
  clearSelected: () => set({ selectedItems: {} }),
}));
