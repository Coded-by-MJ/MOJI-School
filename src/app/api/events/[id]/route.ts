import { NextRequest, NextResponse } from "next/server";
import { isUserAllowed } from "@/lib/users";
import prisma from "@/lib/prisma";
import { eventFormSchema, validateWithZodSchema } from "@/types/zod-schemas";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await isUserAllowed(["admin"]);

    const { id } = await params;
    const rawBody = await request.json();
    const body = validateWithZodSchema(eventFormSchema, rawBody);

    await prisma.event.update({
      where: {
        id,
      },
      data: {
        ...body,
      },
    });

    return NextResponse.json({
      message: "Event updated successfully",
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

    await prisma.event.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      message: "Event deleted successfully",
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
