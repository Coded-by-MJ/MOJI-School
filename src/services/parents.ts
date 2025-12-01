import { api, withAuthHeaders } from "@/lib/axios-client";
import { TableSearchParams, ParentTableDataType, ActionState, UserRole } from "@/types";
import { ParentFormSchemaType } from "@/types/zod-schemas";

export type ParentListResponse = {
  data: ParentTableDataType[];
  count: number;
  userRole: UserRole;
};

export type ParentMutationResponse = ActionState;

export const parentsService = {
  list: async (params: TableSearchParams, cookies?: string) => {
    const response = await api.get<ParentListResponse>(`/api/parents`, {
      ...withAuthHeaders(cookies),
      params,
    });
    return response.data;
  },

  getStudents: async (userId: string, cookies?: string) => {
    const response = await api.get(`/api/parents/${userId}/students`, withAuthHeaders(cookies));
    return response.data;
  },

  create: async (data: ParentFormSchemaType) => {
    const response = await api.post<ParentMutationResponse>(
      `/api/parents`,
      data
    );
    return response.data;
  },

  update: async (userId: string, data: ParentFormSchemaType) => {
    const response = await api.patch<ParentMutationResponse>(
      `/api/parents/${userId}`,
      data
    );
    return response.data;
  },

  delete: async (userId: string) => {
    const response = await api.delete<ParentMutationResponse>(
      `/api/parents/${userId}`
    );
    return response.data;
  },
};

