import React, { useEffect, useRef, useState } from "react";
import { useAppSelector } from "lib/redux/hooks";
import { selectCurrentResumeId } from "lib/redux/resumeManagerSlice";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ListItemNode, ListNode } from "@lexical/list";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import {
  ORDERED_LIST,
  UNORDERED_LIST,
  BOLD_STAR,
  BOLD_UNDERSCORE,
  $convertToMarkdownString,
} from "@lexical/markdown";
import {
  $createParagraphNode,
  $getRoot,
  EditorState,
  $getSelection,
  $isRangeSelection,
  TextNode,
  ParagraphNode,
  $createTextNode,
} from "lexical";
import { $createListNode, $createListItemNode } from "@lexical/list";
import { InputGroupWrapper, INPUT_CLASS_NAME } from "./InputGroup";
import { saveStateToLocalStorage } from "lib/redux/local-storage";
import { store } from "lib/redux/store";

const LexicalNodes = [ListNode, ListItemNode, TextNode, ParagraphNode];

const LIST_TRANSFORMERS = [
  ORDERED_LIST,
  UNORDERED_LIST,
  BOLD_STAR,
  BOLD_UNDERSCORE,
];

function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

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

const extractContentFromEditor = (editorState: EditorState): string[] => {
  return editorState.read(() => {
    const markdown = $convertToMarkdownString(LIST_TRANSFORMERS);

    return markdown
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => {
        const trimmedLine = line.trim();

        if (/^\d+\.\s/.test(trimmedLine)) {
          return trimmedLine;
        } else if (/^[-*]\s/.test(trimmedLine)) {
          return trimmedLine.replace(/^[-*]\s/, "• ");
        } else {
          return trimmedLine;
        }
      });
  });
};

const forceSaveToLocalStorage = () => {
  saveStateToLocalStorage(store.getState());
};

function EditorInitializer({ value = [] }: { value: string[] }) {
  const [editor] = useLexicalComposerContext();
  const prevValueRef = useRef<string[]>([]);
  const isInitializedRef = useRef<boolean>(false);
  const isEditingRef = useRef<boolean>(false);

  useEffect(() => {
    const unregisterFocus = editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
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
    if (isEditingRef.current) {
      prevValueRef.current = [...value];
      return;
    }

    const valueChanged =
      JSON.stringify(prevValueRef.current) !== JSON.stringify(value);
    if (!valueChanged) return;

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

        if (value.length === 0) {
          root.append($createParagraphNode());
          return;
        }

        const groups: Array<{
          type: "paragraph" | "bullet" | "number";
          items: string[];
          startNumber?: number;
        }> = [];

        value.forEach((item) => {
          const trimmedItem = item.trim();

          const isBulletList = /^[•\-\*]\s/.test(trimmedItem);
          const isNumberedList = /^\d+\.\s/.test(trimmedItem);

          if (isBulletList) {
            const lastGroup = groups[groups.length - 1];
            if (lastGroup && lastGroup.type === "bullet") {
              lastGroup.items.push(trimmedItem);
            } else {
              groups.push({ type: "bullet", items: [trimmedItem] });
            }
          } else if (isNumberedList) {
            const numberMatch = trimmedItem.match(/^(\d+)\.\s/);
            const currentNumber = numberMatch
              ? parseInt(numberMatch[1], 10)
              : 1;

            const lastGroup = groups[groups.length - 1];
            if (lastGroup && lastGroup.type === "number") {
              lastGroup.items.push(trimmedItem);
            } else {
              groups.push({
                type: "number",
                items: [trimmedItem],
                startNumber: currentNumber,
              });
            }
          } else {
            groups.push({ type: "paragraph", items: [trimmedItem] });
          }
        });

        groups.forEach((group) => {
          if (group.type === "paragraph") {
            group.items.forEach((item) => {
              const paragraphNode = $createParagraphNode();
              paragraphNode.append($createTextNode(item));
              root.append(paragraphNode);
            });
          } else {
            const listNode = $createListNode(group.type);
            if (group.type === "number" && group.startNumber) {
              listNode.setStart(group.startNumber);
            }

            group.items.forEach((item) => {
              const textContent = item
                .replace(/^[•\-\*]\s/, "")
                .replace(/^\d+\.\s/, "")
                .trim();

              const listItemNode = $createListItemNode();
              listItemNode.append($createTextNode(textContent));
              listNode.append(listItemNode);
            });

            root.append(listNode);
          }
        });
      });
    } else {
      prevValueRef.current = [...value];
    }
  }, [editor, value]);

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
  const [editorKey, setEditorKey] = useState(0);
  const currentResumeId = useAppSelector(selectCurrentResumeId);

  const reloadEditor = () => {
    setEditorKey((prev) => prev + 1);
  };

  useEffect(() => {
    reloadEditor();
  }, [currentResumeId]);

  useEffect(() => {
    return () => {
      forceSaveToLocalStorage();
    };
  }, []);

  const editorConfig = React.useMemo(
    () => ({
      namespace: `LexicalListEditor-${name}`,
      theme: {
        list: {
          ul: "list-disc ml-6 pl-0",
          ol: "list-decimal ml-6 pl-0",
          listitem: "ml-1 pl-0",
        },
        text: {
          base: "text-base font-normal",
          bold: "font-bold",
        },
        paragraph: "my-0",
      },
      nodes: LexicalNodes,

      editorState: null,

      editable: true,
      onError: (error: Error) => {
        console.error(error);
      },
    }),
    [name],
  );

  const debounceRef = useRef<any>(null);

  const handleEditorChange = React.useCallback(
    (editorState: EditorState) => {
      const content = extractContentFromEditor(editorState);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        if (JSON.stringify(content) !== JSON.stringify(value)) {
          onChange(name, content);

          setTimeout(forceSaveToLocalStorage, 10);
        }
        debounceRef.current = null;
      }, 150);
    },
    [onChange, name, value],
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
              <ContentEditable className="min-h-[75px] py-2 outline-none [&_.font-bold]:font-bold [&_ol]:list-decimal [&_strong]:font-bold [&_ul]:list-disc" />
            }
            placeholder={
              value.length === 0 ? (
                <Placeholder placeholder={placeholder} />
              ) : null
            }
            ErrorBoundary={ErrorBoundary}
          />
          <ListPlugin />

          <MarkdownShortcutPlugin transformers={LIST_TRANSFORMERS} />
          <HistoryPlugin />
          <OnChangePlugin onChange={handleEditorChange} />
          <EditorInitializer value={value} />
        </LexicalComposer>
      </div>
    </InputGroupWrapper>
  );
};
