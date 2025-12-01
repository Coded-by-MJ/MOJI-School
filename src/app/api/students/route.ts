import { NextRequest, NextResponse } from "next/server";
import { isUserAllowed } from "@/lib/users";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { extractOrJoinName, getDefaultPassword } from "@/utils/funcs";
import { studentFormSchema, validateWithZodSchema } from "@/types/zod-schemas";
import { TableSearchParams } from "@/types";
import { Prisma } from "@/generated/prisma";
import { uploadImage } from "@/lib/supabase";
import { parseFormDataForRoute } from "@/lib/form-data-helpers";

export async function GET(request: NextRequest) {
  try {
    await isUserAllowed(["admin", "teacher"]);

    const searchParams = request.nextUrl.searchParams;
    const params: TableSearchParams = {
      page: parseInt(searchParams.get("page") || "1"),
      search: searchParams.get("search") || undefined,
      teacherId: searchParams.get("teacherId") || undefined,
    };

    const whereClause: Prisma.StudentWhereInput = {
      ...(params.teacherId
        ? {
            class: {
              lessons: {
                some: {
                  teacherId: params.teacherId,
                },
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

    const [students, count, grades, classes, parents] = await Promise.all([
      prisma.student.findMany({
        where: whereClause,
        include: {
          user: true,
          class: true,
          grade: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
      }),
      prisma.student.count({ where: whereClause }),
      prisma.grade.findMany(),
      prisma.class.findMany({
        select: {
          id: true,
          name: true,
          capacity: true,
          _count: { select: { students: true } },
        },
      }),
      prisma.parent.findMany({
        select: {
          id: true,
          user: {
            select: {
              name: true,
            },
          },
        },
      }),
    ]);

    return NextResponse.json({
      data: students,
      count,
      relativeData: {
        grades,
        classes,
        parents,
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
    const body = validateWithZodSchema(studentFormSchema, rawBody);
    const name = extractOrJoinName([body.firstName, body.lastName]);

    const [existingStudent, classItem] = await Promise.all([
      prisma.student.findUnique({
        where: { phone: body.phone },
      }),
      prisma.class.findUnique({
        where: { id: body.classId },
        include: { _count: { select: { students: true } } },
      }),
    ]);

    if (classItem && classItem.capacity === classItem._count.students) {
      return NextResponse.json(
        { message: "The selected class has reached it's full capacity." },
        { status: 400 }
      );
    }

    if (existingStudent) {
      return NextResponse.json(
        { message: "A student with this phone number already exists." },
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
          role: "student",
        },
        headers: await headers(),
      });

      userId = user.id;

      await prisma.$transaction([
        prisma.student.create({
          data: {
            userId: user.id,
            address: body.address,
            phone: body.phone,
            birthday: body.birthday,
            sex: body.sex,
            bloodType: body.bloodType,
            parentId: body.parentId,
            classId: body.classId,
            gradeId: body.gradeId,
          },
        }),
        prisma.user.update({
          where: { id: user.id },
          data: { ...(imageUrl && { image: imageUrl }) },
        }),
      ]);

      return NextResponse.json({
        message: "Student created successfully.",
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
