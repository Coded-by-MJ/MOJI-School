import { NextRequest, NextResponse } from "next/server";
import { isUserAllowed } from "@/lib/users";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { extractOrJoinName } from "@/utils/funcs";
import { parentFormSchema, validateWithZodSchema } from "@/types/zod-schemas";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    await isUserAllowed(["admin"]);

    const { userId } = await params;
    const rawBody = await request.json();
    const body = validateWithZodSchema(parentFormSchema, rawBody);
    const name = extractOrJoinName([body.firstName, body.lastName]);

    const existingParent = await prisma.parent.findUnique({
      where: { phone: body.phone },
    });

    if (existingParent && existingParent.userId !== userId) {
      return NextResponse.json(
        { message: "A parent with this phone number already exists." },
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

    await prisma.parent.update({
      where: {
        userId,
      },
      data: {
        address: body.address,
        phone: body.phone,
      },
    });

    return NextResponse.json({
      message: "Parent updated successfully",
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
      message: "Parent deleted successfully",
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
