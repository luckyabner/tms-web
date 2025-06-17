import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import Header from "@/components/layout/Header";

export default function MainLayout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="flex-1 min-h-screen">
        <Header />
        <div className="flex-1">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
} 