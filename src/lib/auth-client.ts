import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields, adminClient } from "better-auth/client/plugins";
import { ac, admin, teacher, student, parent } from "./permissions";

import type { auth } from "./auth";
export const authClient = createAuthClient({
  plugins: [
    inferAdditionalFields<typeof auth>(),
    adminClient({
      ac,
      roles: {
        admin,
        teacher,
        student,
        parent,
      },
    }),
  ],
});
