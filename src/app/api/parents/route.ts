import { NextRequest, NextResponse } from "next/server";
import { isUserAllowed } from "@/lib/users";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { extractOrJoinName, getDefaultPassword } from "@/utils/funcs";
import { parentFormSchema, validateWithZodSchema } from "@/types/zod-schemas";
import { TableSearchParams } from "@/types";
import { Prisma, UserRole } from "@/generated/prisma";

export async function GET(request: NextRequest) {
  try {
    const user = await isUserAllowed(["admin", "teacher"]);

    const searchParams = request.nextUrl.searchParams;
    const params: TableSearchParams = {
      page: parseInt(searchParams.get("page") || "1"),
      search: searchParams.get("search") || undefined,
    };

    const whereClause: Prisma.ParentWhereInput = {
      ...(params.search
        ? {
            user: {
              name: {
                contains: params.search,
                mode: "insensitive",
              },
            },
          }
        : {}),
    };

    const [parents, count] = await prisma.$transaction([
      prisma.parent.findMany({
        where: whereClause,
        include: {
          user: true,
          students: {
            select: {
              user: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      }),
      prisma.parent.count({ where: whereClause }),
    ]);

    return NextResponse.json({
      data: parents,
      count,
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

export async function POST(request: NextRequest) {
  try {
    await isUserAllowed(["admin"]);

    const rawBody = await request.json();
    const body = validateWithZodSchema(parentFormSchema, rawBody);
    const name = extractOrJoinName([body.firstName, body.lastName]);

    const existingParent = await prisma.parent.findUnique({
      where: { phone: body.phone },
    });

    if (existingParent) {
      return NextResponse.json(
        { message: "A parent with this phone number already exists." },
        { status: 400 }
      );
    }

    let userId: string | undefined;

    try {
      const { user } = await auth.api.createUser({
        body: {
          name,
          email: body.email,
          password: getDefaultPassword(name),
          role: "parent",
        },
        headers: await headers(),
      });

      userId = user.id;

      await prisma.parent.create({
        data: {
          userId: user.id,
          address: body.address,
          phone: body.phone,
        },
      });

      return NextResponse.json({
        message: "Parent created successfully.",
        type: "success",
      });
    } catch (error) {
      if (userId) {
        try {
          await prisma.user.delete({
            where: {
              id: userId,
            },
          });
        } catch (rollbackError) {
          console.error("Failed to rollback auth user:", rollbackError);
        }
      }
      throw error;
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}
