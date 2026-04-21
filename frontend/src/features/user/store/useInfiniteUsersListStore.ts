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

  setSorting: OnChangeFn<SortingState>;
  resetSorting: () => void;

  setColumnFilters: OnChangeFn<ColumnFiltersState>;
  resetFilters: () => void;

  setPageIndex: (pageIndex: number) => void;
  setPageSize: (pageSize: number) => void;

  trashOnly: boolean;
  setTrashOnly: (bool: boolean) => void;

  employeeIdSearch: string;
  setEmployeeIdSearch: (employeeId: string) => void;
  resetEmployeeIdSearch: () => void;
};

export const useInfiniteUsersListStore = create<UserActionStore>(set => ({
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

  trashOnly: false,
  setTrashOnly: trashOnly =>
    set({ trashOnly, pageIndex: pageConfig.DEFAULT_PAGE_INDEX }),

  employeeIdSearch: "",
  setEmployeeIdSearch: employeeId => set({ employeeIdSearch: employeeId }),
  resetEmployeeIdSearch: () => set({ employeeIdSearch: "" }),
}));
