"use client";

import { TCreateUserSchema } from "@/lib/zod/schemas/user";
import { Control } from "react-hook-form";
import { useGetRolesQuery } from "../api/useGetRolesQuery";

import CustomAutoComplete from "@/components/ui/CustomAutocomplete";

const RoleAutocomplete = ({
  control,
}: {
  control: Control<TCreateUserSchema>;
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

export default RoleAutocomplete;
