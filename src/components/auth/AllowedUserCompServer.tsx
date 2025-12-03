import { getAuthUser } from "@/lib/users";
import { UserRole } from "@/generated/prisma";
import React from "react";
import { redirect } from "next/navigation";

type Props = {
  allowedRoles: UserRole[];
  children: React.ReactNode;
  isRedirect?: boolean;
};
async function AllowedUserCompServer({
  children,
  allowedRoles,
  isRedirect,
}: Props) {
  const user = await getAuthUser();
  if (user && allowedRoles.includes(user.role as UserRole)) {
    if (isRedirect) {
      redirect(`/${user.role as UserRole}`);
    } else {
      return children;
    }
  } else {
    if (isRedirect) {
      redirect("/sign-in");
    } else {
      return null;
    }
  }
}
export default AllowedUserCompServer;
