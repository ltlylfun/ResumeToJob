import type { Template, TemplateStyles } from "./index";

export const techTemplate: Template = {
  id: "tech",
  name: "科技模板",
  description: "适合科技领域的现代数字风格",
  getStyles: (themeColor: string, spacing: any): TemplateStyles => {
    return {
      header: {
        backgroundColor: "black",
        height: spacing[5],
        position: "relative",
      },
      headerText: {
        color: "white",
      },
      content: {
        padding: `${spacing[3]} ${spacing[10]}`,
      },
      section: {
        marginTop: spacing[4],
        paddingTop: spacing[2],
        borderTop: `2pt dashed ${themeColor}`,
      },
      sectionTitle: {
        fontSize: "12pt",
        fontWeight: "bold",
        marginBottom: spacing[2.5],
        color: themeColor,
        fontFamily: "Courier",
      },
      bullet: {
        color: themeColor,
        paddingLeft: spacing[1.5],
        paddingRight: spacing[1.5],
        fontFamily: "Courier",
      },
      name: {
        fontSize: "20pt",
        fontWeight: "bold",
        color: themeColor,
        fontFamily: "Courier",
      },
      date: {
        fontSize: "9pt",
        color: themeColor,
        fontFamily: "Courier",
      },
      company: {
        fontWeight: "bold",
        fontSize: "11pt",
      },
      jobTitle: {
        color: themeColor,
        fontSize: "10pt",
        fontFamily: "Courier",
      },
      school: {
        fontWeight: "bold",
        fontSize: "11pt",
      },
      degree: {
        color: themeColor,
        fontSize: "10pt",
        fontFamily: "Courier",
      },
      projectTitle: {
        fontWeight: "bold",
        fontSize: "11pt",
        color: themeColor,
        fontFamily: "Courier",
        padding: `${spacing[0.5]} 0`,
        borderBottom: `1pt solid ${themeColor}`,
      },
      contact: {
        backgroundColor: "black",
        padding: `${spacing[1]} ${spacing[2]}`,
        marginTop: spacing[2],
        color: "white",
        gap: spacing[2],
      },
    };
  },
};
