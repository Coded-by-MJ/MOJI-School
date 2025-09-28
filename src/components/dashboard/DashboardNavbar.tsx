import { Megaphone, MessageCircleMore } from "lucide-react";
import { Button } from "../ui/button";
import DashboardSearchBar from "./DashboardSearchBar";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "../ui/sidebar";
import { UserRole } from "@/types";

function DashboardNavbar() {
  
  return (
    <nav className="w-full flex py-2 items-center justify-between">
      <div className="hidden w-1/2 max-w-sm md:flex">
        <DashboardSearchBar searchKey="search" placeHolder="Search..." />
      </div>
      <SidebarTrigger className="md:hidden" />

      <div className="flex gap-6 items-center">
        <Button size="icon" className="rounded-full bg-transparent relative ">
          <MessageCircleMore className="size-5" />

          <span className="absolute -top-2 -right-2 size-5 bg-red-500 rounded-full">
            1
          </span>
        </Button>{" "}
        <Button size="icon" className="rounded-full bg-transparent relative ">
          <Megaphone className="size-5" />

          <span className="absolute -top-2 -right-2 size-5 bg-red-500 rounded-full">
            1
          </span>
        </Button>
        <div className="flex gap-1 flex-col">
          <span className="text-sm leading-3 font-semibold">John Doe</span>
          <Badge>Admin</Badge>
        </div>
        <Avatar className="size-9">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
}
export default DashboardNavbar;
