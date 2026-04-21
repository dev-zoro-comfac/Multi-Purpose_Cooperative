"use client";

import { Stack } from "@mui/material";
import { TUser } from "@/lib/zod/schemas/user";
import AccountUserInformation from "./AccountUserInformation";
import PersonalUserInformation from "./PersonalUserInformation";
import UserDetailsEditToggler from "./UserDetailsEditToggler";

type PUserDetails = {
  user: TUser;
};

const UserDetails = ({ user }: PUserDetails) => {
  return (
    <Stack sx={{ gap: 2 }}>
      <UserDetailsEditToggler />
      <PersonalUserInformation user={user} />
      <AccountUserInformation user={user} />
    </Stack>
  );
};

export default UserDetails;
