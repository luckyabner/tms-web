import { AppSidebar } from "@/components/layout/AppSidebar";
import Header from "@/components/layout/Header";
import SWRProvider from "@/components/providers/SWRProvider";
import { SidebarProvider } from "@/components/ui/sidebar";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>
        <SWRProvider>{children}</SWRProvider>
      </body>
    </html>
  );
}
