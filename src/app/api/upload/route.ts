import { NextRequest, NextResponse } from "next/server";
import { isUserAllowed } from "@/lib/users";
import { uploadImage } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    await isUserAllowed(["admin"]);

    const formData = await request.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json(
        { message: "No image file provided" },
        { status: 400 }
      );
    }

    const imageUrl = await uploadImage(file);

    return NextResponse.json({
      imageUrl,
      message: "Image uploaded successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}

