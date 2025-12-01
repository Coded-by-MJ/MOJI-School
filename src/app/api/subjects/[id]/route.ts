import { NextRequest, NextResponse } from "next/server";
import { isUserAllowed } from "@/lib/users";
import prisma from "@/lib/prisma";
import { subjectFormSchema, validateWithZodSchema } from "@/types/zod-schemas";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await isUserAllowed(["admin"]);

    const { id } = await params;
    const rawBody = await request.json();
    const body = validateWithZodSchema(subjectFormSchema, rawBody);

    await prisma.subject.update({
      where: {
        id,
      },
      data: {
        name: body.name,
        teachers: {
          set: body.teachers.map((teacherId) => ({ id: teacherId })),
        },
      },
    });

    return NextResponse.json({
      message: "Subject updated successfully",
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await isUserAllowed(["admin"]);

    const { id } = await params;

    await prisma.subject.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: "Subject deleted successfully",
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
