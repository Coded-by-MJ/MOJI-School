import { NextRequest, NextResponse } from "next/server";
import { isUserAllowed } from "@/lib/users";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { extractOrJoinName } from "@/utils/funcs";
import { teacherFormSchema, validateWithZodSchema } from "@/types/zod-schemas";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await isUserAllowed(["admin"]);

    const { userId } = await params;
    const rawBody = await request.json();
    const body = validateWithZodSchema(teacherFormSchema, rawBody);
    const name = extractOrJoinName([body.firstName, body.lastName]);

    const existingTeacher = await prisma.teacher.findUnique({
      where: { phone: body.phone },
    });

    if (existingTeacher && existingTeacher.userId !== userId) {
      return NextResponse.json(
        { message: "A teacher with this phone number already exists." },
        { status: 400 }
      );
    }

    await auth.api.adminUpdateUser({
      body: {
        userId,
        data: {
          name,
        },
      },
      headers: await headers(),
    });

    await prisma.teacher.update({
      where: {
        userId,
      },
      data: {
        bloodType: body.bloodType,
        address: body.address,
        phone: body.phone,
        birthday: body.birthday,
        sex: body.sex,
        subjects: {
          set: body.subjects?.map((subjectId: string) => ({
            id: subjectId,
          })),
        },
      },
    });

    return NextResponse.json({
      message: "Teacher updated successfully",
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await isUserAllowed(["admin"]);

    const { userId } = await params;

    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    return NextResponse.json({
      message: "Teacher deleted successfully",
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
