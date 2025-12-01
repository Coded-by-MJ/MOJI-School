import { queryResult, mutationResult } from "@/lib/react-query-helpers";
import { eventsService } from "@/services/events";
import { TableSearchParams } from "@/types";
import { EventFormSchemaType } from "@/types/zod-schemas";

export const eventsQueries = {
  list: (params: TableSearchParams) =>
    queryResult(["events", params], () => eventsService.list(params)),

  getByDate: (date?: string) =>
    queryResult(["events-by-date", date], () => eventsService.getByDate(date)),

  withCookies: (cookies: string) => ({
    list: (params: TableSearchParams) =>
      queryResult(["events", params], () =>
        eventsService.list(params, cookies)
      ),

    getByDate: (date?: string) =>
      queryResult(["events-by-date", date], () =>
        eventsService.getByDate(date, cookies)
      ),
  }),
};

export const eventsMutations = {
  create: mutationResult((variables: EventFormSchemaType) =>
    eventsService.create(variables)
  ),

  update: mutationResult(
    (variables: { id: string; data: EventFormSchemaType }) =>
      eventsService.update(variables.id, variables.data)
  ),

  delete: mutationResult((variables: { id: string }) =>
    eventsService.delete(variables.id)
  ),
};

