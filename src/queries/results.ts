import { queryResult, mutationResult } from "@/lib/react-query-helpers";
import { resultsService } from "@/services/results";
import { TableSearchParams } from "@/types";
import { ResultFormSchemaType } from "@/types/zod-schemas";

export const resultsQueries = {
  list: (params: TableSearchParams) =>
    queryResult(["results", params], () => resultsService.list(params)),

  withCookies: (cookies: string) => ({
    list: (params: TableSearchParams) =>
      queryResult(["results", params], () =>
        resultsService.list(params, cookies)
      ),
  }),
};

export const resultsMutations = {
  create: mutationResult((variables: ResultFormSchemaType) =>
    resultsService.create(variables)
  ),

  update: mutationResult(
    (variables: { id: string; data: ResultFormSchemaType }) =>
      resultsService.update(variables.id, variables.data)
  ),

  delete: mutationResult((variables: { id: string }) =>
    resultsService.delete(variables.id)
  ),
};

