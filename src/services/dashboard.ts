import { api, withAuthHeaders } from "@/lib/axios-client";
import { RelativeAdminDataType } from "@/types";
import { UserRole } from "@/generated/prisma";

export type AdminDataResponse = {
  data: RelativeAdminDataType;
  userRole: UserRole;
};

export const dashboardService = {
  getAdminData: async (cookies?: string) => {
    const response = await api.get<AdminDataResponse>(
      `/api/dashboard/admin-data`,
      withAuthHeaders(cookies)
    );
    return response.data;
  },

  getStudentsChart: async (cookies?: string) => {
    const response = await api.get<{ boys: number; girls: number }>(
      `/api/dashboard/charts/students`,
      withAuthHeaders(cookies)
    );
    return response.data;
  },

  getAttendanceChart: async (cookies?: string) => {
    const response = await api.get(
      `/api/dashboard/charts/attendance`,
      withAuthHeaders(cookies)
    );
    return response.data;
  },

  getUserRolesChart: async (cookies?: string) => {
    const response = await api.get(
      `/api/dashboard/charts/user-roles`,
      withAuthHeaders(cookies)
    );
    return response.data;
  },
};

