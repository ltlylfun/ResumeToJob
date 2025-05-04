import { Fragment } from "react";
import type { Resume } from "lib/redux/types";
import { initialEducation, initialWorkExperience } from "lib/redux/resumeSlice";
import { deepClone } from "lib/deep-clone";
import { cx } from "lib/cx";

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
        <TableRowHeader>个人资料</TableRowHeader>
        <TableRow label="姓名" value={resume.profile.name} />
        <TableRow label="邮箱" value={resume.profile.email} />
        <TableRow label="电话" value={resume.profile.phone} />
        <TableRow label="所在地" value={resume.profile.location} />
        <TableRow label="网站" value={resume.profile.url} />
        <TableRow
          label="个人简介"
          value={
            Array.isArray(resume.profile.summary)
              ? resume.profile.summary
              : [resume.profile.summary]
          }
        />
        <TableRowHeader>教育经历</TableRowHeader>
        {educations.map((education, idx) => (
          <Fragment key={idx}>
            <TableRow label="学校" value={education.school} />
            <TableRow label="学位" value={education.degree} />
            <TableRow label="GPA" value={education.gpa} />
            <TableRow label="日期" value={education.date} />
            <TableRow
              label="描述"
              value={education.descriptions}
              className={
                educations.length - 1 !== 0 &&
                idx !== educations.length - 1 &&
                "!border-b-4"
              }
            />
          </Fragment>
        ))}
        <TableRowHeader>工作经历</TableRowHeader>
        {workExperiences.map((workExperience, idx) => (
          <Fragment key={idx}>
            <TableRow label="公司" value={workExperience.company} />
            <TableRow label="职位" value={workExperience.jobTitle} />
            <TableRow label="日期" value={workExperience.date} />
            <TableRow
              label="描述"
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
          <TableRowHeader>项目经历</TableRowHeader>
        )}
        {resume.projects.map((project, idx) => (
          <Fragment key={idx}>
            <TableRow label="项目" value={project.project} />
            <TableRow label="日期" value={project.date} />
            <TableRow
              label="描述"
              value={project.descriptions}
              className={
                resume.projects.length - 1 !== 0 &&
                idx !== resume.projects.length - 1 &&
                "!border-b-4"
              }
            />
          </Fragment>
        ))}
        <TableRowHeader>技能</TableRowHeader>
        <TableRow label="描述" value={skills} />
      </tbody>
    </table>
  );
};
