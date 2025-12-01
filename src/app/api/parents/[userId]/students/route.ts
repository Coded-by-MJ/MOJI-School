import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/users";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await getAuthUser();
    const { userId } = await params;
    
    const data = await prisma.parent.findUnique({
      where: { userId },
      select: {
        students: {
          select: {
            id: true,
            classId: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    if (!data) {
      return NextResponse.json({ message: "Parent not found" }, { status: 404 });
    }

    return NextResponse.json(data.students);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}

