import { useEffect, useRef } from "react";

export const useAutosizeTextareaHeight = ({ value }: { value: string }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resizeHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "0px";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    resizeHeight();
  }, [value]);

  useEffect(() => {
    window.addEventListener("resize", resizeHeight);
    return () => window.removeEventListener("resize", resizeHeight);
  }, []);

  return textareaRef;
};
