import type { Template, TemplateStyles } from "./index";

export const minimalTemplate: Template = {
  id: "minimal",
  name: "极简模板",
  description: "干净利落的最小化设计",
  getStyles: (themeColor: string, spacing: any): TemplateStyles => {
    return {
      header: {}, // 无头部背景
      headerText: {},
      content: {
        padding: `${spacing[0]} ${spacing[8]}`,
      },
      section: {
        marginTop: spacing[3],
      },
      sectionTitle: {
        textTransform: "uppercase",
        letterSpacing: "1pt",
        borderBottomWidth: "0.5pt",
        borderBottomStyle: "solid",
        borderBottomColor: themeColor,
        paddingBottom: spacing[1],
      },
      bullet: {
        color: themeColor,
        paddingLeft: spacing[1],
        paddingRight: spacing[1],
      },
      name: {
        fontSize: "18pt",
        letterSpacing: "1pt",
        textTransform: "uppercase",
      },
      date: {},
      company: {
        fontWeight: "bold",
        letterSpacing: "0.5pt",
      },
      jobTitle: {},
      school: {
        fontWeight: "bold",
        letterSpacing: "0.5pt",
      },
      projectTitle: {
        textDecoration: "underline",
        textDecorationColor: themeColor,
      },
    };
  },
};
