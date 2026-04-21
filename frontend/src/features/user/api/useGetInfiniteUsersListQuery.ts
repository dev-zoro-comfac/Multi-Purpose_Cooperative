import { useDebounce } from "use-debounce";
import { useInfiniteUsersListStore } from "../store/useInfiniteUsersListStore";
import { useGetInfiniteUsersQuery } from "./useGetInfiniteUsersQuery";
import { roleEnum } from "@/lib/zod/schemas/roles";

export const useGetInfiniteUsersListQuery = () => {
  const columnFilters = useInfiniteUsersListStore(state => state.columnFilters);
  const pageIndex = useInfiniteUsersListStore(state => state.pageIndex);
  const pageSize = useInfiniteUsersListStore(state => state.pageSize);
  const sorting = useInfiniteUsersListStore(state => state.sorting);
  const trashOnly = useInfiniteUsersListStore(state => state.trashOnly);
  const [sortingD] = useDebounce(sorting, 300);
  const employeeIdSearch = useInfiniteUsersListStore(
    state => state.employeeIdSearch
  );
  const [debouncedEmployeeIdSearch] = useDebounce(employeeIdSearch, 500);

  const filter = [
    ...columnFilters,
    ...(trashOnly ? [{ id: "trashed", value: "only" }] : []),
    { id: "full_name", value: debouncedEmployeeIdSearch },
    { id: "role", value: roleEnum.Enum.user },
  ];

  const options = {
    page: pageIndex,
    pageSize,
    sortModel: sortingD,
    filter,
  };

  return useGetInfiniteUsersQuery(options);
};
