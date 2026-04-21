import { useDebounce } from "use-debounce";
import { useUsersTableStore } from "../store/useUsersTableStore";
import { useGetUsersQuery } from "./useGetUsersQuery";

export const useGetUsersListQuery = () => {
  const columnFilters = useUsersTableStore(state => state.columnFilters);
  const pageIndex = useUsersTableStore(state => state.pageIndex);
  const pageSize = useUsersTableStore(state => state.pageSize);
  const sorting = useUsersTableStore(state => state.sorting);
  const trashOnly = useUsersTableStore(state => state.trashOnly);
  const [sortingD] = useDebounce(sorting, 300);

  const filter = [
    ...columnFilters,
    ...(trashOnly ? [{ id: "trashed", value: "only" }] : []),
  ];

  const options = {
    page: pageIndex,
    pageSize,
    sortModel: sortingD,
    filter,
    keepPreviousData: true,
  };

  return useGetUsersQuery(options);
};
