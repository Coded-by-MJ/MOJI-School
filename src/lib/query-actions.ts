"use server";

import { TableSearchParams } from "@/types";
import prisma from "./prisma";
import { isUserAllowed } from "./users";
import { Grade, Prisma, UserRole } from "@prisma/client";
import { ITEMS_PER_PAGE } from "@/utils";

const renderError = (error: unknown) => {
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

export async function fetchTeacherList<T>(
  params: TableSearchParams
): Promise<{ data: T; count: number }> {
  const whereClause: Prisma.TeacherWhereInput = {
    ...(params.classId
      ? {
          lessons: {
            some: {
              classId: params.classId,
            },
          },
        }
      : {}),
    ...(params.search
      ? {
          user: {
            name: {
              contains: params.search,
              mode: "insensitive",
            },
          },
        }
      : {}),
  };

  try {
    await isUserAllowed(["admin", "teacher"]);
    const [teachers, count] = await prisma.$transaction([
      prisma.teacher.findMany({
        where: whereClause,
        include: {
          user: true,
          classes: true,
          subjects: true,
        },
        take: ITEMS_PER_PAGE,
        skip: ITEMS_PER_PAGE * (params.page - 1),
      }),

      prisma.teacher.count({
        where: whereClause,
      }),
    ]);

    return {
      data: teachers as T,
      count,
    };
  } catch (error) {
    renderError(error);
    return {
      data: [] as T,
      count: 0,
    };
  }
}
export async function fetchStudentList<T, R>(
  params: TableSearchParams
): Promise<{ data: T; count: number; relativeData: R }> {
  const whereClause: Prisma.StudentWhereInput = {
    ...(params.teacherId
      ? {
          class: {
            lessons: {
              some: {
                teacherId: params.teacherId,
              },
            },
          },
        }
      : {}),
    ...(params.search
      ? {
          user: {
            name: {
              contains: params.search,
              mode: "insensitive",
            },
          },
        }
      : {}),
  };
  try {
    await isUserAllowed(["admin", "teacher"]);
    const [students, count, grades, classes, parents] =
      await prisma.$transaction([
        prisma.student.findMany({
          where: whereClause,
          include: {
            user: true,
            class: true,
            grade: true,
          },
        }),
        prisma.student.count({ where: whereClause }),
        prisma.grade.findMany(),
        prisma.class.findMany({
          select: {
            id: true,
            name: true,
            capacity: true,
            _count: { select: { students: true } },
          },
        }),
        prisma.parent.findMany({
          select: {
            id: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        }),
      ]);

    return {
      data: students as T,
      count,
      relativeData: {
        grades,
        classes,
        parents,
      } as R,
    };
  } catch (error) {
    renderError(error);
    return {
      data: [] as T,
      count: 0,
      relativeData: {
        grades: [],
        classes: [],
        parents: [],
      } as R,
    };
  }
}

export async function fetchParentList<T>(
  params: TableSearchParams
): Promise<{ data: T; count: number; userRole: UserRole | null }> {
  const whereClause: Prisma.ParentWhereInput = {
    ...(params.search
      ? {
          user: {
            name: {
              contains: params.search,
              mode: "insensitive",
            },
          },
        }
      : {}),
  };
  try {
    const user = await isUserAllowed(["admin", "teacher"]);
    const [parents, count] = await prisma.$transaction([
      prisma.parent.findMany({
        where: whereClause,
        include: {
          user: true,
          students: {
            select: {
              user: true,
            },
          },
        },
      }),
      prisma.parent.count({ where: whereClause }),
    ]);

    return {
      data: parents as T,
      count,
      userRole: user.role as UserRole,
    };
  } catch (error) {
    renderError(error);
    return {
      data: [] as T,
      count: 0,
      userRole: null,
    };
  }
}
export async function fetchSubjectList<T>(
  params: TableSearchParams
): Promise<{ data: T; count: number; userRole: UserRole | null }> {
  const whereClause: Prisma.SubjectWhereInput = {
    ...(params.search
      ? {
          name: {
            contains: params.search,
            mode: "insensitive",
          },
        }
      : {}),
  };
  try {
    const user = await isUserAllowed(["admin"]);
    const [subjects, count] = await prisma.$transaction([
      prisma.subject.findMany({
        where: whereClause,
        include: {
          teachers: {
            select: {
              user: true,
            },
          },
        },
      }),
      prisma.subject.count({ where: whereClause }),
    ]);

    return {
      data: subjects as T,
      count,
      userRole: user.role as UserRole,
    };
  } catch (error) {
    renderError(error);
    return {
      data: [] as T,
      count: 0,
      userRole: null,
    };
  }
}

export async function fetchClassList<T, R>(
  params: TableSearchParams
): Promise<{
  data: T;
  count: number;
  userRole: UserRole | null;
  relativeData: R;
}> {
  const whereClause: Prisma.ClassWhereInput = {
    ...(params.teacherId
      ? {
          supervisorId: params.teacherId,
        }
      : {}),
    ...(params.search
      ? {
          name: {
            contains: params.search,
            mode: "insensitive",
          },
        }
      : {}),
  };
  try {
    const user = await isUserAllowed(["admin", "teacher"]);
    const [classes, count, grades, teachers] = await prisma.$transaction([
      prisma.class.findMany({
        where: whereClause,
        include: {
          supervisor: {
            select: {
              user: true,
            },
          },
          grade: true,
        },
      }),
      prisma.class.count({ where: whereClause }),
      prisma.grade.findMany(),
      prisma.teacher.findMany({
        select: {
          id: true,
          user: {
            select: {
              name: true,
            },
          },
        },
      }),
    ]);

    return {
      data: classes as T,
      userRole: user.role as UserRole,
      count,
      relativeData: {
        grades,
        teachers,
      } as R,
    };
  } catch (error) {
    renderError(error);
    return {
      data: [] as T,
      count: 0,
      userRole: null,
      relativeData: {
        grades: [],
        teachers: [],
      } as R,
    };
  }
}

export async function fetchLessonList<T>(
  params: TableSearchParams
): Promise<{ data: T; count: number; userRole: UserRole | null }> {
  const whereClause: Prisma.LessonWhereInput = {
    ...(params.classId
      ? {
          classId: params.classId,
        }
      : {}),
    ...(params.teacherId
      ? {
          teacherId: params.teacherId,
        }
      : {}),
    ...(params.search
      ? {
          OR: [
            {
              subject: {
                name: { contains: params.search, mode: "insensitive" },
              },
            },
            {
              teacher: {
                user: {
                  name: { contains: params.search, mode: "insensitive" },
                },
              },
            },
          ],
        }
      : {}),
  };
  try {
    const user = await isUserAllowed(["admin", "teacher"]);
    const [lessons, count] = await prisma.$transaction([
      prisma.lesson.findMany({
        where: whereClause,
        include: {
          subject: { select: { name: true } },
          class: { select: { name: true } },
          teacher: {
            select: {
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      }),
      prisma.lesson.count({ where: whereClause }),
    ]);

    return {
      data: lessons as T,
      count,
      userRole: user.role as UserRole,
    };
  } catch (error) {
    renderError(error);
    return {
      data: [] as T,
      count: 0,
      userRole: null,
    };
  }
}

export async function fetchRelativeAdminData<T>(): Promise<{
  data: T;
  userRole: UserRole | null;
}> {
  try {
    const user = await isUserAllowed(["admin"]);
    const [gradesWithClasses, parents] = await prisma.$transaction([
      prisma.grade.findMany({
        include: {
          classes: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      }),
      prisma.parent.findMany({
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
      }),
    ]);

    return {
      data: {
        gradesWithClasses,
        parents,
      } as T,

      userRole: user.role as UserRole,
    };
  } catch (error) {
    renderError(error);
    return {
      data: {} as T,
      userRole: null,
    };
  }
}
