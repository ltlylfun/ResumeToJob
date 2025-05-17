import type { Template, TemplateStyles } from "./index";

export const modernTemplate: Template = {
  id: "modern",
  name: "现代模板",
  description: "带有彩色标题区的现代设计",
  getStyles: (themeColor: string, spacing: any): TemplateStyles => {
    return {
      header: {
        backgroundColor: themeColor,
        padding: spacing[1],
      },
      headerText: {},
      content: {
        padding: `${spacing[0]} ${spacing[10]}`, // 修改从20减小到10
      },
      section: {
        marginTop: spacing[3],
        borderBottomWidth: "1pt",
        borderBottomStyle: "solid",
        borderBottomColor: `${themeColor}20`,
        paddingBottom: spacing[3],
      },
      sectionTitle: {
        color: themeColor,
        marginBottom: spacing[2],
      },
      bullet: {
        color: themeColor,
        paddingLeft: spacing[2],
        paddingRight: spacing[2],
      },
      name: {
        fontSize: "24pt",
        fontWeight: "bold",
      },
      date: {
        color: themeColor,
      },
      company: {
        fontWeight: "bold",
        fontSize: "12pt",
      },
      jobTitle: {},
      school: {
        fontWeight: "bold",
        fontSize: "12pt",
      },
      projectTitle: {
        fontWeight: "bold",
        color: themeColor,
      },
    };
  },
};
