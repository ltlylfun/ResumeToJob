import React, { useEffect, useRef, useState } from "react";
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
  LexicalEditor,
} from "lexical";
import { InputGroupWrapper, INPUT_CLASS_NAME } from "./InputGroup";
import { saveStateToLocalStorage } from "lib/redux/local-storage";
import { store } from "lib/redux/store";

// 简单的错误边界函数
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

// 自定义占位符组件
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

// 手动保存状态到本地储存
const forceSaveToLocalStorage = () => {
  saveStateToLocalStorage(store.getState());
};

// 初始化编辑器内容的组件
function EditorInitializer<K extends string>({
  value = "",
}: {
  value: string;
}) {
  const [editor] = useLexicalComposerContext();
  const prevValueRef = useRef<string>("");
  const isInitializedRef = useRef<boolean>(false);
  const isEditingRef = useRef<boolean>(false);

  // 监听编辑器焦点事件
  useEffect(() => {
    const unregisterListener = editor.registerUpdateListener(() => {
      // 检测用户是否正在编辑
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
    // 避免在用户正在输入时更新内容
    if (isEditingRef.current) {
      // 只更新引用，不改变编辑器内容
      prevValueRef.current = value;
      return;
    }

    // 如果值相同或者已经初始化后(除非用户没有编辑)，则不更新
    if (prevValueRef.current === value) return;

    // 只在首次加载或明确需要重置编辑器时更新内容
    if (!isInitializedRef.current || value === "") {
      isInitializedRef.current = true;
      prevValueRef.current = value;

      editor.update(() => {
        const root = $getRoot();
        root.clear();

        // 创建段落节点
        const paragraph = $createParagraphNode();

        // 如果有值，添加文本
        if (value) {
          paragraph.append($createTextNode(value));
        }

        root.append(paragraph);
      });
    } else {
      // 如果用户已经开始编辑，只静默更新引用
      prevValueRef.current = value;
    }
  }, [editor, value]); // 添加 value 作为依赖，确保编辑器内容根据 value 更新

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
  // 使用一个键来重新初始化编辑器
  const [editorKey, setEditorKey] = useState(0);

  // 完全重载编辑器的函数
  const reloadEditor = () => {
    setEditorKey((prev) => prev + 1);
  };

  // 监听窗口聚焦事件，当用户重新进入页面时刷新编辑器
  useEffect(() => {
    const handleFocus = () => {
      reloadEditor();
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);

      // 在组件卸载时确保状态被保存
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
    [name]
  );

  // 防抖函数
  const debounceRef = useRef<any>(null);

  // 处理内容变化
  const handleEditorChange = React.useCallback(
    (editorState: EditorState) => {
      let newContent = "";

      editorState.read(() => {
        const root = $getRoot();
        newContent = root.getTextContent();
      });

      // 使用防抖延迟更新，以避免频繁的状态更新导致光标跳转
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        // 避免无意义的更新
        if (newContent !== value) {
          onChange(name, newContent);

          // 内容变化时立即保存到本地存储
          setTimeout(forceSaveToLocalStorage, 10);
        }
        debounceRef.current = null;
      }, 100); // 延迟100ms更新状态
    },
    [onChange, name, value]
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
