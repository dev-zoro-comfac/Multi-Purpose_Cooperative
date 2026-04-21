"use client";

import LinearLoadingIndicator from "@/components/ui/LinearLoadingIndicator";
import { useGetUsersListQuery } from "../../api/useGetUsersListQuery";

const UsersTableLoadingIndicator = () => {
  const { isFetching } = useGetUsersListQuery();

  return <LinearLoadingIndicator show={isFetching} />;
};

export default UsersTableLoadingIndicator;
