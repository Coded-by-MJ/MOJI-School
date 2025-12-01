import { queryResult, mutationResult } from "@/lib/react-query-helpers";
import { assignmentsService } from "@/services/assignments";
import { TableSearchParams } from "@/types";
import { AssignmentFormSchemaType } from "@/types/zod-schemas";

export const assignmentsQueries = {
  list: (params: TableSearchParams) =>
    queryResult(["assignments", params], () => assignmentsService.list(params)),

  withCookies: (cookies: string) => ({
    list: (params: TableSearchParams) =>
      queryResult(["assignments", params], () =>
        assignmentsService.list(params, cookies)
      ),
  }),
};

export const assignmentsMutations = {
  create: mutationResult((variables: AssignmentFormSchemaType) =>
    assignmentsService.create(variables)
  ),

  update: mutationResult(
    (variables: { id: string; data: AssignmentFormSchemaType }) =>
      assignmentsService.update(variables.id, variables.data)
  ),

  delete: mutationResult((variables: { id: string }) =>
    assignmentsService.delete(variables.id)
  ),
};

