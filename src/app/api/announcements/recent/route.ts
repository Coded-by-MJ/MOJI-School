import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/users";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { id, role } = await getAuthUser();
    
    const roleConditions = {
      teacher: { lessons: { some: { teacherId: id } } },
      student: { students: { some: { id: id } } },
      parent: { students: { some: { parentId: id } } },
    };

    const data = await prisma.announcement.findMany({
      take: 3,
      orderBy: { date: "desc" },
      where: {
        ...(role !== "admin" && {
          OR: [
            { classId: null },
            {
              class: roleConditions[role as keyof typeof roleConditions] || {},
            },
          ],
        }),
      },
    });
    
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}

