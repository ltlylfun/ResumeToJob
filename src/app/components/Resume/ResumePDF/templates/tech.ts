import type { Template, TemplateStyles } from "./index";

export const techTemplate: Template = {
  id: "tech",
  name: "科技模板",
  description: "适合科技领域的现代数字风格",
  getStyles: (
    themeColor: string,
    spacing: any,
    fontSize?: string,
  ): TemplateStyles => {
    // 计算 sectionTitle 的字体大小（选择的字体大小 + 2）
    const baseFontSize = fontSize ? parseFloat(fontSize) : 11;
    const sectionTitleFontSize = `${baseFontSize + 2}pt`;

    return {
      header: {},
      headerText: {},
      content: {
        padding: `${spacing[0]} ${spacing[8]}`,
      },
      section: {
        marginTop: spacing[3],
        paddingTop: spacing[2],
        borderTopWidth: "2pt",
        borderTopStyle: "dashed",
        borderTopColor: themeColor,
      },
      sectionTitle: {
        fontSize: sectionTitleFontSize,
        fontWeight: "bold",
        color: themeColor,
      },
      bullet: {
        color: themeColor,
        paddingLeft: spacing[1],
        paddingRight: spacing[1],
      },
      name: {
        fontSize: "18pt",
        fontWeight: "bold",
        color: themeColor,
      },
      date: {
        color: themeColor,
      },
      company: {
        fontWeight: "bold",
      },
      jobTitle: {
        color: themeColor,
      },
      school: {
        fontWeight: "bold",
      },
      degree: {
        color: themeColor,
      },
      projectTitle: {
        fontWeight: "bold",
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
