import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/users";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await getAuthUser();
    const { id } = await params;
    
    const dataRes = await prisma.lesson.findMany({
      where: {
        classId: id,
      },
    });

    const data = dataRes.map((lesson) => ({
      title: lesson.name,
      start: lesson.startTime,
      end: lesson.endTime,
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}

