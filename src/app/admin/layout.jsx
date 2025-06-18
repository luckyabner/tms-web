import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppAdminSidebar } from "@/components/layout/AppAdminSidebar";
import Header from "@/components/layout/Header";

export default function AdminLayout({ children }) {
  return (
    <SidebarProvider>
      <AppAdminSidebar />
      <main className="flex-1 min-h-screen">
        <Header />
        <div className="flex-1">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
} 