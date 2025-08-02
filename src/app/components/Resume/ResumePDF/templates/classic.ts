import type { Template, TemplateStyles } from "./index";

export const classicTemplate: Template = {
  id: "classic",
  name: "经典模板",
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
        width: spacing["full"],
        height: spacing[3.5],
        backgroundColor: themeColor,
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
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      },
      bullet: {
        color: themeColor,
        paddingLeft: spacing[1],
        paddingRight: spacing[1],
      },
      name: {
        fontSize: "18pt",
      },
      company: {
        fontWeight: "bold",
      },
      projectTitle: {
        fontWeight: "bold",
      },
    };
  },
};
