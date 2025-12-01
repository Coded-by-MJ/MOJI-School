import { queryResult, mutationResult } from "@/lib/react-query-helpers";
import { classesService } from "@/services/classes";
import { TableSearchParams } from "@/types";
import { ClassFormSchemaType } from "@/types/zod-schemas";

export const classesQueries = {
  list: (params: TableSearchParams) =>
    queryResult(["classes", params], () => classesService.list(params)),

  getSchedule: (id: string) =>
    queryResult(["class-schedule", id], () => classesService.getSchedule(id)),

  withCookies: (cookies: string) => ({
    list: (params: TableSearchParams) =>
      queryResult(["classes", params], () =>
        classesService.list(params, cookies)
      ),

    getSchedule: (id: string) =>
      queryResult(["class-schedule", id], () =>
        classesService.getSchedule(id, cookies)
      ),
  }),
};

export const classesMutations = {
  create: mutationResult((variables: ClassFormSchemaType) =>
    classesService.create(variables)
  ),

  update: mutationResult(
    (variables: { id: string; data: ClassFormSchemaType }) =>
      classesService.update(variables.id, variables.data)
  ),

  delete: mutationResult((variables: { id: string }) =>
    classesService.delete(variables.id)
  ),
};

