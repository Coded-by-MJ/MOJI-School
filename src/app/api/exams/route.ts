import { NextRequest, NextResponse } from "next/server";
import { isUserAllowed } from "@/lib/users";
import prisma from "@/lib/prisma";
import { examFormSchema, validateWithZodSchema } from "@/types/zod-schemas";
import { TableSearchParams } from "@/types";
import { Prisma, UserRole } from "@/generated/prisma";

export async function GET(request: NextRequest) {
  try {
    const user = await isUserAllowed(["admin", "teacher", "student", "parent"]);

    const searchParams = request.nextUrl.searchParams;
    const params: TableSearchParams = {
      page: parseInt(searchParams.get("page") || "1"),
      search: searchParams.get("search") || undefined,
      classId: searchParams.get("classId") || undefined,
      teacherId: searchParams.get("teacherId") || undefined,
    };

    const whereClause: Prisma.ExamWhereInput = {
      ...(params.classId
        ? {
            lesson: {
              classId: params.classId,
            },
          }
        : {}),
      ...(params.teacherId
        ? {
            lesson: {
              teacherId: params.teacherId,
            },
          }
        : {}),
      ...(params.search
        ? {
            OR: [
              {
                lesson: {
                  subject: {
                    name: { contains: params.search, mode: "insensitive" },
                  },
                },
              },
              {
                lesson: {
                  teacher: {
                    user: {
                      name: { contains: params.search, mode: "insensitive" },
                    },
                  },
                },
              },
            ],
          }
        : {}),
    };

    const [exams, count, lessons] = await Promise.all([
      prisma.exam.findMany({
        where: whereClause,
        include: {
          lesson: {
            select: {
              subject: { select: { name: true } },
              teacher: { select: { user: { select: { name: true } } } },
              class: { select: { name: true } },
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      }),
      prisma.exam.count({ where: whereClause }),
      prisma.lesson.findMany({
        select: {
          id: true,
          name: true,
        },
      }),
    ]);

    return NextResponse.json({
      data: exams,
      count,
      userRole: user.role as UserRole,
      relativeData: {
        lessons,
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
    const body = validateWithZodSchema(examFormSchema, rawBody);

    await prisma.exam.create({
      data: {
        ...body,
      },
    });

    return NextResponse.json({
      message: "Exam created successfully",
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
