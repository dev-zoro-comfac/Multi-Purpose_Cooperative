"use client";

import { Control } from "react-hook-form";
import { useGetRolesQuery } from "../api/useGetRolesQuery";
import CustomAutoComplete from "@/components/ui/CustomAutocomplete";
import { TEditUserAccountSchema } from "@/lib/zod/schemas/user";

const EditRoleAutocomplete = ({
  control,
}: {
  control: Control<TEditUserAccountSchema>;
}) => {
  const {
    data: { data: roles } = { data: [] },
    isLoading,
    isError,
  } = useGetRolesQuery({ searchKey: "" });

  return (
    <CustomAutoComplete
      multiple={true}
      control={control}
      name="roles"
      valueIdentifier="name"
      labelIdentifier="name"
      options={roles}
      noOptionsText={
        isLoading
          ? "Loading..."
          : isError
            ? "Failed to load roles"
            : "No options"
      }
    />
  );
};

export default EditRoleAutocomplete;
