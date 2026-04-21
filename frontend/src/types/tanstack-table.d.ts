import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  interface ColumnMeta {
    isHidden?: boolean;
    label?: string;
    /**TODO: table column meta for permission check */
    allowed?: TRoleSchema[];
  }
}
