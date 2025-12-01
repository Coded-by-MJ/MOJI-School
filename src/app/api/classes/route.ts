import { NextRequest, NextResponse } from "next/server";
import { isUserAllowed } from "@/lib/users";
import prisma from "@/lib/prisma";
import { classFormSchema, validateWithZodSchema } from "@/types/zod-schemas";
import { TableSearchParams } from "@/types";
import { Prisma, UserRole } from "@/generated/prisma";

export async function GET(request: NextRequest) {
  try {
    const user = await isUserAllowed(["admin", "teacher"]);

    const searchParams = request.nextUrl.searchParams;
    const params: TableSearchParams = {
      page: parseInt(searchParams.get("page") || "1"),
      search: searchParams.get("search") || undefined,
      teacherId: searchParams.get("teacherId") || undefined,
    };

    const whereClause: Prisma.ClassWhereInput = {
      ...(params.teacherId
        ? {
            supervisorId: params.teacherId,
          }
        : {}),
      ...(params.search
        ? {
            name: {
              contains: params.search,
              mode: "insensitive",
            },
          }
        : {}),
    };

    const [classes, count, grades, teachers] = await prisma.$transaction([
      prisma.class.findMany({
        where: whereClause,
        include: {
          supervisor: {
            select: {
              user: true,
            },
          },
          grade: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
      }),
      prisma.class.count({ where: whereClause }),
      prisma.grade.findMany(),
      prisma.teacher.findMany({
        select: {
          id: true,
          user: {
            select: {
              name: true,
            },
          },
        },
      }),
    ]);

    return NextResponse.json({
      data: classes,
      userRole: user.role as UserRole,
      count,
      relativeData: {
        grades,
        teachers,
      },
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
    const body = validateWithZodSchema(classFormSchema, rawBody);

    await prisma.class.create({
      data: {
        ...body,
      },
    });

    return NextResponse.json({
      message: "Class created successfully",
      type: "success",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}
