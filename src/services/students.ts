import { api, withAuthHeaders } from "@/lib/axios-client";
import {
  TableSearchParams,
  StudentTableDataType,
  StudentTableRelativeData,
  ActionState,
} from "@/types";
import { StudentFormSchemaType } from "@/types/zod-schemas";
import { createFormData } from "@/lib/form-data-helpers";

export type StudentListResponse = {
  data: StudentTableDataType[];
  count: number;
  relativeData: StudentTableRelativeData;
};

export type StudentSingleResponse = {
  student: StudentTableDataType;
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    role: string;
  };
  lessonsCount: number;
  currentUserRole: string;
  currentUserId: string;
  relativeData: StudentTableRelativeData;
};

export type StudentMutationResponse = ActionState;

export const studentsService = {
  list: async (params: TableSearchParams, cookies?: string) => {
    const response = await api.get<StudentListResponse>(`/api/students`, {
      ...withAuthHeaders(cookies),
      params,
    });
    return response.data;
  },

  getById: async (userId: string, cookies?: string) => {
    const response = await api.get<StudentSingleResponse>(
      `/api/students/${userId}/single`,
      withAuthHeaders(cookies)
    );
    return response.data;
  },

  getClass: async (userId: string, cookies?: string) => {
    const response = await api.get(
      `/api/students/${userId}/class`,
      withAuthHeaders(cookies)
    );
    return response.data;
  },

  create: async (data: StudentFormSchemaType) => {
    const formData = createFormData(data);
    const response = await api.post<StudentMutationResponse>(
      `/api/students`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  update: async (userId: string, data: StudentFormSchemaType) => {
    const formData = createFormData(data);
    const response = await api.patch<StudentMutationResponse>(
      `/api/students/${userId}`,
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
    const response = await api.delete<StudentMutationResponse>(
      `/api/students/${userId}`
    );
    return response.data;
  },
};
