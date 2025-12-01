import { api, withAuthHeaders } from "@/lib/axios-client";
import { TableSearchParams, ExamTableDataType, ExamTableRelativeData, ActionState, UserRole } from "@/types";
import { ExamFormSchemaType } from "@/types/zod-schemas";

export type ExamListResponse = {
  data: ExamTableDataType[];
  count: number;
  userRole: UserRole;
  relativeData: ExamTableRelativeData;
};

export type ExamMutationResponse = ActionState;

export const examsService = {
  list: async (params: TableSearchParams, cookies?: string) => {
    const response = await api.get<ExamListResponse>(`/api/exams`, {
      ...withAuthHeaders(cookies),
      params,
    });
    return response.data;
  },

  create: async (data: ExamFormSchemaType) => {
    const response = await api.post<ExamMutationResponse>(
      `/api/exams`,
      data
    );
    return response.data;
  },

  update: async (id: string, data: ExamFormSchemaType) => {
    const response = await api.patch<ExamMutationResponse>(
      `/api/exams/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<ExamMutationResponse>(
      `/api/exams/${id}`
    );
    return response.data;
  },
};

