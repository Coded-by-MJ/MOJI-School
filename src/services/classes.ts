import { api, withAuthHeaders } from "@/lib/axios-client";
import { TableSearchParams, ClassTableDataType, ClassTableRelativeData, ActionState } from "@/types";
import { UserRole } from "@/generated/prisma";
import { ClassFormSchemaType } from "@/types/zod-schemas";

export type ClassListResponse = {
  data: ClassTableDataType[];
  count: number;
  userRole: UserRole;
  relativeData: ClassTableRelativeData;
};

export type ClassMutationResponse = ActionState;

export const classesService = {
  list: async (params: TableSearchParams, cookies?: string) => {
    const response = await api.get<ClassListResponse>(`/api/classes`, {
      ...withAuthHeaders(cookies),
      params,
    });
    return response.data;
  },

  getSchedule: async (id: string, cookies?: string) => {
    const response = await api.get(`/api/classes/${id}/schedule`, withAuthHeaders(cookies));
    return response.data;
  },

  create: async (data: ClassFormSchemaType) => {
    const response = await api.post<ClassMutationResponse>(
      `/api/classes`,
      data
    );
    return response.data;
  },

  update: async (id: string, data: ClassFormSchemaType) => {
    const response = await api.patch<ClassMutationResponse>(
      `/api/classes/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<ClassMutationResponse>(
      `/api/classes/${id}`
    );
    return response.data;
  },
};

