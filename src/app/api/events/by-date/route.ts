import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/users";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    await getAuthUser();
    
    const searchParams = request.nextUrl.searchParams;
    const dateParam = searchParams.get("date");
    const date = dateParam ? new Date(dateParam) : new Date();

    const data = await prisma.event.findMany({
      where: {
        startTime: {
          gte: new Date(date.setHours(0, 0, 0, 0)),
          lte: new Date(date.setHours(23, 59, 59, 999)),
        },
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

