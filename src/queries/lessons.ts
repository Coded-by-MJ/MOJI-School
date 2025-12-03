import { queryResult, mutationResult } from "@/lib/react-query-helpers";
import { lessonsService } from "@/services/lessons";
import { TableSearchParams } from "@/types";
import { LessonFormSchemaType } from "@/types/zod-schemas";

export const lessonsQueries = {
  list: (params: TableSearchParams) =>
    queryResult(["lessons", params], () => lessonsService.list(params)),

  withCookies: (cookies: string) => ({
    list: (params: TableSearchParams) =>
      queryResult(["lessons", params], () =>
        lessonsService.list(params, cookies)
      ),
  }),
};

export const lessonsMutations = {
  create: mutationResult((variables: LessonFormSchemaType) =>
    lessonsService.create(variables)
  ),

  update: mutationResult(
    (variables: { id: string; data: LessonFormSchemaType }) =>
      lessonsService.update(variables.id, variables.data)
  ),

  delete: mutationResult((variables: { id: string }) =>
    lessonsService.delete(variables.id)
  ),
};

