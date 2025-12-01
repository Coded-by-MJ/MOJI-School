import { queryResult, mutationResult } from "@/lib/react-query-helpers";
import { parentsService } from "@/services/parents";
import { TableSearchParams } from "@/types";
import { ParentFormSchemaType } from "@/types/zod-schemas";

export const parentsQueries = {
  list: (params: TableSearchParams) =>
    queryResult(["parents", params], () => parentsService.list(params)),

  getStudents: (userId: string) =>
    queryResult(["parent-students", userId], () => parentsService.getStudents(userId)),

  withCookies: (cookies: string) => ({
    list: (params: TableSearchParams) =>
      queryResult(["parents", params], () =>
        parentsService.list(params, cookies)
      ),

    getStudents: (userId: string) =>
      queryResult(["parent-students", userId], () =>
        parentsService.getStudents(userId, cookies)
      ),
  }),
};

export const parentsMutations = {
  create: mutationResult((variables: ParentFormSchemaType) =>
    parentsService.create(variables)
  ),

  update: mutationResult(
    (variables: { userId: string; data: ParentFormSchemaType }) =>
      parentsService.update(variables.userId, variables.data)
  ),

  delete: mutationResult((variables: { userId: string }) =>
    parentsService.delete(variables.userId)
  ),
};

