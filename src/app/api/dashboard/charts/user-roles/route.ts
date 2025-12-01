import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/users";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    await getAuthUser();
    
    const [teachers, parents, students] = await prisma.$transaction([
      prisma.teacher.count(),
      prisma.parent.count(),
      prisma.student.count(),
    ]);

    return NextResponse.json({
      teachersCount: teachers || 0,
      parentsCount: parents || 0,
      studentsCount: students || 0,
      staffCount: 0,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}

