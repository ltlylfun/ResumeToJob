import { configureStore } from "@reduxjs/toolkit";
import settingsReducer from "lib/redux/settingsSlice";
import languageReducer from "lib/redux/languageSlice";
import resumeManagerReducer from "lib/redux/resumeManagerSlice";

export const store = configureStore({
  reducer: {
    settings: settingsReducer,
    language: languageReducer,
    resumeManager: resumeManagerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
