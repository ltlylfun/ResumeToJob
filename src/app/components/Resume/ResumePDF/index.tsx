import { Page, View, Document } from "@react-pdf/renderer";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import { ResumePDFProfile } from "components/Resume/ResumePDF/ResumePDFProfile";
import { ResumePDFWorkExperience } from "components/Resume/ResumePDF/ResumePDFWorkExperience";
import { ResumePDFEducation } from "components/Resume/ResumePDF/ResumePDFEducation";
import { ResumePDFProject } from "components/Resume/ResumePDF/ResumePDFProject";
import { ResumePDFSkills } from "components/Resume/ResumePDF/ResumePDFSkills";
import { ResumePDFCustom } from "components/Resume/ResumePDF/ResumePDFCustom";
import { DEFAULT_FONT_COLOR } from "lib/redux/settingsSlice";
import type { Settings, ShowForm } from "lib/redux/settingsSlice";
import type { Resume } from "lib/redux/types";
import { SuppressResumePDFErrorMessage } from "components/Resume/ResumePDF/common/SuppressResumePDFErrorMessage";
import { getTemplateStyles } from "components/Resume/ResumePDF/templates";

/**
 * Note: ResumePDF is supposed to be rendered inside PDFViewer. However,
 * PDFViewer is rendered too slow and has noticeable delay as you enter
 * the resume form, so we render it without PDFViewer to make it render
 * instantly. There are 2 drawbacks with this approach:
 * 1. Not everything works out of box if not rendered inside PDFViewer,
 *    e.g. svg doesn't work, so it takes in a isPDF flag that maps react
 *    pdf element to the correct dom element.
 * 2. It throws a lot of errors in console log, e.g. "<VIEW /> is using incorrect
 *    casing. Use PascalCase for React components, or lowercase for HTML elements."
 *    in development, causing a lot of noises. We can possibly workaround this by
 *    mapping every react pdf element to a dom element, but for now, we simply
 *    suppress these messages in <SuppressResumePDFErrorMessage />.
 *    https://github.com/diegomura/react-pdf/issues/239#issuecomment-487255027
 */
export const ResumePDF = ({
  resume,
  settings,
  isPDF = false,
}: {
  resume: Resume;
  settings: Settings;
  isPDF?: boolean;
}) => {
  const { profile, workExperiences, educations, projects, skills, custom } =
    resume;
  const { name } = profile;
  const {
    fontFamily,
    fontSize,
    documentSize,
    formToHeading,
    formToShow,
    formsOrder,
    template,
  } = settings;
  const themeColor = settings.themeColor || DEFAULT_FONT_COLOR;

  // 检查各个板块是否有内容
  const hasContent = {
    workExperiences:
      workExperiences.length > 0 &&
      workExperiences.some(
        (exp) =>
          exp.company ||
          exp.jobTitle ||
          exp.date ||
          (exp.descriptions && exp.descriptions.length > 0)
      ),
    educations:
      educations.length > 0 &&
      educations.some(
        (edu) =>
          edu.school ||
          edu.degree ||
          edu.date ||
          edu.gpa ||
          (edu.descriptions && edu.descriptions.length > 0)
      ),
    projects:
      projects.length > 0 &&
      projects.some(
        (proj) =>
          proj.project ||
          proj.date ||
          (proj.descriptions && proj.descriptions.length > 0)
      ),
    skills:
      skills.featuredSkills.some((skill) => skill.skill) ||
      (skills.descriptions && skills.descriptions.length > 0),
    custom: custom.descriptions && custom.descriptions.length > 0,
  };

  // 过滤出有内容且被设置为显示的板块
  const showFormsOrder = formsOrder.filter(
    (form) => formToShow[form] && hasContent[form]
  );

  // 从模板文件中获取样式
  const templateStyles = getTemplateStyles(
    template || "classic",
    themeColor,
    spacing
  );

  const formTypeToComponent: { [type in ShowForm]: () => JSX.Element } = {
    workExperiences: () => (
      <ResumePDFWorkExperience
        heading={formToHeading["workExperiences"]}
        workExperiences={workExperiences}
        themeColor={themeColor}
        templateStyles={templateStyles}
      />
    ),
    educations: () => (
      <ResumePDFEducation
        heading={formToHeading["educations"]}
        educations={educations}
        themeColor={themeColor}
        showBulletPoints={false}
        templateStyles={templateStyles}
      />
    ),
    projects: () => (
      <ResumePDFProject
        heading={formToHeading["projects"]}
        projects={projects}
        themeColor={themeColor}
        templateStyles={templateStyles}
      />
    ),
    skills: () => (
      <ResumePDFSkills
        heading={formToHeading["skills"]}
        skills={skills}
        themeColor={themeColor}
        showBulletPoints={false}
        templateStyles={templateStyles}
      />
    ),
    custom: () => (
      <ResumePDFCustom
        heading={formToHeading["custom"]}
        custom={custom}
        themeColor={themeColor}
        showBulletPoints={false}
        templateStyles={templateStyles}
      />
    ),
  };

  return (
    <>
      <Document title={`${name} Resume`} author={name} producer={"OpenResume"}>
        <Page
          size={documentSize === "A4" ? "A4" : "LETTER"}
          style={{
            ...styles.flexCol,
            color: DEFAULT_FONT_COLOR,
            fontFamily,
            fontSize: fontSize + "pt",
          }}
        >
          {Boolean(settings.themeColor) && (
            <View style={templateStyles.header} />
          )}
          <View
            style={{
              ...styles.flexCol,
              ...templateStyles.content,
            }}
          >
            {" "}
            <ResumePDFProfile
              profile={profile}
              themeColor={themeColor}
              isPDF={isPDF}
              showBulletPoints={false}
              templateStyles={templateStyles}
            />
            {showFormsOrder.map((form) => {
              const Component = formTypeToComponent[form];
              return <Component key={form} />;
            })}
          </View>
        </Page>
      </Document>
      <SuppressResumePDFErrorMessage />
    </>
  );
};
