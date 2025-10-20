import { Card, CardHeader } from "@/components/ui/card";
import BigCalendar from "./BigCalendar";
import { fetchScheduleData } from "@/lib/query-actions";
import { adjustScheduleToCurrentWeek } from "@/utils/funcs";

type Props = {
  heading: string;
  type: "teacherId" | "classId";
  id: string;
};
async function ClassSchedule({ heading, type, id }: Props) {
  const data = await fetchScheduleData(id, type);

  const schedule = adjustScheduleToCurrentWeek(data);
  return (
    <Card className="h-full bg-muted p-4 rounded-md min-h-[900px]">
      <CardHeader className=" px-0">
        <h1 className="text-2xl font-semibold">{heading}</h1>
      </CardHeader>
      <BigCalendar data={schedule} />
    </Card>
  );
}
export default ClassSchedule;
