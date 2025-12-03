import { NextRequest, NextResponse } from "next/server";
import { isUserAllowed } from "@/lib/users";
import prisma from "@/lib/prisma";
import {
  attendanceFormSchema,
  validateWithZodSchema,
} from "@/types/zod-schemas";
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

    const whereClause: Prisma.AttendanceWhereInput = {
      ...(params.classId
        ? {
            lesson: { classId: params.classId },
          }
        : {}),
      ...(params.teacherId
        ? {
            lesson: { teacherId: params.teacherId },
          }
        : {}),
      ...(params.search
        ? {
            student: {
              user: {
                name: { contains: params.search, mode: "insensitive" },
              },
            },
          }
        : {}),
    };

    const [attendances, count, students, lessons] = await Promise.all([
      prisma.attendance.findMany({
        where: whereClause,
        include: {
          student: {
            select: {
              id: true,
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
          lesson: {
            select: {
              id: true,
              name: true,
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
          },
        },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.attendance.count({ where: whereClause }),
      prisma.student.findMany({
        select: {
          id: true,
          user: {
            select: {
              name: true,
            },
          },
        },
      }),
      prisma.lesson.findMany({ select: { id: true, name: true } }),
    ]);

    return NextResponse.json({
      data: attendances,
      count,
      userRole: user.role as UserRole,
      relativeData: { students, lessons },
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
    const body = validateWithZodSchema(attendanceFormSchema, rawBody);

    await prisma.attendance.create({
      data: {
        ...body,
      },
    });

    return NextResponse.json({
      message: "Attendance created successfully",
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
