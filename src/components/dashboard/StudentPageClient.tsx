"use client";

import EventCalendarClient from "@/components/global/EventCalendarClient";
import AnnouncementsClient from "@/components/global/AnnouncementsClient";
import ClassSchedule from "@/components/global/ClassSchedule";
import { useQuery } from "@tanstack/react-query";
import { studentsQueries } from "@/queries/students";
import { Skeleton } from "@/components/ui/skeleton";

type Props = {
  studentId: string;
  eventsDate?: string;
};

function StudentPageClient({ studentId, eventsDate }: Props) {
  const { data: classItem, isLoading } = useQuery(
    studentsQueries.getClass(studentId)
  );

  if (isLoading || !classItem) {
    return (
      <section className="flex flex-1 gap-4 flex-col xl:flex-row">
        <div className="w-full flex flex-col gap-4 xl:w-2/3">
          <Skeleton className="w-full h-[900px] rounded-md" />
        </div>
        <div className="w-full flex flex-col gap-8 xl:w-1/3">
          <Skeleton className="w-full h-[400px] rounded-md" />
          <Skeleton className="w-full h-[400px] rounded-md" />
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-1 gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full flex flex-col gap-4 xl:w-2/3">
        <ClassSchedule
          type="classId"
          id={classItem.id}
          heading={`Schedule (${classItem.name})`}
        />
      </div>

      {/* RIGHT */}
      <div className="w-full flex flex-col gap-8 xl:w-1/3">
        <EventCalendarClient defaultDate={eventsDate} />
        <AnnouncementsClient />
      </div>
    </section>
  );
}

export default StudentPageClient;
