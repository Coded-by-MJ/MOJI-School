"use client";

import { Card, CardHeader } from "@/components/ui/card";
import BigCalendar from "./BigCalendar";
import { adjustScheduleToCurrentWeek } from "@/utils/funcs";
import { useQuery } from "@tanstack/react-query";
import { teachersQueries } from "@/queries/teachers";
import { classesQueries } from "@/queries/classes";
import { ScheduleSkeleton } from "./SkeletonsLoading";

type Props = {
  heading: string;
  type: "teacherId" | "classId";
  id: string;
};

function ClassSchedule({ heading, type, id }: Props) {
  // Use enabled option to conditionally fetch based on type
  const teacherScheduleQuery = useQuery({
    ...teachersQueries.getSchedule(id),
    enabled: type === "teacherId" && !!id,
  });

  const classScheduleQuery = useQuery({
    ...classesQueries.getSchedule(id),
    enabled: type === "classId" && !!id,
  });

  // Get the active query based on type
  const activeQuery =
    type === "teacherId" ? teacherScheduleQuery : classScheduleQuery;
  const { data, isLoading } = activeQuery;

  if (isLoading || !data) {
    return (
      <Card className="h-full bg-muted p-4 rounded-md min-h-[900px]">
        <CardHeader className="px-0">
          <h1 className="text-2xl font-semibold">{heading}</h1>
        </CardHeader>
        <ScheduleSkeleton />
      </Card>
    );
  }

  const schedule = adjustScheduleToCurrentWeek(data);

  return (
    <Card className="h-full bg-muted p-4 rounded-md min-h-[900px]">
      <CardHeader className="px-0">
        <h1 className="text-2xl font-semibold">{heading}</h1>
      </CardHeader>
      <BigCalendar data={schedule} />
    </Card>
  );
}

export default ClassSchedule;
