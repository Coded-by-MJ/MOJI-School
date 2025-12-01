import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/users";
import prisma from "@/lib/prisma";
import { UserRole } from "@/generated/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { role, id } = await getAuthUser();
    const { userId } = await params;
    
    const [data, grades, classes, parents] = await prisma.$transaction([
      prisma.student.findUnique({
        where: { id: userId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              role: true,
            },
          },
          grade: true,
          class: {
            include: {
              _count: {
                select: {
                  lessons: true,
                },
              },
            },
          },
        },
      }),
      prisma.grade.findMany(),
      prisma.class.findMany({
        select: {
          id: true,
          name: true,
          capacity: true,
          _count: { select: { students: true } },
        },
      }),
      prisma.parent.findMany({
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

    if (!data) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    return NextResponse.json({
      student: {
        ...data,
      },
      user: data.user,
      lessonsCount: data.class._count.lessons,
      currentUserRole: role as UserRole,
      currentUserId: id,
      relativeData: {
        grades,
        classes,
        parents,
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

