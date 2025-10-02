import { z } from "zod";
import { fromError } from "zod-validation-error";

export const signUpSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z
    .email({ message: "Invalid email address" })
    .min(1, { message: "Email is required" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export const signInSchema = z.object({
  email: z
    .email({ message: "Invalid email address" })
    .min(1, { message: "Email is required" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
    confirmPassword: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(1, { message: "Email is required" }),
});

export const studentOrTeacherFormSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required!" }),
  lastName: z.string().min(1, { message: "Last name is required!" }),
  email: z.string().min(1, { message: "Email is required!" }),
  phone: z.string().min(1, { message: "Phone is required!" }),
  address: z.string().min(1, { message: "Address is required!" }),
  bloodType: z.string().min(1, { message: "Blood Type is required!" }),
  birthday: z.string().min(1, { message: "Birthday is required!" }), // keep as string for Input[type=date]
  sex: z.enum(["male", "female"], { message: "Sex is required!" }),
  img: validateImageFile(),
});

// Type inference

export function validateImageFiles() {
  const maxUploadSize = 2 * 1024 * 1024; // 2MB
  const acceptedFileTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/jpg",
  ];

  return z
    .array(z.instanceof(File))
    .max(8, "You can only upload up to 8 images")
    .refine(
      (files) => files.every((file) => file.size <= maxUploadSize),
      "Each file must be less than 2MB"
    )
    .refine(
      (files) =>
        files.every((file) =>
          acceptedFileTypes.some((type) => file.type.startsWith(type))
        ),
      "File must be a valid image type (JPEG, PNG, WebP, GIF, JPG)"
    );
}

function validateImageFile() {
  const maxUploadSize = 1024 * 1024 * 2;
  const acceptedFileTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/jpg",
  ];
  return z
    .instanceof(File)
    .refine((file) => {
      if (!file) return "Image is required!";
      return file && file.size <= maxUploadSize;
    }, `Image size must be less than 2 MB`)
    .refine((file) => {
      return file && !acceptedFileTypes.includes(file.type);
    }, "Image must be a valid image type (JPEG, PNG, WebP, GIF, JPG)");
}

export function validateWithZodSchema<T>(
  schema: z.ZodType<T>,
  data: unknown
): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors = fromError(result.error);
    throw new Error(errors.toString());
  }
  return result.data;
}

export type SignUpSchemaType = z.infer<typeof signUpSchema>;
export type SignInSchemaType = z.infer<typeof signInSchema>;
export type ResetPasswordSchemaType = z.infer<typeof resetPasswordSchema>;
export type ForgotPasswordSchemaType = z.infer<typeof forgotPasswordSchema>;
export type StudentOrTeacherFormSchemaType = z.infer<
  typeof studentOrTeacherFormSchema
>;
