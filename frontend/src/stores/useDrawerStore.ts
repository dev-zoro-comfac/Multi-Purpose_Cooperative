import { create } from "zustand";
import { persist } from "zustand/middleware";

type DrawerState = {
  open: boolean;
  isClosing: boolean;
  toggle: () => void;
  closeDrawer: () => void;
  setClosing: (isClosing: boolean) => void;
};

const useDrawerStore = create<DrawerState>()(
  persist(
    (set, get) => ({
      open: true,
      isClosing: false,

      toggle: () => set({ open: !get().open }),
      closeDrawer: () => set({ open: false, isClosing: true }),
      setClosing: isClosing => set({ isClosing }),
    }),
    {
      name: "drawer-store",
      partialize: state => ({
        open: state.open,
      }),
    }
  )
);

export default useDrawerStore;
