import { queryResult, mutationResult } from "@/lib/react-query-helpers";
import { studentsService } from "@/services/students";
import { TableSearchParams } from "@/types";
import { StudentFormSchemaType } from "@/types/zod-schemas";

export const studentsQueries = {
  list: (params: TableSearchParams) =>
    queryResult(["students", params], () => studentsService.list(params)),

  getById: (userId: string) =>
    queryResult(["student", userId], () => studentsService.getById(userId)),

  getClass: (userId: string) =>
    queryResult(["student-class", userId], () => studentsService.getClass(userId)),

  withCookies: (cookies: string) => ({
    list: (params: TableSearchParams) =>
      queryResult(["students", params], () =>
        studentsService.list(params, cookies)
      ),

    getById: (userId: string) =>
      queryResult(["student", userId], () =>
        studentsService.getById(userId, cookies)
      ),

    getClass: (userId: string) =>
      queryResult(["student-class", userId], () =>
        studentsService.getClass(userId, cookies)
      ),
  }),
};

export const studentsMutations = {
  create: mutationResult((variables: StudentFormSchemaType) =>
    studentsService.create(variables)
  ),

  update: mutationResult(
    (variables: { userId: string; data: StudentFormSchemaType }) =>
      studentsService.update(variables.userId, variables.data)
  ),

  delete: mutationResult((variables: { userId: string }) =>
    studentsService.delete(variables.userId)
  ),
};

