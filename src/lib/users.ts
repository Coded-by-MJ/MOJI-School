"use server";

import { UserRole } from "@/generated/prisma";
import { auth } from "./auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Route } from "next";
import { revalidatePath } from "next/cache";
import prisma from "./prisma";
import { ActionState } from "@/types";

const renderError = (error: unknown): ActionState => {
  console.error(error);
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error("unknown error occurred");
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
    redirect("/sign-in");
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
