import { api, withAuthHeaders } from "@/lib/axios-client";
import { TableSearchParams, EventTableDataType, EventTableRelativeData, ActionState, UserRole } from "@/types";
import { EventFormSchemaType } from "@/types/zod-schemas";

export type EventListResponse = {
  data: EventTableDataType[];
  count: number;
  userRole: UserRole;
  relativeData: EventTableRelativeData;
};

export type EventMutationResponse = ActionState;

export const eventsService = {
  list: async (params: TableSearchParams, cookies?: string) => {
    const response = await api.get<EventListResponse>(`/api/events`, {
      ...withAuthHeaders(cookies),
      params,
    });
    return response.data;
  },

  getByDate: async (date?: string, cookies?: string) => {
    const response = await api.get(`/api/events/by-date`, {
      ...withAuthHeaders(cookies),
      params: date ? { date } : undefined,
    });
    return response.data;
  },

  create: async (data: EventFormSchemaType) => {
    const response = await api.post<EventMutationResponse>(
      `/api/events`,
      data
    );
    return response.data;
  },

  update: async (id: string, data: EventFormSchemaType) => {
    const response = await api.patch<EventMutationResponse>(
      `/api/events/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<EventMutationResponse>(
      `/api/events/${id}`
    );
    return response.data;
  },
};

