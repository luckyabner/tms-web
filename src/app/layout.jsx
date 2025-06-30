import SWRProvider from "@/components/providers/SWRProvider";
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
