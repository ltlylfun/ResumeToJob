import "globals.css";
import { TopNavBar } from "components/TopNavBar";
import { Analytics } from "@vercel/analytics/react";
import { LanguageProvider } from "./i18n/LanguageContext";
import ClientLayout from "./ClientLayout";
import { getMetadata } from "./metadata";

// 默认使用中文元数据，客户端渲染后会根据用户设置或浏览器语言动态更新
export const metadata = getMetadata("zh");

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <LanguageProvider>
          <ClientLayout>
            <TopNavBar />
            {children}
            <Analytics />
          </ClientLayout>
        </LanguageProvider>
      </body>
    </html>
  );
}
