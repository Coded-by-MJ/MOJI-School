import FormDialog from "@/components/forms/FormDialog";
import Announcements from "@/components/global/Announcements";
import ClassSchedule from "@/components/global/ClassSchedule";
import PerformanceChart from "@/components/global/PerformanceChart";
import { role } from "@/lib/data";
import { Calendar, Mail, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { MdBloodtype, MdOutlineBloodtype } from "react-icons/md";

async function SingleStudentPage({
  params,
}: PageProps<"/list/students/[studentId]">) {
  const { studentId } = await params;

  return (
    <section className="flex flex-col xl:flex-row gap-4 w-full">
      <div className="w-full flex flex-col gap-4 xl:w-2/3">
        <div className="flex w-full flex-col gap-4 lg:flex-row">
          {/* Student Card */}
          <div className="bg-primary flex gap-4 flex-1 py-6 px-4 rounded-md">
            <div className="w-1/3">
              <Image
                className="rounded-full object-cover w-36 h-36"
                src="https://images.pexels.com/photos/2888150/pexels-photo-2888150.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="avatar"
                width={144}
                height={144}
              />
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold">Student Name</h1>
                {role === "admin" && (
                  <FormDialog type="update" table="student" />
                )}
              </div>
              <p className="text-sm ">a good student</p>
              <div className="flex gap-2 text-xs font-medium justify-between items-center flex-wrap">
                <div className="flex items-center gap-2 w-full md:w-1/3 lg:w-full xl:w-1/3">
                  <MdOutlineBloodtype className=" size-4 shrink-0" />
                  <span>A+</span>
                </div>{" "}
                <div className="flex items-center gap-2 w-full md:w-1/3 lg:w-full xl:w-1/3">
                  <Calendar strokeWidth={1.5} className=" size-4 shrink-0" />
                  <span>January 2025</span>
                </div>{" "}
                <div className="flex items-center gap-2 w-full md:w-1/3 lg:w-full xl:w-1/3">
                  <Mail strokeWidth={1.5} className=" size-4 shrink-0" />
                  <span>jondoe@gmail.com</span>
                </div>{" "}
                <div className="flex items-center gap-2 w-full md:w-1/3 lg:w-full xl:w-1/3">
                  <Phone strokeWidth={1.5} className=" size-4 shrink-0" />
                  <span>+24553334444</span>
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
                <h2 className="text-xl font-semibold">6th</h2>
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
                <h2 className="text-xl font-semibold">18</h2>
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
                <h2 className="text-xl font-semibold">6A</h2>
                <span className="text-sm text-secondary/50">Classes</span>
              </div>
            </div>{" "}
          </div>
        </div>{" "}
        <ClassSchedule heading={"Student's Schedule"} />
      </div>
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        <div className="w-full flex gap-4 flex-col p-4 bg-muted rounded-md ">
          <h2 className="text-xl font-semibold">Shortcuts</h2>
          <div className="flex flex-wrap text-xs gap-4">
            <Link
              className="p-3 rounded-md odd:bg-purple-300 text-primary even:bg-yellow-300"
              href={"/"}
            >
              Student&apos;s Teachers
            </Link>{" "}
            <Link
              className="p-3 rounded-md odd:bg-purple-300 text-primary even:bg-yellow-300"
              href={"/"}
            >
              Student&apos;s Results
            </Link>{" "}
            <Link
              className="p-3 rounded-md odd:bg-purple-300 text-primary even:bg-yellow-300"
              href={"/"}
            >
              Student&apos;s Lessons
            </Link>{" "}
            <Link
              className="p-3 rounded-md odd:bg-purple-300 text-primary even:bg-yellow-300"
              href={"/"}
            >
              Student&apos;s Exams
            </Link>
            <Link
              className="p-3 rounded-md odd:bg-purple-300 text-primary even:bg-yellow-300"
              href={"/"}
            >
              Student&apos;s Assignments
            </Link>
          </div>
        </div>

        <PerformanceChart />

        <Announcements />
      </div>
    </section>
  );
}
export default SingleStudentPage;
