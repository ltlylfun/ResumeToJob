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
        padding: `${spacing[2]} ${spacing[8]}`,
      },
      section: {
        marginTop: spacing[3],
      },
      sectionTitle: {
        fontSize: "11pt",
        fontWeight: "bold",
        color: "white",
        backgroundColor: themeColor,
        paddingTop: spacing[0.5],
        paddingBottom: spacing[0.5],
        paddingLeft: spacing[1],
        paddingRight: spacing[1],
        marginBottom: spacing[2],
        display: "flex", // 修改 "inline-block" 为 "flex"
      },
      bullet: {
        paddingLeft: spacing[1],
        paddingRight: spacing[1],
        fontSize: "8pt",
      },
      name: {
        fontSize: "16pt",
        fontWeight: "bold",
      },
      date: {
        fontSize: "8pt",
      },
      company: {
        fontWeight: "bold",
        fontSize: "10pt",
      },
      jobTitle: {
        fontWeight: "normal",
        fontSize: "9pt",
        color: themeColor,
      },
      school: {
        fontWeight: "bold",
        fontSize: "10pt",
      },
      degree: {
        fontSize: "9pt",
      },
      projectTitle: {
        fontWeight: "bold",
        fontSize: "10pt",
      },
      contact: {
        marginTop: spacing[1],
        fontSize: "9pt",
        gap: spacing[1],
      },
    };
  },
};
