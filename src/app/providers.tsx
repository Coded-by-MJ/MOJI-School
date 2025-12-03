"use client";

import { renderAxiosOrAuthError } from "@/lib/axios-client";
import {
  isServer,
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { toast } from "sonner";

const globalErrorHandler = (error: unknown) => {
  if (typeof window !== "undefined") {
    const msg = renderAxiosOrAuthError(error);
    toast.error(msg);
  }
};
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: 1,
      },
    },
    queryCache: new QueryCache({
      onError: globalErrorHandler,
    }),
    mutationCache: new MutationCache({
      onError: globalErrorHandler,
    }),
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  } else {
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
