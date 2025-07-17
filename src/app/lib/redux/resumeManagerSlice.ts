import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "lib/redux/store";
import { deepClone } from "lib/deep-clone";
import { generateUniqueId } from "lib/utils/string-utils";
import type {
  ResumeData,
  ResumeManagerState,
  ResumeMetadata,
  Resume,
  ResumeProfile,
  ResumeWorkExperience,
  ResumeEducation,
  ResumeProject,
  ResumeSkills,
  FeaturedSkill,
} from "lib/redux/types";
import type { ShowForm } from "lib/redux/settingsSlice";

// 从 resumeSlice 移植的初始状态定义
export const initialProfile: ResumeProfile = {
  name: "",
  summary: [],
  email: "",
  phone: "",
  location: "",
  url: "",
  photoUrl: "",
};

export const initialWorkExperience: ResumeWorkExperience = {
  id: "initial-work-1",
  company: "",
  jobTitle: "",
  date: "",
  descriptions: [],
};

export const initialEducation: ResumeEducation = {
  id: "initial-education-1",
  school: "",
  degree: "",
  gpa: "",
  date: "",
  descriptions: [],
};

export const initialProject: ResumeProject = {
  id: "initial-project-1",
  project: "",
  date: "",
  descriptions: [],
};

export const initialFeaturedSkill: FeaturedSkill = { skill: "", rating: 4 };
export const initialFeaturedSkills: FeaturedSkill[] = Array(6).fill({
  ...initialFeaturedSkill,
});
export const initialSkills: ResumeSkills = {
  featuredSkills: initialFeaturedSkills,
  descriptions: [],
};

export const initialCustom = {
  descriptions: [],
};

export const initialResumeState: Resume = {
  profile: initialProfile,
  workExperiences: [initialWorkExperience],
  educations: [initialEducation],
  projects: [initialProject],
  skills: initialSkills,
  custom: initialCustom,
};

// Keep the field & value type in sync with CreateHandleChangeArgsWithDescriptions (components\ResumeForm\types.ts)
export type CreateChangeActionWithDescriptions<T> = {
  idx: number;
} & (
  | {
      field: Exclude<keyof T, "descriptions">;
      value: string;
    }
  | { field: "descriptions"; value: string[] }
);

const initialState: ResumeManagerState = {
  resumes: [],
  currentResumeId: null,
};

