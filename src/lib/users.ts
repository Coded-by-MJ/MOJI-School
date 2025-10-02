"use server";

import { auth } from "./auth";
import { headers } from "next/headers";

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
