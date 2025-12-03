"use client";

import AnnouncementsClient from "@/components/global/AnnouncementsClient";
import ClassSchedule from "@/components/global/ClassSchedule";

type Props = {
  teacherId: string;
};

function TeacherPageClient({ teacherId }: Props) {
  return (
    <section className="flex flex-1 gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full flex flex-col gap-4 xl:w-2/3">
        <ClassSchedule type="teacherId" id={teacherId} heading={"Schedule"} />
      </div>

      {/* RIGHT */}
      <div className="w-full flex flex-col gap-8 xl:w-1/3">
        <AnnouncementsClient />
      </div>
    </section>
  );
}

export default TeacherPageClient;