export const resumeManagerSlice = createSlice({
  name: "resumeManager",
  initialState,
  reducers: {
    // 创建新简历
    createResume: (
      state,
      action: PayloadAction<{
        title: string;
      }>,
    ) => {
      const { title } = action.payload;
      const now = new Date().toISOString();

      const newResume: ResumeData = {
        metadata: {
          id: `resume-${Date.now()}`,
          title,
          tags: [],
          createdAt: now,
          updatedAt: now,
        },
        content: initialResumeState,
      };

      state.resumes.push(newResume);
      state.currentResumeId = newResume.metadata.id;
    },

    // 克隆现有简历
    cloneResume: (
      state,
      action: PayloadAction<{ resumeId: string; title: string }>,
    ) => {
      const { resumeId, title } = action.payload;
      const sourceResume = state.resumes.find(
        (r) => r.metadata.id === resumeId,
      );

      if (sourceResume) {
        const now = new Date().toISOString();
        const newResume: ResumeData = {
          metadata: {
            ...sourceResume.metadata,
            id: `resume-${Date.now()}`,
            title,
            createdAt: now,
            updatedAt: now,
          },
          content: deepClone(sourceResume.content),
        };

        state.resumes.push(newResume);
        state.currentResumeId = newResume.metadata.id;
      }
    },

    // 删除简历
    deleteResume: (state, action: PayloadAction<string>) => {
      const resumeId = action.payload;
      state.resumes = state.resumes.filter((r) => r.metadata.id !== resumeId);

      // 如果删除的是当前简历，切换到第一个简历
      if (state.currentResumeId === resumeId) {
        state.currentResumeId =
          state.resumes.length > 0 ? state.resumes[0].metadata.id : null;
      }
    },

    // 切换当前简历
    switchResume: (state, action: PayloadAction<string>) => {
      const resumeId = action.payload;
      if (state.resumes.some((r) => r.metadata.id === resumeId)) {
        state.currentResumeId = resumeId;
      }
    },

    // 更新简历元数据
    updateResumeMetadata: (
      state,
      action: PayloadAction<{ id: string; metadata: Partial<ResumeMetadata> }>,
    ) => {
      const { id, metadata } = action.payload;
      const resume = state.resumes.find((r) => r.metadata.id === id);

      if (resume) {
        resume.metadata = {
          ...resume.metadata,
          ...metadata,
          updatedAt: new Date().toISOString(),
        };
      }
    },

    // 更新简历内容
    updateResumeContent: (
      state,
      action: PayloadAction<{ id: string; content: Resume }>,
    ) => {
      const { id, content } = action.payload;
      const resume = state.resumes.find((r) => r.metadata.id === id);

      if (resume) {
        resume.content = content;
        resume.metadata.updatedAt = new Date().toISOString();
      }
    },

    // 导入简历数据
    importResumes: (state, action: PayloadAction<ResumeData[]>) => {
      const importedResumes = action.payload;
      importedResumes.forEach((resume) => {
        // 确保ID唯一
        const existingIds = state.resumes.map((r) => r.metadata.id);
        if (existingIds.includes(resume.metadata.id)) {
          resume.metadata.id = generateUniqueId("resume");
        }
        state.resumes.push(resume);
      });
    },

    // 设置所有简历数据（用于初始化）
    setAllResumes: (state, action: PayloadAction<ResumeManagerState>) => {
      return { ...action.payload };
    },

    // 从 resumeSlice 移植的简历内容编辑 actions
    changeProfile: (
      state,
      action: PayloadAction<{
        field: keyof ResumeProfile;
        value: string | string[];
      }>,
    ) => {
      const currentResume = state.resumes.find(
        (r) => r.metadata.id === state.currentResumeId,
      );
      if (currentResume) {
        const { field, value } = action.payload;
        currentResume.content.profile[field] = value as any;
        currentResume.metadata.updatedAt = new Date().toISOString();
      }
    },

    changeWorkExperiences: (
      state,
      action: PayloadAction<
        CreateChangeActionWithDescriptions<ResumeWorkExperience>
      >,
    ) => {
      const currentResume = state.resumes.find(
        (r) => r.metadata.id === state.currentResumeId,
      );
      if (currentResume) {
        const { idx, field, value } = action.payload;
        const workExperience = currentResume.content.workExperiences[idx];
        workExperience[field] = value as any;
        currentResume.metadata.updatedAt = new Date().toISOString();
      }
    },

    changeEducations: (
      state,
      action: PayloadAction<
        CreateChangeActionWithDescriptions<ResumeEducation>
      >,
    ) => {
      const currentResume = state.resumes.find(
        (r) => r.metadata.id === state.currentResumeId,
      );
      if (currentResume) {
        const { idx, field, value } = action.payload;
        const education = currentResume.content.educations[idx];
        education[field] = value as any;
        currentResume.metadata.updatedAt = new Date().toISOString();
      }
    },

    changeProjects: (
      state,
      action: PayloadAction<CreateChangeActionWithDescriptions<ResumeProject>>,
    ) => {
      const currentResume = state.resumes.find(
        (r) => r.metadata.id === state.currentResumeId,
      );
      if (currentResume) {
        const { idx, field, value } = action.payload;
        const project = currentResume.content.projects[idx];
        project[field] = value as any;
        currentResume.metadata.updatedAt = new Date().toISOString();
      }
    },

    changeSkills: (
      state,
      action: PayloadAction<
        | { field: "descriptions"; value: string[] }
        | {
            field: "featuredSkills";
            idx: number;
            skill: string;
            rating: number;
          }
      >,
    ) => {
      const currentResume = state.resumes.find(
        (r) => r.metadata.id === state.currentResumeId,
      );
      if (currentResume) {
        const { field } = action.payload;
        if (field === "descriptions") {
          const { value } = action.payload;
          currentResume.content.skills.descriptions = value;
        } else {
          const { idx, skill, rating } = action.payload;
          const featuredSkill =
            currentResume.content.skills.featuredSkills[idx];
          featuredSkill.skill = skill;
          featuredSkill.rating = rating;
        }
        currentResume.metadata.updatedAt = new Date().toISOString();
      }
    },

    changeCustom: (
      state,
      action: PayloadAction<{ field: "descriptions"; value: string[] }>,
    ) => {
      const currentResume = state.resumes.find(
        (r) => r.metadata.id === state.currentResumeId,
      );
      if (currentResume) {
        const { value } = action.payload;
        currentResume.content.custom.descriptions = value;
        currentResume.metadata.updatedAt = new Date().toISOString();
      }
    },

    addSectionInForm: (state, action: PayloadAction<{ form: ShowForm }>) => {
      const currentResume = state.resumes.find(
        (r) => r.metadata.id === state.currentResumeId,
      );
      if (currentResume) {
        const { form } = action.payload;
        switch (form) {
          case "workExperiences": {
            const newWorkExperience = structuredClone(initialWorkExperience);
            newWorkExperience.id = generateUniqueId();
            currentResume.content.workExperiences.push(newWorkExperience);
            break;
          }
          case "educations": {
            const newEducation = structuredClone(initialEducation);
            newEducation.id = generateUniqueId();
            currentResume.content.educations.push(newEducation);
            break;
          }
          case "projects": {
            const newProject = structuredClone(initialProject);
            newProject.id = generateUniqueId();
            currentResume.content.projects.push(newProject);
            break;
          }
        }
        currentResume.metadata.updatedAt = new Date().toISOString();
      }
    },

    moveSectionInForm: (
      state,
      action: PayloadAction<{
        form: ShowForm;
        idx: number;
        direction: "up" | "down";
      }>,
    ) => {
      const currentResume = state.resumes.find(
        (r) => r.metadata.id === state.currentResumeId,
      );
      if (currentResume) {
        const { form, idx, direction } = action.payload;
        if (form !== "skills" && form !== "custom") {
          const sections = currentResume.content[form];
          if (
            (idx === 0 && direction === "up") ||
            (idx === sections.length - 1 && direction === "down")
          ) {
            return;
          }

          const section = sections[idx];
          if (direction === "up") {
            sections[idx] = sections[idx - 1];
            sections[idx - 1] = section;
          } else {
            sections[idx] = sections[idx + 1];
            sections[idx + 1] = section;
          }
          currentResume.metadata.updatedAt = new Date().toISOString();
        }
      }
    },

    deleteSectionInFormByIdx: (
      state,
      action: PayloadAction<{ form: ShowForm; idx: number }>,
    ) => {
      const currentResume = state.resumes.find(
        (r) => r.metadata.id === state.currentResumeId,
      );
      if (currentResume) {
        const { form, idx } = action.payload;
        if (form !== "skills" && form !== "custom") {
          currentResume.content[form].splice(idx, 1);
          currentResume.metadata.updatedAt = new Date().toISOString();
        }
      }
    },

    setResume: (state, action: PayloadAction<Resume>) => {
      const currentResume = state.resumes.find(
        (r) => r.metadata.id === state.currentResumeId,
      );
      if (currentResume) {
        currentResume.content = action.payload;
        currentResume.metadata.updatedAt = new Date().toISOString();
      }
    },
  },
});

