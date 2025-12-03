import { NextRequest, NextResponse } from "next/server";
import { isUserAllowed } from "@/lib/users";
import prisma from "@/lib/prisma";
import { resultFormSchema, validateWithZodSchema } from "@/types/zod-schemas";
import { TableSearchParams } from "@/types";
import { Prisma, UserRole } from "@/generated/prisma";

export async function GET(request: NextRequest) {
  try {
    const { role, id: currentUserId } = await isUserAllowed([
      "admin",
      "teacher",
      "student",
      "parent",
    ]);

    const searchParams = request.nextUrl.searchParams;
    const params: TableSearchParams = {
      page: parseInt(searchParams.get("page") || "1"),
      search: searchParams.get("search") || undefined,
      studentId: searchParams.get("studentId") || undefined,
    };

    const whereClause: Prisma.ResultWhereInput = {
      ...(params.studentId
        ? {
            studentId: params.studentId,
          }
        : {}),
      ...(params.search
        ? {
            OR: [
              {
                exam: {
                  title: { contains: params.search, mode: "insensitive" },
                },
              },
              {
                student: {
                  user: {
                    name: { contains: params.search, mode: "insensitive" },
                  },
                },
              },
            ],
          }
        : {}),
    };

    switch (role) {
      case "admin":
        break;
      case "teacher":
        whereClause.OR = [
          { exam: { lesson: { teacherId: currentUserId } } },
          { assignment: { lesson: { teacherId: currentUserId } } },
        ];
        break;
      case "student":
        whereClause.studentId = currentUserId;
        break;
      case "parent":
        whereClause.student = {
          parentId: currentUserId,
        };
        break;
      default:
        break;
    }

    const [results, count, exams, assignments, students] =
      await Promise.all([
        prisma.result.findMany({
          where: whereClause,
          include: {
            exam: {
              select: {
                id: true,
                title: true,
                lesson: {
                  select: {
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
            },
            assignment: {
              select: {
                id: true,
                title: true,
                lesson: {
                  select: {
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
            },
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
          },
          orderBy: { updatedAt: "desc" },
        }),
        prisma.result.count({ where: whereClause }),
        prisma.exam.findMany({ select: { id: true, title: true } }),
        prisma.assignment.findMany({ select: { id: true, title: true } }),
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
      ]);

    return NextResponse.json({
      data: results,
      count,
      userRole: role as UserRole,
      relativeData: { exams, assignments, students },
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
    const body = validateWithZodSchema(resultFormSchema, rawBody);

    await prisma.result.create({
      data: {
        ...body,
      },
    });

    return NextResponse.json({
      message: "Result created successfully",
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
