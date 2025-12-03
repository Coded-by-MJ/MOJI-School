import { queryResult, mutationResult } from "@/lib/react-query-helpers";
import { attendancesService } from "@/services/attendances";
import { TableSearchParams } from "@/types";
import { AttendanceFormSchemaType } from "@/types/zod-schemas";

export const attendancesQueries = {
  list: (params: TableSearchParams) =>
    queryResult(["attendances", params], () => attendancesService.list(params)),

  withCookies: (cookies: string) => ({
    list: (params: TableSearchParams) =>
      queryResult(["attendances", params], () =>
        attendancesService.list(params, cookies)
      ),
  }),
};

export const attendancesMutations = {
  create: mutationResult((variables: AttendanceFormSchemaType) =>
    attendancesService.create(variables)
  ),

  update: mutationResult(
    (variables: { id: string; data: AttendanceFormSchemaType }) =>
      attendancesService.update(variables.id, variables.data)
  ),

  delete: mutationResult((variables: { id: string }) =>
    attendancesService.delete(variables.id)
  ),
};

