export function getMetadata(lang: "zh" | "en" = "zh") {
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
  };
}
