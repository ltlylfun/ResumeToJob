import { Text, View, Link } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import { DEBUG_RESUME_PDF_FLAG } from "lib/constants";
import { DEFAULT_FONT_COLOR } from "lib/redux/settingsSlice";

// 解析Markdown粗体语法并返回格式化的文本节点
const parseMarkdownBold = (text: string) => {
  const parts = [];
  // 支持 **bold** 和 __bold__ 语法
  const regex = /(\*\*([^*]+)\*\*|__([^_]+)__)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // 添加粗体前的普通文本
    if (match.index > lastIndex) {
      const normalText = text.substring(lastIndex, match.index);
      if (normalText) {
        parts.push(
          <Text key={`normal-${lastIndex}`} debug={DEBUG_RESUME_PDF_FLAG}>
            {normalText}
          </Text>
        );
      }
    }

    // 添加粗体文本
    const boldText = match[2] || match[3]; // match[2] 是 **text**, match[3] 是 __text__
    if (boldText) {
      parts.push(
        <Text
          key={`bold-${match.index}`}
          style={{ fontWeight: "bold" }}
          debug={DEBUG_RESUME_PDF_FLAG}
        >
          {boldText}
        </Text>
      );
    }

    lastIndex = regex.lastIndex;
  }

  // 添加剩余的普通文本
  if (lastIndex < text.length) {
    const remainingText = text.substring(lastIndex);
    if (remainingText) {
      parts.push(
        <Text key={`remaining-${lastIndex}`} debug={DEBUG_RESUME_PDF_FLAG}>
          {remainingText}
        </Text>
      );
    }
  }

  // 如果没有匹配到任何Markdown，返回原始文本
  if (parts.length === 0) {
    parts.push(
      <Text key="default" debug={DEBUG_RESUME_PDF_FLAG}>
        {text}
      </Text>
    );
  }

  return parts;
};

export const ResumePDFSection = ({
  themeColor,
  heading,
  style = {},
  titleStyle = {},
  children,
}: {
  themeColor?: string;
  heading?: string;
  style?: Style;
  titleStyle?: Style;
  children: React.ReactNode;
}) => (
  <View
    style={{
      ...styles.flexCol,
      gap: spacing["2"],
      marginTop: spacing["5"],
      ...style,
    }}
  >
    {heading && (
      <View style={{ ...styles.flexRow, alignItems: "center", ...titleStyle }}>
        {themeColor && (
          <View
            style={{
              height: "3.75pt",
              width: "30pt",
              backgroundColor: themeColor,
              marginRight: spacing["3.5"],
            }}
            debug={DEBUG_RESUME_PDF_FLAG}
          />
        )}
        <Text
          style={{
            fontWeight: "bold",
            letterSpacing: "0.3pt", // tracking-wide -> 0.025em * 12 pt = 0.3pt
          }}
          debug={DEBUG_RESUME_PDF_FLAG}
        >
          {heading}
        </Text>
      </View>
    )}
    {children}
  </View>
);

export const ResumePDFText = ({
  bold = false,
  themeColor,
  style = {},
  children,
}: {
  bold?: boolean;
  themeColor?: string;
  style?: Style;
  children: React.ReactNode;
}) => {
  return (
    <Text
      style={{
        color: themeColor || DEFAULT_FONT_COLOR,
        fontWeight: bold ? "bold" : "normal",
        ...style,
      }}
      debug={DEBUG_RESUME_PDF_FLAG}
    >
      {children}
    </Text>
  );
};

export const ResumePDFBulletList = ({
  items,
  bulletStyle = {},
}: {
  items: string[];
  bulletStyle?: Style;
}) => {
  return (
    <>
      {items.map((item, idx) => {
        // 检查项目是否已经包含列表标记
        let bulletMark = "•"; // 默认无序列表标记
        let content = item;
        let isNumbered = false;
        let isList = false;

        // 检测项目是否已经有列表标记
        if (item.startsWith("• ")) {
          // 已经有无序列表标记
          content = item.substring(2); // 移除列表标记
          isNumbered = false;
          isList = true;
        } else if (item.match(/^\d+\.\s/)) {
          // 已经有有序列表标记 (例如 "1. ")
          content = item.replace(/^\d+\.\s/, ""); // 移除数字和点
          bulletMark = `${idx + 1}.`; // 使用序号作为有序列表标记
          isNumbered = true;
          isList = true;
        }
        return (
          <View style={{ ...styles.flexRow, alignItems: "baseline" }} key={idx}>
            {/* 只有检测到列表项时才显示项目符号 */}
            {isList && (
              <ResumePDFText
                style={{
                  paddingLeft: spacing["1"],
                  paddingRight: spacing["1"],
                  lineHeight: "1.3",
                  ...bulletStyle,
                }}
                bold={true}
              >
                {isNumbered ? bulletMark : "•"}
              </ResumePDFText>
            )}
            {/* A breaking change was introduced causing text layout to be wider than node's width
                https://github.com/diegomura/react-pdf/issues/2182. flexGrow & flexBasis fixes it */}
            <Text
              style={{
                lineHeight: "1.3",
                flexGrow: 1,
                flexBasis: 0,
                color: DEFAULT_FONT_COLOR,
              }}
              debug={DEBUG_RESUME_PDF_FLAG}
            >
              {parseMarkdownBold(content)}
            </Text>
          </View>
        );
      })}
    </>
  );
};

export const ResumePDFLink = ({
  src,
  isPDF,
  children,
}: {
  src: string;
  isPDF: boolean;
  children: React.ReactNode;
}) => {
  if (isPDF) {
    return (
      <Link src={src} style={{ textDecoration: "none" }}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={src}
      style={{ textDecoration: "none" }}
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  );
};

export const ResumeFeaturedSkill = ({
  skill,
  rating,
  themeColor,
  style = {},
}: {
  skill: string;
  rating: number;
  themeColor: string;
  style?: Style;
}) => {
  const numCircles = 5;

  return (
    <View style={{ ...styles.flexRow, alignItems: "center", ...style }}>
      <ResumePDFText style={{ marginRight: spacing[0.5] }}>
        {skill}
      </ResumePDFText>
      {[...Array(numCircles)].map((_, idx) => (
        <View
          key={idx}
          style={{
            height: "9pt",
            width: "9pt",
            marginLeft: "2.25pt",
            backgroundColor: rating >= idx ? themeColor : "#d9d9d9",
            borderRadius: "100%",
          }}
        />
      ))}
    </View>
  );
};
