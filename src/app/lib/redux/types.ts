// 语言相关类型
export type SupportedLanguage = "zh" | "en";

export interface ResumeProfile {
  name: string;
  email: string;
  phone: string;
  url: string;
  summary: string[]; // 修改为字符串数组以支持换行
  location: string;
  photoUrl: string; // 添加照片 URL 字段
}

export interface ResumeWorkExperience {
  id: string;
  company: string;
  jobTitle: string;
  date: string;
  descriptions: string[];
}

export interface ResumeEducation {
  id: string;
  school: string;
  degree: string;
  date: string;
  gpa: string;
  descriptions: string[];
}

export interface ResumeProject {
  id: string;
  project: string;
  date: string;
  descriptions: string[];
}

export interface FeaturedSkill {
  skill: string;
  rating: number;
}

export interface ResumeSkills {
  featuredSkills: FeaturedSkill[];
  descriptions: string[];
}

export interface ResumeCustom {
  descriptions: string[];
}

export interface Resume {
  profile: ResumeProfile;
  workExperiences: ResumeWorkExperience[];
  educations: ResumeEducation[];
  projects: ResumeProject[];
  skills: ResumeSkills;
  custom: ResumeCustom;
}

export type ResumeKey = keyof Resume;

// 新增：简历元数据
export interface ResumeMetadata {
  id: string;
  title: string;
  description?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

// 新增：完整的简历数据结构
export interface ResumeData {
  metadata: ResumeMetadata;
  content: Resume;
}

// 新增：简历管理状态
export interface ResumeManagerState {
  resumes: ResumeData[];
  currentResumeId: string | null;
}
