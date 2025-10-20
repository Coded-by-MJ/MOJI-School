import Announcements from "@/components/global/Announcements";
import ClassSchedule from "@/components/global/ClassSchedule";
import { fetchAnnouncementData } from "@/lib/query-actions";
import { isUserAllowed } from "@/lib/users";

async function TeachersPage() {
  const { id } = await isUserAllowed(["teacher"]);
  const announcementData = await fetchAnnouncementData();
  return (
    <section className="flex  flex-1 gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full  flex flex-col  gap-4 xl:w-2/3">
        <ClassSchedule type="teacherId" id={id} heading={"Schedule"} />
      </div>

      {/* RIGHT */}
      <div className="w-full flex flex-col gap-8 xl:w-1/3">
        {/* EVENTS */}
        <Announcements data={announcementData} />
      </div>
    </section>
  );
}
export default TeachersPage;
