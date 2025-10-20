"use server";

import { ActionState } from "@/types";
import {
  AnnouncementFormSchemaType,
  AssignmentFormSchemaType,
  AttendanceFormSchemaType,
  ClassFormSchemaType,
  EventFormSchemaType,
  ExamFormSchemaType,
  LessonFormSchemaType,
  ParentFormSchemaType,
  ResultFormSchemaType,
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
import { isUserAllowed } from "./users";

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
  revalidatePath(`/list/teachers/${userId}`);

  return {
    message: "Teacher updated successfully",
    type: "success",
  };
};

export const deleteTeacher = async (
  currentState: ActionState,
  data: FormData
): Promise<ActionState> => {
  const userId = data.get("userId") as string | undefined;

  await isUserAllowed(["admin"]);

  if (!userId) {
    return {
      message: "Teacher User ID is required.",
      type: "error",
    };
  }

  try {
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });
    revalidatePath("/list/teachers");
    return {
      message: "Teacher deleted successfully",
      type: "success",
    };
  } catch (error) {
    return renderError(error);
  }
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
export const deleteParent = async (
  currentState: ActionState,
  data: FormData
): Promise<ActionState> => {
  const userId = data.get("userId") as string | undefined;

  await isUserAllowed(["admin"]);

  if (!userId) {
    return {
      message: "Parent User ID is required.",
      type: "error",
    };
  }

  try {
    await prisma.user.delete({
      where: {
        id: userId  ,
      },
    });
    revalidatePath("/list/parents");
    return {
      message: "Parent deleted successfully",
      type: "success",
    };
  } catch (error) {
    return renderError(error);
  }
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
  revalidatePath(`/list/students/${userId}`);

  return {
    message: "Student updated successfully",
    type: "success",
  };
};

