import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";

import { AuthUserType } from "@/types";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

function DashboardUserIcon({ user }: { user: AuthUserType }) {
  const userName = user.name;
  const profileImage =
    user.image ||
    `https://ui-avatars.com/api/?size=60&background=112358&color=fff&rounded=true&name=${
      user.name.split(" ")[0]
    }+${user.name.split(" ")[1]}`;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        className={
          "group flex h-14 w-full [&>svg]:size-5   group-data-[collapsible=icon]:!p-0   items-center gap-2 text-sm font-medium  transition-all "
        }
        asChild
      >
        <Link href="/admin/settings">
          <Image
            src={profileImage}
            alt={`Profile picture of ${userName}`}
            width={28}
            height={28}
            priority
            className="w-8 h-8 shrink-0 rounded-full object-cover"
          />
          <div className="flex flex-col overflow-hidden flex-1 gap-1">
            <span className="font-medium truncate text-main-blue text-sm font-broke-medium">
              {userName}
            </span>
            <Badge
              className={cn("text-xs capitalize text-white bg-dark-orange")}
            >
              {user.role.replace(/_/g, " ")}
            </Badge>
          </div>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
export default DashboardUserIcon;
