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
        borderWidth: "1pt",
        borderStyle: "solid",
        borderColor: themeColor,
        margin: spacing[4],
      },
      section: {
        marginTop: spacing[3],
        position: "relative",
      },
      sectionTitle: {
        fontSize: "12pt",
        textTransform: "uppercase",
        letterSpacing: "3pt",
        color: themeColor,
        marginBottom: spacing[2],
        textAlign: "center",
        borderTopWidth: "0.5pt",
        borderTopStyle: "solid",
        borderTopColor: themeColor,
        borderBottomWidth: "0.5pt",
        borderBottomStyle: "solid",
        borderBottomColor: themeColor,
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
        textAlign: "left",
        marginBottom: spacing[1],
        letterSpacing: "1pt",
        color: themeColor,
      },
      date: {
        fontSize: "9pt",
      },
      company: {
        fontWeight: "normal",
        letterSpacing: "1pt",
        fontSize: "12pt",
        textTransform: "uppercase",
      },
      jobTitle: {
        color: themeColor,
      },
      school: {
        fontWeight: "normal",
        letterSpacing: "1pt",
        fontSize: "12pt",
        textTransform: "uppercase",
      },
      degree: {},
      projectTitle: {
        fontWeight: "normal",

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
