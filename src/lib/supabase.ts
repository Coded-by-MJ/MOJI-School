import { createClient } from "@supabase/supabase-js";

const bucket = "main-bucket";
const folderName = "moji-school";
// Check for Next.js public environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const uploadImage = async (image: File) => {
  const timestamp = Date.now();
  const newName = `${folderName}/${timestamp}-${image.name}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(newName, image, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error(`Image upload failed: ${error.message}`);
  }

  if (!data) {
    throw new Error("Image upload failed: No data returned");
  }

  // Use the path from the upload response to get the public URL
  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  if (!urlData?.publicUrl) {
    throw new Error("Failed to get public URL for uploaded image");
  }

  return urlData.publicUrl;
};

export const deleteImage = async (imagePath: string | null | undefined) => {
  // Return early if no image path provided
  if (!imagePath) return;

  // Only delete if the image path contains the Supabase URL
  if (!imagePath.includes(supabaseUrl)) {
    // Image is not from Supabase, skip deletion silently
    return;
  }

  try {
    // Extract the path from the full URL
    // URL format: https://supabase.co/storage/v1/object/public/main-bucket/moji-school/timestamp-filename.jpg
    // We need to extract: moji-school/timestamp-filename.jpg
    const url = new URL(imagePath);
    const pathParts = url.pathname.split("/");

    // Find the index of the bucket name in the path
    const bucketIndex = pathParts.findIndex((part) => part === bucket);
    if (bucketIndex === -1) return; // Bucket not found in path

    // Get everything after the bucket name (folder/filename)
    const storagePath = pathParts.slice(bucketIndex + 1).join("/");
    if (!storagePath) return; // No path found after bucket

    await supabase.storage.from(bucket).remove([storagePath]);
  } catch (error) {
    // Silently handle errors - don't throw, just log if needed
    console.error("Failed to delete image from Supabase:", error);
  }
};
