import React, { useEffect, useRef, useState } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  ListItemNode,
  ListNode,
  $createListItemNode,
  $createListNode,
} from "@lexical/list";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import {
  ORDERED_LIST,
  UNORDERED_LIST,
  BOLD_STAR,
  BOLD_UNDERSCORE,
} from "@lexical/markdown";
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  EditorState,
  $getSelection,
  $isRangeSelection,
  TextNode,
  ParagraphNode,
} from "lexical";
import { InputGroupWrapper, INPUT_CLASS_NAME } from "./InputGroup";
import { saveStateToLocalStorage } from "lib/redux/local-storage";
import { store } from "lib/redux/store";

// Lexical 节点配置 - 包含列表和文本格式化节点
const LexicalNodes = [ListNode, ListItemNode, TextNode, ParagraphNode];

// 自定义的Markdown转换器 - 包含列表和粗体转换器
const LIST_TRANSFORMERS = [
  ORDERED_LIST,
  UNORDERED_LIST,
  BOLD_STAR,
  BOLD_UNDERSCORE,
];

// 简单的错误边界函数
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

// 自定义占位符组件
function Placeholder({ placeholder }: { placeholder: string }) {
  return (
    <div className="pointer-events-none absolute left-[13px] top-[10px] text-gray-400">
      {placeholder}
    </div>
  );
}

interface ListEditorProps<T extends string> {
  label: string;
  labelClassName?: string;
  name: T;
  value?: string[];
  placeholder: string;
  onChange: (name: T, value: string[]) => void;
}

// 从编辑器状态中提取内容，包括列表项和格式化文本
const extractContentFromEditor = (editorState: EditorState): string[] => {
  const result: string[] = [];

  editorState.read(() => {
    const root = $getRoot();
    const nodes = root.getChildren();

    // 提取格式化文本的辅助函数
    const extractFormattedText = (node: any): string => {
      if (node.getType() === "text") {
        const textNode = node as TextNode;
        let text = textNode.getTextContent();

        // 如果文本是粗体，用 Markdown 语法包装
        if (textNode.hasFormat("bold")) {
          text = `**${text}**`;
        }

        return text;
      } else if (node.getChildren) {
        // 递归处理有子节点的节点
        const children = node.getChildren();
        return children.map(extractFormattedText).join("");
      }

      return node.getTextContent();
    };

    nodes.forEach((node) => {
      // 特殊处理列表节点
      if (node.getType() === "list") {
        // 这是一个列表节点
        const listNode = node as ListNode;
        const listItems = listNode.getChildren();

        // 遍历列表项
        listItems.forEach((listItemNode) => {
          if (listItemNode.getType() === "listitem") {
            // 对于列表项，添加适当的前缀（无序列表用"• "，有序列表用"1. "等）
            const isNumbered = listNode.getListType() === "number";
            const listItemContent = extractFormattedText(listItemNode).trim();

            if (listItemContent) {
              if (isNumbered) {
                // 对于有序列表，使用数字前缀
                result.push(`1. ${listItemContent}`);
              } else {
                // 对于无序列表，使用圆点前缀
                result.push(`• ${listItemContent}`);
              }
            }
          }
        });
      } else {
        // 普通段落节点
        const text = extractFormattedText(node).trim();
        if (text) {
          result.push(text);
        }
      }
    });
  });

  return result;
};

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

    // 添加粗体文本（不包含 Markdown 符号）
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
function EditorInitializer<T extends string>({
  value = [],
}: {
  value: string[];
}) {
  const [editor] = useLexicalComposerContext();
  const prevValueRef = useRef<string[]>([]);
  const isInitializedRef = useRef<boolean>(false);
  const isEditingRef = useRef<boolean>(false);

  // 监听编辑器焦点事件
  useEffect(() => {
    const unregisterFocus = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        // 如果有选择范围，说明用户正在编辑
        if ($isRangeSelection(selection) && selection.anchor.offset > 0) {
          isEditingRef.current = true;
        }
      });
    });

    return () => {
      unregisterFocus();
    };
  }, [editor]);

  useEffect(() => {
    // 避免在用户正在输入时更新内容
    if (isEditingRef.current) {
      // 只更新引用，不改变编辑器内容
      prevValueRef.current = [...value];
      return;
    }

    // 如果值相同或者已经初始化后(除非用户没有编辑)，则不更新
    const valueChanged =
      JSON.stringify(prevValueRef.current) !== JSON.stringify(value);
    if (!valueChanged) return;

    // 只在首次加载或明确需要重置编辑器时更新内容
    if (
      !isInitializedRef.current ||
      value.length === 0 ||
      prevValueRef.current.length === 0
    ) {
      isInitializedRef.current = true;
      prevValueRef.current = [...value];

      editor.update(() => {
        const root = $getRoot();
        root.clear();

        // 如果没有内容，创建空段落
        if (value.length === 0) {
          root.append($createParagraphNode());
          return;
        }

        // 处理列表项
        let currentList: any = null;
        let currentListType: "bullet" | "number" | null = null;

        // 添加每一行内容，检查是否有列表标记
        value.forEach((text) => {
          // 检查文本是否以列表标记开始
          if (text.startsWith("• ")) {
            // 无序列表项
            if (currentListType !== "bullet") {
              // 如果当前不是无序列表，创建新的无序列表
              currentList = $createListNode("bullet");
              currentListType = "bullet";
              root.append(currentList);
            }

            const listItemNode = $createListItemNode();
            const itemText = text.substring(2); // 移除 "• " 前缀
            const parsedNodes = parseMarkdownText(itemText);
            parsedNodes.forEach((node) => listItemNode.append(node));
            currentList.append(listItemNode);
          } else if (text.match(/^\d+\.\s/)) {
            // 有序列表项 (例如 "1. ")
            if (currentListType !== "number") {
              // 如果当前不是有序列表，创建新的有序列表
              currentList = $createListNode("number");
              currentListType = "number";
              root.append(currentList);
            }

            const listItemNode = $createListItemNode();
            const itemText = text.replace(/^\d+\.\s/, ""); // 移除数字前缀
            const parsedNodes = parseMarkdownText(itemText);
            parsedNodes.forEach((node) => listItemNode.append(node));
            currentList.append(listItemNode);
          } else {
            // 普通段落，结束当前列表
            currentList = null;
            currentListType = null;

            const paragraph = $createParagraphNode();
            if (text) {
              const parsedNodes = parseMarkdownText(text);
              parsedNodes.forEach((node) => paragraph.append(node));
            }
            root.append(paragraph);
          }
        });
      });
    } else {
      // 如果用户已经开始编辑，只静默更新引用
      prevValueRef.current = [...value];
    }
  }, [editor, value]); // 添加 value 作为依赖，确保编辑器内容根据 value 更新

  return null;
}

