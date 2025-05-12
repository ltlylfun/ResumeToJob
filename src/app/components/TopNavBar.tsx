"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import logoSrc from "public/logo-500.png";
import { cx } from "lib/cx";
import { useLanguage } from "../i18n/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";

export const TopNavBar = () => {
  const pathName = usePathname();
  const isHomePage = pathName === "/";
  const { language } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  // 本地翻译函数，替代全局翻译
  const translate = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      build: {
        en: "Build",
        zh: "构建",
      },
      parse: {
        en: "Parse",
        zh: "解析",
      },
      menu: {
        en: "Menu",
        zh: "菜单",
      },
    };

    return translations[key]?.[language] || key;
  };

  // 关闭移动端菜单
  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header
      aria-label="Site Header"
      className={cx(
        "flex h-[var(--top-nav-bar-height)] items-center border-b-2 border-gray-100 px-3 lg:px-12",
        isHomePage && "bg-dot"
      )}
    >
      <div className="flex h-10 w-full items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="sr-only">ResumeToJob</span>
          <img src={logoSrc.src} alt="Logo" className="h-8 w-auto" />
          <span className="text-lg font-semibold text-gray-800">
            ResumeToJob
          </span>
        </Link>

        {/* 桌面导航 */}
        <nav
          aria-label="Site Nav Bar"
          className="hidden items-center gap-2 text-sm font-medium md:flex"
        >
          {[
            ["/resume-builder", translate("build")],
            ["/resume-parser", translate("parse")],
          ].map(([href, text]) => (
            <Link
              key={text}
              className="rounded-md px-1.5 py-2 text-gray-500 hover:bg-gray-100 focus-visible:bg-gray-100 lg:px-4"
              href={href}
            >
              {text}
            </Link>
          ))}
          <LanguageSwitcher />{" "}
          <div className="ml-1 mt-1 hidden sm:block">
            <iframe
              src="https://ghbtns.com/github-btn.html?user=ltlylfun&repo=ResumeToJob&type=star&count=true"
              width="100"
              height="20"
              className="overflow-hidden border-none"
              title="GitHub"
            />
          </div>
        </nav>

        {/* 移动端菜单按钮 */}
        <button
          className="rounded-md p-2 hover:bg-gray-100 md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-6 w-6 text-gray-600"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* 移动端下拉菜单 */}
        {menuOpen && (
          <div className="absolute left-0 right-0 top-[var(--top-nav-bar-height)] z-50 bg-white shadow-lg md:hidden">
            <div className="flex flex-col py-2">
              {[
                ["/resume-builder", translate("build")],
                ["/resume-parser", translate("parse")],
              ].map(([href, text]) => (
                <Link
                  key={text}
                  onClick={closeMenu}
                  className="px-4 py-3 text-gray-700 hover:bg-gray-100"
                  href={href}
                >
                  {text}
                </Link>
              ))}
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-gray-700">语言/Language</span>
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
