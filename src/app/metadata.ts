// filepath: c:\Users\z'j\Desktop\ResumeToJob\src\app\metadata.ts
// 元数据已直接在此文件中定义，不再依赖 translations.ts

export function getMetadata(lang: "zh" | "en" = "zh") {
  // 直接定义中英文元数据
  const metadataTranslations = {
    zh: {
      title: "ResumeToJob - 免费开源简历生成器和解析器",
      description:
        "ResumeToJob是一个免费、开源且功能强大的简历生成器，允许任何人通过3个简单步骤创建现代专业简历。",
    },
    en: {
      title: "ResumeToJob - Free Open-Source Resume Builder and Parser",
      description:
        "ResumeToJob is a free, open-source and powerful resume builder that allows anyone to create a modern and professional resume in 3 simple steps.",
    },
  };

  return {
    title: metadataTranslations[lang].title,
    description: metadataTranslations[lang].description,
    // 可以在这里添加更多的元数据
  };
}
