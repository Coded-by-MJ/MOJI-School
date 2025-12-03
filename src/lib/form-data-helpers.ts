import {
  TeacherFormSchemaType,
  StudentFormSchemaType,
  ParentFormSchemaType,
  ProfileFormSchemaType,
} from "@/types/zod-schemas";

/**
 * Converts form data to FormData, handling File objects and Date objects properly
 */
export function createFormData<
  T extends
    | TeacherFormSchemaType
    | StudentFormSchemaType
    | ParentFormSchemaType
    | ProfileFormSchemaType,
>(data: T): FormData {
  const formData = new FormData();

  // Handle all primitive fields
  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return; // Skip undefined/null values
    }

    // Handle File objects
    if (value instanceof File) {
      formData.append(key, value);
      return;
    }

    // Handle Date objects - convert to ISO string
    if (value instanceof Date) {
      formData.append(key, value.toISOString());
      return;
    }

    // Handle arrays (like subjects)
    if (Array.isArray(value)) {
      value.forEach((item) => {
        formData.append(`${key}[]`, String(item));
      });
      return;
    }

    // Handle all other primitives
    formData.append(key, String(value));
  });

  return formData;
}

/**
 * Parses FormData from request into a plain object for API routes
 * Handles arrays, files, and date conversions
 */
export async function parseFormDataForRoute(
  formData: FormData,
  fileFieldName: string = "img"
): Promise<{ rawBody: Record<string, any>; file: File | null }> {
  const rawBody: Record<string, any> = {};
  const file = formData.get(fileFieldName) as File | null;

  // Extract all fields from FormData
  for (const [key, value] of formData.entries()) {
    if (key === fileFieldName) continue; // Handle file separately

    if (key.endsWith("[]")) {
      // Handle array fields
      const arrayKey = key.replace("[]", "");
      if (!rawBody[arrayKey]) {
        rawBody[arrayKey] = [];
      }
      rawBody[arrayKey].push(value.toString());
    } else if (!rawBody[key]) {
      rawBody[key] = value.toString();
    }
  }

  // Handle date conversion for birthday field
  if (rawBody.birthday) {
    rawBody.birthday = new Date(rawBody.birthday);
  }

  // Add file to body if provided and has size
  if (file && file.size > 0) {
    rawBody[fileFieldName] = file;
  }

  return { rawBody, file: file && file.size > 0 ? file : null };
}
