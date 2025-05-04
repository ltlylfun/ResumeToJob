import type { Template, TemplateStyles } from "./index";

export const classicTemplate: Template = {
  id: "classic",
  name: "经典模板",
  description: "简洁明了的传统设计",
  getStyles: (themeColor: string, spacing: any): TemplateStyles => {
    return {
      header: {
        width: spacing["full"],
        height: spacing[3.5],
        backgroundColor: themeColor,
      },
      headerText: {}, // 不需要特殊样式
      content: {
        padding: `${spacing[0]} ${spacing[10]}`, // 修改从20减小到10
      },
      section: {
        marginTop: spacing[5],
      },
      sectionTitle: {
        marginBottom: spacing[2],
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      },
      bullet: {
        paddingLeft: spacing[2],
        paddingRight: spacing[2],
      },
      name: {
        fontSize: "20pt",
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
