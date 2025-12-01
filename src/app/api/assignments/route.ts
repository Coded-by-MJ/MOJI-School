import { NextRequest, NextResponse } from "next/server";
import { isUserAllowed } from "@/lib/users";
import prisma from "@/lib/prisma";
import {
  assignmentFormSchema,
  validateWithZodSchema,
} from "@/types/zod-schemas";
import { TableSearchParams } from "@/types";
import { Prisma, UserRole } from "@/generated/prisma";

export async function GET(request: NextRequest) {
  try {
    const { id: currentUserId, role } = await isUserAllowed([
      "admin",
      "teacher",
      "student",
      "parent",
    ]);

    const searchParams = request.nextUrl.searchParams;
    const params: TableSearchParams = {
      page: parseInt(searchParams.get("page") || "1"),
      search: searchParams.get("search") || undefined,
      classId: searchParams.get("classId") || undefined,
      teacherId: searchParams.get("teacherId") || undefined,
    };

    const whereClause: Prisma.AssignmentWhereInput = {
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
            lesson: {
              subject: {
                name: { contains: params.search, mode: "insensitive" },
              },
            },
          }
        : {}),
    };

    switch (role) {
      case "admin":
        break;
      case "teacher": {
        const existing = whereClause.lesson || {};
        existing.teacherId = currentUserId;
        whereClause.lesson = { ...existing };
        break;
      }
      case "student": {
        const existing = whereClause.lesson || {};
        existing.class = {
          students: {
            some: {
              id: currentUserId,
            },
          },
        };
        whereClause.lesson = { ...existing };
        break;
      }
      case "parent": {
        const existing = whereClause.lesson || {};
        existing.class = {
          students: {
            some: {
              parentId: currentUserId!,
            },
          },
        };
        whereClause.lesson = { ...existing };
        break;
      }
      default:
        break;
    }

    const [assignments, count, lessons] = await Promise.all([
      prisma.assignment.findMany({
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
      prisma.assignment.count({ where: whereClause }),
      prisma.lesson.findMany({
        select: {
          id: true,
          name: true,
        },
      }),
    ]);

    return NextResponse.json({
      data: assignments,
      count,
      userRole: role as UserRole,
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
    const body = validateWithZodSchema(assignmentFormSchema, rawBody);

    await prisma.assignment.create({
      data: {
        ...body,
      },
    });

    return NextResponse.json({
      message: "Assignment created successfully",
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
