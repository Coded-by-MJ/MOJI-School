import Announcements from "@/components/global/Announcements";
import ClassSchedule from "@/components/global/ClassSchedule";
import {
  fetchAnnouncementData,
  fetchParentStudents,
} from "@/lib/query-actions";
import { isUserAllowed } from "@/lib/users";

async function ParentPage() {
  const { id } = await isUserAllowed(["parent"]);
  const [students, announcementData] = await Promise.all([
    fetchParentStudents(id),
    fetchAnnouncementData(),
  ]);
  return (
    <section className="flex  flex-1 gap-4 flex-col xl:flex-row">
      {/* LEFT */}

      <div className="w-full  flex flex-col  gap-4">
        {students.map((student) => (
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
        {/* EVENTS */}
        <Announcements data={announcementData} />
      </div>
    </section>
  );
}
export default ParentPage;
