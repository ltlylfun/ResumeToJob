// filepath: c:\Users\z'j\Desktop\ResumeToJob\src\app\components\ResumeForm\Form\LexicalListEditor.tsx
import React, { useEffect, useRef } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ListItemNode, ListNode } from "@lexical/list";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import {
  MarkdownShortcutPlugin,
  DEFAULT_TRANSFORMERS,
} from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import { LinkNode, AutoLinkNode } from "@lexical/link";
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  EditorState,
} from "lexical";
import { InputGroupWrapper, INPUT_CLASS_NAME } from "./InputGroup";

// Lexical 节点配置 - 添加所有必要的节点类型
const LexicalNodes = [
  ListNode,
  ListItemNode,
  HorizontalRuleNode,
  HeadingNode,
  QuoteNode,
  CodeNode,
  CodeHighlightNode,
  LinkNode,
  AutoLinkNode,
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

// 从编辑器状态中提取内容，包括列表项
const extractContentFromEditor = (editorState: EditorState): string[] => {
  const result: string[] = [];

  editorState.read(() => {
    const root = $getRoot();
    const nodes = root.getChildren();

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
            const listItemContent = listItemNode.getTextContent().trim();

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
        const text = node.getTextContent().trim();
        if (text) {
          result.push(text);
        }
      }
    });
  });

  return result;
};

// 初始化编辑器内容的组件
function EditorInitializer<T extends string>({
  value = [],
}: {
  value: string[];
}) {
  const [editor] = useLexicalComposerContext();
  const isInitialized = useRef(false);

  useEffect(() => {
    // 只在首次渲染时初始化编辑器内容，避免无限循环
    if (!isInitialized.current) {
      isInitialized.current = true;

      editor.update(() => {
        const root = $getRoot();
        root.clear();

        // 如果没有内容，创建空段落
        if (value.length === 0) {
          root.append($createParagraphNode());
          return;
        }

        // 添加每一行内容，检查是否有列表标记
        value.forEach((text) => {
          // 检查文本是否以列表标记开始
          if (text.startsWith("• ")) {
            // 无序列表项
            const paragraph = $createParagraphNode();
            paragraph.append($createTextNode(text.substring(2))); // 移除列表标记
            root.append(paragraph);
          } else if (text.match(/^\d+\.\s/)) {
            // 有序列表项 (例如 "1. ")
            const paragraph = $createParagraphNode();
            paragraph.append($createTextNode(text.replace(/^\d+\.\s/, ""))); // 移除数字和点
            root.append(paragraph);
          } else {
            // 普通段落
            const paragraph = $createParagraphNode();
            if (text) {
              paragraph.append($createTextNode(text));
            }
            root.append(paragraph);
          }
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]); // 故意不添加 value 依赖，避免无限循环

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
          italic: "italic",
        },
      },
      nodes: LexicalNodes,
      onError: (error: Error) => {
        console.error(error);
      },
    }),
    [name]
  );

  // 处理内容变化
  const handleEditorChange = React.useCallback(
    (editorState: EditorState) => {
      const content = extractContentFromEditor(editorState);
      onChange(name, content);
    },
    [onChange, name]
  );

  return (
    <InputGroupWrapper label={label} className={labelClassName}>
      <div className={`${INPUT_CLASS_NAME} relative min-h-[100px]`}>
        <LexicalComposer initialConfig={editorConfig}>
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="min-h-[75px] py-2 outline-none" />
            }
            placeholder={
              value.length === 0 ? (
                <Placeholder placeholder={placeholder} />
              ) : null
            }
            ErrorBoundary={ErrorBoundary}
          />{" "}
          <ListPlugin />
          {/* 添加 Markdown 快捷方式支持，如: "- " 和 "1. " 自动转换为列表 */}
          <MarkdownShortcutPlugin transformers={DEFAULT_TRANSFORMERS} />
          <HistoryPlugin />
          <OnChangePlugin onChange={handleEditorChange} />
          <EditorInitializer value={value} />
        </LexicalComposer>
      </div>
    </InputGroupWrapper>
  );
};
