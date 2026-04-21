import dayjs from "dayjs";
import { FieldValues } from "react-hook-form";

export const logInDevelopment = (message: string) => {
  if (process.env.NODE_ENV === "development") {
    console.error(message);
  }
};

export const minutesToMilliseconds = (minutes: number) => minutes * 1000 * 60;

export const getNameInitials = (firstName?: string, lastName?: string) => {
  if (!firstName && !lastName) return "NA";
  const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
  const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
  return `${firstInitial}${lastInitial}`;
};

export const generateTimeLabels = () => {
  const timeLabels = Array.from({ length: 13 }, (_, i) =>
    dayjs()
      .startOf("day")
      .add(i * 2, "hour")
      .format("h A")
  );
  return timeLabels;
};

export const getDirtyFields = <T extends FieldValues>(
  allFields: T,
  dirtyFields: Partial<Record<keyof T, boolean | boolean[]>>
): Partial<T> => {
  const changedFieldValues = Object.keys(dirtyFields).reduce(
    (acc, currentField) => {
      const isDirty = Array.isArray(dirtyFields[currentField])
        ? (dirtyFields[currentField] as boolean[]).some(value => value === true)
        : dirtyFields[currentField] === true;
      if (isDirty) {
        return {
          ...acc,
          [currentField]: allFields[currentField],
        };
      }
      return acc;
    },
    {} as Partial<T>
  );

  return changedFieldValues;
};
