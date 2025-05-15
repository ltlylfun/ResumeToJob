import { View } from "@react-pdf/renderer";
import {
  ResumePDFSection,
  ResumePDFBulletList,
  ResumePDFText,
} from "components/Resume/ResumePDF/common";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import type { ResumeWorkExperience } from "lib/redux/types";
import type { TemplateStyles } from "components/Resume/ResumePDF/templates";

export const ResumePDFWorkExperience = ({
  heading,
  workExperiences,
  themeColor,
  templateStyles,
}: {
  heading: string;
  workExperiences: ResumeWorkExperience[];
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
      {workExperiences.map(({ company, jobTitle, date, descriptions }, idx) => {
        // Hide company name if it is the same as the previous company
        const hideCompanyName =
          idx > 0 && company === workExperiences[idx - 1].company;

        return (
          <View key={idx} style={idx !== 0 ? { marginTop: spacing["2"] } : {}}>
            {!hideCompanyName && (
              <ResumePDFText bold={true} style={templateStyles.company}>
                {company}
              </ResumePDFText>
            )}
            <View
              style={{
                ...styles.flexRowBetween,
                marginTop: hideCompanyName
                  ? "-" + spacing["1"]
                  : spacing["1.5"],
              }}
            >
              <ResumePDFText style={templateStyles.jobTitle}>
                {jobTitle}
              </ResumePDFText>
              <ResumePDFText style={templateStyles.date}>{date}</ResumePDFText>
            </View>
            <View style={{ ...styles.flexCol, marginTop: spacing["1.5"] }}>
              <ResumePDFBulletList
                items={descriptions}
                showBulletPoints={false}
                bulletStyle={templateStyles.bullet}
              />
            </View>
          </View>
        );
      })}
    </ResumePDFSection>
  );
};
