"use client";

import { authClient } from "@/lib/auth-client";
import { UserRole } from "@/generated/prisma";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  isRedirect?: boolean;
};
function AllowedUserCompClient({ children, allowedRoles, isRedirect }: Props) {
  const { push } = useRouter();
  const { data } = authClient.useSession();

  if (data && allowedRoles.includes(data.user.role as UserRole)) {
    if (isRedirect) {
      push(`/${data.user.role as UserRole}`);
    } else {
      return children;
    }
  } else {
    if (isRedirect) {
      push("/sign-in");
    } else {
      return null;
    }
  }
}
export default AllowedUserCompClient;
