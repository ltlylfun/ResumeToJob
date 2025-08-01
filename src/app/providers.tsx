"use client";

import React from "react";
import { Provider } from "react-redux";
import { store } from "./lib/redux/store";
import {
  useSaveStateToLocalStorageOnChange,
  useSetInitialStore,
} from "./lib/redux/hooks";

const StoreInitializer = ({ children }: { children: React.ReactNode }) => {
  useSetInitialStore();

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
