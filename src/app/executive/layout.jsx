import { SidebarProvider } from "@/components/ui/sidebar";
import { AppExecutiveSidebar } from "@/components/layout/AppExecutiveSidebar";
import Header from "@/components/layout/Header";

export default function ExecutiveLayout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex">
        <AppExecutiveSidebar />
        <main className="flex-1 min-h-screen">
          <Header />
          <div className="flex-1">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
} 