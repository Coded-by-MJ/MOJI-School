import Announcements from "@/components/global/Announcements";
import ClassSchedule from "@/components/global/ClassSchedule";

function ParentPage() {
  return (
    <section className="flex  flex-1 gap-4 flex-col xl:flex-row">
      {/* LEFT */}
      <div className="w-full  flex flex-col  gap-4 xl:w-2/3">
        <ClassSchedule heading={"Schedule (John Doe) "} />
      </div>

      {/* RIGHT */}
      <div className="w-full flex flex-col gap-8 xl:w-1/3">
        {/* EVENTS */}
        <Announcements />
      </div>
    </section>
  );
}
export default ParentPage;
