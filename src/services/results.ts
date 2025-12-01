import { api, withAuthHeaders } from "@/lib/axios-client";
import { TableSearchParams, ResultTableDataType, ResultTableRelativeData, ActionState } from "@/types";
import { UserRole } from "@/generated/prisma";
import { ResultFormSchemaType } from "@/types/zod-schemas";

export type ResultListResponse = {
  data: ResultTableDataType[];
  count: number;
  userRole: UserRole;
  relativeData: ResultTableRelativeData;
};

export type ResultMutationResponse = ActionState;

export const resultsService = {
  list: async (params: TableSearchParams, cookies?: string) => {
    const response = await api.get<ResultListResponse>(`/api/results`, {
      ...withAuthHeaders(cookies),
      params,
    });
    return response.data;
  },

  create: async (data: ResultFormSchemaType) => {
    const response = await api.post<ResultMutationResponse>(
      `/api/results`,
      data
    );
    return response.data;
  },

  update: async (id: string, data: ResultFormSchemaType) => {
    const response = await api.patch<ResultMutationResponse>(
      `/api/results/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<ResultMutationResponse>(
      `/api/results/${id}`
    );
    return response.data;
  },
};

