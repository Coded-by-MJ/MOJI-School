import { MoreHorizontal } from "lucide-react";
import { Badge } from "../ui/badge";

const UserCard = ({ type, count }: { type: string; count: number }) => {
  const now = new Date();
  const lastYear = now.getFullYear() - 1;
  const currentYear = now.getFullYear().toString().slice(-2); // take last 2 digits
  const academicYear = `${lastYear}/${currentYear}`;
  return (
    <div className="rounded-2xl odd:bg-purple-600 even:bg-yellow-600 p-4 flex-1 min-w-[130px]">
      <div className="flex justify-between items-center">
        <Badge className="bg-secondary px-2 py-1 rounded-full text-green-600">
          {academicYear}
        </Badge>
        <MoreHorizontal className="size-5" />
      </div>
      <h1 className="text-2xl font-semibold my-4">{count.toLocaleString()}</h1>
      <h2 className="capitalize text-sm font-medium ">
        {type}
        {count > 1 ? "s" : ""}
      </h2>
    </div>
  );
};

export default UserCard;
