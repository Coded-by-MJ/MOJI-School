import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/users";
import prisma from "@/lib/prisma";
import { UserSex } from "@/generated/prisma";

export async function GET(request: NextRequest) {
  try {
    await getAuthUser();
    
    const data = await prisma.student.groupBy({
      by: ["sex"],
      _count: {
        _all: true,
      },
      orderBy: {
        sex: "asc",
      },
    });

    const boys = data.find((d) => d.sex === UserSex.MALE)?._count._all || 0;
    const girls = data.find((d) => d.sex === UserSex.FEMALE)?._count._all || 0;

    return NextResponse.json({
      boys,
      girls,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}

