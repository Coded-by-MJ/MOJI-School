import {
  queryOptions,
  QueryKey,
  MutationFunction,
  type DefaultError,
} from "@tanstack/react-query";

export function queryResult<TData>(
  key: QueryKey,
  fn: () => Promise<TData>,
  options?: Omit<
    ReturnType<typeof queryOptions<TData, DefaultError>>,
    "queryKey" | "queryFn"
  >
) {
  return queryOptions({
    queryKey: key,
    queryFn: fn,
    ...options,
  });
}

export function mutationResult<TData, TVariables>(
  fn: (variables: TVariables) => Promise<TData>
): MutationFunction<TData, TVariables> {
  return fn;
}

// 🔎 Utility type: infer query data
export type InferQueryData<T> = T extends ReturnType<
  typeof queryResult<infer D>
>
  ? D
  : never;

// 🔎 Utility type: infer mutation data (TData)
export type InferMutationData<T> = T extends () => MutationFunction<
  infer D,
  any
>
  ? D
  : never;

// 🔎 Utility type: infer mutation variables (TVariables)
export type InferMutationVariables<T> = T extends () => MutationFunction<
  any,
  infer V
>
  ? V
  : never;
  