export const {
  createResume,
  cloneResume,
  deleteResume,
  switchResume,
  updateResumeMetadata,
  updateResumeContent,
  importResumes,
  setAllResumes,
  // 从 resumeSlice 移植的 actions
  changeProfile,
  changeWorkExperiences,
  changeEducations,
  changeProjects,
  changeSkills,
  changeCustom,
  addSectionInForm,
  moveSectionInForm,
  deleteSectionInFormByIdx,
  setResume,
} = resumeManagerSlice.actions;

// Selectors
export const selectAllResumes = (state: RootState) =>
  state.resumeManager.resumes;
export const selectCurrentResumeId = (state: RootState) =>
  state.resumeManager.currentResumeId;
export const selectCurrentResume = (state: RootState) => {
  const currentId = state.resumeManager.currentResumeId;
  return currentId
    ? state.resumeManager.resumes.find((r) => r.metadata.id === currentId)
    : null;
};

// 从 resumeSlice 移植的 selectors - 这些现在基于当前选中的简历
export const selectResume = (state: RootState) => {
  const currentResume = selectCurrentResume(state);
  return currentResume ? currentResume.content : initialResumeState;
};

export const selectProfile = (state: RootState) => {
  const currentResume = selectCurrentResume(state);
  return currentResume ? currentResume.content.profile : initialProfile;
};

export const selectWorkExperiences = (state: RootState) => {
  const currentResume = selectCurrentResume(state);
  return currentResume
    ? currentResume.content.workExperiences
    : [initialWorkExperience];
};

export const selectEducations = (state: RootState) => {
  const currentResume = selectCurrentResume(state);
  return currentResume ? currentResume.content.educations : [initialEducation];
};

export const selectProjects = (state: RootState) => {
  const currentResume = selectCurrentResume(state);
  return currentResume ? currentResume.content.projects : [initialProject];
};

export const selectSkills = (state: RootState) => {
  const currentResume = selectCurrentResume(state);
  return currentResume ? currentResume.content.skills : initialSkills;
};

export const selectCustom = (state: RootState) => {
  const currentResume = selectCurrentResume(state);
  return currentResume ? currentResume.content.custom : initialCustom;
};

export default resumeManagerSlice.reducer;
