"use client";
import { useEffect } from "react";
import { initializeLanguage } from "./lib/redux/languageSlice";
import { useAppDispatch } from "./lib/redux/hooks";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initializeLanguage());
  }, [dispatch]);
  return <>{children}</>;
}
