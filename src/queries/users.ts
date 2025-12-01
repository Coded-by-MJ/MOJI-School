import { mutationResult } from "@/lib/react-query-helpers";
import { usersService } from "@/services/users";
import { ProfileFormSchemaType } from "@/types/zod-schemas";

export const usersMutations = {
  updateProfile: mutationResult((variables: ProfileFormSchemaType) =>
    usersService.updateProfile(variables)
  ),
};
