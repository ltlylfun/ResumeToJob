import { configureStore } from "@reduxjs/toolkit";
import resumeReducer from "lib/redux/resumeSlice";
import settingsReducer from "lib/redux/settingsSlice";
import languageReducer from "lib/redux/languageSlice";

export const store = configureStore({
  reducer: {
    resume: resumeReducer,
    settings: settingsReducer,
    language: languageReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
