import { headers } from "next/headers";
import { QueryClient } from "@tanstack/react-query";

export async function getCookiesString(): Promise<string> {
  const headersList = await headers();
  return headersList.get("cookie") || "";
}

export function getQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: 1,
      },
    },
  });
}
