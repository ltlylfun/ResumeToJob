import React, { useEffect, useRef, useState } from "react";
import { useAppSelector } from "lib/redux/hooks";
import { selectCurrentResumeId } from "lib/redux/resumeManagerSlice";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  EditorState,
} from "lexical";
import { InputGroupWrapper, INPUT_CLASS_NAME } from "./InputGroup";
import { saveStateToLocalStorage } from "lib/redux/local-storage";
import { store } from "lib/redux/store";

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function Placeholder({ placeholder }: { placeholder: string }) {
  return (
    <div className="pointer-events-none absolute left-[13px] top-1/2 -translate-y-1/2 text-gray-400">
      {placeholder}
    </div>
  );
}

interface LexicalPlainEditorProps<K extends string> {
  label: string;
  labelClassName?: string;
  name: K;
  value?: string;
  placeholder: string;
  minHeight?: string;
  onChange: (name: K, value: string) => void;
  autoResizable?: boolean;
}

const forceSaveToLocalStorage = () => {
  saveStateToLocalStorage(store.getState());
};

function EditorInitializer<K extends string>({
  value = "",
}: {
  value: string;
}) {
  const [editor] = useLexicalComposerContext();
  const prevValueRef = useRef<string>("");
  const isInitializedRef = useRef<boolean>(false);
  const isEditingRef = useRef<boolean>(false);

  useEffect(() => {
    const unregisterListener = editor.registerUpdateListener(() => {
      if (
        editor.isEditable() &&
        document.activeElement === editor.getRootElement()
      ) {
        isEditingRef.current = true;
      }
    });

    return () => {
      unregisterListener();
    };
  }, [editor]);

  useEffect(() => {
    if (isEditingRef.current) {
      prevValueRef.current = value;
      return;
    }

    if (prevValueRef.current === value) return;

    if (!isInitializedRef.current || value === "") {
      isInitializedRef.current = true;
      prevValueRef.current = value;

      editor.update(() => {
        const root = $getRoot();
        root.clear();

        const paragraph = $createParagraphNode();

        if (value) {
          paragraph.append($createTextNode(value));
        }

        root.append(paragraph);
      });
    } else {
      prevValueRef.current = value;
    }
  }, [editor, value]);

  return null;
}

export const LexicalPlainEditor = <K extends string>({
  label,
  labelClassName,
  name,
  value = "",
  placeholder,
  minHeight = "38px",
  onChange,
  autoResizable = false,
}: LexicalPlainEditorProps<K>) => {
  const [editorKey, setEditorKey] = useState(0);
  const currentResumeId = useAppSelector(selectCurrentResumeId);

  const reloadEditor = () => {
    setEditorKey((prev) => prev + 1);
  };

  useEffect(() => {
    reloadEditor();
  }, [currentResumeId]);

  useEffect(() => {
    const handleFocus = () => {
      reloadEditor();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);

      forceSaveToLocalStorage();
    };
  }, []);

  const editorConfig = React.useMemo(
    () => ({
      namespace: `LexicalPlainEditor-${name}`,
      theme: {
        text: {
          base: "text-base font-normal",
        },
      },
      onError: (error: Error) => {
        console.error(error);
      },
    }),
    [name],
  );

  const debounceRef = useRef<any>(null);

  const handleEditorChange = React.useCallback(
    (editorState: EditorState) => {
      let newContent = "";

      editorState.read(() => {
        const root = $getRoot();
        newContent = root.getTextContent();
      });

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        if (newContent !== value) {
          onChange(name, newContent);

          setTimeout(forceSaveToLocalStorage, 10);
        }
        debounceRef.current = null;
      }, 100);
    },
    [onChange, name, value],
  );

  return (
    <InputGroupWrapper label={label} className={labelClassName}>
      <div
        className={`${INPUT_CLASS_NAME} relative ${
          autoResizable ? "resize-y overflow-hidden" : ""
        }`}
        style={{ minHeight }}
      >
        <LexicalComposer
          key={`editor-${editorKey}`}
          initialConfig={editorConfig}
        >
          <PlainTextPlugin
            contentEditable={
              <ContentEditable className="min-h-[30px] py-[5px] outline-none" />
            }
            placeholder={
              value === "" ? <Placeholder placeholder={placeholder} /> : null
            }
            ErrorBoundary={ErrorBoundary}
          />
          <OnChangePlugin onChange={handleEditorChange} />
          <EditorInitializer value={value} />
        </LexicalComposer>
      </div>
    </InputGroupWrapper>
  );
};
