import { NextRequest, NextResponse } from "next/server";
import { isUserAllowed } from "@/lib/users";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { extractOrJoinName, getDefaultPassword } from "@/utils/funcs";
import { teacherFormSchema, validateWithZodSchema } from "@/types/zod-schemas";
import { TableSearchParams } from "@/types";
import { Prisma } from "@/generated/prisma";
import { ITEMS_PER_PAGE } from "@/utils";
import { uploadImage } from "@/lib/supabase";
import { parseFormDataForRoute } from "@/lib/form-data-helpers";

export async function GET(request: NextRequest) {
  try {
    await isUserAllowed(["admin", "teacher"]);

    const searchParams = request.nextUrl.searchParams;
    const params: TableSearchParams = {
      page: parseInt(searchParams.get("page") || "1"),
      search: searchParams.get("search") || undefined,
      classId: searchParams.get("classId") || undefined,
    };

    const whereClause: Prisma.TeacherWhereInput = {
      ...(params.classId
        ? {
            lessons: {
              some: {
                classId: params.classId,
              },
            },
          }
        : {}),
      ...(params.search
        ? {
            user: {
              name: {
                contains: params.search,
                mode: "insensitive",
              },
            },
          }
        : {}),
    };

    const [teachers, count, subjects] = await Promise.all([
      prisma.teacher.findMany({
        where: whereClause,
        include: {
          user: true,
          classes: true,
          subjects: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
        take: ITEMS_PER_PAGE,
        skip: ITEMS_PER_PAGE * (params.page - 1),
      }),
      prisma.teacher.count({
        where: whereClause,
      }),
      prisma.subject.findMany({
        select: {
          id: true,
          name: true,
        },
      }),
    ]);

    return NextResponse.json({
      data: teachers,
      count,
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

export async function POST(request: NextRequest) {
  try {
    await isUserAllowed(["admin"]);

    const formData = await request.formData();
    const { rawBody } = await parseFormDataForRoute(formData);

    // Handle subjects array properly
    const subjectsEntries = formData.getAll("subjects[]");
    if (subjectsEntries.length > 0) {
      rawBody.subjects = subjectsEntries.map((s) => s.toString());
    } else if (!rawBody.subjects) {
      rawBody.subjects = [];
    }

    const body = validateWithZodSchema(teacherFormSchema, rawBody);
    const name = extractOrJoinName([body.firstName, body.lastName]);

    const existingTeacher = await prisma.teacher.findUnique({
      where: { phone: body.phone },
    });

    if (existingTeacher) {
      return NextResponse.json(
        { message: "A teacher with this phone number already exists." },
        { status: 400 }
      );
    }

    let userId: string | undefined;
    let imageUrl: string | undefined;

    try {
      // Upload image if provided
      if (body.img instanceof File) {
        imageUrl = await uploadImage(body.img);
      }

      const { user } = await auth.api.createUser({
        body: {
          name,
          email: body.email,
          password: getDefaultPassword(name),
          role: "teacher",
        },
        headers: await headers(),
      });

      userId = user.id;
      await prisma.$transaction([
        prisma.teacher.create({
          data: {
            userId: user.id,
            bloodType: body.bloodType,
            address: body.address,
            phone: body.phone,
            birthday: body.birthday,
            sex: body.sex,
            subjects: {
              connect: body.subjects.map((subjectId) => ({ id: subjectId })),
            },
          },
        }),
        prisma.user.update({
          where: { id: user.id },
          data: { ...(imageUrl && { image: imageUrl }) },
        }),
      ]);

      return NextResponse.json({
        message: "Teacher created successfully.",
        type: "success",
      });
    } catch (error) {
      if (userId) {
        try {
          await prisma.user.delete({
            where: {
              id: userId,
            },
          });
        } catch (rollbackError) {
          console.error("Failed to rollback auth user:", rollbackError);
        }
      }
      throw error;
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}
