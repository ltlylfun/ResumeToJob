import type { Template, TemplateStyles } from "./index";

export const professionalTemplate: Template = {
  id: "professional",
  name: "专业模板",
  description: "强调专业性和清晰度的企业风格",
  getStyles: (themeColor: string, spacing: any): TemplateStyles => {
    return {
      header: { backgroundColor: themeColor, padding: spacing[1] },
      headerText: {}, // 保持默认样式
      content: {
        padding: `${spacing[3]} ${spacing[10]}`,
      },
      section: {
        marginTop: spacing[6],
        paddingLeft: spacing[2],
        borderLeftWidth: "2pt",
        borderLeftStyle: "solid",
        borderLeftColor: themeColor,
      },
      sectionTitle: {
        color: themeColor,
        fontWeight: "bold",
        fontSize: "13pt",
        letterSpacing: "0.5pt",
        marginBottom: spacing[3],
      },
      bullet: {
        paddingLeft: spacing[1.5],
        paddingRight: spacing[1.5],
      },
      name: {
        fontSize: "22pt",
        fontWeight: "bold",
        letterSpacing: "0.5pt",
      },
      date: {
        fontWeight: "normal",
        fontSize: "9pt",
        color: themeColor,
        backgroundColor: `${themeColor}10`,
        padding: `${spacing[0.5]} ${spacing[1.5]}`,
        borderTopLeftRadius: "3pt",
        borderTopRightRadius: "3pt",
        borderBottomRightRadius: "3pt",
        borderBottomLeftRadius: "3pt",
      },
      company: {
        fontWeight: "bold",
        fontSize: "11pt",
        textDecoration: "underline",
        textDecorationColor: themeColor,
      },
      jobTitle: {
        fontWeight: "bold",
      },
      school: {
        fontWeight: "bold",
        fontSize: "11pt",
        textDecoration: "underline",
        textDecorationColor: themeColor,
      },
      degree: {
        fontWeight: "bold",
      },
      projectTitle: {
        fontWeight: "bold",
        backgroundColor: `${themeColor}15`,
        padding: `${spacing[0.5]} ${spacing[1]}`,
        display: "flex",
      },
      contact: {
        marginTop: spacing[2],
        gap: spacing[3],
      },
    };
  },
};
