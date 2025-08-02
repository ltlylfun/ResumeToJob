import type { Template, TemplateStyles } from "./index";

export const modernTemplate: Template = {
  id: "modern",
  name: "现代模板",
  getStyles: (
    themeColor: string,
    spacing: any,
    fontSize?: string,
  ): TemplateStyles => {
    // 计算 sectionTitle 的字体大小（选择的字体大小 + 2）
    const baseFontSize = fontSize ? parseFloat(fontSize) : 11;
    const sectionTitleFontSize = `${baseFontSize + 2}pt`;

    return {
      header: {
        backgroundColor: themeColor,
        padding: spacing[1],
      },
      headerText: {},
      content: {
        padding: `${spacing[0]} ${spacing[8]}`,
      },
      section: {
        marginTop: spacing[3],
        borderBottomWidth: "1pt",
        borderBottomStyle: "solid",
        borderBottomColor: themeColor,
        paddingBottom: spacing[3],
      },
      sectionTitle: {
        fontSize: sectionTitleFontSize,
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
      },
      date: {
        color: themeColor,
      },
      company: {
        fontWeight: "bold",
      },
      jobTitle: {},
      school: {
        fontWeight: "bold",
      },
      projectTitle: {
        fontWeight: "bold",
        color: themeColor,
      },
    };
  },
};
