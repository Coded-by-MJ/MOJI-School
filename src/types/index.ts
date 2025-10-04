import { JSX } from "react";
import { Route } from "next";
import {
  Subject,
  Teacher,
  User,
  Class,
  Parent,
  Student,
  Grade,
  Lesson,
} from "@prisma/client";
import { relative } from "path";

export type UserRole = "user" | "admin" | "parent" | "teacher" | "student";

export interface DashboardLink {
  icon: JSX.Element;
  title: string;
  url: Route;
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
  user: User;
  subjects: Subject[];
  classes: Class[];
};
export type StudentTableDataType = Student & {
  user: User;
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
  teachers: Teacher &
    {
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

export interface ClassTableRelativeData {
  grades: Grade[];
  teachers: {
    id: string;
    user: {
      name: string;
    };
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

export type LessonTableDataType = Lesson & {
  class: Grade;
  subject: {
    name: string;
  };
  teacher: {
    user: {
      name: string;
    };
  };
};
