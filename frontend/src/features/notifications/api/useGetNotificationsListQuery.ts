import { useDebounce } from "use-debounce";
import { useNotificationsTableStore } from "../store/useNotificationsTableStore";
import { useGetNotificationsQuery } from "./useGetNotificationsQuery";

export const useGetNotificationsListQuery = () => {
  const columnFilters = useNotificationsTableStore(
    state => state.columnFilters
  );
  const pageIndex = useNotificationsTableStore(state => state.pageIndex);
  const pageSize = useNotificationsTableStore(state => state.pageSize);
  const sorting = useNotificationsTableStore(state => state.sorting);
  const [sortingD] = useDebounce(sorting, 300);

  const filter = [...columnFilters];

  const options = {
    page: pageIndex,
    pageSize,
    sortModel: sortingD,
    filter,
    keepPreviousData: true,
  };

  return useGetNotificationsQuery(options);
};
