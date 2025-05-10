import { Fragment } from "react";
import type { Resume } from "lib/redux/types";
import { initialEducation, initialWorkExperience } from "lib/redux/resumeSlice";
import { deepClone } from "lib/deep-clone";
import { cx } from "lib/cx";
import { useLanguage } from "../i18n/LanguageContext";

const TableRowHeader = ({ children }: { children: React.ReactNode }) => (
  <tr className="divide-x bg-gray-50">
    <th className="px-3 py-2 font-semibold" scope="colgroup" colSpan={2}>
      {children}
    </th>
  </tr>
);

const TableRow = ({
  label,
  value,
  className,
}: {
  label: string;
  value: string | string[];
  className?: string | false;
}) => (
  <tr className={cx("divide-x", className)}>
    <th className="px-3 py-2 font-medium" scope="row">
      {label}
    </th>
    <td className="w-full px-3 py-2">
      {typeof value === "string"
        ? value
        : value.map((x, idx) => (
            <Fragment key={idx}>
              • {x}
              <br />
            </Fragment>
          ))}
    </td>
  </tr>
);

export const ResumeTable = ({ resume }: { resume: Resume }) => {
  const { language } = useLanguage();
  const translateLabels = (key: string) => {
    const translations = {
      profile: { en: "Personal Info", zh: "个人资料" },
      name: { en: "Name", zh: "姓名" },
      email: { en: "Email", zh: "邮箱" },
      phone: { en: "Phone", zh: "电话" },
      location: { en: "Location", zh: "所在地" },
      url: { en: "Website", zh: "网站" },
      summary: { en: "Summary", zh: "个人简介" },
      education: { en: "Education", zh: "教育经历" },
      school: { en: "School", zh: "学校" },
      degree: { en: "Degree", zh: "学位" },
      gpa: { en: "GPA", zh: "GPA" },
      date: { en: "Date", zh: "日期" },
      description: { en: "Description", zh: "描述" },
      work: { en: "Work Experience", zh: "工作经历" },
      company: { en: "Company", zh: "公司" },
      jobTitle: { en: "Position", zh: "职位" },
      project: { en: "Projects", zh: "项目经历" },
      skills: { en: "Skills", zh: "技能" },
    };

    return (
      translations[key as keyof typeof translations]?.[
        language as "en" | "zh"
      ] || key
    );
  };

  const educations =
    resume.educations.length === 0
      ? [deepClone(initialEducation)]
      : resume.educations;
  const workExperiences =
    resume.workExperiences.length === 0
      ? [deepClone(initialWorkExperience)]
      : resume.workExperiences;
  const skills = [...resume.skills.descriptions];
  const featuredSkills = resume.skills.featuredSkills
    .filter((item) => item.skill.trim())
    .map((item) => item.skill)
    .join(", ")
    .trim();
  if (featuredSkills) {
    skills.unshift(featuredSkills);
  }
  return (
    <table className="mt-2 w-full border text-sm text-gray-900">
      <tbody className="divide-y text-left align-top">
        <TableRowHeader>{translateLabels("profile")}</TableRowHeader>
        <TableRow label={translateLabels("name")} value={resume.profile.name} />
        <TableRow
          label={translateLabels("email")}
          value={resume.profile.email}
        />
        <TableRow
          label={translateLabels("phone")}
          value={resume.profile.phone}
        />
        <TableRow
          label={translateLabels("location")}
          value={resume.profile.location}
        />
        <TableRow label={translateLabels("url")} value={resume.profile.url} />
        <TableRow
          label={translateLabels("summary")}
          value={
            Array.isArray(resume.profile.summary)
              ? resume.profile.summary
              : [resume.profile.summary]
          }
        />
        <TableRowHeader>{translateLabels("education")}</TableRowHeader>
        {educations.map((education, idx) => (
          <Fragment key={idx}>
            <TableRow
              label={translateLabels("school")}
              value={education.school}
            />
            <TableRow
              label={translateLabels("degree")}
              value={education.degree}
            />
            <TableRow label={translateLabels("gpa")} value={education.gpa} />
            <TableRow label={translateLabels("date")} value={education.date} />
            <TableRow
              label={translateLabels("description")}
              value={education.descriptions}
              className={
                educations.length - 1 !== 0 &&
                idx !== educations.length - 1 &&
                "!border-b-4"
              }
            />
          </Fragment>
        ))}
        <TableRowHeader>{translateLabels("work")}</TableRowHeader>
        {workExperiences.map((workExperience, idx) => (
          <Fragment key={idx}>
            <TableRow
              label={translateLabels("company")}
              value={workExperience.company}
            />
            <TableRow
              label={translateLabels("jobTitle")}
              value={workExperience.jobTitle}
            />
            <TableRow
              label={translateLabels("date")}
              value={workExperience.date}
            />
            <TableRow
              label={translateLabels("description")}
              value={workExperience.descriptions}
              className={
                workExperiences.length - 1 !== 0 &&
                idx !== workExperiences.length - 1 &&
                "!border-b-4"
              }
            />
          </Fragment>
        ))}
        {resume.projects.length > 0 && (
          <TableRowHeader>{translateLabels("project")}</TableRowHeader>
        )}
        {resume.projects.map((project, idx) => (
          <Fragment key={idx}>
            <TableRow
              label={translateLabels("project")}
              value={project.project}
            />
            <TableRow label={translateLabels("date")} value={project.date} />
            <TableRow
              label={translateLabels("description")}
              value={project.descriptions}
              className={
                resume.projects.length - 1 !== 0 &&
                idx !== resume.projects.length - 1 &&
                "!border-b-4"
              }
            />
          </Fragment>
        ))}
        <TableRowHeader>{translateLabels("skills")}</TableRowHeader>
        <TableRow label={translateLabels("description")} value={skills} />
      </tbody>
    </table>
  );
};
