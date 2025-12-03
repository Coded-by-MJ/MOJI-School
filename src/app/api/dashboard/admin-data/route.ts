import { NextRequest, NextResponse } from "next/server";
import { isUserAllowed } from "@/lib/users";
import prisma from "@/lib/prisma";
import { UserRole } from "@/generated/prisma";

export async function GET(request: NextRequest) {
  try {
    const user = await isUserAllowed(["admin"]);
    
    const [gradesWithClasses, parents] = await Promise.all([
      prisma.grade.findMany({
        include: {
          classes: {
            select: {
              name: true,
              id: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      }),
      prisma.parent.findMany({
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      }),
    ]);

    return NextResponse.json({
      data: {
        gradesWithClasses,
        parents,
      },
      userRole: user.role as UserRole,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}

