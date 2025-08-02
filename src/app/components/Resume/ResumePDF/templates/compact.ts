import type { Template, TemplateStyles } from "./index";

export const compactTemplate: Template = {
  id: "compact",
  name: "紧凑模板",
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
        fontSize: sectionTitleFontSize,
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
