import { queryResult, mutationResult } from "@/lib/react-query-helpers";
import { teachersService } from "@/services/teachers";
import { TableSearchParams } from "@/types";
import { TeacherFormSchemaType } from "@/types/zod-schemas";

export const teachersQueries = {
  list: (params: TableSearchParams) =>
    queryResult(["teachers", params], () => teachersService.list(params)),

  getById: (userId: string) =>
    queryResult(["teacher", userId], () => teachersService.getById(userId)),

  getSchedule: (userId: string) =>
    queryResult(["teacher-schedule", userId], () => teachersService.getSchedule(userId)),

  withCookies: (cookies: string) => ({
    list: (params: TableSearchParams) =>
      queryResult(["teachers", params], () =>
        teachersService.list(params, cookies)
      ),

    getById: (userId: string) =>
      queryResult(["teacher", userId], () =>
        teachersService.getById(userId, cookies)
      ),

    getSchedule: (userId: string) =>
      queryResult(["teacher-schedule", userId], () =>
        teachersService.getSchedule(userId, cookies)
      ),
  }),
};

export const teachersMutations = {
  create: mutationResult((variables: TeacherFormSchemaType) =>
    teachersService.create(variables)
  ),

  update: mutationResult(
    (variables: { userId: string; data: TeacherFormSchemaType }) =>
      teachersService.update(variables.userId, variables.data)
  ),

  delete: mutationResult((variables: { userId: string }) =>
    teachersService.delete(variables.userId)
  ),
};
