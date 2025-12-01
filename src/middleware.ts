import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth"; // your better-auth instance
import { headers } from "next/headers";
import { UserRole } from "@/generated/prisma";
import { routeAccessMap } from "./utils";

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
    if (pathname === "/" || isAuth) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/forgot-password", request.url));
    }
  }

  // If logged in and on an auth route → redirect to role dashboard
  if (session && !session.user.isPasswordResetRequired && isAuth) {
    const currentUserRole = session.user.role as UserRole;
    return NextResponse.redirect(
      new URL(roleRoutes[currentUserRole] || "/", request.url)
    );
  }

  // Prevent cross-role access

  if (session) {
    const currentUserRole = session.user.role as UserRole;

    // Check if the route matches any rule in routeAccessMap
    for (const [pattern, allowedRoles] of Object.entries(routeAccessMap)) {
      const regex = new RegExp(`^${pattern}$`);
      if (regex.test(pathname)) {
        // If user's role isn't allowed → redirect
        if (!allowedRoles.includes(currentUserRole)) {
          const redirectTo = roleRoutes[currentUserRole] || "/";
          return NextResponse.redirect(new URL(redirectTo, request.url));
        }
        break;
      }
    }
  }

  // Allow otherwise
  return NextResponse.next();
}

export const config = {
  runtime: "nodejs",
  matcher: ["/((?!_next|api|static|favicon.ico).*)", "/"], // protect all pages except public
};
