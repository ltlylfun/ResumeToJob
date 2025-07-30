import { Text, View, Link } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import { DEBUG_RESUME_PDF_FLAG } from "lib/constants";
import { DEFAULT_FONT_COLOR } from "lib/redux/settingsSlice";
import React from "react";

const MARKDOWN_BOLD_REGEX = /(\*\*([^*]+)\*\*|__([^_]+)__)/g;
const SKILL_RATING_CIRCLES = 5;
const CIRCLE_SIZE = "9pt";
const CIRCLE_MARGIN = "2.25pt";
const BULLET_SYMBOL = "•";
const ORDERED_LIST_REGEX = /^\d+\.\s/;
const UNORDERED_LIST_PREFIX = "• ";

const DebugText = React.memo(
  ({
    children,
    style = {},
    ...props
  }: {
    children: React.ReactNode;
    style?: Style;
    [key: string]: any;
  }) => (
    <Text style={style} debug={DEBUG_RESUME_PDF_FLAG} {...props}>
      {children}
    </Text>
  ),
);

DebugText.displayName = "DebugText";

const parseMarkdownBold = (text: string) => {
  const parts = [];

  const regex = MARKDOWN_BOLD_REGEX;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      const normalText = text.substring(lastIndex, match.index);
      if (normalText) {
        parts.push(
          <DebugText key={`normal-${lastIndex}`}>{normalText}</DebugText>,
        );
      }
    }

    const boldText = match[2] || match[3];
    if (boldText) {
      parts.push(
        <DebugText key={`bold-${match.index}`} style={{ fontWeight: "bold" }}>
          {boldText}
        </DebugText>,
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    const remainingText = text.substring(lastIndex);
    if (remainingText) {
      parts.push(
        <DebugText key={`remaining-${lastIndex}`}>{remainingText}</DebugText>,
      );
    }
  }

  if (parts.length === 0) {
    parts.push(<DebugText key="default">{text}</DebugText>);
  }

  return parts;
};

export const ResumePDFSection = React.memo(
  ({
    themeColor,
    heading,
    style = {},
    titleStyle = {},
    children,
  }: ResumePDFSectionProps) => (
    <View
      style={{
        ...styles.flexCol,
        gap: spacing["2"],
        marginTop: spacing["5"],
        ...style,
      }}
    >
      {heading && (
        <View
          style={{ ...styles.flexRow, alignItems: "center", ...titleStyle }}
        >
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
          <DebugText
            style={{
              fontWeight: "bold",
              letterSpacing: "0.3pt",
            }}
          >
            {heading}
          </DebugText>
        </View>
      )}
      {children}
    </View>
  ),
);

ResumePDFSection.displayName = "ResumePDFSection";

export const ResumePDFText = React.memo(
  ({ bold = false, themeColor, style = {}, children }: ResumePDFTextProps) => {
    return (
      <DebugText
        style={{
          color: themeColor || DEFAULT_FONT_COLOR,
          fontWeight: bold ? "bold" : "normal",
          ...style,
        }}
      >
        {children}
      </DebugText>
    );
  },
);

ResumePDFText.displayName = "ResumePDFText";

interface ListItemInfo {
  content: string;
  bulletMark: string;
  isNumbered: boolean;
  isList: boolean;
}

interface ResumePDFSectionProps {
  themeColor?: string;
  heading?: string;
  style?: Style;
  titleStyle?: Style;
  children: React.ReactNode;
}

interface ResumePDFTextProps {
  bold?: boolean;
  themeColor?: string;
  style?: Style;
  children: React.ReactNode;
}

interface ResumePDFBulletListProps {
  items: string[];
  bulletStyle?: Style;
}

interface ResumePDFLinkProps {
  src: string;
  isPDF: boolean;
  children: React.ReactNode;
}

interface ResumeFeaturedSkillProps {
  skill: string;
  rating: number;
  themeColor: string;
  style?: Style;
}

const parseListItem = (item: string): ListItemInfo => {
  if (item.startsWith(UNORDERED_LIST_PREFIX)) {
    return {
      content: item.substring(2),
      bulletMark: BULLET_SYMBOL,
      isNumbered: false,
      isList: true,
    };
  }

  const orderedMatch = item.match(ORDERED_LIST_REGEX);
  if (orderedMatch) {
    const numberMatch = item.match(/^(\d+)\.\s/);
    return {
      content: item.replace(ORDERED_LIST_REGEX, ""),
      bulletMark: numberMatch ? `${numberMatch[1]}.` : "1.",
      isNumbered: true,
      isList: true,
    };
  }

  return {
    content: item,
    bulletMark: BULLET_SYMBOL,
    isNumbered: false,
    isList: false,
  };
};

export const ResumePDFBulletList = React.memo(
  ({ items, bulletStyle = {} }: ResumePDFBulletListProps) => {
    return (
      <>
        {items.map((item, idx) => {
          const listInfo = parseListItem(item);
          return (
            <View
              style={{ ...styles.flexRow, alignItems: "flex-start" }}
              key={idx}
            >
              {listInfo.isList && (
                <ResumePDFText
                  style={{
                    paddingLeft: spacing["1"],
                    paddingRight: spacing["1"],
                    lineHeight: "1.3",
                    marginTop: "0pt",
                    ...bulletStyle,
                  }}
                  bold={true}
                >
                  {listInfo.isNumbered ? listInfo.bulletMark : BULLET_SYMBOL}
                </ResumePDFText>
              )}
              <DebugText
                style={{
                  lineHeight: "1.3",
                  flexGrow: 1,
                  flexBasis: 0,
                  color: DEFAULT_FONT_COLOR,
                }}
              >
                {parseMarkdownBold(listInfo.content)}
              </DebugText>
            </View>
          );
        })}
      </>
    );
  },
);

ResumePDFBulletList.displayName = "ResumePDFBulletList";

export const ResumePDFLink = ({ src, isPDF, children }: ResumePDFLinkProps) => {
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

export const ResumeFeaturedSkill = React.memo(
  ({ skill, rating, themeColor, style = {} }: ResumeFeaturedSkillProps) => {
    return (
      <View style={{ ...styles.flexRow, alignItems: "center", ...style }}>
        <ResumePDFText style={{ marginRight: spacing[0.5] }}>
          {skill}
        </ResumePDFText>
        {[...Array(SKILL_RATING_CIRCLES)].map((_, idx) => (
          <View
            key={idx}
            style={{
              height: CIRCLE_SIZE,
              width: CIRCLE_SIZE,
              marginLeft: CIRCLE_MARGIN,
              backgroundColor: rating >= idx ? themeColor : "#d9d9d9",
              borderRadius: "100%",
            }}
          />
        ))}
      </View>
    );
  },
);

ResumeFeaturedSkill.displayName = "ResumeFeaturedSkill";
