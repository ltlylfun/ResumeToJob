import type { Template, TemplateStyles } from "./index";

export const professionalTemplate: Template = {
  id: "professional",
  name: "专业模板",
  description: "强调专业性和清晰度的企业风格",
  getStyles: (
    themeColor: string,
    spacing: any,
    fontSize?: string,
  ): TemplateStyles => {
    // 计算 sectionTitle 的字体大小（选择的字体大小 + 2）
    const baseFontSize = fontSize ? parseFloat(fontSize) : 11;
    const sectionTitleFontSize = `${baseFontSize + 2}pt`;

    return {
      header: { backgroundColor: themeColor, padding: spacing[1] },
      headerText: {}, // 保持默认样式
      content: {
        padding: `${spacing[0]} ${spacing[8]}`,
      },
      section: {
        marginTop: spacing[3],
        paddingLeft: spacing[2],
        borderLeftWidth: "2pt",
        borderLeftStyle: "solid",
        borderLeftColor: themeColor,
      },
      sectionTitle: {
        fontSize: sectionTitleFontSize,
        color: themeColor,
        fontWeight: "bold",
        letterSpacing: "0.5pt",
      },
      bullet: {
        color: themeColor,
        paddingLeft: spacing[1],
        paddingRight: spacing[1],
      },
      name: {
        fontSize: "18pt",
        fontWeight: "bold",
        letterSpacing: "0.5pt",
      },
      date: {
        fontWeight: "normal",
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
        textDecoration: "underline",
        textDecorationColor: themeColor,
      },
      jobTitle: {
        fontWeight: "bold",
      },
      school: {
        fontWeight: "bold",
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
