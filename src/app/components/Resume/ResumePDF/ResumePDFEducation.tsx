import { View } from "@react-pdf/renderer";
import {
  ResumePDFBulletList,
  ResumePDFSection,
  ResumePDFText,
} from "components/Resume/ResumePDF/common";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import type { ResumeEducation } from "lib/redux/types";
import type { TemplateStyles } from "components/Resume/ResumePDF/templates";

export const ResumePDFEducation = ({
  heading,
  educations,
  themeColor,
  templateStyles,
}: {
  heading: string;
  educations: ResumeEducation[];
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
      {educations.map(
        ({ id, school, degree, date, gpa, descriptions = [] }, idx) => {
          // Hide school name if it is the same as the previous school
          const hideSchoolName =
            idx > 0 && school === educations[idx - 1].school;
          const showDescriptions = descriptions.join() !== "";

          return (
            <View key={id || `education-pdf-${idx}`}>
              {!hideSchoolName && (
                <ResumePDFText bold={true} style={templateStyles.school}>
                  {school}
                </ResumePDFText>
              )}
              <View
                style={{
                  ...styles.flexRowBetween,
                  marginTop: hideSchoolName
                    ? "-" + spacing["1"]
                    : spacing["1.5"],
                }}
              >
                <ResumePDFText style={templateStyles.degree}>{`${
                  gpa
                    ? `${degree} - ${Number(gpa) ? gpa + " GPA" : gpa}`
                    : degree
                }`}</ResumePDFText>
                <ResumePDFText style={templateStyles.date}>
                  {date}
                </ResumePDFText>
              </View>
              {showDescriptions && (
                <View style={{ ...styles.flexCol, marginTop: spacing["1.5"] }}>
                  <ResumePDFBulletList
                    items={descriptions}
                    bulletStyle={templateStyles.bullet}
                  />
                </View>
              )}
            </View>
          );
        }
      )}
    </ResumePDFSection>
  );
};
