interface InputProps<K extends string, V extends string | string[]> {
  label: string;
  labelClassName?: string;
  name: K;
  value?: V;
  placeholder: string;
  onChange: (name: K, value: V) => void;
}

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

import { LexicalListEditor } from "./LexicalListEditor";
import { LexicalPlainEditor } from "./LexicalPlainEditor";

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
  props: InputProps<T, string[]>,
) => {
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
