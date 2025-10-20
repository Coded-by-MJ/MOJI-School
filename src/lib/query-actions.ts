"use server";

import { TableSearchParams } from "@/types";
import prisma from "./prisma";
import { getAuthUser, isUserAllowed } from "./users";
import { Prisma, UserRole, UserSex } from "@prisma/client";
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

export async function fetchTeacherList<T, R>(
  params: TableSearchParams
): Promise<{ data: T; count: number; relativeData: R }> {
  await isUserAllowed(["admin", "teacher"]);
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
    const [teachers, count, subjects] = await prisma.$transaction([
      prisma.teacher.findMany({
        where: whereClause,
        include: {
          user: true,
          classes: true,
          subjects: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
        take: ITEMS_PER_PAGE,
        skip: ITEMS_PER_PAGE * (params.page - 1),
      }),

      prisma.teacher.count({
        where: whereClause,
      }),
      prisma.subject.findMany({
        select: {
          id: true,
          name: true,
        },
      }),
    ]);

    return {
      data: teachers as T,
      count,
      relativeData: {
        subjects,
      } as R,
    };
  } catch (error) {
    renderError(error);
    return {
      data: [] as T,
      count: 0,
      relativeData: {
        subjects: [],
      } as R,
    };
  }
}
export async function fetchStudentList<T, R>(
  params: TableSearchParams
): Promise<{ data: T; count: number; relativeData: R }> {
  await isUserAllowed(["admin", "teacher"]);
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
    const [students, count, grades, classes, parents] =
      await prisma.$transaction([
        prisma.student.findMany({
          where: whereClause,
          include: {
            user: true,
            class: true,
            grade: true,
          },
          orderBy: {
            updatedAt: "desc",
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
  const user = await isUserAllowed(["admin", "teacher"]);

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
        orderBy: {
          updatedAt: "desc",
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
      userRole: user.role as UserRole,
    };
  }
}
export async function fetchSubjectList<T, R>(
  params: TableSearchParams
): Promise<{
  data: T;
  count: number;
  userRole: UserRole | null;
  relativeData: R;
}> {
  const user = await isUserAllowed(["admin"]);

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
    const [subjects, count, teachers] = await prisma.$transaction([
      prisma.subject.findMany({
        where: whereClause,
        include: {
          teachers: {
            select: {
              id: true,
              user: true,
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      }),
      prisma.subject.count({ where: whereClause }),
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
      data: subjects as T,
      count,
      userRole: user.role as UserRole,
      relativeData: { teachers } as R,
    };
  } catch (error) {
    renderError(error);
    return {
      data: [] as T,
      count: 0,
      userRole: user.role as UserRole,
      relativeData: {
        teachers: [],
      } as R,
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
  const user = await isUserAllowed(["admin", "teacher"]);

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
        orderBy: {
          updatedAt: "desc",
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
      userRole: user.role as UserRole,
      relativeData: {
        grades: [],
        teachers: [],
      } as R,
    };
  }
}

export async function fetchLessonList<T, R>(
  params: TableSearchParams
): Promise<{
  data: T;
  count: number;
  userRole: UserRole | null;
  relativeData: R;
}> {
  const user = await isUserAllowed(["admin", "teacher"]);

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
    const [lessons, count, teachers, subjects, classes] =
      await prisma.$transaction([
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
          orderBy: {
            updatedAt: "desc",
          },
        }),
        prisma.lesson.count({ where: whereClause }),
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
        prisma.subject.findMany({
          select: {
            id: true,
            name: true,
          },
        }),
        prisma.class.findMany({
          select: {
            id: true,
            name: true,
          },
        }),
      ]);

    return {
      data: lessons as T,
      count,
      userRole: user.role as UserRole,
      relativeData: {
        teachers,
        subjects,
        classes,
      } as R,
    };
  } catch (error) {
    renderError(error);
    return {
      data: [] as T,
      count: 0,
      userRole: user.role as UserRole,
      relativeData: {
        teachers: [],
        subjects: [],
        classes: [],
      } as R,
    };
  }
}

export async function fetchExamList<T, R>(
  params: TableSearchParams
): Promise<{
  data: T;
  count: number;
  userRole: UserRole | null;
  relativeData: R;
}> {
  const user = await isUserAllowed(["admin", "teacher", "student", "parent"]);

  const whereClause: Prisma.ExamWhereInput = {
    ...(params.classId
      ? {
          lesson: {
            classId: params.classId,
          },
        }
      : {}),

    ...(params.teacherId
      ? {
          lesson: {
            teacherId: params.teacherId,
          },
        }
      : {}),

    ...(params.search
      ? {
          OR: [
            {
              lesson: {
                subject: {
                  name: { contains: params.search, mode: "insensitive" },
                },
              },
            },
            {
              lesson: {
                teacher: {
                  user: {
                    name: { contains: params.search, mode: "insensitive" },
                  },
                },
              },
            },
          ],
        }
      : {}),
  };

  try {
    const [exams, count, lessons] = await prisma.$transaction([
      prisma.exam.findMany({
        where: whereClause,
        include: {
          lesson: {
            select: {
              subject: { select: { name: true } },
              teacher: { select: { user: { select: { name: true } } } },
              class: { select: { name: true } },
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      }),
      prisma.exam.count({ where: whereClause }),
      prisma.lesson.findMany({
        select: {
          id: true,
          name: true,
        },
      }),
    ]);

    return {
      data: exams as T,
      count,
      userRole: user.role as UserRole,
      relativeData: {
        lessons,
      } as R,
    };
  } catch (error) {
    renderError(error);
    return {
      data: [] as T,
      count: 0,
      userRole: user.role as UserRole,
      relativeData: {
        lessons: [],
      } as R,
    };
  }
}

export async function fetchAssignmentList<T, R>(
  params: TableSearchParams
): Promise<{
  data: T;
  count: number;
  userRole: UserRole | null;
  relativeData: R;
}> {
  const { id: currentUserId, role } = await isUserAllowed([
    "admin",
    "teacher",
    "student",
    "parent",
  ]);

  const whereClause: Prisma.AssignmentWhereInput = {
    ...(params.classId
      ? {
          lesson: {
            classId: params.classId,
          },
        }
      : {}),

    ...(params.teacherId
      ? {
          lesson: {
            teacherId: params.teacherId,
          },
        }
      : {}),

    ...(params.search
      ? {
          lesson: {
            subject: {
              name: { contains: params.search, mode: "insensitive" },
            },
          },
        }
      : {}),
  };

  switch (role) {
    case "admin":
      break;
    case "teacher": {
      const existing = whereClause.lesson || {};
      existing.teacherId = currentUserId;
      whereClause.lesson = { ...existing };
      break;
    }
    case "student": {
      const existing = whereClause.lesson || {};
      existing.class = {
        students: {
          some: {
            id: currentUserId,
          },
        },
      };
      whereClause.lesson = { ...existing };
      break;
    }
    case "parent": {
      const existing = whereClause.lesson || {};
      existing.class = {
        students: {
          some: {
            parentId: currentUserId!,
          },
        },
      };
      whereClause.lesson = { ...existing };
      break;
    }
    default:
      break;
  }

  try {
    const [assignments, count, lessons] = await prisma.$transaction([
      prisma.assignment.findMany({
        where: whereClause,
        include: {
          lesson: {
            select: {
              subject: { select: { name: true } },
              teacher: { select: { user: { select: { name: true } } } },
              class: { select: { name: true } },
            },
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
      }),
      prisma.assignment.count({ where: whereClause }),
      prisma.lesson.findMany({
        select: {
          id: true,
          name: true,
        },
      }),
    ]);

    return {
      data: assignments as T,
      count,
      userRole: role as UserRole,
      relativeData: {
        lessons,
      } as R,
    };
  } catch (error) {
    renderError(error);
    return {
      data: [] as T,
      count: 0,
      userRole: role as UserRole,
      relativeData: {
        lessons: [],
      } as R,
    };
  }
}

export async function fetchResultList<T, R>(
  params: TableSearchParams
): Promise<{
  data: T;
  count: number;
  userRole: UserRole | null;
  relativeData: R;
}> {
  const { role, id: currentUserId } = await isUserAllowed([
    "admin",
    "teacher",
    "student",
    "parent",
  ]);

  const whereClause: Prisma.ResultWhereInput = {
    ...(params.studentId
      ? {
          studentId: params.studentId,
        }
      : {}),
    ...(params.search
      ? {
          OR: [
            {
              exam: { title: { contains: params.search, mode: "insensitive" } },
            },
            {
              student: {
                user: {
                  name: { contains: params.search, mode: "insensitive" },
                },
              },
            },
          ],
        }
      : {}),
  };

  switch (role) {
    case "admin":
      break;
    case "teacher":
      whereClause.OR = [
        { exam: { lesson: { teacherId: currentUserId } } },
        { assignment: { lesson: { teacherId: currentUserId } } },
      ];
      break;

    case "student":
      whereClause.studentId = currentUserId;
      break;

    case "parent":
      whereClause.student = {
        parentId: currentUserId,
      };
      break;
    default:
      break;
  }

  try {
    const [results, count, exams, assignments, students] =
      await prisma.$transaction([
        prisma.result.findMany({
          where: whereClause,
          include: {
            exam: {
              select: {
                id: true,
                title: true,
                lesson: {
                  select: {
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
                },
              },
            },
            assignment: {
              select: {
                id: true,
                title: true,
                lesson: {
                  select: {
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
                },
              },
            },
            student: {
              select: {
                id: true,
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
          orderBy: { updatedAt: "desc" },
        }),
        prisma.result.count({ where: whereClause }),
        prisma.exam.findMany({ select: { id: true, title: true } }),
        prisma.assignment.findMany({ select: { id: true, title: true } }),
        prisma.student.findMany({
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
      data: results as T,
      count,
      userRole: role as UserRole,
      relativeData: { exams, assignments, students } as R,
    };
  } catch (error) {
    renderError(error);
    return {
      data: [] as T,
      count: 0,
      userRole: role as UserRole,
      relativeData: {
        exams: [],
        assignments: [],
        students: [],
      } as R,
    };
  }
}

export async function fetchAnnouncementList<T, R>(
  params: TableSearchParams
): Promise<{
  data: T;
  count: number;
  userRole: UserRole | null;
  relativeData: R;
}> {
  const { role, id } = await isUserAllowed([
    "admin",
    "teacher",
    "student",
    "parent",
  ]);

  const roleConditions = {
    teacher: { lessons: { some: { teacherId: id } } },
    student: { students: { some: { id: id } } },
    parent: { students: { some: { parentId: id } } },
  };
  const whereClause: Prisma.AnnouncementWhereInput = {
    ...(params.search
      ? {
          title: { contains: params.search, mode: "insensitive" },
        }
      : {}),
    classId: null,
    class: roleConditions[role as keyof typeof roleConditions] || {},
  };

  try {
    const [announcements, count, classes] = await prisma.$transaction([
      prisma.announcement.findMany({
        where: whereClause,
        include: { class: { select: { id: true, name: true } } },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.announcement.count({ where: whereClause }),
      prisma.class.findMany({ select: { id: true, name: true } }),
    ]);

    return {
      data: announcements as T,
      count,
      userRole: role as UserRole,
      relativeData: { classes } as R,
    };
  } catch (error) {
    renderError(error);
    return {
      data: [] as T,
      count: 0,
      userRole: role as UserRole,
      relativeData: { classes: [] } as R,
    };
  }
}

export async function fetchEventList<T, R>(
  params: TableSearchParams
): Promise<{
  data: T;
  count: number;
  userRole: UserRole | null;
  relativeData: R;
}> {
  const { role, id } = await isUserAllowed([
    "admin",
    "teacher",
    "student",
    "parent",
  ]);

  const roleConditions = {
    teacher: { lessons: { some: { teacherId: id } } },
    student: { students: { some: { id: id } } },
    parent: { students: { some: { parentId: id } } },
  };
  const whereClause: Prisma.EventWhereInput = {
    ...(params.search
      ? {
          title: { contains: params.search, mode: "insensitive" },
        }
      : {}),
    classId: null,
    class: roleConditions[role as keyof typeof roleConditions] || {},
  };

  try {
    const [events, count, classes] = await prisma.$transaction([
      prisma.event.findMany({
        where: whereClause,
        include: { class: { select: { id: true, name: true } } },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.event.count({ where: whereClause }),
      prisma.class.findMany({ select: { id: true, name: true } }),
    ]);

    return {
      data: events as T,
      count,
      userRole: role as UserRole,
      relativeData: { classes } as R,
    };
  } catch (error) {
    renderError(error);
    return {
      data: [] as T,
      count: 0,
      userRole: role as UserRole,
      relativeData: { classes: [] } as R,
    };
  }
}

export async function fetchAttendanceList<T, R>(
  params: TableSearchParams
): Promise<{
  data: T;
  count: number;
  userRole: UserRole | null;
  relativeData: R;
}> {
  const user = await isUserAllowed(["admin", "teacher", "student", "parent"]);

  const whereClause: Prisma.AttendanceWhereInput = {
    ...(params.classId
      ? {
          lesson: { classId: params.classId },
        }
      : {}),
    ...(params.teacherId
      ? {
          lesson: { teacherId: params.teacherId },
        }
      : {}),
    ...(params.search
      ? {
          student: {
            user: {
              name: { contains: params.search, mode: "insensitive" },
            },
          },
        }
      : {}),
  };

  try {
    const [attendances, count, students, lessons] = await prisma.$transaction([
      prisma.attendance.findMany({
        where: whereClause,
        include: {
          student: {
            select: {
              id: true,
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
          lesson: {
            select: {
              id: true,
              name: true,
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
          },
        },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.attendance.count({ where: whereClause }),
      prisma.student.findMany({
        select: {
          id: true,
          user: {
            select: {
              name: true,
            },
          },
        },
      }),
      prisma.lesson.findMany({ select: { id: true, name: true } }),
    ]);

    return {
      data: attendances as T,
      count,
      userRole: user.role as UserRole,
      relativeData: { students, lessons } as R,
    };
  } catch (error) {
    renderError(error);
    return {
      data: [] as T,
      count: 0,
      userRole: user.role as UserRole,
      relativeData: { students: [], lessons: [] } as R,
    };
  }
}

export async function fetchRelativeAdminData<T>(): Promise<{
  data: T;
  userRole: UserRole | null;
}> {
  const user = await isUserAllowed(["admin"]);
  try {
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
        orderBy: {
          updatedAt: "desc",
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
        orderBy: {
          updatedAt: "desc",
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
      userRole: user.role as UserRole,
    };
  }
}

export const fetchStudentsChartData = async () => {
  try {
    const data = await prisma.student.groupBy({
      by: ["sex"],
      _count: {
        _all: true,
      },
      orderBy: {
        sex: "asc",
      },
    });

    const boys = data.find((d) => d.sex === UserSex.MALE)?._count._all || 0;
    const girls = data.find((d) => d.sex === UserSex.FEMALE)?._count._all || 0;

    return {
      boys,
      girls,
    };
  } catch (error) {
    renderError(error);
    return {
      boys: 0,
      girls: 0,
    };
  }
};

export const fetchAttendanceChartData = async () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  const lastMonday = new Date(today);

  lastMonday.setDate(today.getDate() - daysSinceMonday);

  const resData = await prisma.attendance.findMany({
    where: {
      date: {
        gte: lastMonday,
      },
    },
    select: {
      date: true,
      present: true,
    },
  });

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  const attendanceMap: { [key: string]: { present: number; absent: number } } =
    {
      Mon: { present: 0, absent: 0 },
      Tue: { present: 0, absent: 0 },
      Wed: { present: 0, absent: 0 },
      Thu: { present: 0, absent: 0 },
      Fri: { present: 0, absent: 0 },
    };

  resData.forEach((item) => {
    const itemDate = new Date(item.date);
    const dayOfWeek = itemDate.getDay();

    if (dayOfWeek >= 1 && dayOfWeek <= 5) {
      const dayName = daysOfWeek[dayOfWeek - 1];

      if (item.present) {
        attendanceMap[dayName].present += 1;
      } else {
        attendanceMap[dayName].absent += 1;
      }
    }
  });

  const data = daysOfWeek.map((day) => ({
    name: day,
    present: attendanceMap[day].present,
    absent: attendanceMap[day].absent,
  }));
  return data;
};

export const fetchEventsData = async (dateParam: string | undefined) => {
  const date = dateParam ? new Date(dateParam) : new Date();

  const data = await prisma.event.findMany({
    where: {
      startTime: {
        gte: new Date(date.setHours(0, 0, 0, 0)),
        lte: new Date(date.setHours(23, 59, 59, 999)),
      },
    },
  });
  return data;
};

export const fetchUserRoleData = async () => {
  try {
    const [teachers, parents, students] = await prisma.$transaction([
      prisma.teacher.count(),
      prisma.parent.count(),
      prisma.student.count(),
    ]);

    return {
      teachersCount: teachers || 0,
      parentsCount: parents || 0,
      studentsCount: students || 0,
      staffCount: 0,
    };
  } catch (error) {
    renderError(error);
    return {
      teachersCount: 0,
      parentsCount: 0,
      studentsCount: 0,
      staffCount: 0,
    };
  }
};

export const fetchAnnouncementData = async () => {
  const { id, role } = await getAuthUser();

  const roleConditions = {
    teacher: { lessons: { some: { teacherId: id } } },
    student: { students: { some: { id: id } } },
    parent: { students: { some: { parentId: id } } },
  };

  try {
    const data = await prisma.announcement.findMany({
      take: 3,
      orderBy: { date: "desc" },
      where: {
        ...(role !== "admin" && {
          OR: [
            { classId: null },
            {
              class: roleConditions[role as keyof typeof roleConditions] || {},
            },
          ],
        }),
      },
    });
    return data;
  } catch (error) {
    return [];
  }
};

export const fetchSingleTeacherData = async (userId: string) => {
  const { role, id } = await getAuthUser();
  try {
    const [data, subjects] = await prisma.$transaction([
      prisma.teacher.findUnique({
        where: { id: userId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              role: true,
            },
          },
          subjects: true,
          _count: {
            select: {
              lessons: true,
              classes: true,
            },
          },
        },
      }),

      prisma.subject.findMany({
        select: {
          id: true,
          name: true,
        },
      }),
    ]);

    if (!data) {
      return null;
    }

    return {
      teacher: {
        ...data,
      },
      user: data.user,
      subjectsCount: data.subjects.length,
      lessonsCount: data._count.lessons,
      classesCount: data._count.classes,
      currentUserRole: role as UserRole,
      currentUserId: id,
      relativeData: {
        subjects,
      },
    };
  } catch (error) {
    renderError(error);
    return null;
  }
};

export const fetchSingleStudentData = async (userId: string) => {
  const { role, id } = await getAuthUser();
  try {
    const [data, grades, classes, parents] = await prisma.$transaction([
      prisma.student.findUnique({
        where: { id: userId },

        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              role: true,
            },
          },
          grade: true,
          class: {
            include: {
              _count: {
                select: {
                  lessons: true,
                },
              },
            },
          },
        },
      }),

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

    if (!data) {
      return null;
    }

    return {
      student: {
        ...data,
      },
      user: data.user,
      lessonsCount: data.class._count.lessons,
      currentUserRole: role as UserRole,
      currentUserId: id,
      relativeData: {
        grades,
        classes,
        parents,
      },
    };
  } catch (error) {
    renderError(error);
    return null;
  }
};

export const fetchScheduleData = async (
  id: string,
  type: "teacherId" | "classId"
) => {
  const dataRes = await prisma.lesson.findMany({
    where: {
      ...(type === "teacherId" ? { teacherId: id } : { classId: id }),
    },
  });

  const data = dataRes.map((lesson) => ({
    title: lesson.name,
    start: lesson.startTime,
    end: lesson.endTime,
  }));

  return data;
};

export const fetchStudentClass = async (id: string) => {
  try {
    const data = await prisma.student.findUnique({
      where: { userId: id },
      select: {
        class: true,
      },
    });
    if (!data) {
      return null;
    }
    return data.class;
  } catch (error) {
    renderError(error);
    return null;
  }
};
export const fetchParentStudents = async (id: string) => {
  try {
    const data = await prisma.parent.findUnique({
      where: { userId: id },
      select: {
        students: {
          select: {
            id: true,
            classId: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
    if (!data) {
      return [];
    }
    return data.students;
  } catch (error) {
    renderError(error);
    return [];
  }
};
