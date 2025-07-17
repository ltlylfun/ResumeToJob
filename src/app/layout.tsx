import "globals.css";
import { TopNavBar } from "components/TopNavBar";
import { Footer } from "components/Footer";
import { Analytics } from "@vercel/analytics/react";
import { Providers } from "./providers";
import ClientLayout from "./ClientLayout";
import { getMetadata } from "./metadata";

// 使用中英文双语元数据
export const metadata = getMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="flex min-h-screen flex-col">
        <Providers>
          <ClientLayout>
            <TopNavBar />
            <div className="flex-1">{children}</div>
            <Footer />
            <Analytics />
          </ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
