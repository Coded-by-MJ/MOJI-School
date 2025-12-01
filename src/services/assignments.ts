import { api, withAuthHeaders } from "@/lib/axios-client";
import { TableSearchParams, AssignmentTableDataType, AssignmentTableRelativeData, ActionState } from "@/types";
import { UserRole } from "@/generated/prisma";
import { AssignmentFormSchemaType } from "@/types/zod-schemas";

export type AssignmentListResponse = {
  data: AssignmentTableDataType[];
  count: number;
  userRole: UserRole;
  relativeData: AssignmentTableRelativeData;
};

export type AssignmentMutationResponse = ActionState;

export const assignmentsService = {
  list: async (params: TableSearchParams, cookies?: string) => {
    const response = await api.get<AssignmentListResponse>(`/api/assignments`, {
      ...withAuthHeaders(cookies),
      params,
    });
    return response.data;
  },

  create: async (data: AssignmentFormSchemaType) => {
    const response = await api.post<AssignmentMutationResponse>(
      `/api/assignments`,
      data
    );
    return response.data;
  },

  update: async (id: string, data: AssignmentFormSchemaType) => {
    const response = await api.patch<AssignmentMutationResponse>(
      `/api/assignments/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<AssignmentMutationResponse>(
      `/api/assignments/${id}`
    );
    return response.data;
  },
};

