"use client";
import { LogOut } from "lucide-react";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "nextjs-toploader/app";

function LogOutBtn() {
  const router = useRouter();
  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.replace("/sign-in"); // redirect to login page
        },
      },
    });
  };
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={handleLogout}
        tooltip={{
          children: "Sign Out",
        }}
        className={
          "group flex h-10 w-full [&>svg]:size-5 hover:bg-destructive/20 hover:text-destructive   group-data-[collapsible=icon]:!pl-1.5   items-center gap-2 text-sm font-medium text-destructive transition-all data-[active=true]:bg-destructive/20 "
        }
      >
        <LogOut />
        <span>Sign Out</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
export default LogOutBtn;
