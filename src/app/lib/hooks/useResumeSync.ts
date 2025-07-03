import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { selectResume } from "lib/redux/resumeManagerSlice";
import {
  selectCurrentResumeId,
  updateResumeContent,
} from "lib/redux/resumeManagerSlice";

export const useResumeSync = () => {
  const dispatch = useAppDispatch();
  const currentResumeContent = useAppSelector(selectResume);
  const currentResumeId = useAppSelector(selectCurrentResumeId);

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
