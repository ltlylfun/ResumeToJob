import "globals.css";
import { TopNavBar } from "components/TopNavBar";
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
      <body>
        <Providers>
          <ClientLayout>
            <TopNavBar />
            {children}
            <Analytics />
          </ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
