import {
  ColumnFiltersState,
  OnChangeFn,
  SortingState,
} from "@tanstack/react-table";
import { create } from "zustand";
import { pageConfig } from "@/constant/pagination";

export type UserActionStore = {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;

  pageIndex: number;
  resetPageIndex: () => void;
  pageSize: number;
  resetPageSize: () => void;

  pendingDeletion: string;
  setPendingDeletion: (id: string) => void;
  resetPendingDeletion: () => void;

  pendingRestore: string;
  setPendingRestore: (string: string) => void;
  resetPendingRestore: () => void;

  setSorting: OnChangeFn<SortingState>;
  resetSorting: () => void;

  setColumnFilters: OnChangeFn<ColumnFiltersState>;
  resetFilters: () => void;

  setPageIndex: (pageIndex: number) => void;
  setPageSize: (pageSize: number) => void;

  trashOnly: boolean;
  setTrashOnly: (bool: boolean) => void;
};

export const useUsersTableStore = create<UserActionStore>(set => ({
  /**
   *
   * Sort
   *
   *  */
  sorting: [],
  setSorting: updater =>
    set(state => ({
      sorting: typeof updater === "function" ? updater(state.sorting) : updater,
    })),
  resetSorting: () => set({ sorting: [] }),

  /**
   *
   * Filter
   *
   *  */
  columnFilters: [],
  setColumnFilters: updater =>
    set(state => ({
      columnFilters:
        typeof updater === "function" ? updater(state.columnFilters) : updater,
    })),
  resetFilters: () => set({ columnFilters: [] }),

  /**
   *
   * Page Index
   *
   *  */
  pageIndex: pageConfig.DEFAULT_PAGE_INDEX,
  setPageIndex: pageIndex =>
    set({
      pageIndex: Math.max(
        pageConfig.MINIMUM_PAGE_INDEX,
        Math.max(pageIndex, pageConfig.MINIMUM_PAGE_INDEX)
      ),
    }),
  resetPageIndex: () =>
    set({
      pageIndex: pageConfig.DEFAULT_PAGE_INDEX,
    }),
  /**
   *
   * Page Size
   *
   *  */
  pageSize: pageConfig.DEFAULT_PAGE_SIZE,
  setPageSize: pageSize =>
    set({
      pageSize: Math.max(
        pageConfig.MINIMUM_PAGE_SIZE,
        Math.min(pageSize, pageConfig.MAXIMUM_PAGE_SIZE)
      ),
      pageIndex: pageConfig.DEFAULT_PAGE_INDEX,
    }),
  resetPageSize: () =>
    set({
      pageSize: pageConfig.DEFAULT_PAGE_SIZE,
    }),

  pendingDeletion: "",
  setPendingDeletion: id => set({ pendingDeletion: id }),
  resetPendingDeletion: () => set({ pendingDeletion: "" }),

  trashOnly: false,
  setTrashOnly: trashOnly =>
    set({ trashOnly, pageIndex: pageConfig.DEFAULT_PAGE_INDEX }),

  pendingRestore: "",
  setPendingRestore: id => set({ pendingRestore: id }),
  resetPendingRestore: () => set({ pendingRestore: "" }),
}));
