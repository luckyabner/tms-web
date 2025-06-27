import { AppSidebar } from "@/components/layout/AppSidebar";
import Header from "@/components/layout/Header";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="min-h-screen flex-1">
        <Header />
        <div className="flex-1">{children}</div>
      </main>
    </SidebarProvider>
  );
}
