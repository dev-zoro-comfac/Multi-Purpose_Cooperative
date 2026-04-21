export const RolePermission = {
  ViewOne: "view one role",
  ViewMany: "view many role",
  ViewOwn: "view own role",
  ViewProtectedData: "view role protected data",
  Create: "create role",
  Update: "update role",
  HardDelete: "hard delete role",
} as const;

export const UserPermission = {
  ViewAny: "view any user",
  ViewOne: "view one user",
  ViewMany: "view many user",
  ViewOwn: "view own user",
  ViewProtectedData: "view user protected data",
  Create: "create user",
  Update: "update user",
  SoftDelete: "soft delete user",
  HardDelete: "hard delete user",
  Restore: "restore user",
  Import: "import user",
  Export: "export user",
  Schedulable: "schedulable user",
  ChangeOtherPassword: "change other user password",
} as const;

export const PermissionPermission = {
  ViewOne: "view one permission",
  ViewMany: "view many permission",
  ViewOwn: "view own permission",
  ViewProtectedData: "view permission protected data",
} as const;
