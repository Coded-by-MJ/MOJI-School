import DashboardNavbar from "@/components/dashboard/DashboardNavbar";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="w-full p-4 min-h-dvh overflow-y-auto flex-col flex gap-6">
        <DashboardNavbar />
        {children}
      </main>
    </SidebarProvider>
  );
}
export default DashboardLayout;
