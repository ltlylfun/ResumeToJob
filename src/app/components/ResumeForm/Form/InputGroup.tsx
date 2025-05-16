interface InputProps<K extends string, V extends string | string[]> {
  label: string;
  labelClassName?: string;
  // name is passed in as a const string. Therefore, we make it a generic type so its type can
  // be more restricted as a const for the first argument in onChange
  name: K;
  value?: V;
  placeholder: string;
  onChange: (name: K, value: V) => void;
}

/**
 * InputGroupWrapper wraps a label element around a input children. This is preferable
 * than having input as a sibling since it makes clicking label auto focus input children
 */
export const InputGroupWrapper = ({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children?: React.ReactNode;
}) => (
  <label className={`text-base font-medium text-gray-700 ${className}`}>
    {label}
    {children}
  </label>
);

export const INPUT_CLASS_NAME =
  "mt-1 px-3 py-2 block w-full rounded-md border border-gray-300 text-gray-900 shadow-sm outline-none font-normal text-base";

// 导入 Lexical 编辑器
import { LexicalListEditor } from "./LexicalListEditor";
import { LexicalPlainEditor } from "./LexicalPlainEditor";

// 使用 Lexical 编辑器替换原有的 Input 组件
export const Input = <K extends string>({
  name,
  value = "",
  placeholder,
  onChange,
  label,
  labelClassName,
}: InputProps<K, string>) => {
  return (
    <LexicalPlainEditor
      label={label}
      labelClassName={labelClassName}
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      minHeight="40px"
    />
  );
};

// 使用 Lexical 编辑器替换原有的 Textarea 组件
export const Textarea = <T extends string>({
  label,
  labelClassName: wrapperClassName,
  name,
  value = "",
  placeholder,
  onChange,
}: InputProps<T, string>) => {
  return (
    <LexicalPlainEditor
      label={label}
      labelClassName={wrapperClassName}
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      minHeight="100px"
      autoResizable={true}
    />
  );
};

export const BulletListTextarea = <T extends string>(
  props: InputProps<T, string[]>
) => {
  // 使用 Lexical 编辑器替换原有实现，支持 Markdown 快捷方式
  // 在编辑器中输入 "- " 或 "* " 会自动转换为无序列表
  // 输入 "1. " 会自动转换为有序列表
  return (
    <LexicalListEditor
      label={props.label}
      labelClassName={props.labelClassName}
      name={props.name}
      value={props.value}
      placeholder={props.placeholder}
      onChange={props.onChange}
    />
  );
};
