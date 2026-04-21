"use client";
import { Fragment } from "react";
import { Autocomplete, TextField, Typography } from "@mui/material";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

interface AutoCompleteProps<O extends object, TField extends FieldValues> {
  control: Control<TField>;
  options: O[];
  name: Path<TField>;
  labelIdentifier: keyof O;
  valueIdentifier: keyof O;
  defaultValueId?: string;
  fieldLabel?: string;
  noOptionsText?: string;
  loading?: boolean;
  multiple: boolean;
}

export default function CustomAutoComplete<
  O extends object,
  TField extends FieldValues,
>({
  control,
  options,
  name,
  labelIdentifier,
  valueIdentifier,
  fieldLabel,
  defaultValueId,
  noOptionsText = "No options",
  loading = false,
  multiple = false,
}: AutoCompleteProps<O, TField>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => {
        const { value, onChange, ref } = field;
        return (
          <Autocomplete
            fullWidth
            multiple={multiple}
            loading={loading}
            defaultValue={options.find(
              option => option[valueIdentifier] === defaultValueId
            )}
            getOptionLabel={option => `${option[labelIdentifier]}`}
            options={options}
            value={
              multiple
                ? value
                  ? options.filter(option =>
                      value.includes(option[valueIdentifier])
                    )
                  : []
                : (options.find(option => option[valueIdentifier] === value) ??
                  null)
            }
            onChange={(_, newValue) => {
              if (multiple) {
                const newIds = (newValue as O[]).map(
                  option => option[valueIdentifier]
                );
                onChange(newIds);
              } else {
                onChange(newValue ? (newValue as O)[valueIdentifier] : null);
              }
            }}
            noOptionsText={noOptionsText}
            slotProps={{
              listbox: { sx: { maxHeight: "15rem" } },
            }}
            disableCloseOnSelect={multiple ? true : false}
            renderTags={value => {
              const numTags = value?.length ?? 0;
              const limitTags = 2;

              return (
                <Fragment>
                  <Typography
                    sx={{ fontWeight: "bold" }}
                    component="span"
                    color="warning"
                  >
                    {value
                      .slice(0, limitTags)
                      .map(option => option[labelIdentifier])
                      .join(", ")}
                  </Typography>
                  <Typography component="span" color="secondary">
                    {numTags > limitTags && `, +${numTags - limitTags}`}
                  </Typography>
                </Fragment>
              );
            }}
            renderInput={params => (
              <TextField
                {...params}
                {...(fieldLabel && { label: fieldLabel })}
                inputRef={ref}
                helperText={error?.message}
                error={!!error}
              />
            )}
            sx={{
              "& input": {
                maxHeight: "18px",
              },
            }}
          />
        );
      }}
    />
  );
}
