import "globals.css";
import { TopNavBar } from "components/TopNavBar";
import { Analytics } from "@vercel/analytics/react";

export const metadata = {
  title: "ResumeToJob - 免费开源简历生成器和解析器",
  description:
    "ResumeToJob是一个免费、开源且功能强大的简历生成器，允许任何人通过3个简单步骤创建现代专业简历。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <TopNavBar />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
