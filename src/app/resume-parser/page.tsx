"use client";
import { useState, useEffect } from "react";
import { readPdf } from "lib/parse-resume-from-pdf/read-pdf";
import type { TextItems } from "lib/parse-resume-from-pdf/types";
import { groupTextItemsIntoLines } from "lib/parse-resume-from-pdf/group-text-items-into-lines";
import { groupLinesIntoSections } from "lib/parse-resume-from-pdf/group-lines-into-sections";
import { extractResumeFromSections } from "lib/parse-resume-from-pdf/extract-resume-from-sections";
import { ResumeDropzone } from "components/ResumeDropzone";
import { cx } from "lib/cx";
import { Heading, Link, Paragraph } from "components/documentation";
import { ResumeTable } from "resume-parser/ResumeTable";
import { FlexboxSpacer } from "components/FlexboxSpacer";
import { ResumeParserAlgorithmArticle } from "resume-parser/ResumeParserAlgorithmArticle";
import { useLanguageRedux } from "../lib/hooks/useLanguageRedux";

const RESUME_EXAMPLES = [
  {
    fileUrl: "resume-example/laverne-resume.pdf",
    descriptionEn: (
      <span>
        Borrowed from University of La Verne Career Center -{" "}
        <Link href="https://laverne.edu/careers/wp-content/uploads/sites/15/2010/12/Undergraduate-Student-Resume-Examples.pdf">
          Link
        </Link>
      </span>
    ),
    descriptionZh: (
      <span>
        来自拉文大学职业中心 -{" "}
        <Link href="https://laverne.edu/careers/wp-content/uploads/sites/15/2010/12/Undergraduate-Student-Resume-Examples.pdf">
          链接
        </Link>
      </span>
    ),
  },
  {
    fileUrl: "resume-example/openresume-resume.pdf",
    descriptionEn: (
      <span>
        Created with OpenResume resume builder -{" "}
        <Link href="/resume-builder">Link</Link>
      </span>
    ),
    descriptionZh: (
      <span>
        使用OpenResume简历生成器创建 - <Link href="/resume-builder">链接</Link>
      </span>
    ),
  },
];

const defaultFileUrl = RESUME_EXAMPLES[0]["fileUrl"];
export default function ResumeParser() {
  const { language } = useLanguageRedux();
  const [fileUrl, setFileUrl] = useState(defaultFileUrl);
  const [textItems, setTextItems] = useState<TextItems>([]);
  const lines = groupTextItemsIntoLines(textItems || []);
  const sections = groupLinesIntoSections(lines);
  const resume = extractResumeFromSections(sections);

  // 翻译函数
  const translate = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      title: {
        en: "Resume Parser Playground",
        zh: "简历解析器演示",
      },
      description: {
        en: "This playground showcases the OpenResume resume parser and its ability to parse information from a resume PDF. Click around the PDF examples below to observe different parsing results.",
        zh: "此演示展示了OpenResume简历解析器及其从PDF简历中解析信息的能力。点击下方的PDF示例，观察不同的解析结果。",
      },
      example: {
        en: "Resume Example",
        zh: "简历示例",
      },
      addYours: {
        en: "You can also add your resume below to access how well your resume would be parsed by similar Application Tracking Systems (ATS) used in job applications. The more information it can parse out, the better it indicates the resume is well formatted and easy to read. It is beneficial to have the name and email accurately parsed at the very least.",
        zh: "您还可以在下方添加自己的简历，以评估求职应用中使用的类似申请跟踪系统(ATS)解析您简历的效果。能够解析的信息越多，越表明简历格式良好，易于阅读。至少应确保姓名和电子邮件能被准确解析。",
      },
      results: {
        en: "Resume Parsing Results",
        zh: "简历解析结果",
      },
    };

    return translations[key]?.[language] || key;
  };

  useEffect(() => {
    async function test() {
      const textItems = await readPdf(fileUrl);
      setTextItems(textItems);
    }
    test();
  }, [fileUrl]);

  return (
    <main className="h-full w-full overflow-hidden">
      <div className="grid md:grid-cols-6">
        <div className="flex justify-center px-2 md:col-span-3 md:h-[calc(100vh-var(--top-nav-bar-height))] md:justify-end">
          <section className="mt-5 grow px-4 md:max-w-[600px] md:px-0">
            <div className="aspect-h-[9.5] aspect-w-7">
              <iframe src={`${fileUrl}#navpanes=0`} className="h-full w-full" />
            </div>
          </section>
          <FlexboxSpacer maxWidth={30} className="hidden md:block" />
        </div>
        <div className="flex px-6 text-gray-900 md:col-span-3 md:h-[calc(100vh-var(--top-nav-bar-height))] md:overflow-y-scroll">
          <FlexboxSpacer maxWidth={30} className="hidden md:block" />
          <section className="max-w-[600px] grow">
            <Heading className="text-primary !mt-4">
              {translate("title")}
            </Heading>
            <Paragraph smallMarginTop={true}>
              {translate("description")}
            </Paragraph>
            <div className="mt-3 flex gap-3">
              {RESUME_EXAMPLES.map((example, idx) => (
                <article
                  key={idx}
                  className={cx(
                    "flex-1 cursor-pointer rounded-md border-2 px-4 py-3 shadow-sm outline-none hover:bg-gray-50 focus:bg-gray-50",
                    example.fileUrl === fileUrl
                      ? "border-blue-400"
                      : "border-gray-300"
                  )}
                  onClick={() => setFileUrl(example.fileUrl)}
                  onKeyDown={(e) => {
                    if (["Enter", " "].includes(e.key))
                      setFileUrl(example.fileUrl);
                  }}
                  tabIndex={0}
                >
                  <h1 className="font-semibold">
                    {translate("example")} {idx + 1}
                  </h1>
                  <p className="mt-2 text-sm text-gray-500">
                    {language === "en"
                      ? example.descriptionEn
                      : example.descriptionZh}
                  </p>
                </article>
              ))}
            </div>
            <Paragraph>{translate("addYours")}</Paragraph>
            <div className="mt-3">
              <ResumeDropzone
                onFileUrlChange={(fileUrl) =>
                  setFileUrl(fileUrl || defaultFileUrl)
                }
                playgroundView={true}
              />
            </div>
            <Heading level={2} className="!mt-[1.2em]">
              {translate("results")}
            </Heading>
            <ResumeTable resume={resume} />
            <ResumeParserAlgorithmArticle
              textItems={textItems}
              lines={lines}
              sections={sections}
            />
            <div className="pt-24" />
          </section>
        </div>
      </div>
    </main>
  );
}
