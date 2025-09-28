import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import SidebarLink from "./SidebarLink";
import { sidebarMenuLinks, sidebarOtherLinks } from "./Links";
// import { LogoSvg } from "@/components/global/Logo";

import Link from "next/link";
import { UserRole } from "@/types";

type Props = {
  //   user: AuthUserType;
};

function DashboardSidebar({}: Props) {
  //   const userRole = user.role;
  const userRole: UserRole = "admin";
  return (
    <Sidebar collapsible="icon" className="border-main-blue/50 bg-white!">
      <SidebarHeader className="px-0 py-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:pl-1! hover:bg-transparent group-data-[collapsible=icon]:size-12! h-12 items-center flex "
            >
              <Link href="/">
                {/* <LogoSvg className="size-[38px]!" /> */}
                <p className="text-sm normal-case font-bold">MOJI SCHOOL</p>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="flex-1  p-0">
          <SidebarGroupLabel className="text-sm uppercase font-semibold">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent className="p-2">
            <SidebarMenu className="gap-2">
              {sidebarMenuLinks.map((link) => {
                return (
                  <SidebarLink
                    key={link.title}
                    link={link}
                    userRole={userRole}
                  />
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarContent className="flex-none my-4">
        <SidebarGroup className="p-0">
          <SidebarGroupLabel className="text-sm uppercase font-semibold">
            Toggle Sidebar
          </SidebarGroupLabel>
          <SidebarGroupContent className="p-2 ">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip={{
                    children: "Toggle Sidebar",
                  }}
                  className={
                    "group flex h-10 w-full [&_svg]:size-5!   group-data-[collapsible=icon]:!pl-1.5   items-center justify-start gap-2 text-sm font-medium text-main-blue transition-all data-[active=true]:bg-dark-orange/20 "
                  }
                >
                  <SidebarTrigger />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-0">
        <SidebarContent>
          <SidebarGroup className="flex-1  p-0">
            <SidebarGroupLabel className="text-sm uppercase font-semibold">
              Other
            </SidebarGroupLabel>
            <SidebarGroupContent className="p-2">
              <SidebarMenu>
                {sidebarOtherLinks.map((link) => {
                  return (
                    <SidebarLink
                      key={link.title}
                      link={link}
                      userRole={userRole}
                    />
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </SidebarFooter>
    </Sidebar>
  );
}
export default DashboardSidebar;
