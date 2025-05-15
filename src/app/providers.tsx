"use client";

import React from "react";
import { Provider } from "react-redux";
import { store } from "./lib/redux/store";
import { useSaveStateToLocalStorageOnChange } from "./lib/redux/hooks";

// 创建一个内部组件来使用 hooks
const StoreInitializer = ({ children }: { children: React.ReactNode }) => {
  // 使用自定义hook处理状态保存到localStorage
  useSaveStateToLocalStorageOnChange();
  return <>{children}</>;
};

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <StoreInitializer>{children}</StoreInitializer>
    </Provider>
  );
};
