import type { Template, TemplateStyles } from "./index";

export const compactTemplate: Template = {
  id: "compact",
  name: "紧凑模板",
  description: "适合需要展示大量内容的求职者",
  getStyles: (themeColor: string, spacing: any): TemplateStyles => {
    return {
      header: {
        backgroundColor: themeColor,
        height: spacing[2],
      },
      headerText: {},
      content: {
        padding: `${spacing[0]} ${spacing[8]}`,
      },
      section: {
        marginTop: spacing[3],
      },
      sectionTitle: {
        fontWeight: "bold",
        color: "white",
        backgroundColor: themeColor,
        paddingTop: spacing[0.5],
        paddingBottom: spacing[0.5],
        paddingLeft: spacing[1],
        paddingRight: spacing[1],
        display: "flex", // 修改 "inline-block" 为 "flex"
      },
      bullet: {
        color: themeColor,
        paddingLeft: spacing[1],
        paddingRight: spacing[1],
      },
      name: {
        fontSize: "18pt",
        fontWeight: "bold",
      },
      date: {},
      company: {
        fontWeight: "bold",
      },
      jobTitle: {
        fontWeight: "normal",
        color: themeColor,
      },
      school: {
        fontWeight: "bold",
      },
      degree: {},
      projectTitle: {
        fontWeight: "bold",
      },
      contact: {
        marginTop: spacing[1],
        gap: spacing[1],
      },
    };
  },
};
