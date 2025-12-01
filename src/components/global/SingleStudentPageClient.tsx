"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AllowedUserCompClient from "@/components/auth/AllowedUserCompClient";
import FormDialog from "@/components/forms/FormDialog";
import Announcements from "@/components/global/Announcements";
import ClassSchedule from "@/components/global/ClassSchedule";
import PerformanceChart from "@/components/global/PerformanceChart";
import { SinglePersonPageSkeleton } from "@/components/global/SkeletonsLoading";
import { StudentTableDataType } from "@/types";
import { getDefaultImage } from "@/utils/funcs";
import { formatDate } from "date-fns";
import { Calendar, Mail, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { studentsQueries } from "@/queries/students";
import { announcementsQueries } from "@/queries/announcements";
import { MdOutlineBloodtype } from "react-icons/md";

type Props = {
  studentId: string;
};

export default function SingleStudentPageClient({ studentId }: Props) {
  const router = useRouter();
  const { data, isLoading, isError } = useQuery(studentsQueries.getById(studentId));
  const { data: announcementData, isLoading: isLoadingAnnouncements } = useQuery(
    announcementsQueries.getRecent()
  );

  // Handle redirect if student not found
  useEffect(() => {
    if (!isLoading && (isError || !data)) {
      router.push("/list/students");
    }
  }, [isLoading, isError, data, router]);

  if (isLoading || !data) {
    return <SinglePersonPageSkeleton />;
  }

  const studentData: StudentTableDataType = {
    ...data.student,
  };

  return (
    <section className="flex flex-col xl:flex-row gap-4 w-full">
      <div className="w-full flex flex-col gap-4 xl:w-2/3">
        <div className="flex w-full flex-col gap-4 lg:flex-row">
          {/* Student Card */}
          <div className="bg-primary flex gap-4 flex-1 py-6 px-4 rounded-md">
            <div className="w-1/3">
              <Image
                className="rounded-full object-cover w-36 h-36"
                src={data.user.image || getDefaultImage(data.user.name)}
                alt={data.user.name}
                width={144}
                height={144}
              />
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold">{data.user.name}</h1>
                <AllowedUserCompClient allowedRoles={["admin"]}>
                  <FormDialog
                    type="update"
                    table="student"
                    id={data.student.id}
                    userId={data.user.id}
                    data={studentData}
                    relativeData={data.relativeData}
                  />
                </AllowedUserCompClient>
              </div>
              <p className="text-sm ">a good student</p>
              <div className="flex gap-2 text-xs font-medium justify-between items-center flex-wrap">
                <div className="flex items-center gap-2 w-full md:w-1/3 lg:w-full xl:w-1/3">
                  <MdOutlineBloodtype className=" size-4 shrink-0" />
                  <span>{data.student.bloodType}</span>
                </div>{" "}
                <div className="flex items-center gap-2 w-full md:w-1/3 lg:w-full xl:w-1/3">
                  <Calendar strokeWidth={1.5} className=" size-4 shrink-0" />
                  <span>
                    {formatDate(new Date(data.student.birthday), "MM/dd/yyyy")}
                  </span>
                </div>{" "}
                <div className="flex items-center gap-2 w-full md:w-1/3 lg:w-full xl:w-1/3">
                  <Mail strokeWidth={1.5} className=" size-4 shrink-0" />
                  <span>{data.user.email}</span>
                </div>{" "}
                <div className="flex items-center gap-2 w-full md:w-1/3 lg:w-full xl:w-1/3">
                  <Phone strokeWidth={1.5} className=" size-4 shrink-0" />
                  <span>{data.student.phone || "-"}</span>
                </div>
              </div>
            </div>
          </div>
          {/* Student Info */}
          <div className="flex-1 flex gap-4 justify-between flex-wrap">
            <div className="flex md:w-[48%] xl:w-[45%] 2xl:w-[48%] p-4 bg-muted rounded-md items-start gap-4">
              <Image
                src={"/singleAttendance.png"}
                alt="attendance"
                width={24}
                height={24}
                className="size-6"
              />
              <div className="flex flex-col gap-0.5">
                <h2 className="text-xl font-semibold">90%</h2>
                <span className="text-sm text-secondary/50">Attendance</span>
              </div>
            </div>{" "}
            <div className="flex md:w-[48%] xl:w-[45%] 2xl:w-[48%] p-4 bg-muted rounded-md items-start gap-4">
              <Image
                src={"/singleBranch.png"}
                alt="branches"
                width={24}
                height={24}
                className="size-6"
              />
              <div className="flex flex-col gap-0.5">
                <h2 className="text-xl font-semibold">
                  {data.student.grade.level}
                  {data.student.grade.level === 1
                    ? "st"
                    : data.student.grade.level === 2
                    ? "nd"
                    : data.student.grade.level === 3
                    ? "rd"
                    : "th"}
                </h2>
                <span className="text-sm text-secondary/50">Grade</span>
              </div>
            </div>{" "}
            <div className="flex md:w-[48%] xl:w-[45%] 2xl:w-[48%] p-4 bg-muted rounded-md items-start gap-4">
              <Image
                src={"/singleLesson.png"}
                alt="lessons"
                width={24}
                height={24}
                className="size-6"
              />
              <div className="flex flex-col gap-0.5">
                <h2 className="text-xl font-semibold">{data.lessonsCount}</h2>
                <span className="text-sm text-secondary/50">Lessons</span>
              </div>
            </div>
            <div className="flex md:w-[48%] xl:w-[45%] 2xl:w-[48%] p-4 bg-muted rounded-md items-start gap-4">
              <Image
                src={"/singleClass.png"}
                alt="classes"
                width={24}
                height={24}
                className="size-6"
              />
              <div className="flex flex-col gap-0.5">
                <h2 className="text-xl font-semibold">
                  {data.student.class.name}
                </h2>
                <span className="text-sm text-secondary/50">Class</span>
              </div>
            </div>{" "}
          </div>
        </div>{" "}
        <ClassSchedule
          type="classId"
          id={data.student.classId}
          heading={"Student's Schedule"}
        />
      </div>
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="w-full flex gap-4 flex-col p-4 bg-muted rounded-md ">
          <h2 className="text-xl font-semibold">Shortcuts</h2>
          <div className="flex flex-wrap text-xs gap-4">
            <Link
              className="p-3 rounded-md odd:bg-purple-300 text-primary even:bg-yellow-300"
              href={`/list/teachers?classId=${data.student.classId}`}
            >
              Student&apos;s Teachers
            </Link>{" "}
            <Link
              className="p-3 rounded-md odd:bg-purple-300 text-primary even:bg-yellow-300"
              href={`/list/results?studentId=${data.student.id}`}
            >
              Student&apos;s Results
            </Link>{" "}
            <Link
              className="p-3 rounded-md odd:bg-purple-300 text-primary even:bg-yellow-300"
              href={`/list/lessons?classId=${data.student.classId}`}
            >
              Student&apos;s Lessons
            </Link>{" "}
            <Link
              className="p-3 rounded-md odd:bg-purple-300 text-primary even:bg-yellow-300"
              href={`/list/exams?classId=${data.student.classId}`}
            >
              Student&apos;s Exams
            </Link>
            <Link
              className="p-3 rounded-md odd:bg-purple-300 text-primary even:bg-yellow-300"
              href={`/list/assignments?classId=${data.student.classId}`}
            >
              Student&apos;s Assignments
            </Link>
          </div>
        </div>

        <PerformanceChart />

        {!isLoadingAnnouncements && announcementData && (
          <Announcements data={announcementData} />
        )}
      </div>
    </section>
  );
}
