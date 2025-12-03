"use client";

import AnnouncementsClient from "@/components/global/AnnouncementsClient";
import ClassSchedule from "@/components/global/ClassSchedule";
import { useQuery } from "@tanstack/react-query";
import { parentsQueries } from "@/queries/parents";
import { Skeleton } from "@/components/ui/skeleton";

type Student = {
  id: string;
  classId: string;
  user: {
    name: string;
  };
};

type Props = {
  parentId: string;
};

function ParentPageClient({ parentId }: Props) {
  const { data: students, isLoading } = useQuery(
    parentsQueries.getStudents(parentId)
  );

  if (isLoading || !students) {
    return (
      <section className="flex flex-1 gap-4 flex-col xl:flex-row">
        <div className="w-full flex flex-col gap-4">
          <Skeleton className="w-full h-[900px] rounded-md" />
        </div>
        <div className="w-full flex flex-col gap-8 xl:w-1/3">
          <Skeleton className="w-full h-[400px] rounded-md" />
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-1 gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full flex flex-col gap-4">
        {students.map((student: Student) => (
          <div key={student.id} className="w-full">
            <ClassSchedule
              heading={`Schedule (${student.user.name})`}
              type="classId"
              id={student.classId}
            />
          </div>
        ))}
      </div>
      {/* RIGHT */}
      <div className="w-full flex flex-col gap-8 xl:w-1/3">
        <AnnouncementsClient />
      </div>
    </section>
  );
}

export default ParentPageClient;
