import { Form, FormSection } from "components/ResumeForm/Form";
import {
  Input,
  BulletListTextarea,
} from "components/ResumeForm/Form/InputGroup";
import type { CreateHandleChangeArgsWithDescriptions } from "components/ResumeForm/types";
import { useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "lib/redux/hooks";
import { selectProjects, changeProjects } from "lib/redux/resumeSlice";
import type { ResumeProject } from "lib/redux/types";
import { useLanguageRedux } from "../../lib/hooks/useLanguageRedux";
import {
  changeFormHeading,
  updateFormHeadingIfNotCustomized,
} from "lib/redux/settingsSlice";

export const ProjectsForm = () => {
  const projects = useAppSelector(selectProjects);
  const dispatch = useAppDispatch();
  const { language } = useLanguageRedux();
  const showDelete = projects.length > 1;

  const translate = useCallback(
    (key: string) => {
      const translations: Record<string, Record<string, string>> = {
        projects: {
          en: "Projects",
          zh: "项目经历",
        },
        addProject: {
          en: "Add Project",
          zh: "添加项目",
        },
        deleteProject: {
          en: "Delete Project",
          zh: "删除项目",
        },
        projectName: {
          en: "Project Name",
          zh: "项目名称",
        },
        date: {
          en: "Date",
          zh: "日期",
        },
        projectDescription: {
          en: "Project Description",
          zh: "项目描述",
        },
      };

      return translations[key]?.[language] || key;
    },
    [language]
  );
  // 更新表单标题（仅在用户未自定义时）
  useEffect(() => {
    dispatch(
      updateFormHeadingIfNotCustomized({
        field: "projects",
        value: translate("projects"),
      })
    );
  }, [dispatch, language, translate]);

  return (
    <Form form="projects" addButtonText={translate("addProject")}>
      {projects.map(({ project, date, descriptions }, idx) => {
        const handleProjectChange = (
          ...[
            field,
            value,
          ]: CreateHandleChangeArgsWithDescriptions<ResumeProject>
        ) => {
          dispatch(changeProjects({ idx, field, value } as any));
        };
        const showMoveUp = idx !== 0;
        const showMoveDown = idx !== projects.length - 1;

        return (
          <FormSection
            key={idx}
            form="projects"
            idx={idx}
            showMoveUp={showMoveUp}
            showMoveDown={showMoveDown}
            showDelete={showDelete}
            deleteButtonTooltipText={translate("deleteProject")}
          >
            <Input
              name="project"
              label={translate("projectName")}
              placeholder=""
              value={project}
              onChange={handleProjectChange}
              labelClassName="col-span-4"
            />{" "}
            <Input
              name="date"
              label={translate("date")}
              placeholder=""
              value={date}
              onChange={handleProjectChange}
              labelClassName="col-span-2"
            />{" "}
            <BulletListTextarea
              name="descriptions"
              label={translate("projectDescription")}
              placeholder={
                language === "en"
                  ? "Input '- ' or '* ' to create an unordered list (with space after)\nInput '1. ' to create an ordered list (with space after)\nPress Enter to cancel if not needed\nInput '**text**' or '__text__' to make text bold"
                  : "输入 '- ' 或 '* ' 创建无序列表（注意空格）\n输入 '1. ' 创建有序列表（注意空格）\n如果不需要可以回车取消\n输入 '**文本**' 或 '__文本__' 创建粗体文本"
              }
              value={descriptions}
              onChange={handleProjectChange}
              labelClassName="col-span-full"
            />
          </FormSection>
        );
      })}
    </Form>
  );
};
