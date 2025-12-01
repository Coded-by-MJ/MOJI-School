import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/users";
import prisma from "@/lib/prisma";
import { ActionState } from "@/types";
import { profileFormSchema, validateWithZodSchema } from "@/types/zod-schemas";
import { deleteImage, uploadImage } from "@/lib/supabase";
import { parseFormDataForRoute } from "@/lib/form-data-helpers";
import { extractOrJoinName } from "@/utils/funcs";

export async function PATCH(request: NextRequest) {
  try {
    const user = await getAuthUser();
    const formData = await request.formData();
    const { rawBody } = await parseFormDataForRoute(formData, "img");

    const body = validateWithZodSchema(profileFormSchema, rawBody);
    const name = extractOrJoinName([body.firstName, body.lastName]);

    // Get current user data to check for existing image
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
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

    await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        ...(imageUrl && { image: imageUrl }),
      },
    });

    const response: ActionState = {
      message: "Profile updated successfully",
      type: "success",
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error updating profile:", error);
    const response: ActionState = {
      message: error instanceof Error ? error.message : "An error occurred",
      type: "error",
    };
    return NextResponse.json(response, { status: 400 });
  }
}
