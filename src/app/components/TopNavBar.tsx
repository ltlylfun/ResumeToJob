"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import logoSrc from "public/logo-500.png";
import { cx } from "lib/cx";
import { useLanguageRedux } from "../lib/hooks/useLanguageRedux";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { DismissibleBanner } from "./DismissibleBanner";

export const TopNavBar = () => {
  const pathName = usePathname();
  const isHomePage = pathName === "/";
  const { language } = useLanguageRedux();
  const [menuOpen, setMenuOpen] = useState(false);

  // 本地翻译函数，替代全局翻译
  const translate = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      build: {
        en: "Create Resume",
        zh: "创建简历",
      },
      menu: {
        en: "Menu",
        zh: "菜单",
      },
      bugReport: {
        en: "Bug Report",
        zh: "反馈问题",
      },
      communityHelp: {
        en: "Community Help",
        zh: "寻求社区建议",
      },
      resetDefault: {
        en: "Reset Default",
        zh: "恢复默认",
      },
    };

    return translations[key]?.[language] || key;
  };

  // 处理bug反馈点击
  const handleBugReportClick = () => {
    const message =
      language === "zh"
        ? "如果发现bug或者你认为不好的地方，请在GitHub Issues中反馈问题。\n\n点击确定将跳转到GitHub Issues页面。"
        : "If you find bugs or things you think are not good, please report issues in GitHub Issues.\n\nClick OK to jump to the GitHub Issues page.";

    if (confirm(message)) {
      window.open("https://github.com/ltlylfun/ResumeToJob/issues", "_blank");
    }
  };

  // 处理社区建议点击
  const handleCommunityHelpClick = () => {
    const message =
      language === "zh"
        ? "你可以在GitHub Discussions中展示你的简历(不要忘记隐藏个人信息)，社区会提供帮助。\n\n点击确定将跳转到GitHub Discussions页面。"
        : "You can showcase your resume in GitHub Discussions (don't forget to hide personal information), and the community will provide help.\n\nClick OK to jump to the GitHub Discussions page.";

    if (confirm(message)) {
      window.open(
        "https://github.com/ltlylfun/ResumeToJob/discussions/categories/resume-help",
        "_blank",
      );
    }
  };

  // 处理恢复默认点击
  const handleResetDefaultClick = () => {
    const message =
      language === "zh"
        ? "是否要恢复默认，会删除所有信息，请做好备份。\n\n点击确定后将清除所有数据并刷新网页。"
        : "Are you sure you want to reset to default? This will delete all information, please make a backup.\n\nClick OK to clear all data and refresh the page.";

    if (confirm(message)) {
      localStorage.clear();
      window.location.reload();
    }
  };

  // 关闭移动端菜单
  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <DismissibleBanner />
      <header
        aria-label="Site Header"
        className={cx(
          "flex h-[var(--top-nav-bar-height)] items-center border-b-2 border-gray-100 px-3 lg:px-12",
          isHomePage && "bg-dot",
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
            <button
              onClick={handleBugReportClick}
              className="rounded-md px-1.5 py-2 text-gray-500 hover:bg-gray-100 focus-visible:bg-gray-100 lg:px-4"
            >
              {translate("bugReport")}
            </button>
            <button
              onClick={handleCommunityHelpClick}
              className="rounded-md px-1.5 py-2 text-gray-500 hover:bg-gray-100 focus-visible:bg-gray-100 lg:px-4"
            >
              {translate("communityHelp")}
            </button>
            <button
              onClick={handleResetDefaultClick}
              className="rounded-md px-1.5 py-2 text-red-500 hover:bg-red-50 focus-visible:bg-red-50 lg:px-4"
            >
              {translate("resetDefault")}
            </button>
            {[["/resume-builder", translate("build")]].map(([href, text]) => (
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
                <button
                  onClick={() => {
                    handleBugReportClick();
                    closeMenu();
                  }}
                  className="px-4 py-3 text-left text-gray-700 hover:bg-gray-100"
                >
                  {translate("bugReport")}
                </button>
                <button
                  onClick={() => {
                    handleCommunityHelpClick();
                    closeMenu();
                  }}
                  className="px-4 py-3 text-left text-gray-700 hover:bg-gray-100"
                >
                  {translate("communityHelp")}
                </button>
                <button
                  onClick={() => {
                    handleResetDefaultClick();
                    closeMenu();
                  }}
                  className="px-4 py-3 text-left text-red-600 hover:bg-red-50"
                >
                  {translate("resetDefault")}
                </button>
                {[["/resume-builder", translate("build")]].map(
                  ([href, text]) => (
                    <Link
                      key={text}
                      onClick={closeMenu}
                      className="px-4 py-3 text-gray-700 hover:bg-gray-100"
                      href={href}
                    >
                      {text}
                    </Link>
                  ),
                )}
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-gray-700">语言/Language</span>
                  <LanguageSwitcher />
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};
