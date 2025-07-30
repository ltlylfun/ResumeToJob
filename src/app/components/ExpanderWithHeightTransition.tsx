export const ExpanderWithHeightTransition = ({
  expanded,
  children,
}: {
  expanded: boolean;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={`grid overflow-hidden transition-all duration-300 ${
        expanded ? "visible" : "invisible"
      }`}
      style={{ gridTemplateRows: expanded ? "1fr" : "0fr" }}
    >
      <div className="min-h-0">{children}</div>
    </div>
  );
};
