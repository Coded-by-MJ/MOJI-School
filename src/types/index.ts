import { JSX } from "react";
import { Route } from "next";
import type {
  Subject,
  Teacher,
  User,
  Class,
  Parent,
  Student,
  Grade,
  Lesson,
  Exam,
  Assignment,
  Attendance,
  Event,
  Announcement,
  Result,
  UserRole,
} from "@/generated/prisma";

export type { UserRole } from "@/generated/prisma";

export interface DashboardLink {
  icon: JSX.Element;
  title: string;
  url: Route;
  isLogout?: boolean;
  access: UserRole[];
  items?: {
    title: string;
    url: Route;
  }[];
}

export type ActionState = {
  message: string;
  type: "success" | "error";
};

export interface EventType {
  id: number;
  studentId: string;
  name: string;
  email: string;
  photo: string;
  phone: string;
  grade: number;
  class: string;
  address: string;
}

export type TableSearchParams = {
  page: number;
  phone?: string;
  search?: string;
  classId?: string;
  teacherId?: string;
  studentId?: string;
};

export type RelativeAdminDataType = {
  gradesWithClass: {
    id: string;
    level: number;
    classes: {
      id: string;
      name: string;
    }[];
  }[];
  parents: Parent &
    {
      user: Pick<User, "name">;
    }[];
};

export type TeacherTableDataType = Teacher & {
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    role: UserRole;
  };
  classes: Class[];

  subjects: Subject[];
};
export type StudentTableDataType = Student & {
  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    role: UserRole;
  };
  grade: Grade;
  class: Class;
};
export type ParentTableDataType = Parent & {
  user: User;
  students: Student &
    {
      user: User;
    }[];
};
export type SubjectTableDataType = Subject & {
  teachers: {
    id: string;
    user: User;
  }[];
};

export type ClassTableDataType = Class & {
  grade: Grade;
  supervisor:
    | (Teacher & {
        user: {
          name: string;
        };
      })
    | null;
};

export type LessonTableDataType = Lesson & {
  class: Class;
  subject: {
    name: string;
  };
  teacher: {
    user: {
      name: string;
    };
  };
};
export type ExamTableDataType = Exam & {
  lesson: LessonTableDataType;
};

export type ExamTableRelativeData = {
  lessons: {
    id: string;
    name: string;
  }[];
};
export type AssignmentTableDataType = Assignment & {
  lesson: LessonTableDataType;
};

export type AssignmentTableRelativeData = {
  lessons: {
    id: string;
    name: string;
  }[];
};

// ===== ATTENDANCE =====
export type AttendanceTableDataType = Attendance & {
  student: {
    id: string;
    user: {
      name: string;
    };
  };
  lesson: {
    id: string;
    name: string;
    teacher: {
      user: {
        name: string;
      };
    };
  };
};

export type AttendanceTableRelativeData = {
  students: {
    id: string;
    user: {
      name: string;
    };
  }[];
  lessons: {
    id: string;
    name: string;
  }[];
};

// ===== EVENT =====
export type EventTableDataType = Event & {
  class?: {
    id: string;
    name: string;
  } | null;
};

export type EventTableRelativeData = {
  classes: {
    id: string;
    name: string;
  }[];
};

// ===== ANNOUNCEMENT =====
export type AnnouncementTableDataType = Announcement & {
  class?: {
    id: string;
    name: string;
  } | null;
};

export type AnnouncementTableRelativeData = {
  classes: {
    id: string;
    name: string;
  }[];
};

// ===== RESULT =====
export type ResultTableDataType = Result & {
  exam?: {
    id: string;
    title: string;
    lesson: {
      teacher: {
        user: {
          name: string;
        };
      };
    };
  } | null;
  assignment?: {
    id: string;
    title: string;
    lesson: {
      teacher: {
        user: {
          name: string;
        };
      };
    };
  } | null;
  student: {
    id: string;
    user: {
      name: string;
    };
  };
};

export type ResultTableRelativeData = {
  exams: {
    id: string;
    title: string;
  }[];
  assignments: {
    id: string;
    title: string;
  }[];
  students: {
    id: string;
    user: {
      name: string;
    };
  }[];
};

export interface ClassTableRelativeData {
  grades: Grade[];
  teachers: {
    id: string;
    user: {
      name: string;
    };
  }[];
}

export interface TeacherTableRelativeData {
  subjects: {
    id: string;

    name: string;
  }[];
}
export interface StudentTableRelativeData {
  grades: Grade[];
  classes: {
    id: string;
    _count: {
      students: number;
    };
    name: string;
    capacity: number;
  }[];
  parents: {
    id: string;
    user: {
      name: string;
    };
  }[];
}
export interface SubjectTableRelativeData {
  teachers: {
    id: string;
    user: {
      name: string;
    };
  }[];
}
export interface LessonTableRelativeData {
  subjects: {
    id: string;
    name: string;
  }[];
  classes: {
    id: string;
    name: string;
  }[];
  teachers: {
    id: string;
    user: {
      name: string;
    };
  }[];
}
