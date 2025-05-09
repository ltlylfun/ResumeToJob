import type { Template, TemplateStyles } from "./index";

export const elegantTemplate: Template = {
  id: "elegant",
  name: "优雅模板",
  description: "简约大气的高级设计",
  getStyles: (themeColor: string, spacing: any): TemplateStyles => {
    return {
      header: {}, // 无头部背景
      headerText: {},
      content: {
        padding: `${spacing[4]} ${spacing[10]}`,
        border: `1pt solid ${themeColor}30`,
        margin: spacing[4],
      },
      section: {
        marginTop: spacing[6],
        position: "relative",
      },
      sectionTitle: {
        fontSize: "12pt",
        textTransform: "uppercase",
        letterSpacing: "3pt",
        color: themeColor,
        marginBottom: spacing[4],
        textAlign: "center",
        borderTop: `0.5pt solid ${themeColor}`,
        borderBottom: `0.5pt solid ${themeColor}`,
        paddingTop: spacing[1],
        paddingBottom: spacing[1],
      },
      bullet: {
        color: themeColor,
        fontSize: "10pt",
      },
      name: {
        fontSize: "24pt",
        fontWeight: "normal",
        textAlign: "center",
        marginBottom: spacing[1],
        letterSpacing: "1pt",
        color: themeColor,
      },
      date: {
        fontSize: "9pt",
        fontStyle: "italic",
      },
      company: {
        fontWeight: "normal",
        letterSpacing: "1pt",
        fontSize: "12pt",
        textTransform: "uppercase",
      },
      jobTitle: {
        fontStyle: "italic",
        color: themeColor,
      },
      school: {
        fontWeight: "normal",
        letterSpacing: "1pt",
        fontSize: "12pt",
        textTransform: "uppercase",
      },
      degree: {
        fontStyle: "italic",
      },
      projectTitle: {
        fontWeight: "normal",
        fontStyle: "italic",
        fontSize: "11pt",
        color: themeColor,
      },
      contact: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        flexWrap: "wrap",
        marginTop: spacing[2],
        gap: spacing[3],
      },
    };
  },
};
