import { api, withAuthHeaders } from "@/lib/axios-client";
import { TableSearchParams, LessonTableDataType, LessonTableRelativeData, ActionState, UserRole } from "@/types";
import { LessonFormSchemaType } from "@/types/zod-schemas";

export type LessonListResponse = {
  data: LessonTableDataType[];
  count: number;
  userRole: UserRole;
  relativeData: LessonTableRelativeData;
};

export type LessonMutationResponse = ActionState;

export const lessonsService = {
  list: async (params: TableSearchParams, cookies?: string) => {
    const response = await api.get<LessonListResponse>(`/api/lessons`, {
      ...withAuthHeaders(cookies),
      params,
    });
    return response.data;
  },

  create: async (data: LessonFormSchemaType) => {
    const response = await api.post<LessonMutationResponse>(
      `/api/lessons`,
      data
    );
    return response.data;
  },

  update: async (id: string, data: LessonFormSchemaType) => {
    const response = await api.patch<LessonMutationResponse>(
      `/api/lessons/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<LessonMutationResponse>(
      `/api/lessons/${id}`
    );
    return response.data;
  },
};

