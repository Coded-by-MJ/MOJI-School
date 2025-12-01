import { api, withAuthHeaders } from "@/lib/axios-client";
import {
  TableSearchParams,
  SubjectTableDataType,
  SubjectTableRelativeData,
  ActionState,
} from "@/types";
import { UserRole } from "@/generated/prisma";
import { SubjectFormSchemaType } from "@/types/zod-schemas";

export type SubjectListResponse = {
  data: SubjectTableDataType[];
  count: number;
  userRole: UserRole;
  relativeData: SubjectTableRelativeData;
};

export type SubjectMutationResponse = ActionState;

export const subjectsService = {
  list: async (params: TableSearchParams, cookies?: string) => {
    const response = await api.get<SubjectListResponse>(`/api/subjects`, {
      ...withAuthHeaders(cookies),
      params,
    });
    return response.data;
  },

  create: async (data: SubjectFormSchemaType) => {
    const response = await api.post<SubjectMutationResponse>(
      `/api/subjects`,
      data
    );
    return response.data;
  },

  update: async (id: string, data: SubjectFormSchemaType) => {
    const response = await api.patch<SubjectMutationResponse>(
      `/api/subjects/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<SubjectMutationResponse>(
      `/api/subjects/${id}`
    );
    return response.data;
  },
};
