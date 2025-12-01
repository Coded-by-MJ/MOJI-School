import { queryResult, mutationResult } from "@/lib/react-query-helpers";
import { examsService } from "@/services/exams";
import { TableSearchParams } from "@/types";
import { ExamFormSchemaType } from "@/types/zod-schemas";

export const examsQueries = {
  list: (params: TableSearchParams) =>
    queryResult(["exams", params], () => examsService.list(params)),

  withCookies: (cookies: string) => ({
    list: (params: TableSearchParams) =>
      queryResult(["exams", params], () =>
        examsService.list(params, cookies)
      ),
  }),
};

export const examsMutations = {
  create: mutationResult((variables: ExamFormSchemaType) =>
    examsService.create(variables)
  ),

  update: mutationResult(
    (variables: { id: string; data: ExamFormSchemaType }) =>
      examsService.update(variables.id, variables.data)
  ),

  delete: mutationResult((variables: { id: string }) =>
    examsService.delete(variables.id)
  ),
};

