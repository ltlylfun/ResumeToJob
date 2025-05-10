import type { Template, TemplateStyles } from "./index";

export const techTemplate: Template = {
  id: "tech",
  name: "科技模板",
  description: "适合科技领域的现代数字风格",
  getStyles: (themeColor: string, spacing: any): TemplateStyles => {
    return {
      header: {},
      headerText: {},
      content: {
        padding: `${spacing[3]} ${spacing[10]}`,
      },
      section: {
        marginTop: spacing[4],
        paddingTop: spacing[2],
        borderTopWidth: "2pt",
        borderTopStyle: "dashed",
        borderTopColor: themeColor,
      },
      sectionTitle: {
        fontSize: "12pt",
        fontWeight: "bold",
        marginBottom: spacing[2.5],
        color: themeColor,
      },
      bullet: {
        color: themeColor,
        paddingLeft: spacing[1.5],
        paddingRight: spacing[1.5],
      },
      name: {
        fontSize: "20pt",
        fontWeight: "bold",
        color: themeColor,
      },
      date: {
        fontSize: "9pt",
        color: themeColor,
      },
      company: {
        fontWeight: "bold",
        fontSize: "11pt",
      },
      jobTitle: {
        color: themeColor,
        fontSize: "10pt",
      },
      school: {
        fontWeight: "bold",
        fontSize: "11pt",
      },
      degree: {
        color: themeColor,
        fontSize: "10pt",
      },
      projectTitle: {
        fontWeight: "bold",
        fontSize: "11pt",
        color: themeColor,
        padding: `${spacing[0.5]} 0`,
        borderBottomWidth: "1pt",
        borderBottomStyle: "solid",
        borderBottomColor: themeColor,
      },
      contact: {
        padding: `${spacing[1]} ${spacing[2]}`,
        marginTop: spacing[2],

        gap: spacing[2],
      },
    };
  },
};
