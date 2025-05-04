import type { Template, TemplateStyles } from "./index";

export const creativeTemplate: Template = {
  id: "creative",
  name: "创意模板",
  description: "适合设计和创意行业的现代风格",
  getStyles: (themeColor: string, spacing: any): TemplateStyles => {
    return {
      header: {
        width: spacing["full"],
        backgroundColor: "transparent",
      },
      headerText: {},
      content: {
        padding: `${spacing[5]} ${spacing[8]}`,
      },
      section: {
        marginTop: spacing[6],
        position: "relative",
        paddingLeft: spacing[2.5],
        borderLeft: `8pt dotted ${themeColor}25`,
      },
      sectionTitle: {
        fontSize: "14pt",
        fontWeight: "bold",
        marginBottom: spacing[3],
        color: "white",
        backgroundColor: themeColor,
        paddingTop: spacing[1],
        paddingBottom: spacing[1],
        paddingLeft: spacing[2.5],
        paddingRight: spacing[2.5],
        marginLeft: `-${spacing[4]}`,
        borderTopRightRadius: "15pt",
        borderBottomRightRadius: "15pt",
        display: "flex",
      },
      bullet: {
        color: themeColor,
        fontWeight: "bold",
      },
      name: {
        fontSize: "26pt",
        fontWeight: "bold",
        color: themeColor,
        borderBottom: `2pt solid ${themeColor}`,
        paddingBottom: spacing[1],
        marginBottom: spacing[2],
        display: "flex",
      },
      date: {
        fontStyle: "italic",
        fontSize: "9pt",
        backgroundColor: `${themeColor}15`,
        padding: `${spacing[0.5]} ${spacing[1]}`,
        borderRadius: "10pt",
      },
      company: {
        fontWeight: "bold",
        fontSize: "12pt",
        color: themeColor,
      },
      jobTitle: {
        fontStyle: "normal",
        fontSize: "11pt",
        backgroundColor: `${themeColor}15`,
        padding: `${spacing[0.5]} ${spacing[1]}`,
        borderRadius: "5pt",
        display: "flex",
      },
      school: {
        fontWeight: "bold",
        fontSize: "12pt",
        color: themeColor,
      },
      degree: {
        fontStyle: "normal",
      },
      projectTitle: {
        fontWeight: "bold",
        fontSize: "11pt",
        color: themeColor,
        borderBottom: `1.5pt dotted ${themeColor}`,
        paddingBottom: spacing[0.5],
        display: "flex",
      },
      contact: {
        marginTop: spacing[3],
        backgroundColor: `${themeColor}15`,
        padding: spacing[2],
        borderRadius: "5pt",
        gap: spacing[2],
      },
    };
  },
};
