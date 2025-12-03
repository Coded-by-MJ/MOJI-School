import { queryResult, mutationResult } from "@/lib/react-query-helpers";
import { subjectsService } from "@/services/subjects";
import { TableSearchParams } from "@/types";
import { SubjectFormSchemaType } from "@/types/zod-schemas";

export const subjectsQueries = {
  list: (params: TableSearchParams) =>
    queryResult(["subjects", params], () => subjectsService.list(params)),

  withCookies: (cookies: string) => ({
    list: (params: TableSearchParams) =>
      queryResult(["subjects", params], () =>
        subjectsService.list(params, cookies)
      ),
  }),
};

export const subjectsMutations = {
  create: mutationResult((variables: SubjectFormSchemaType) =>
    subjectsService.create(variables)
  ),

  update: mutationResult(
    (variables: { id: string; data: SubjectFormSchemaType }) =>
      subjectsService.update(variables.id, variables.data)
  ),

  delete: mutationResult((variables: { id: string }) =>
    subjectsService.delete(variables.id)
  ),
};

