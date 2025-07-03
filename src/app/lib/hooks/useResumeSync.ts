import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectResume } from "lib/redux/resumeManagerSlice";
import {
  selectCurrentResumeId,
  updateResumeContent,
} from "lib/redux/resumeManagerSlice";
import type { AppDispatch } from "lib/redux/store";

export const useResumeSync = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentResumeContent = useSelector(selectResume);
  const currentResumeId = useSelector(selectCurrentResumeId);

  useEffect(() => {
    if (currentResumeId && currentResumeContent) {
      const timeoutId = setTimeout(() => {
        dispatch(
          updateResumeContent({
            id: currentResumeId,
            content: currentResumeContent,
          }),
        );
      }, 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [currentResumeContent, currentResumeId, dispatch]);
};
