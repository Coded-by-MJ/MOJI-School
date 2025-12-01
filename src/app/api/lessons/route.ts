import { NextRequest, NextResponse } from "next/server";
import { isUserAllowed } from "@/lib/users";
import prisma from "@/lib/prisma";
import { lessonFormSchema, validateWithZodSchema } from "@/types/zod-schemas";
import { TableSearchParams } from "@/types";
import { Prisma, UserRole } from "@/generated/prisma";

export async function GET(request: NextRequest) {
  try {
    const user = await isUserAllowed(["admin", "teacher"]);

    const searchParams = request.nextUrl.searchParams;
    const params: TableSearchParams = {
      page: parseInt(searchParams.get("page") || "1"),
      search: searchParams.get("search") || undefined,
      classId: searchParams.get("classId") || undefined,
      teacherId: searchParams.get("teacherId") || undefined,
    };

    const whereClause: Prisma.LessonWhereInput = {
      ...(params.classId
        ? {
            classId: params.classId,
          }
        : {}),
      ...(params.teacherId
        ? {
            teacherId: params.teacherId,
          }
        : {}),
      ...(params.search
        ? {
            OR: [
              {
                subject: {
                  name: { contains: params.search, mode: "insensitive" },
                },
              },
              {
                teacher: {
                  user: {
                    name: { contains: params.search, mode: "insensitive" },
                  },
                },
              },
            ],
          }
        : {}),
    };

    const [lessons, count, teachers, subjects, classes] =
      await prisma.$transaction([
        prisma.lesson.findMany({
          where: whereClause,
          include: {
            subject: { select: { name: true } },
            class: { select: { name: true } },
            teacher: {
              select: {
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
          orderBy: {
            updatedAt: "desc",
          },
        }),
        prisma.lesson.count({ where: whereClause }),
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
        prisma.subject.findMany({
          select: {
            id: true,
            name: true,
          },
        }),
        prisma.class.findMany({
          select: {
            id: true,
            name: true,
          },
        }),
      ]);

    return NextResponse.json({
      data: lessons,
      count,
      userRole: user.role as UserRole,
      relativeData: {
        teachers,
        subjects,
        classes,
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
    const body = validateWithZodSchema(lessonFormSchema, rawBody);

    await prisma.lesson.create({
      data: {
        ...body,
      },
    });

    return NextResponse.json({
      message: "Lesson created successfully",
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
