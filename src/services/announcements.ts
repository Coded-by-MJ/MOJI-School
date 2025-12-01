import { api, withAuthHeaders } from "@/lib/axios-client";
import { TableSearchParams, AnnouncementTableDataType, AnnouncementTableRelativeData, ActionState, UserRole } from "@/types";
import { AnnouncementFormSchemaType } from "@/types/zod-schemas";

export type AnnouncementListResponse = {
  data: AnnouncementTableDataType[];
  count: number;
  userRole: UserRole;
  relativeData: AnnouncementTableRelativeData;
};

export type AnnouncementMutationResponse = ActionState;

export const announcementsService = {
  list: async (params: TableSearchParams, cookies?: string) => {
    const response = await api.get<AnnouncementListResponse>(`/api/announcements`, {
      ...withAuthHeaders(cookies),
      params,
    });
    return response.data;
  },

  getRecent: async (cookies?: string) => {
    const response = await api.get(`/api/announcements/recent`, withAuthHeaders(cookies));
    return response.data;
  },

  create: async (data: AnnouncementFormSchemaType) => {
    const response = await api.post<AnnouncementMutationResponse>(
      `/api/announcements`,
      data
    );
    return response.data;
  },

  update: async (id: string, data: AnnouncementFormSchemaType) => {
    const response = await api.patch<AnnouncementMutationResponse>(
      `/api/announcements/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<AnnouncementMutationResponse>(
      `/api/announcements/${id}`
    );
    return response.data;
  },
};

