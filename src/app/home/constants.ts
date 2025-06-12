import {
  initialEducation,
  initialProfile,
  initialProject,
  initialWorkExperience,
} from "lib/redux/resumeSlice";
import type { Resume } from "lib/redux/types";
import { deepClone } from "lib/deep-clone";
import kenan from "public/assets/kenan.jpg";
import { SupportedLanguage } from "../lib/redux/types";

export const END_HOME_RESUME_ZH: Resume = {
  profile: {
    name: "江户川 柯南",
    summary: ["• 帝丹高中-休学中", "• 帝丹小学-在读"], // 修改为数组
    email: "Konan@Konan.com",
    phone: "11111111111",
    location: "米花町5丁目毛利侦探事务所",
    url: "konan.com",
    photoUrl: kenan.src,
  },
  workExperiences: [
    {
      id: "work-1",
      company: "少年侦探团",
      jobTitle: "团长",
      date: "身体缩小至今",
      descriptions: [
        "• 带领少年侦探团成员步美、元太、光彦及灰原哀，解决各类儿童失踪、寻宝解谜等案件，累计处理案件 50 余起，培养团队成员的侦查与协作能力。",
        "• 在 '失踪的光彦' 案件中，冷静分析线索，利用团队成员各自优势，在废弃工厂找到被绑架的光彦；在 '少年侦探团寻宝事件' 里，凭借对暗号的解读，带领团队成功找到隐藏的宝藏，锻炼了团队的推理与实践能力。",
        "• 在 '图书馆杀人事件' 中，发现图书馆管理员的异常举动，带领团队在深夜潜入图书馆。面对黑暗阴森的环境和狡猾的凶手，柯南引导大家仔细搜索，最终在电梯顶部发现尸体，并巧妙设计让凶手露出马脚，成功将其制服。",
      ],
    },
    {
      id: "work-2",
      company: "毛利侦探事务所",
      jobTitle: "实习侦探",
      date: "身体缩小至今",
      descriptions: [
        "• 协助毛利小五郎处理各类案件，独立完成线索收集、嫌疑人调查、现场勘查等工作，主导或参与侦破案件超 500 起",
        "• 在 '浴室密室杀人事件' 中，柯南对密室进行细致分析，注意到门锁的特殊构造和水渍痕迹，通过还原案发过程，识破凶手利用胶带和拖把制造密室的诡计，为案件侦破提供了关键突破。",
      ],
    },
  ],
  educations: [],
  projects: [
    {
      id: "project-1",
      project: "黑衣组织调查项目",
      date: "",
      descriptions: [
        "• 作为核心调查人员，持续对黑衣组织展开深度调查。通过收集组织成员遗留的蛛丝马迹，如在 '电玩公司杀人事件' 中，从组织成员交易现场残留的特殊烟蒂和加密手机信息入手，顺藤摸瓜追踪到组织在米花町的一处秘密据点 。面对组织成员的高度警惕和反侦察手段，巧妙利用少年侦探团成员的身份作掩护，暗中观察组织人员行动，获取关键情报。",
        "• 在调查过程中，成功破解组织内部使用的多种加密通讯方式，例如通过分析组织邮件中的特殊符号组合规律，破译出其时间与地点的传递密码，从而掌握了组织多起交易和暗杀计划。还协助警方布局，在关键时机对组织行动进行干扰和破坏，成功阻止了一起跨国走私武器的非法交易。同时，不断挖掘组织高层的身份信息，逐步揭开黑衣组织背后庞大的犯罪网络架构，为后续打击黑衣组织犯罪活动积累了大量核心情报支持。",
      ],
    },
    {
      id: "project-2",
      project: "红与黑的碰撞",
      date: "",
      descriptions: [
        "项目背景：黑衣组织策划大规模行动，FBI 与柯南共同应对，阻止组织阴谋并获取情报。",
        "• 制定 '赤井假死计划' 核心方案，与 FBI、CIA 紧密配合，安排各环节细节，包括假死现场布置、人员配合等，确保计划顺利实施。同时，在行动中推理组织下一步行动，保障己方人员安全。",
        "• 成功实施 '赤井假死计划'，使赤井秀一以冲矢昴的身份暗中活动；获取黑衣组织部分行动计划，打乱组织部署，延缓其犯罪进程，为后续对抗赢得先机。",
      ],
    },
  ],
  skills: {
    featuredSkills: [
      { skill: "推理能力", rating: 5 },
      { skill: "道具大师", rating: 5 },
      { skill: "足球特技", rating: 5 },
      { skill: "语言能力", rating: 5 },
      { skill: "伪装天赋", rating: 5 },
      { skill: "音乐天赋", rating: 1 },
    ],
    descriptions: [
      "• 精通犯罪现场分析与逻辑推演，通过微表情和细节锁定真凶",
      "• 灵活运用蝴蝶结变声器、麻醉手表及增强脚力鞋，以足球为武器",
    ],
  },
  custom: {
    descriptions: [],
  },
};

// // 英文示例简历
// export const END_HOME_RESUME_EN: Resume = {};

// 根据语言选择不同的示例简历
export const getResumeByLang = (lang: SupportedLanguage): Resume => {
  // 无论语言设置如何，总是返回中文版简历
  return END_HOME_RESUME_ZH;
};

// 导出默认示例简历（用于向后兼容）
export const END_HOME_RESUME = END_HOME_RESUME_ZH;

// 创建简历起始状态
export const START_HOME_RESUME: Resume = {
  profile: {
    ...deepClone(initialProfile),
    photoUrl: END_HOME_RESUME_ZH.profile.photoUrl, // 确保照片在开始就显示
  },
  workExperiences: END_HOME_RESUME_ZH.workExperiences.map((_, index) => {
    const workExp = deepClone(initialWorkExperience);
    workExp.id = `start-work-${index + 1}`;
    return workExp;
  }),
  educations: [],
  projects: [
    {
      ...deepClone(initialProject),
      id: "start-project-1",
    },
  ],
  skills: {
    featuredSkills: END_HOME_RESUME_ZH.skills.featuredSkills.map(
      (item: any) => ({
        skill: "",
        rating: item.rating,
      })
    ),
    descriptions: [],
  },
  custom: {
    descriptions: [],
  },
};
