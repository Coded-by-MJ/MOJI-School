"use server";

import { ActionState } from "@/types";
import {
  ClassFormSchemaType,
  LessonFormSchemaType,
  ParentFormSchemaType,
  StudentFormSchemaType,
  SubjectFormSchemaType,
  TeacherFormSchemaType,
} from "@/types/zod-schemas";
import prisma from "./prisma";
import { revalidatePath } from "next/cache";
import {
  extractOrJoinName,
  getDefaultImage,
  getDefaultPassword,
} from "@/utils/funcs";
import { auth } from "./auth";
import { headers } from "next/headers";
import { teacher } from "./permissions";

const renderError = (error: unknown): ActionState => {
  console.log(error);
  if (error instanceof Error) {
    console.log(error.message);
  } else {
    console.log("unknown error occurred");
  }
  return {
    message: error instanceof Error ? error.message : "An error occurred",
    type: "error",
  };
};

export const createTeacher = async (
  data: TeacherFormSchemaType
): Promise<ActionState> => {
  const name = extractOrJoinName([data.firstName, data.lastName]);
  const existingTeacher = await prisma.teacher.findUnique({
    where: { phone: data.phone },
  });
  if (existingTeacher) {
    return {
      message: "A teacher with this phone number already exists.",
      type: "error",
    };
  }

  let userId: string | undefined;

  try {
    const { user } = await auth.api.createUser({
      body: {
        name,
        email: data.email,
        password: getDefaultPassword(name),
        role: "teacher",
      },
    });

    userId = user.id;

    await prisma.teacher.create({
      data: {
        userId: user.id,
        bloodType: data.bloodType,
        address: data.address,
        phone: data.phone,
        birthday: data.birthday,
        sex: data.sex,
        subjects: {
          connect: data.subjects.map((subjectId) => ({ id: subjectId })),
        },
      },
    });

    revalidatePath("/list/teachers");

    return {
      message: "Teacher created successfully.",
      type: "success",
    };
  } catch (error) {
    if (userId) {
      try {
        await prisma.user.delete({
          where: {
            id: userId,
          },
        });
      } catch (rollbackError) {
        console.error("Failed to rollback auth user:", rollbackError);
      }
    }
    return renderError(error);
  }
};

export const updateTeacher = async (
  userId: string,
  data: TeacherFormSchemaType
): Promise<ActionState> => {
  const name = extractOrJoinName([data.firstName, data.lastName]);

  const existingTeacher = await prisma.teacher.findUnique({
    where: { phone: data.phone },
  });
  if (existingTeacher) {
    return {
      message: "A teacher with this phone number already exists.",
      type: "error",
    };
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
  await prisma.teacher.update({
    where: {
      userId,
    },
    data: {
      bloodType: data.bloodType,
      address: data.address,
      phone: data.phone,
      birthday: data.birthday,
      sex: data.sex,
      subjects: {
        set: data.subjects?.map((subjectId: string) => ({
          id: subjectId,
        })),
      },
    },
  });

  revalidatePath("/list/teachers");

  return {
    message: "Teacher updated successfully",
    type: "success",
  };
};

export const createParent = async (
  data: ParentFormSchemaType
): Promise<ActionState> => {
  const name = extractOrJoinName([data.firstName, data.lastName]);
  const existingParent = await prisma.parent.findUnique({
    where: { phone: data.phone },
  });
  if (existingParent) {
    return {
      message: "A parent with this phone number already exists.",
      type: "error",
    };
  }

  let userId: string | undefined;

  try {
    const { user } = await auth.api.createUser({
      body: {
        name,
        email: data.email,
        password: getDefaultPassword(name),
        role: "parent",
      },
    });

    userId = user.id;

    await prisma.parent.create({
      data: {
        userId: user.id,
        address: data.address,
        phone: data.phone,
      },
    });

    revalidatePath("/list/parents");

    return {
      message: "Parent created successfully.",
      type: "success",
    };
  } catch (error) {
    if (userId) {
      try {
        await prisma.user.delete({
          where: {
            id: userId,
          },
        });
      } catch (rollbackError) {
        console.error("Failed to rollback auth user:", rollbackError);
      }
    }
    return renderError(error);
  }
};

export const updateParent = async (
  userId: string,
  data: ParentFormSchemaType
): Promise<ActionState> => {
  const name = extractOrJoinName([data.firstName, data.lastName]);
  const existingParent = await prisma.parent.findUnique({
    where: { phone: data.phone },
  });
  if (existingParent) {
    return {
      message: "A parent with this phone number already exists.",
      type: "error",
    };
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
      address: data.address,
      phone: data.phone,
    },
  });

  revalidatePath("/list/parents");
  return {
    message: "Parent updated successfully",
    type: "success",
  };
};

