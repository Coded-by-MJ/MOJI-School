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
    
    const [data, subjects] = await prisma.$transaction([
      prisma.teacher.findUnique({
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
          subjects: true,
          _count: {
            select: {
              lessons: true,
              classes: true,
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
    ]);

    if (!data) {
      return NextResponse.json({ message: "Teacher not found" }, { status: 404 });
    }

    return NextResponse.json({
      teacher: {
        ...data,
      },
      user: data.user,
      subjectsCount: data.subjects.length,
      lessonsCount: data._count.lessons,
      classesCount: data._count.classes,
      currentUserRole: role as UserRole,
      currentUserId: id,
      relativeData: {
        subjects,
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

