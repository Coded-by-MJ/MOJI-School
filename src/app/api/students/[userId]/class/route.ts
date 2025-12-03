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
    
    const data = await prisma.student.findUnique({
      where: { userId },
      select: {
        class: true,
      },
    });

    if (!data) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    return NextResponse.json(data.class);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}