export const LexicalListEditor = <T extends string>({
  label,
  labelClassName,
  name,
  value = [],
  placeholder,
  onChange,
}: ListEditorProps<T>) => {
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
  // 避免编辑器每次渲染都重新创建
  const editorConfig = React.useMemo(
    () => ({
      namespace: `LexicalListEditor-${name}`,
      theme: {
        list: {
          ul: "list-disc ml-6",
          ol: "list-decimal ml-6",
          listitem: "ml-1",
        },
        text: {
          base: "text-base font-normal",
          bold: "font-bold",
        },
        paragraph: "my-0",
      },
      nodes: LexicalNodes,
      // 添加自动焦点恢复
      editorState: null,
      // 保留选区状态
      editable: true,
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
      const content = extractContentFromEditor(editorState);

      // 使用防抖延迟更新，以避免频繁的状态更新导致光标跳转
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        // 使用前后对比避免无意义的更新
        if (JSON.stringify(content) !== JSON.stringify(value)) {
          onChange(name, content);

          // 内容变化时立即保存到本地存储
          setTimeout(forceSaveToLocalStorage, 10);
        }
        debounceRef.current = null;
      }, 150); // 延迟150ms更新状态
    },
    [onChange, name, value]
  );
  return (
    <InputGroupWrapper label={label} className={labelClassName}>
      <div className={`${INPUT_CLASS_NAME} relative min-h-[100px]`}>
        <LexicalComposer
          key={`editor-${editorKey}`}
          initialConfig={editorConfig}
        >
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="min-h-[75px] py-2 outline-none [&_.font-bold]:font-bold [&_strong]:font-bold" />
            }
            placeholder={
              value.length === 0 ? (
                <Placeholder placeholder={placeholder} />
              ) : null
            }
            ErrorBoundary={ErrorBoundary}
          />
          <ListPlugin />
          {/* 添加 Markdown 快捷方式支持，如: "- " 和 "1. " 自动转换为列表，"**text**" 转换为粗体 */}
          {/* 包含列表和粗体相关的转换器 */}
          <MarkdownShortcutPlugin transformers={LIST_TRANSFORMERS} />
          <HistoryPlugin />
          <OnChangePlugin onChange={handleEditorChange} />
          <EditorInitializer value={value} />
        </LexicalComposer>
      </div>
    </InputGroupWrapper>
  );
};
