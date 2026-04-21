"use client";

import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Autocomplete, TextField } from "@mui/material";
import { useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import { useGetUsersOptionsQuery } from "@/features/user/api/useGetUsersOptionsQuery";

type UserOption = {
  id: string;
  full_name: string;
};

type PUserAutocomplete<TField extends FieldValues> = {
  control: Control<TField>;
  name: Path<TField>;
  fieldLabel?: string;
  role?: string;
  user?: UserOption | null;
  disabled?: boolean;
  readOnly?: boolean;
  permission?: string;
};

const UserSelect = <TField extends FieldValues>({
  permission,
  control,
  name,
  user,
  disabled = false,
  readOnly = false,
  role,
}: PUserAutocomplete<TField>) => {
  const [search, setSearch] = useState("");
  const [debouncedSearchQuery] = useDebounce(search, 400);

  const {
    data: { data: options = [] } = { data: [] },
    isFetching,
    isError,
  } = useGetUsersOptionsQuery({
    filter: [
      {
        id: "search",
        value: debouncedSearchQuery,
      },
      { id: "role", value: role ?? null },
      { id: "permission", value: permission ?? null },
    ],
  });

  const finalOptions = useMemo(() => {
    if (user && !options.some(option => option.id === user.id)) {
      return [user, ...options];
    }

    return options;
  }, [user, options]);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange, ref }, fieldState: { error } }) => {
        return (
          <Autocomplete
            loadingText="Loading..."
            loading={isFetching}
            readOnly={readOnly}
            disabled={disabled}
            isOptionEqualToValue={(option, newValue) =>
              option?.id === newValue?.id
            }
            getOptionLabel={user => user?.full_name ?? ""}
            filterOptions={x => x}
            options={finalOptions}
            value={finalOptions.find(option => option.id === value) ?? null}
            onChange={(_, newValue) => {
              onChange(newValue ? newValue.id : null);
            }}
            onInputChange={(_, newInputValue, reason) => {
              if (reason === "input" || reason === "clear") {
                onChange(null);
                setSearch(newInputValue);
              }
            }}
            noOptionsText={
              isFetching
                ? "Loading..."
                : isError
                  ? "Failed to load users"
                  : "No options"
            }
            renderInput={params => (
              <TextField
                {...params}
                inputRef={ref}
                placeholder="Type here to search for a user..."
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
        );
      }}
    />
  );
};

export default UserSelect;
