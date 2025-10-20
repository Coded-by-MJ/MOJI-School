import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Announcement } from "@prisma/client";
import { formatDate } from "date-fns";

type Props = {
  data: Announcement[];
};
const Announcements = ({ data }: Props) => {
  return (
    <Card className=" py-4 bg-muted rounded-md">
      <CardHeader className="flex px-4 items-center justify-between">
        <CardTitle className="text-xl font-semibold">Announcements</CardTitle>
        <Link href="/list/announcements">
          <span className="text-xs text-muted-foreground">View All</span>
        </Link>
      </CardHeader>
      <CardContent className="flex px-4 flex-col gap-4 mt-4">
        {data.map((item) => (
          <div
            key={item.id}
            className="odd:bg-purple-300 even:bg-yellow-300 rounded-md p-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-primary">{item.title}</h2>
              <span className="text-xs text-primary bg-secondary rounded-md p-1">
                {formatDate(item.date, "MMM dd, yyyy")}
              </span>
            </div>
            <p className="text-sm text-primary mt-1">
              {item.description}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default Announcements;
