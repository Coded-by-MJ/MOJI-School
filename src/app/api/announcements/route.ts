import { NextRequest, NextResponse } from "next/server";
import { isUserAllowed, getAuthUser } from "@/lib/users";
import prisma from "@/lib/prisma";
import {
  announcementFormSchema,
  validateWithZodSchema,
} from "@/types/zod-schemas";
import { TableSearchParams } from "@/types";
import { Prisma, UserRole } from "@/generated/prisma";

export async function GET(request: NextRequest) {
  try {
    const { role, id } = await isUserAllowed([
      "admin",
      "teacher",
      "student",
      "parent",
    ]);

    const searchParams = request.nextUrl.searchParams;
    const params: TableSearchParams = {
      page: parseInt(searchParams.get("page") || "1"),
      search: searchParams.get("search") || undefined,
    };

    const roleConditions = {
      teacher: { lessons: { some: { teacherId: id } } },
      student: { students: { some: { id: id } } },
      parent: { students: { some: { parentId: id } } },
    };

    const whereClause: Prisma.AnnouncementWhereInput = {
      ...(params.search
        ? {
            title: { contains: params.search, mode: "insensitive" },
          }
        : {}),
      class: roleConditions[role as keyof typeof roleConditions] || {},
    };

    const [announcements, count, classes] = await Promise.all([
      prisma.announcement.findMany({
        where: whereClause,
        include: { class: { select: { id: true, name: true } } },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.announcement.count({ where: whereClause }),
      prisma.class.findMany({ select: { id: true, name: true } }),
    ]);

    return NextResponse.json({
      data: announcements,
      count,
      userRole: role as UserRole,
      relativeData: { classes },
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
    const body = validateWithZodSchema(announcementFormSchema, rawBody);

    await prisma.announcement.create({
      data: {
        ...body,
      },
    });

    return NextResponse.json({
      message: "Announcement created successfully",
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
