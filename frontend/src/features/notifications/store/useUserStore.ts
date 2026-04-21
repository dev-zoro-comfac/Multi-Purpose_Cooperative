import { create } from "zustand";

type NotificationEditingStore = {
  value: number;
  isEditing: boolean;
  setValue: (value: number) => void;
  toggleEditing: () => void;
};
export const useEditingStore = create<NotificationEditingStore>(set => ({
  value: 0,
  isEditing: false,
  setValue: value => set({ value }),
  toggleEditing: () => set(state => ({ isEditing: !state.isEditing })),
}));
