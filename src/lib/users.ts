"use server";

import { UserRole } from "@prisma/client";
import { auth } from "./auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Route } from "next";

const renderError = (error: unknown) => {
  if (error instanceof Error) {
    console.log(error.message);
  } else {
    console.log("unknown error occurred");
  }
  return {
    message: error instanceof Error ? error.message : "An error occurred",
    type: "error",
  };
};
export const fetchSession = async () => {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({
      headers: headersList,
    });
    return session;
  } catch (error) {
    console.log("error fetching session", error);
    return null;
  }
};

export const getAuthUser = async () => {
  const session = await fetchSession();
  if (!session) {
    throw new Error("You must be logged in to access this page.");
  }
  if (session.user.banned) {
    throw new Error("Your account has been banned. Please contact support.");
  }
  return session.user;
};

export const getAdminUser = async () => {
  const adminUser = await getAuthUser();
  if (adminUser.role !== UserRole.admin) {
    redirect(`/${adminUser.role}` as Route);
  }
  return adminUser;
};

export const isUserAllowed = async (allowedUsers: UserRole[]) => {
  const adminUser = await getAuthUser();
  const currentUserRole = adminUser.role?.toString() as UserRole;
  if (!allowedUsers.includes(currentUserRole)) {
    redirect(`/${adminUser.role}` as Route);
  }
  return adminUser;
};
