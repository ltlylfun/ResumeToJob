import type { Template, TemplateStyles } from "./index";

export const elegantTemplate: Template = {
  id: "elegant",
  name: "优雅模板",
  description: "简约大气的高级设计",
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
        padding: `${spacing[2]} ${spacing[8]}`,
        borderWidth: "1pt",
        borderStyle: "solid",
        borderColor: themeColor,
        margin: spacing[4],
      },
      section: {
        marginTop: spacing[3],
        position: "relative",
      },
      sectionTitle: {
        fontSize: sectionTitleFontSize,
        textTransform: "uppercase",
        letterSpacing: "3pt",
        color: themeColor,
        textAlign: "center",
        borderTopWidth: "0.5pt",
        borderTopStyle: "solid",
        borderTopColor: themeColor,
        borderBottomWidth: "0.5pt",
        borderBottomStyle: "solid",
        borderBottomColor: themeColor,
        paddingTop: spacing[1],
        paddingBottom: spacing[1],
      },
      bullet: {
        color: themeColor,
        paddingLeft: spacing[1],
        paddingRight: spacing[1],
      },
      name: {
        fontSize: "18pt",
        fontWeight: "normal",
        textAlign: "left",
        marginBottom: spacing[1],
        letterSpacing: "1pt",
        color: themeColor,
      },
      date: {},
      company: {
        fontWeight: "normal",
        textTransform: "uppercase",
      },
      jobTitle: {
        color: themeColor,
      },
      school: {
        fontWeight: "normal",
        textTransform: "uppercase",
      },
      degree: {},
      projectTitle: {
        fontWeight: "normal",
        color: themeColor,
      },
      contact: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        flexWrap: "wrap",
        marginTop: spacing[2],
        gap: spacing[3],
      },
    };
  },
};
