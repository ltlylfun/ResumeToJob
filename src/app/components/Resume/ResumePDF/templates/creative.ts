import type { Template, TemplateStyles } from "./index";

export const creativeTemplate: Template = {
  id: "creative",
  name: "创意模板",
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
        backgroundColor: "transparent",
      },
      headerText: {},
      content: {
        padding: `${spacing[0]} ${spacing[8]}`,
      },
      section: {
        marginTop: spacing[3],
        position: "relative",
        paddingLeft: spacing[2.5],
        borderLeftWidth: "4pt",
        borderLeftStyle: "dotted",
        borderLeftColor: themeColor,
      },
      sectionTitle: {
        fontSize: sectionTitleFontSize,
        fontWeight: "bold",
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
        paddingLeft: spacing[1],
        paddingRight: spacing[1],
      },
      name: {
        fontSize: "18pt",
        fontWeight: "bold",
        color: themeColor,
        borderBottomWidth: "2pt",
        borderBottomStyle: "solid",
        borderBottomColor: themeColor,
        paddingBottom: spacing[1],
        marginBottom: spacing[2],
        display: "flex",
      },
      date: {
        backgroundColor: `${themeColor}15`,
        padding: `${spacing[0.5]} ${spacing[1]}`,
        borderTopLeftRadius: "10pt",
        borderTopRightRadius: "10pt",
        borderBottomRightRadius: "10pt",
        borderBottomLeftRadius: "10pt",
      },
      company: {
        fontWeight: "bold",
        color: themeColor,
      },
      jobTitle: {
        backgroundColor: `${themeColor}15`,
        padding: `${spacing[0.5]} ${spacing[1]}`,
        borderTopLeftRadius: "5pt",
        borderTopRightRadius: "5pt",
        borderBottomRightRadius: "5pt",
        borderBottomLeftRadius: "5pt",
        display: "flex",
      },
      school: {
        fontWeight: "bold",
        color: themeColor,
      },
      degree: {},
      projectTitle: {
        fontWeight: "bold",
        color: themeColor,
        borderBottomWidth: "1.5pt",
        borderBottomStyle: "dotted",
        borderBottomColor: themeColor,
        paddingBottom: spacing[0.5],
        display: "flex",
      },
      contact: {
        marginTop: spacing[3],
        backgroundColor: `${themeColor}15`,
        padding: spacing[2],
        borderTopLeftRadius: "5pt",
        borderTopRightRadius: "5pt",
        borderBottomRightRadius: "5pt",
        borderBottomLeftRadius: "5pt",
        gap: spacing[2],
      },
    };
  },
};
