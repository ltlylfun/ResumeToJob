import React, { useEffect, useState } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { ListItemNode, ListNode } from "@lexical/list";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  EditorState,
  LexicalEditor,
} from "lexical";
import { INPUT_CLASS_NAME } from "./InputGroup";

// 注册 Lexical 节点
const LexicalNodes = [ListNode, ListItemNode];

// 自定义 Placeholder 组件
function Placeholder({ placeholder }: { placeholder: string }) {
  return (
    <div className="pointer-events-none absolute left-[13px] top-[10px] text-gray-500">
      {placeholder}
    </div>
  );
}

// 错误边界组件
function LexicalErrorBoundary({ children }: { children: React.ReactNode }) {
  return <React.Fragment>{children}</React.Fragment>;
}

// 将字符串数组转换为 Lexical 编辑器内容
const setEditorContent = (editor: LexicalEditor, value: string[]) => {
  editor.update(() => {
    const root = $getRoot();
    // 清除现有内容
    root.clear();

    // 如果没有内容，添加一个空段落
    if (value.length === 0) {
      root.append($createParagraphNode());
      return;
    } // 添加内容 (这里只是简单实现，完整实现需要考虑列表节点的创建)
    value.forEach((line) => {
      const paragraph = $createParagraphNode();
      paragraph.append($createTextNode(line));
      root.append(paragraph);
    });
  });
};

// 从 Lexical 编辑器获取内容为字符串数组
function getContentFromEditor(editorState: EditorState): string[] {
  const content: string[] = [];

  editorState.read(() => {
    const root = $getRoot();
    root.getChildren().forEach((node) => {
      const textContent = node.getTextContent();
      if (textContent.trim()) {
        content.push(textContent);
      }
    });
  });

  return content;
}

interface LexicalEditorProps<K extends string> {
  label: string;
  labelClassName?: string;
  name: K;
  value?: string[];
  placeholder: string;
  onChange: (name: K, value: string[]) => void;
}

export const LexicalListEditor = <K extends string>({
  label,
  labelClassName,
  name,
  value = [],
  placeholder,
  onChange,
}: LexicalEditorProps<K>) => {
  // 编辑器初始配置
  const initialConfig = {
    namespace: "LexicalListEditor",
    theme: {
      text: {
        base: "text-base font-normal",
      },
      list: {
        ul: "list-disc pl-6",
        ol: "list-decimal pl-6",
      },
    },
    nodes: LexicalNodes,
    onError: (error: Error) => {
      console.error(error);
    },
  };

  // 编辑器改变时的回调
  const onEditorChange = (editorState: EditorState) => {
    const content = getContentFromEditor(editorState);
    onChange(name, content);
  };

  return (
    <label className={`text-base font-medium text-gray-700 ${labelClassName}`}>
      {label}
      <LexicalComposer initialConfig={initialConfig}>
        <div className={`${INPUT_CLASS_NAME} relative min-h-[100px]`}>
          {" "}
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="min-h-[75px] outline-none" />
            }
            placeholder={<Placeholder placeholder={placeholder} />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <ListPlugin />
          <OnChangePlugin onChange={onEditorChange} />
          <EditorInitializer value={value} />
        </div>
      </LexicalComposer>
    </label>
  );
};

// 用于初始化编辑器内容的组件
function EditorInitializer<K extends string>({ value }: { value: string[] }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    setEditorContent(editor, value);
  }, [editor, value]);

  return null;
}
