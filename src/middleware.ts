import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth"; // your better-auth instance
import { headers } from "next/headers";
import { se } from "date-fns/locale";
import { UserRole } from "@prisma/client";

const privateRoutes = ["/list", "/profile", "/settings"];
const authRoutes = [
  "/forgot-password",
  "/reset-password",
  "/sign-in",
  "/sign-up",
];

const roleRoutes: Record<string, string> = {
  admin: "/admin",
  teacher: "/teacher",
  student: "/student",
  parent: "/parent",
};

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const pathname = request.nextUrl.pathname;
  const isPrivate = privateRoutes.some((route) => pathname.startsWith(route));
  const isAuth = authRoutes.some((route) => pathname.startsWith(route));

  // Not logged in → block private routes
  if (!session && isPrivate) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Force password reset if required
  if (session && session.user.isPasswordResetRequired) {
    if (!pathname.startsWith("/reset-password")) {
      return NextResponse.redirect(new URL("/reset-password", request.url));
    }
    return NextResponse.next();
  }

  // If logged in and on an auth route → redirect to role dashboard
  if (session && isAuth) {
    const currentUserRole = session.user.role as UserRole;
    return NextResponse.redirect(
      new URL(roleRoutes[currentUserRole] || "/", request.url)
    );
  }

  // Prevent cross-role access
//   if (session) {
//     const currentUserRole = session.user.role as UserRole;
//     const allowedPrefix = roleRoutes[currentUserRole];
//     if (!pathname.startsWith(allowedPrefix)) {
//       return NextResponse.redirect(new URL(allowedPrefix, request.url));
//     }
//   }

  // Allow otherwise
  return NextResponse.next();
}

export const config = {
  runtime: "nodejs",
  matcher: ["/((?!_next|api|static|favicon.ico).*)", "/"], // protect all pages except public
};
