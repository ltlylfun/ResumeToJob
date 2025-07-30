export const FlexboxSpacer = ({
  maxWidth,
  minWidth = 0,
  className = "",
}: {
  maxWidth: number;
  minWidth?: number;
  className?: string;
}) => (
  <div
    className={`invisible shrink-[10000] grow ${className}`}
    style={{ maxWidth: `${maxWidth}px`, minWidth: `${minWidth}px` }}
  />
);
