import { NextRequest, NextResponse } from "next/server";
import { isUserAllowed } from "@/lib/users";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { extractOrJoinName } from "@/utils/funcs";
import { teacherFormSchema, validateWithZodSchema } from "@/types/zod-schemas";
import { deleteImage, uploadImage } from "@/lib/supabase";
import { parseFormDataForRoute } from "@/lib/form-data-helpers";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await isUserAllowed(["admin"]);

    const { userId } = await params;
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

    if (existingTeacher && existingTeacher.userId !== userId) {
      return NextResponse.json(
        { message: "A teacher with this phone number already exists." },
        { status: 400 }
      );
    }

    // Get current user data to check for existing image
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { image: true },
    });

    let imageUrl: string | undefined;

    // Upload new image if provided
    if (body.img instanceof File && body.img.size > 0) {
      imageUrl = await uploadImage(body.img);
      // Delete old image if it exists
      if (currentUser?.image) {
        await deleteImage(currentUser.image);
      }
    }

    await auth.api.adminUpdateUser({
      body: {
        userId,
        data: {
          name,
          ...(imageUrl && { image: imageUrl }),
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

    // Get user to check for images before deletion
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { image: true },
    });

    // Delete image from Supabase if it exists
    if (user?.image) {
      await deleteImage(user.image);
    }

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
