import { api, withAuthHeaders } from "@/lib/axios-client";
import { TableSearchParams, AttendanceTableDataType, AttendanceTableRelativeData, ActionState } from "@/types";
import { UserRole } from "@/generated/prisma";
import { AttendanceFormSchemaType } from "@/types/zod-schemas";

export type AttendanceListResponse = {
  data: AttendanceTableDataType[];
  count: number;
  userRole: UserRole;
  relativeData: AttendanceTableRelativeData;
};

export type AttendanceMutationResponse = ActionState;

export const attendancesService = {
  list: async (params: TableSearchParams, cookies?: string) => {
    const response = await api.get<AttendanceListResponse>(`/api/attendances`, {
      ...withAuthHeaders(cookies),
      params,
    });
    return response.data;
  },

  create: async (data: AttendanceFormSchemaType) => {
    const response = await api.post<AttendanceMutationResponse>(
      `/api/attendances`,
      data
    );
    return response.data;
  },

  update: async (id: string, data: AttendanceFormSchemaType) => {
    const response = await api.patch<AttendanceMutationResponse>(
      `/api/attendances/${id}`,
      data
    );
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete<AttendanceMutationResponse>(
      `/api/attendances/${id}`
    );
    return response.data;
  },
};

