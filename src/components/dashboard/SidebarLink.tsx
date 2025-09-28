"use client";

import { DashboardLink } from "@/types";
import { usePathname } from "next/navigation";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "../ui/sidebar";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";
type Props = {
  link: DashboardLink;
  userRole: string;
};

function SidebarLink({ link, userRole }: Props) {
  const { access, url, icon, title, items } = link;
  const pathname = usePathname();
  const isActive =
    pathname === url ||
    pathname.startsWith(url + "/") ||
    (items && items.some((item) => pathname.startsWith(item.url)));

  const isSubItemActive = (subUrl: string) => pathname === subUrl;

  if (!access.some((role) => userRole === role)) {
    return null;
  }

  if (items) {
    return (
      <Collapsible
        key={title}
        asChild
        defaultOpen={isActive}
        className="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              tooltip={title}
              className={
                "group flex h-10 w-full [&>svg]:size-5   group-data-[collapsible=icon]:!pl-1.5   items-center gap-2 text-sm font-medium text-main-blue transition-all data-[active=true]:bg-dark-orange/20 "
              }
            >
              {icon}
              <span className="fon-semibold">{title}</span>
              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {items.map((subItem) => (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton
                    asChild
                    isActive={isSubItemActive(subItem.url)}
                    className={
                      "group flex h-10 w-full [&>svg]:size-5    items-center gap-2 text-sm font-medium text-main-blue transition-all data-[active=true]:bg-dark-orange/20 "
                    }
                  >
                    <Link href={subItem.url}>
                      <span>{subItem.title}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={{
          children: title,
        }}
        className={
          "group flex h-10 w-full [&>svg]:size-5   group-data-[collapsible=icon]:!pl-1.5   items-center gap-2 text-sm font-medium text-primary-foreground transition-all data-[active=true]:bg-primary "
        }
      >
        <Link prefetch={true} href={url}>
          {icon}
          <span>{title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
export default SidebarLink;
