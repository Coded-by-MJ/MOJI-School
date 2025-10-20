import { Megaphone, MessageCircleMore } from "lucide-react";
import { Button } from "../ui/button";
import DashboardSearchBar from "./DashboardSearchBar";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarTrigger } from "../ui/sidebar";
import { SessionType } from "@/lib/auth-types";
import { getDefaultImage } from "@/utils/funcs";
import Link from "next/link";

type Props = {
  user: SessionType["user"];
};
function DashboardNavbar({ user }: Props) {
  return (
    <nav className="w-full flex py-2 items-center justify-between">
      <div className="hidden w-1/2 max-w-sm md:flex">
        <DashboardSearchBar searchKey="nav_search" placeHolder="Search..." />
      </div>
      <SidebarTrigger className="md:hidden" />

      <div className="flex gap-6 items-center">
        <Button
          size="icon"
          className="rounded-full bg-transparent relative "
          asChild
        >
          <Link href="/list/messages">
            <MessageCircleMore className="size-5" />

            <span className="absolute -top-2 -right-2 text-center size-5 bg-red-500 rounded-full">
              1
            </span>
          </Link>
        </Button>{" "}
        <Button
          size="icon"
          className="rounded-full bg-transparent relative "
          asChild
        >
          <Link href="/list/announcements">
            <Megaphone className="size-5" />

            <span className="absolute -top-2 -right-2 size-5 text-center bg-red-500 rounded-full">
              1
            </span>
          </Link>
        </Button>
        <div className="flex gap-1 flex-col">
          <span className="text-sm leading-3 font-semibold">{user.name}</span>
          <Badge className="capitalize">{user.role}</Badge>
        </div>
        <Avatar className="size-9">
          <AvatarImage src={user.image || getDefaultImage(user.name)} />
          <AvatarFallback>{user.name}</AvatarFallback>
        </Avatar>
      </div>
    </nav>
  );
}
export default DashboardNavbar;
