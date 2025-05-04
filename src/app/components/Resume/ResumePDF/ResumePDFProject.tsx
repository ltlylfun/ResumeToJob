import { View } from "@react-pdf/renderer";
import {
  ResumePDFSection,
  ResumePDFBulletList,
  ResumePDFText,
} from "components/Resume/ResumePDF/common";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import type { ResumeProject } from "lib/redux/types";
import type { TemplateStyles } from "components/Resume/ResumePDF/templates";

export const ResumePDFProject = ({
  heading,
  projects,
  themeColor,
  templateStyles,
}: {
  heading: string;
  projects: ResumeProject[];
  themeColor: string;
  templateStyles: TemplateStyles;
}) => {
  return (
    <ResumePDFSection
      themeColor={themeColor}
      heading={heading}
      style={templateStyles.section}
      titleStyle={templateStyles.sectionTitle}
    >
      {projects.map(({ project, date, descriptions }, idx) => (
        <View key={idx}>
          <View
            style={{
              ...styles.flexRowBetween,
              marginTop: spacing["0.5"],
            }}
          >
            <ResumePDFText bold={true} style={templateStyles.projectTitle}>
              {project}
            </ResumePDFText>
            <ResumePDFText style={templateStyles.date}>{date}</ResumePDFText>
          </View>
          <View style={{ ...styles.flexCol, marginTop: spacing["0.5"] }}>
            <ResumePDFBulletList
              items={descriptions}
              bulletStyle={templateStyles.bullet}
            />
          </View>
        </View>
      ))}
    </ResumePDFSection>
  );
};
