import { queryResult, mutationResult } from "@/lib/react-query-helpers";
import { announcementsService } from "@/services/announcements";
import { TableSearchParams } from "@/types";
import { AnnouncementFormSchemaType } from "@/types/zod-schemas";

export const announcementsQueries = {
  list: (params: TableSearchParams) =>
    queryResult(["announcements", params], () => announcementsService.list(params)),

  getRecent: () =>
    queryResult(["announcements-recent"], () => announcementsService.getRecent()),

  withCookies: (cookies: string) => ({
    list: (params: TableSearchParams) =>
      queryResult(["announcements", params], () =>
        announcementsService.list(params, cookies)
      ),

    getRecent: () =>
      queryResult(["announcements-recent"], () =>
        announcementsService.getRecent(cookies)
      ),
  }),
};

export const announcementsMutations = {
  create: mutationResult((variables: AnnouncementFormSchemaType) =>
    announcementsService.create(variables)
  ),

  update: mutationResult(
    (variables: { id: string; data: AnnouncementFormSchemaType }) =>
      announcementsService.update(variables.id, variables.data)
  ),

  delete: mutationResult((variables: { id: string }) =>
    announcementsService.delete(variables.id)
  ),
};

