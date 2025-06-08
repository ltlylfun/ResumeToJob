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
      headerText: {},
      content: {
        padding: `${spacing[0]} ${spacing[8]}`,
      },
      section: {
        marginTop: spacing[3],
      },
      sectionTitle: {
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
