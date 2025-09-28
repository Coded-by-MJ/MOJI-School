import { JSX } from "react";
import { Route } from "next";

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
