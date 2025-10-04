import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { fetchSession, getAuthUser } from "@/lib/users";

async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getAuthUser()

  return (
    <SidebarProvider>
      <DashboardSidebar user={user} />
      <main className="w-full p-4 min-h-dvh overflow-y-auto flex-col flex gap-6">
        <DashboardNavbar user={user} />
        {children}
      </main>
    </SidebarProvider>
  );
}
export default DashboardLayout;
