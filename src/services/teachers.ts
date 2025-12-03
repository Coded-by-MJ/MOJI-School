import { api, withAuthHeaders } from "@/lib/axios-client";
import {
  TableSearchParams,
  TeacherTableDataType,
  TeacherTableRelativeData,
  ActionState,
} from "@/types";
import { TeacherFormSchemaType } from "@/types/zod-schemas";
import { createFormData } from "@/lib/form-data-helpers";

export type TeacherListResponse = {
  data: TeacherTableDataType[];
  count: number;
  relativeData: TeacherTableRelativeData;
};

export type TeacherSingleResponse = {
  teacher: TeacherTableDataType;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    role: string;
  };
  subjectsCount: number;
  lessonsCount: number;
  classesCount: number;
  currentUserRole: string;
  currentUserId: string;
  relativeData: TeacherTableRelativeData;
};

export type TeacherMutationResponse = ActionState;

export const teachersService = {
  list: async (params: TableSearchParams, cookies?: string) => {
    const response = await api.get<TeacherListResponse>(`/api/teachers`, {
      ...withAuthHeaders(cookies),
      params,
    });
    return response.data;
  },

  getById: async (userId: string, cookies?: string) => {
    const response = await api.get<TeacherSingleResponse>(
      `/api/teachers/${userId}/single`,
      withAuthHeaders(cookies)
    );
    return response.data;
  },

  getSchedule: async (userId: string, cookies?: string) => {
    const response = await api.get(
      `/api/teachers/${userId}/schedule`,
      withAuthHeaders(cookies)
    );
    return response.data;
  },

  create: async (data: TeacherFormSchemaType) => {
    const formData = createFormData(data);
    const response = await api.post<TeacherMutationResponse>(
      `/api/teachers`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  update: async (userId: string, data: TeacherFormSchemaType) => {
    const formData = createFormData(data);
    const response = await api.patch<TeacherMutationResponse>(
      `/api/teachers/${userId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  delete: async (userId: string) => {
    const response = await api.delete<TeacherMutationResponse>(
      `/api/teachers/${userId}`
    );
    return response.data;
  },
};
