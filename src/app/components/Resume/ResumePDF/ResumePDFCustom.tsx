import { View } from "@react-pdf/renderer";
import {
  ResumePDFSection,
  ResumePDFBulletList,
} from "components/Resume/ResumePDF/common";
import { styles } from "components/Resume/ResumePDF/styles";
import type { ResumeCustom } from "lib/redux/types";
import type { TemplateStyles } from "components/Resume/ResumePDF/templates";

export const ResumePDFCustom = ({
  heading,
  custom,
  themeColor,
  templateStyles,
}: {
  heading: string;
  custom: ResumeCustom;
  themeColor: string;
  templateStyles: TemplateStyles;
}) => {
  const { descriptions } = custom;

  return (
    <ResumePDFSection
      themeColor={themeColor}
      heading={heading}
      style={templateStyles.section}
      titleStyle={templateStyles.sectionTitle}
    >
      <View style={{ ...styles.flexCol }}>
        <ResumePDFBulletList
          items={descriptions}
          bulletStyle={templateStyles.bullet}
        />
      </View>
    </ResumePDFSection>
  );
};
