import EventCalendar from "@/components/global/EventCalendar";
import Announcements from "@/components/global/Announcements";
import ClassSchedule from "@/components/global/ClassSchedule";

function StudentPage() {
  return (
    <section className="flex flex-1 gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full  flex flex-col  gap-4 xl:w-2/3">
        <ClassSchedule heading={"Schedule(4A)"} />
      </div>

      {/* RIGHT */}
      <div className="w-full flex flex-col gap-8 xl:w-1/3">
        {/* EVENTS */}
        <EventCalendar />
        <Announcements />
      </div>
    </section>
  );
}
export default StudentPage;
