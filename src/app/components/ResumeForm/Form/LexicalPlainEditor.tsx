import React, { useEffect, useRef, useState } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  EditorState,
  TextNode,
  $getSelection,
  $isRangeSelection,
} from "lexical";
import { BOLD_STAR, BOLD_UNDERSCORE } from "@lexical/markdown";
import { InputGroupWrapper, INPUT_CLASS_NAME } from "./InputGroup";
import { saveStateToLocalStorage } from "lib/redux/local-storage";
import { store } from "lib/redux/store";

// Lexical 节点配置 - 支持文本格式化
const LexicalNodes = [TextNode];

// Markdown 转换器 - 仅支持粗体
const MARKDOWN_TRANSFORMERS = [BOLD_STAR, BOLD_UNDERSCORE];

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

// 解析Markdown文本并创建相应的Lexical节点
function parseMarkdownText(text: string): any[] {
  const nodes: any[] = [];

  // 简单的Markdown解析器，支持 **bold** 和 __bold__ 语法
  const regex = /(\*\*([^*]+)\*\*|__([^_]+)__)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // 添加粗体前的普通文本
    if (match.index > lastIndex) {
      const normalText = text.substring(lastIndex, match.index);
      if (normalText) {
        nodes.push($createTextNode(normalText));
      }
    }

    // 添加粗体文本
    const boldText = match[2] || match[3]; // match[2] 是 **text**, match[3] 是 __text__
    if (boldText) {
      const boldNode = $createTextNode(boldText);
      boldNode.setFormat("bold");
      nodes.push(boldNode);
    }

    lastIndex = regex.lastIndex;
  }

  // 添加剩余的普通文本
  if (lastIndex < text.length) {
    const remainingText = text.substring(lastIndex);
    if (remainingText) {
      nodes.push($createTextNode(remainingText));
    }
  }

  // 如果没有匹配到任何Markdown，返回原始文本
  if (nodes.length === 0) {
    nodes.push($createTextNode(text));
  }

  return nodes;
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

        // 如果有值，解析Markdown并添加格式化文本
        if (value) {
          const parsedNodes = parseMarkdownText(value);
          parsedNodes.forEach((node) => paragraph.append(node));
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
          bold: "font-bold",
        },
      },
      nodes: LexicalNodes,
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

        // 提取富文本内容，保留 Markdown 格式
        const extractFormattedText = (node: any): string => {
          if (node.getType() === "text") {
            const textNode = node as TextNode;
            let text = textNode.getTextContent();

            // 如果文本是粗体，用 Markdown 语法包装
            if (textNode.hasFormat("bold")) {
              text = `**${text}**`;
            }

            return text;
          } else if (node.getType() === "paragraph") {
            const children = node.getChildren();
            return children.map(extractFormattedText).join("");
          }

          return node.getTextContent();
        };

        const nodes = root.getChildren();
        const formattedTexts = nodes.map(extractFormattedText);
        newContent = formattedTexts.join("\n").trim();
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
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="min-h-[30px] py-[5px] outline-none" />
            }
            placeholder={
              value === "" ? <Placeholder placeholder={placeholder} /> : null
            }
            ErrorBoundary={ErrorBoundary}
          />
          <MarkdownShortcutPlugin transformers={MARKDOWN_TRANSFORMERS} />
          <HistoryPlugin />
          <OnChangePlugin onChange={handleEditorChange} />
          <EditorInitializer value={value} />
        </LexicalComposer>
      </div>
    </InputGroupWrapper>
  );
};
