import Announcements from "@/components/global/Announcements";
import ClassSchedule from "@/components/global/ClassSchedule";
import { announcementsService } from "@/services/announcements";
import { isUserAllowed } from "@/lib/users";
import { cookies as getCookies } from "next/headers";

async function TeachersPage() {
  const { id } = await isUserAllowed(["teacher"]);
  const cookiesString = (await getCookies()).toString();
  const announcementData = await announcementsService.getRecent(cookiesString);
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
