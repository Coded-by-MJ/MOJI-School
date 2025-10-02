import { Card, CardHeader } from "@/components/ui/card";
import BigCalendar from "./BigCalendar";

type Props = {
  heading: string;
};
function ClassSchedule({ heading }: Props) {
  return (
    <Card className="h-full bg-muted p-4 rounded-md min-h-[900px]">
      <CardHeader className=" px-0">
        <h1 className="text-2xl font-semibold">{heading}</h1>
      </CardHeader>
      <BigCalendar />
    </Card>
  );
}
export default ClassSchedule;
