import { DashboardLink } from "@/types";
import {
  BookOpenCheck,
  CalendarDays,
  Settings,
  UserRoundPen,
  GraduationCap,
  Home,
  LogOut,
  MessageCircleMore,
  NotepadText,
  School,
  UsersRound,
  Megaphone,
  Divide,
  BookMarked,
} from "lucide-react";
import { BsFillJournalBookmarkFill } from "react-icons/bs";
import { IoIosPeople } from "react-icons/io";
import { MdFormatListNumbered, MdListAlt } from "react-icons/md";
import { RiBookShelfLine } from "react-icons/ri";

const sidebarMenuLinks: DashboardLink[] = [
  {
    icon: <Home strokeWidth={1.5} />,
    title: "Home",
    url: "/",
    access: ["admin", "teacher", "student", "parent"],
  },
  {
    icon: <GraduationCap strokeWidth={1.5} />,
    title: "Teachers",
    url: "/list/teachers",
    access: ["admin", "teacher"],
  },
  {
    icon: <UsersRound strokeWidth={1.5} />,
    title: "Students",
    url: "/list/students",
    access: ["admin", "teacher"],
  },
  {
    icon: <IoIosPeople />,
    title: "Parents",
    url: "/list/parents",
    access: ["admin", "teacher"],
  },
  {
    icon: <Divide strokeWidth={1.5} />,
    title: "Subjects",
    url: "/list/subjects",
    access: ["admin"],
  },
  {
    icon: <School strokeWidth={1.5} />,
    title: "Classes",
    url: "/list/classes",
    access: ["admin", "teacher"],
  },
  {
    icon: <NotepadText strokeWidth={1.5} />,
    title: "Lessons",
    url: "/list/lessons",
    access: ["admin", "teacher"],
  },
  {
    icon: <BookOpenCheck strokeWidth={1.5} />,
    title: "Exams",
    url: "/list/exams",
    access: ["admin", "teacher", "student", "parent"],
  },
  {
    icon: <BookMarked strokeWidth={1.5} />,
    title: "Assignments",
    url: "/list/assignments",
    access: ["admin", "teacher", "student", "parent"],
  },
  {
    icon: <RiBookShelfLine />,
    title: "Results",
    url: "/list/results",
    access: ["admin", "teacher", "student", "parent"],
  },
  {
    icon: <MdFormatListNumbered />,
    title: "Attendance",
    url: "/list/attendance",
    access: ["admin", "teacher", "student", "parent"],
  },
  {
    icon: <CalendarDays strokeWidth={1.5} />,
    title: "Events",
    url: "/list/events",
    access: ["admin", "teacher", "student", "parent"],
  },
  {
    icon: <MessageCircleMore strokeWidth={1.5} />,
    title: "Messages",
    url: "/list/messages",
    access: ["admin", "teacher", "student", "parent"],
  },
  {
    icon: <Megaphone strokeWidth={1.5} />,
    title: "Announcements",
    url: "/list/announcements",
    access: ["admin", "teacher", "student", "parent"],
  },
];

const sidebarOtherLinks: DashboardLink[] = [
  {
    icon: <UserRoundPen strokeWidth={1.5} />,
    title: "Profile",
    url: "/profile",
    access: ["admin", "teacher", "student", "parent"],
  },
  {
    icon: <Settings strokeWidth={1.5} />,
    title: "Settings",
    url: "/settings",
    access: ["admin", "teacher", "student", "parent"],
  },
  {
    icon: <LogOut strokeWidth={1.5} />,
    title: "Logout",
    url: "/",
    access: ["admin", "teacher", "student", "parent"],
  },
];
export { sidebarMenuLinks, sidebarOtherLinks };
