import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { openAPI, admin, createAuthMiddleware } from "better-auth/plugins";
import { nextCookies } from "better-auth/next-js";
import { APIError } from "better-auth/api";

import prisma from "./prisma";
import { ReturnedType } from "./auth-types";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  appName: "MOJI School",
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    sendResetPassword: async ({ user, url }) => {
      // const resetLink = `${process.env.BETTER_AUTH_URL}/api/auth/reset-password/${token}?callbackURL=/reset-password`;
      //   await sendResetPasswordEmailAction({
      //     email: user.email,
      //     link: url,
      //     firstName: user.name.split(" ")[0],
      //   });
    },
    onPasswordReset: async ({ user }) => {},
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
        after: async (user) => {},
      },
    },
  },

  plugins: [
    openAPI(),
    admin({
      defaultRole: "student",
    }),
    nextCookies(),
  ], //api/auth/reference
});
