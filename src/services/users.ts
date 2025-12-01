import { api } from "@/lib/axios-client";
import { ActionState } from "@/types";
import { ProfileFormSchemaType } from "@/types/zod-schemas";
import { createFormData } from "@/lib/form-data-helpers";

export type UserMutationResponse = ActionState;

export const usersService = {
  updateProfile: async (data: ProfileFormSchemaType) => {
    const formData = createFormData(data);
    const response = await api.patch<UserMutationResponse>(
      `/api/users/profile`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },
};
