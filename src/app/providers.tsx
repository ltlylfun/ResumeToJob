"use client";

import React, { useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./lib/redux/store";

// 创建一个内部组件来使用 hooks
const StoreInitializer = ({ children }: { children: React.ReactNode }) => {
  // 保存状态到本地存储
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      try {
        localStorage.setItem("reduxState", JSON.stringify(store.getState()));
      } catch (error) {
        console.error("Could not save state to localStorage", error);
      }
    });
    return unsubscribe;
  }, []);

  return <>{children}</>;
};

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <StoreInitializer>{children}</StoreInitializer>
    </Provider>
  );
};
