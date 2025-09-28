import { MoreHorizontal } from "lucide-react";
import { Badge } from "../ui/badge";

const UserCard = ({ type }: { type: string }) => {
  return (
    <div className="rounded-2xl odd:bg-purple-600 even:bg-yellow-600 p-4 flex-1 min-w-[130px]">
      <div className="flex justify-between items-center">
        <Badge className="bg-secondary px-2 py-1 rounded-full text-green-600">
          2024/25
        </Badge>
        <MoreHorizontal className="size-5" />
      </div>
      <h1 className="text-2xl font-semibold my-4">1,234</h1>
      <h2 className="capitalize text-sm font-medium ">{type}s</h2>
    </div>
  );
};

export default UserCard;
