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

export const teacherFormSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required!" }),
  lastName: z.string().min(1, { message: "Last name is required!" }),
  email: z.string().min(1, { message: "Email is required!" }),
  phone: z.string().min(1, { message: "Phone is required!" }),
  address: z.string().min(1, { message: "Address is required!" }),
  bloodType: z
    .string()
    .regex(/^(A|B|AB|O)[+-]$/, { message: "Invalid blood type!" }),
  birthday: z.date({ message: "Birthday is required!" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
  img: validateImageFile().optional(),
  subjects: z.array(z.string()),
});
export const parentFormSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required!" }),
  lastName: z.string().min(1, { message: "Last name is required!" }),
  email: z.string().min(1, { message: "Email is required!" }),
  phone: z.string().min(1, { message: "Phone is required!" }),
  address: z.string().min(1, { message: "Address is required!" }),
  img: validateImageFile().optional(),
});
export const studentFormSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required!" }),
  lastName: z.string().min(1, { message: "Last name is required!" }),
  email: z.string().min(1, { message: "Email is required!" }),
  phone: z.string().min(1, { message: "Phone is required!" }).optional(),
  address: z.string().min(1, { message: "Address is required!" }),
  bloodType: z
    .string()
    .regex(/^(A|B|AB|O)[+-]$/, { message: "Invalid blood type!" }),
  birthday: z.date({ message: "Birthday is required!" }),
  sex: z.enum(["MALE", "FEMALE"], { message: "Sex is required!" }),
  img: validateImageFile().optional(),
  parentId: z.string().min(1, { message: "Parent ID is required!" }),
  classId: z.string().min(1, { message: "Class ID is required!" }),
  gradeId: z.string().min(1, { message: "Grade ID is required!" }),
});
export const classFormSchema = z.object({
  name: z.string().min(1, { message: "name is required!" }),
  capacity: z.coerce.number({ message: "Capacity must be an Integer" }),
  supervisorId: z.string().min(1, { message: "Supervisor ID is required!" }),
  gradeId: z.string().min(1, { message: "Grade ID is required!" }),
});

export const gradeFormSchema = z.object({
  level: z.int({ message: "Level must be an Integer" }),
});
export const subjectFormSchema = z.object({
  name: z.string().min(1, { message: "name is required!" }),
  teachers: z.array(z.string()),
});

export const lessonFormSchema = z
  .object({
    name: z.string().min(1, { message: "name is required!" }),
    startTime: z.coerce.date({ message: "Start Time is required!" }),
    endTime: z.coerce.date({ message: "End Time is required!" }),
    day: z.enum(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"], {
      message: "Day is required!",
    }),
    teacherId: z.string().min(1, { message: "Teacher ID is required!" }),
    classId: z.string().min(1, { message: "Class ID is required!" }),
    subjectId: z.string().min(1, { message: "Subject ID is required!" }),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "End time must be later than start time",
    path: ["endTime"], // attach error to endTime field
  });
export const examFormSchema = z
  .object({
    title: z.string().min(1, { message: "title is required!" }),
    startTime: z.coerce.date({ message: "Start Time is required!" }),
    endTime: z.coerce.date({ message: "End Time is required!" }),
    lessonId: z.string().min(1, { message: "Lesson ID is required!" }),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "End time must be later than start time",
    path: ["endTime"], // attach error to endTime field
  });
export const assignmentFormSchema = z
  .object({
    title: z.string().min(1, { message: "title is required!" }),
    startDate: z.coerce.date({ message: "Start Date is required!" }),
    dueDate: z.coerce.date({ message: "Due Date is required!" }),
    lessonId: z.string().min(1, { message: "Lesson ID is required!" }),
  })
  .refine((data) => data.dueDate > data.startDate, {
    message: "Due Date must be later than start date",
    path: ["dueDate"], // attach error to endTime field
  });

export const resultFormSchema = z
  .object({
    score: z.coerce
      .number({ message: "Score must be a number" })
      .int({ message: "Score must be an integer" })
      .min(0, { message: "Score cannot be negative" }),
    type: z.enum(["EXAM", "ASSIGNMENT"], {
      message: "type is required!",
    }),

    examId: z
      .string({ message: "Exam ID must be a string" })
      .optional()
      .nullable(),

    assignmentId: z
      .string({ message: "Assignment ID must be a string" })
      .optional()
      .nullable(),

    studentId: z.string({ message: "Student ID is required" }),
  })
  .superRefine((data, ctx) => {
    if (data.type === "EXAM" && !data.examId) {
      ctx.addIssue({
        code: "custom",
        message: "Exam ID is required when type is EXAM",
        path: ["examId"],
      });
    }

    if (data.type === "ASSIGNMENT" && !data.assignmentId) {
      ctx.addIssue({
        code: "custom",
        message: "Assignment ID is required when type is ASSIGNMENT",
        path: ["assignmentId"],
      });
    }
  });

export const announcementFormSchema = z.object({
  title: z
    .string({
      message: "Announcement title is required",
    })
    .min(2, "Title must be at least 2 characters long"),

  description: z
    .string({
      message: "Announcement description is required",
    })
    .min(5, "Description must be at least 5 characters long"),

  date: z.coerce.date({
    message: "Date is required",
  }),

  classId: z.string().optional(),
});

export const attendanceFormSchema = z.object({
  date: z.coerce.date({
    message: "Date is required",
  }),

  present: z.boolean({
    message: "Present status is required",
  }),

  studentId: z.string({
    message: "Student ID is required",
  }),

  lessonId: z.string({
    message: "Lesson ID is required",
  }),
});

export const eventFormSchema = z
  .object({
    title: z
      .string({
        message: "Event title is required",
      })
      .min(2, "Title must be at least 2 characters long"),

    description: z
      .string({
        message: "Event description is required",
      })
      .min(5, "Description must be at least 5 characters long"),

    startTime: z.coerce.date({
      message: "Start time is required",
    }),

    endTime: z.coerce.date({
      message: "End time is required",
    }),

    classId: z.string().optional(),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "End time must be later than start time",
    path: ["endTime"],
  });

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
export type StudentFormSchemaType = z.infer<typeof studentFormSchema>;
export type TeacherFormSchemaType = z.infer<typeof teacherFormSchema>;
export type ParentFormSchemaType = z.infer<typeof parentFormSchema>;
export type LessonFormSchemaType = z.infer<typeof lessonFormSchema>;
export type GradeFormSchemaType = z.infer<typeof gradeFormSchema>;
export type ClassFormSchemaType = z.infer<typeof classFormSchema>;
export type SubjectFormSchemaType = z.infer<typeof subjectFormSchema>;
export type ExamFormSchemaType = z.infer<typeof examFormSchema>;
export type AssignmentFormSchemaType = z.infer<typeof assignmentFormSchema>;
export type ResultFormSchemaType = z.infer<typeof resultFormSchema>;
export type AttendanceFormSchemaType = z.infer<typeof attendanceFormSchema>;
export type EventFormSchemaType = z.infer<typeof eventFormSchema>;
export type AnnouncementFormSchemaType = z.infer<typeof announcementFormSchema>;
