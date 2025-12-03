import { NextRequest, NextResponse } from "next/server";
import { isUserAllowed } from "@/lib/users";
import prisma from "@/lib/prisma";
import { subjectFormSchema, validateWithZodSchema } from "@/types/zod-schemas";
import { TableSearchParams } from "@/types";
import { Prisma, UserRole } from "@/generated/prisma";

export async function GET(request: NextRequest) {
  try {
    const user = await isUserAllowed(["admin"]);

    const searchParams = request.nextUrl.searchParams;
    const params: TableSearchParams = {
      page: parseInt(searchParams.get("page") || "1"),
      search: searchParams.get("search") || undefined,
    };

    const whereClause: Prisma.SubjectWhereInput = {
      ...(params.search
        ? {
            name: {
              contains: params.search,
              mode: "insensitive",
            },
          }
        : {}),
    };

    const [subjects, count, teachers] = await Promise.all([
      prisma.subject.findMany({
        where: whereClause,
        include: {
          teachers: {
            select: {
              id: true,
              user: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      }),
      prisma.subject.count({ where: whereClause }),
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
      data: subjects,
      count,
      userRole: user.role as UserRole,
      relativeData: { teachers },
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
    const body = validateWithZodSchema(subjectFormSchema, rawBody);

    await prisma.subject.create({
      data: {
        name: body.name,
        teachers: {
          connect: body.teachers.map((teacherId) => ({ id: teacherId })),
        },
      },
    });

    return NextResponse.json({
      message: "Subject created successfully",
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
