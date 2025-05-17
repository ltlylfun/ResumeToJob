"use client";
import { useEffect } from "react";
import { useLanguageRedux } from "./lib/hooks/useLanguageRedux";
import { DynamicMetadata } from "./components/DynamicMetadata";
import { LocalStorageDebugger } from "./components/LocalStorageDebugger";
import { initializeLanguage } from "./lib/redux/languageSlice";
import { useAppDispatch } from "./lib/redux/hooks";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { language } = useLanguageRedux();
  const dispatch = useAppDispatch();

  // 初始化语言设置
  useEffect(() => {
    dispatch(initializeLanguage());
  }, [dispatch]);

  // 注：无需手动更新 HTML lang 属性，languageSlice 中会自动处理
  return (
    <>
      <DynamicMetadata />
      {children}
      <LocalStorageDebugger />
    </>
  );
}