export const deleteStudent = async (
  currentState: ActionState,
  data: FormData
): Promise<ActionState> => {
    const userId = data.get("userId") as string | undefined;

  await isUserAllowed(["admin"]);

  if (!userId) {
    return {
      message: "Student User ID is required.",
      type: "error",
    };
  }

  try {
    await prisma.user.delete({
      where: {
        id: userId,
      },
    });
    revalidatePath("/list/students");
    return {
      message: "Student deleted successfully",
      type: "success",
    };
  } catch (error) {
    return renderError(error);
  }
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

export const deleteSubject = async (
  currentState: ActionState,
  data: FormData
): Promise<ActionState> => {
  const id = data.get("id") as string;

  try {
    await prisma.subject.delete({
      where: {
        id,
      },
    });
    revalidatePath("/list/subjects");
    return {
      message: "Subject deleted successfully",
      type: "success",
    };
  } catch (error) {
    return renderError(error);
  }
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

export const deleteClass = async (
  currentState: ActionState,
  data: FormData
): Promise<ActionState> => {
  const id = data.get("id") as string;

  try {
    await prisma.class.delete({
      where: {
        id,
      },
    });
    revalidatePath("/list/classes");
    return {
      message: "Class deleted successfully",
      type: "success",
    };
  } catch (error) {
    return renderError(error);
  }
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

export const deleteLesson = async (
  currentState: ActionState,
  data: FormData
): Promise<ActionState> => {
  const id = data.get("id") as string;

  try {
    await prisma.lesson.delete({
      where: {
        id,
      },
    });
    revalidatePath("/list/lessons");
    return {
      message: "Lesson deleted successfully",
      type: "success",
    };
  } catch (error) {
    return renderError(error);
  }
};

export const createExam = async (
  data: ExamFormSchemaType
): Promise<ActionState> => {
  await prisma.exam.create({
    data: {
      ...data,
    },
  });

  revalidatePath("/list/exams");

  return {
    message: "Exam created successfully",
    type: "success",
  };
};

export const updateExam = async (
  id: string,
  data: ExamFormSchemaType
): Promise<ActionState> => {
  await prisma.exam.update({
    where: {
      id,
    },
    data: {
      ...data,
    },
  });

  revalidatePath("/list/exams");
  return {
    message: "Exam updated successfully",
    type: "success",
  };
};

export const deleteExam = async (
  currentState: ActionState,
  data: FormData
): Promise<ActionState> => {
  const id = data.get("id") as string;

  try {
    await prisma.exam.delete({
      where: {
        id,
      },
    });
    revalidatePath("/list/exams");
    return {
      message: "Exam deleted successfully",
      type: "success",
    };
  } catch (error) {
    return renderError(error);
  }
};

export const createAssignment = async (
  data: AssignmentFormSchemaType
): Promise<ActionState> => {
  await prisma.assignment.create({
    data: {
      ...data,
    },
  });

  revalidatePath("/list/assignments");

  return {
    message: "Assignment created successfully",
    type: "success",
  };
};

export const updateAssignment = async (
  id: string,
  data: AssignmentFormSchemaType
): Promise<ActionState> => {
  await prisma.assignment.update({
    where: {
      id,
    },
    data: {
      ...data,
    },
  });

  revalidatePath("/list/assignments");
  return {
    message: "Assignment updated successfully",
    type: "success",
  };
};

export const deleteAssignment = async (
  currentState: ActionState,
  data: FormData
): Promise<ActionState> => {
  const id = data.get("id") as string;

  try {
    await prisma.assignment.delete({
      where: {
        id,
      },
    });
    revalidatePath("/list/assignments");
    return {
      message: "Assignment deleted successfully",
      type: "success",
    };
  } catch (error) {
    return renderError(error);
  }
};

export const createResult = async (
  data: ResultFormSchemaType
): Promise<ActionState> => {
  await prisma.result.create({
    data: {
      ...data,
    },
  });

  revalidatePath("/list/results");

  return {
    message: "Result created successfully",
    type: "success",
  };
};

export const updateResult = async (
  id: string,
  data: ResultFormSchemaType
): Promise<ActionState> => {
  await prisma.result.update({
    where: {
      id,
    },
    data: {
      ...data,
    },
  });

  revalidatePath("/list/results");
  return {
    message: "Result updated successfully",
    type: "success",
  };
};

export const deleteResult = async (
  currentState: ActionState,
  data: FormData
): Promise<ActionState> => {
  const id = data.get("id") as string;

  try {
    await prisma.result.delete({
      where: {
        id,
      },
    });
    revalidatePath("/list/results");
    return {
      message: "Result deleted successfully",
      type: "success",
    };
  } catch (error) {
    return renderError(error);
  }
};

export const createAttendance = async (
  data: AttendanceFormSchemaType
): Promise<ActionState> => {
  await prisma.attendance.create({
    data: {
      ...data,
    },
  });

  revalidatePath("/list/attendances");

  return {
    message: "Attendance created successfully",
    type: "success",
  };
};

export const updateAttendance = async (
  id: string,
  data: AttendanceFormSchemaType
): Promise<ActionState> => {
  await prisma.attendance.update({
    where: {
      id,
    },
    data: {
      ...data,
    },
  });

  revalidatePath("/list/attendances");
  return {
    message: "Attendance updated successfully",
    type: "success",
  };
};

export const deleteAttendance = async (
  currentState: ActionState,
  data: FormData
): Promise<ActionState> => {
  const id = data.get("id") as string;

  try {
    await prisma.attendance.delete({
      where: {
        id,
      },
    });
    revalidatePath("/list/attendances");
    return {
      message: "Attendance deleted successfully",
      type: "success",
    };
  } catch (error) {
    return renderError(error);
  }
};

export const createAnnouncement = async (
  data: AnnouncementFormSchemaType
): Promise<ActionState> => {
  await prisma.announcement.create({
    data: {
      ...data,
    },
  });

  revalidatePath("/list/announcements");

  return {
    message: "Announcement created successfully",
    type: "success",
  };
};

export const updateAnnouncement = async (
  id: string,
  data: AnnouncementFormSchemaType
): Promise<ActionState> => {
  await prisma.announcement.update({
    where: {
      id,
    },
    data: {
      ...data,
    },
  });

  revalidatePath("/list/announcements");
  return {
    message: "Announcement updated successfully",
    type: "success",
  };
};

export const deleteAnnouncement = async (
  currentState: ActionState,
  data: FormData
): Promise<ActionState> => {
  const id = data.get("id") as string;

  try {
    await prisma.announcement.delete({
      where: {
        id,
      },
    });
    revalidatePath("/list/announcements");
    return {
      message: "Announcement deleted successfully",
      type: "success",
    };
  } catch (error) {
    return renderError(error);
  }
};

export const createEvent = async (
  data: EventFormSchemaType
): Promise<ActionState> => {
  await prisma.event.create({
    data: {
      ...data,
    },
  });

  revalidatePath("/list/events");

  return {
    message: "Event created successfully",
    type: "success",
  };
};

export const updateEvent = async (
  id: string,
  data: EventFormSchemaType
): Promise<ActionState> => {
  await prisma.event.update({
    where: {
      id,
    },
    data: {
      ...data,
    },
  });

  revalidatePath("/list/events");
  return {
    message: "Event updated successfully",
    type: "success",
  };
};

export const deleteEvent = async (
  currentState: ActionState,
  data: FormData
): Promise<ActionState> => {
  const id = data.get("id") as string;

  try {
    await prisma.event.delete({
      where: {
        id,
      },
    });
    revalidatePath("/list/events");
    return {
      message: "Event deleted successfully",
      type: "success",
    };
  } catch (error) {
    return renderError(error);
  }
};
