import { classicTemplate } from "./classic";
import { modernTemplate } from "./modern";
import { minimalTemplate } from "./minimal";
import { professionalTemplate } from "./professional";
import { creativeTemplate } from "./creative";
import { elegantTemplate } from "./elegant";
import { compactTemplate } from "./compact";
import { techTemplate } from "./tech";
import type { Style } from "@react-pdf/types";

export type TemplateStyles = {
  header: Style;
  headerText: Style;
  content: Style;
  section?: Style;
  name?: Style;
  sectionTitle?: Style;
  sectionContent?: Style;
  contact?: Style;
  bullet?: Style;
  date?: Style;
  company?: Style;
  jobTitle?: Style;
  school?: Style;
  degree?: Style;
  projectTitle?: Style;
};

export interface Template {
  id: string;
  name: string;
  description: string;
  getStyles: (themeColor: string, spacing: any) => TemplateStyles;
}

export const templates: Record<string, Template> = {
  classic: classicTemplate,
  professional: professionalTemplate,
  modern: modernTemplate,
  elegant: elegantTemplate,
  creative: creativeTemplate,
  tech: techTemplate,
  minimal: minimalTemplate,
  compact: compactTemplate,
};

export const getTemplateStyles = (
  template: string,
  themeColor: string,
  spacing: any
): TemplateStyles => {
  return (
    templates[template]?.getStyles(themeColor, spacing) ||
    classicTemplate.getStyles(themeColor, spacing)
  );
};

export const getTemplateById = (id: string): Template => {
  return templates[id] || classicTemplate;
};

export const getAllTemplates = (): Template[] => {
  return Object.values(templates);
};
