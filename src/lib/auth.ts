import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import {
  openAPI,
  admin as adminPlugin,
  createAuthMiddleware,
} from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { ac, admin, teacher, student, parent } from "./permissions";

import prisma from "./prisma";
import { ReturnedType } from "./auth-types";
import {
  sendAccountDetailsEmailAction,
  sendResetPasswordEmailAction,
} from "./resendActions";
import { getDefaultPassword } from "@/utils/funcs";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  appName: "MOJI School",
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    sendResetPassword: async ({ user, url }) => {
      await sendResetPasswordEmailAction({
        email: user.email,
        link: url,
        firstName: user.name.split(" ")[0],
      });
    },
    onPasswordReset: async ({ user }) => {
      await prisma.user.update({
        where: { id: user.id },
        data: { isPasswordResetRequired: false },
      });
    },
  },
  user: {
    additionalFields: {
      isPasswordResetRequired: {
        type: "boolean",
        defaultValue: true,
        input: false,
        returned: true,
      },
      role: {
        type: "string",
        input: false,
        required: false,
        defaultValue: "student",
        returned: true,
      },
    },
  },

  // ✅ Just this block ensures the session is valid for 7 days
  session: {
    // You're using prismaAdapter
    maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
    updateAge: 24 * 60 * 60, // Optional: refresh token age every 24 hours
    cookieCache: {
      enabled: false,
    },
  },

  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-in/email") {
        const returnedObj = ctx.context.returned as ReturnedType;
        if (!returnedObj.user) return;
        const dbUser = await prisma.user.findUnique({
          where: { id: returnedObj.user.id },
          select: {
            isPasswordResetRequired: true,
            role: true,
          },
        });

        if (!dbUser) return;

        const newReturned = {
          ...returnedObj,
          user: {
            ...returnedObj.user,
            isPasswordResetRequired: dbUser.isPasswordResetRequired,
            role: dbUser.role,
          },
        };

        ctx.context.returned = newReturned;

        return ctx.context.returned;
      }
    }),
  },

  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          const link = `${process.env.NEXT_PUBLIC_APP_URL}/sign-in`;

          await sendAccountDetailsEmailAction({
            email: user.email,
            name: user.name,
            link,
            password: getDefaultPassword(user.name),
          });
        },
      },
    },
  },

  plugins: [
    openAPI(),
    adminPlugin({
      defaultRole: "student",
      ac,
      roles: {
        admin,
        teacher,
        student,
        parent,
      },
    }),
    nextCookies(),
  ], //api/auth/reference
});