export const createStudent = async (
  data: StudentFormSchemaType
): Promise<ActionState> => {
  const name = extractOrJoinName([data.firstName, data.lastName]);

  const [existingStudent, classItem] = await prisma.$transaction([
    prisma.student.findUnique({
      where: { phone: data.phone },
    }),
    prisma.class.findUnique({
      where: { id: data.classId },
      include: { _count: { select: { students: true } } },
    }),
  ]);

  if (classItem && classItem.capacity === classItem._count.students) {
    return {
      message: "The selected class has reached it's full capacity.",
      type: "error",
    };
  }
  if (existingStudent) {
    return {
      message: "A student with this phone number already exists.",
      type: "error",
    };
  }

  let userId: string | undefined;

  try {
    const { user } = await auth.api.createUser({
      body: {
        name,
        email: data.email,
        password: getDefaultPassword(name),
        role: "student",
      },
    });

    userId = user.id;

    await prisma.student.create({
      data: {
        userId: user.id,
        address: data.address,
        phone: data.phone,
        birthday: data.birthday,
        sex: data.sex,
        bloodType: data.bloodType,
        parentId: data.parentId,
        classId: data.classId,
        gradeId: data.gradeId,
      },
    });

    revalidatePath("/list/students");

    return {
      message: "Student created successfully.",
      type: "success",
    };
  } catch (error) {
    if (userId) {
      try {
        await prisma.user.delete({
          where: {
            id: userId,
          },
        });
      } catch (rollbackError) {
        console.error("Failed to rollback auth user:", rollbackError);
      }
    }
    return renderError(error);
  }
};

export const updateStudent = async (
  userId: string,
  data: StudentFormSchemaType
): Promise<ActionState> => {
  const name = extractOrJoinName([data.firstName, data.lastName]);
  const existingStudent = await prisma.student.findUnique({
    where: { phone: data.phone },
  });
  if (existingStudent) {
    return {
      message: "A student with this phone number already exists.",
      type: "error",
    };
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
  await prisma.student.update({
    where: {
      userId,
    },
    data: {
      address: data.address,
      phone: data.phone,
      birthday: data.birthday,
      sex: data.sex,
      bloodType: data.bloodType,
      parentId: data.parentId,
      classId: data.classId,
      gradeId: data.gradeId,
    },
  });

  revalidatePath("/list/students");
  return {
    message: "Student updated successfully",
    type: "success",
  };
};

export const createSubject = async (
  data: SubjectFormSchemaType
): Promise<ActionState> => {
  await prisma.subject.create({
    data: {
      name: data.name,
      teachers: {
        connect: data.teachers.map((teacherId) => ({ id: teacherId })),
      },
    },
  });

  revalidatePath("/list/subjects");

  return {
    message: "Subject created successfully",
    type: "success",
  };
};

export const updateSubject = async (
  subjectId: string,
  data: SubjectFormSchemaType
): Promise<ActionState> => {
  await prisma.subject.update({
    where: {
      id: subjectId,
    },
    data: {
      name: data.name,
      teachers: {
        set: data.teachers.map((teacherId) => ({ id: teacherId })),
      },
    },
  });

  revalidatePath("/list/subjects");

  return {
    message: "Subject updated successfully",
    type: "success",
  };
};

export const createClass = async (
  data: ClassFormSchemaType
): Promise<ActionState> => {
  await prisma.class.create({
    data: {
      ...data,
    },
  });

  revalidatePath("/list/classes");

  return {
    message: "Class created successfully",
    type: "success",
  };
};

export const updateClass = async (
  classId: string,
  data: ClassFormSchemaType
): Promise<ActionState> => {
  await prisma.class.update({
    where: {
      id: classId,
    },
    data: {
      ...data,
    },
  });

  revalidatePath("/list/classes");
  return {
    message: "Class updated successfully",
    type: "success",
  };
};



export const createLesson = async (
  data: LessonFormSchemaType
): Promise<ActionState> => {
   await prisma.lesson.create({
    data: {
      ...data,
    },
  });

  revalidatePath("/list/lessons");

  return {
    message: "Lesson created successfully",
    type: "success",
  };
};

export const updateLesson = async (
  lessonId: string,
  data: LessonFormSchemaType
): Promise<ActionState> => {
  await prisma.lesson.update({
    where: {
      id: lessonId,
    },
    data: {
      ...data,
    },
  });

  revalidatePath("/list/lessons");
  return {
    message: "Lesson updated successfully",
    type: "success",
  };
};
