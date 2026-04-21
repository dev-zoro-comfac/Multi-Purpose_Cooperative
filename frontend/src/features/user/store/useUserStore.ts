import { create } from "zustand";

type UserEditingStore = {
  value: number;
  isEditing: boolean;
  setValue: (value: number) => void;
  toggleEditing: () => void;
};
export const useEditingStore = create<UserEditingStore>(set => ({
  value: 0,
  isEditing: false,
  setValue: value => set({ value }),
  toggleEditing: () => set(state => ({ isEditing: !state.isEditing })),
}));
