"use client";

import CountChart from "@/components/global/CountChart";
import AttendanceChart from "@/components/global/AttendanceChart";
import FinanceChart from "@/components/global/FinanceChart";
import UserCard from "@/components/global/UserCard";
import EventCalendarClient from "@/components/global/EventCalendarClient";
import AnnouncementsClient from "@/components/global/AnnouncementsClient";
import { useQuery } from "@tanstack/react-query";
import { dashboardQueries } from "@/queries/dashboard";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  eventsDate?: string;
};

function AdminPageClient({ eventsDate }: Props) {
  const { data: usersData, isLoading: usersLoading } = useQuery(
    dashboardQueries.getUserRolesChart()
  );
  const { data: studentsChartData, isLoading: studentsLoading } = useQuery(
    dashboardQueries.getStudentsChart()
  );
  const { data: attendanceChartData, isLoading: attendanceLoading } = useQuery(
    dashboardQueries.getAttendanceChart()
  );

  if (usersLoading || !usersData) {
    return (
      <section className="flex gap-4 flex-col lg:flex-row">
        <div className="w-full flex flex-col gap-4 lg:w-2/3">
          <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(150px,1fr))] items-start h-max gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
          <div className="gap-4 grid grid-cols-1 lg:grid-cols-[0.5fr_1fr]">
            <Skeleton className="h-[450px] w-full" />
            <Skeleton className="h-[450px] w-full" />
          </div>
          <Skeleton className="h-[300px] w-full" />
        </div>
        <div className="w-full flex flex-col gap-8 lg:w-1/3">
          <Skeleton className="h-[400px] w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </section>
    );
  }

  return (
    <section className="flex gap-4 flex-col lg:flex-row">
      {/* LEFT */}
      <div className="w-full flex flex-col gap-4 lg:w-2/3">
        <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(150px,1fr))] items-start h-max gap-4">
          <UserCard type="student" count={usersData.studentsCount} />
          <UserCard type="teacher" count={usersData.teachersCount} />
          <UserCard type="parent" count={usersData.parentsCount} />
          <UserCard type="staff" count={usersData.staffCount} />
        </div>

        {/* MIDDLE CHARTS */}
        <div className="gap-4 [&>div]:h-[450px] grid grid-cols-1 lg:grid-cols-[0.5fr_1fr]">
          {studentsChartData && <CountChart {...studentsChartData} />}
          {attendanceChartData && (
            <AttendanceChart data={attendanceChartData} />
          )}
        </div>
        {/* BOTTOM CHARTS */}
        <FinanceChart />
      </div>

      {/* RIGHT */}
      <div className="w-full flex flex-col gap-8 lg:w-1/3">
        <EventCalendarClient defaultDate={eventsDate} />
        <AnnouncementsClient />
      </div>
    </section>
  );
}

export default AdminPageClient;
