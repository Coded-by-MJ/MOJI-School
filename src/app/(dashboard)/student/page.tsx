import EventCalendar from "@/components/global/EventCalendar";
import Announcements from "@/components/global/Announcements";
import ClassSchedule from "@/components/global/ClassSchedule";
import { isUserAllowed } from "@/lib/users";
import {
  fetchAnnouncementData,
  fetchEventsData,
  fetchStudentClass,
} from "@/lib/query-actions";

async function StudentPage({ searchParams }: PageProps<"/student">) {
  const queryParams = await searchParams;
  const eventsDate = queryParams.date ? queryParams.date.toString() : undefined;
  const { id } = await isUserAllowed(["student"]);
  const [classItem, eventsData, announcementData] = await Promise.all([
    fetchStudentClass(id),
    fetchEventsData(eventsDate),
    fetchAnnouncementData(),
  ]);
  return (
    <section className="flex flex-1 gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full  flex flex-col  gap-4 xl:w-2/3">
        <ClassSchedule
          type="classId"
          id={classItem ? classItem.id : ""}
          heading={`Schedule${classItem ? ` (${classItem.name})` : ""}`}
        />
      </div>

      {/* RIGHT */}
      <div className="w-full flex flex-col gap-8 xl:w-1/3">
        {/* EVENTS */}
        <EventCalendar events={eventsData} />
        <Announcements data={announcementData} />
      </div>
    </section>
  );
}
export default StudentPage;
