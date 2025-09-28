import CountChart from "@/components/global/CountChart";
import AttendanceChart from "@/components/global/AttendanceChart";
import FinanceChart from "@/components/global/FinanceChart";
import UserCard from "@/components/global/UserCard";
import EventCalendar from "@/components/global/EventCalendar";
import Announcements from "@/components/global/Announcements";

function AdminPage() {
  return (
    <section className="flex gap-4 flex-col lg:flex-row">
      {/* LEFT */}
      <div className="w-full flex flex-col  gap-4 lg:w-2/3">
        <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(150px,1fr))] items-start h-max gap-4">
          <UserCard type="student" />
          <UserCard type="teacher" />
          <UserCard type="parent" />
          <UserCard type="staff" />
        </div>

        {/* MIDDLE CHARTS */}
        <div className="gap-4 [&>div]:h-[450px] grid grid-cols-1 lg:grid-cols-[0.5fr_1fr]">
          <CountChart />
          <AttendanceChart />
        </div>
        {/* BOTTOM CHARTS */}
        <FinanceChart />
      </div>

      {/* RIGHT */}
      <div className="w-full flex flex-col gap-8 lg:w-1/3">
        {/* EVENTS */}
        <EventCalendar />
        <Announcements />
      </div>
    </section>
  );
}
export default AdminPage;
