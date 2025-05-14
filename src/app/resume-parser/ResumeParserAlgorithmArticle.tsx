import { isBold } from "lib/parse-resume-from-pdf/extract-resume-from-sections/lib/common-features";
import {
  Badge,
  Heading,
  Link,
  Paragraph,
  Table,
} from "components/documentation";
import type {
  Line,
  Lines,
  ResumeSectionToLines,
  TextItem,
  TextItems,
  TextScores,
} from "lib/parse-resume-from-pdf/types";
import { extractProfile } from "lib/parse-resume-from-pdf/extract-resume-from-sections/extract-profile";
import { useLanguageRedux } from "../lib/hooks/useLanguageRedux";

export const ResumeParserAlgorithmArticle = ({
  textItems,
  lines,
  sections,
}: {
  textItems: TextItems;
  lines: Lines;
  sections: ResumeSectionToLines;
}) => {
  // 获取当前语言
  const { language } = useLanguageRedux();

  // 文章内容翻译函数
  const translate = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      title: {
        en: "Resume Parser Algorithm Deep Dive",
        zh: "简历解析算法深度解析",
      },
      subtitle: {
        en: "For the technical curious, this section will dive into the OpenResume parser algorithm and walks through the 4 steps on how it works. (Note that the algorithm is designed to parse single column resume in English language)",
        zh: "针对技术好奇者，本节将深入研究OpenResume解析器算法，并介绍其工作原理的4个步骤。(请注意，该算法设计用于解析英文单列简历)",
      },
      writtenBy: {
        en: "Written by",
        zh: "作者：",
      },
      date: {
        en: "on May 25, 2023",
        zh: "于2023年5月25日",
      },
      step1Title: {
        en: "Step 1. Read the text items from a PDF file",
        zh: "步骤1. 从PDF文件中读取文本项",
      },
      step1Para1: {
        en: "A PDF file is a standardized file format defined by the ISO 32000 specification. When you open up a PDF file using a text editor, you'll notice that the raw content looks encoded and is difficult to read. To display it in a readable format, you would need a PDF reader to decode and view the file. Similarly, the resume parser first needs to decode the PDF file in order to extract its text content.",
        zh: "PDF文件是由ISO 32000规范定义的标准文件格式。当您使用文本编辑器打开PDF文件时，您会注意到原始内容看起来是编码的，难以阅读。要以可读格式显示它，您需要PDF阅读器来解码和查看文件。同样，简历解析器首先需要解码PDF文件才能提取其文本内容。",
      },
      step1Para2: {
        en: "While it is possible to write a custom PDF reader function following the ISO 32000 specification, it is much simpler to leverage an existing library. In this case, the resume parser uses Mozilla's open source pdf.js library to first extract all the text items in the file.",
        zh: "虽然可以按照ISO 32000规范编写自定义PDF读取器函数，但使用现有库会更简单。在这种情况下，简历解析器使用Mozilla的开源pdf.js库首先提取文件中的所有文本项。",
      },
      step1Para3: {
        en: `The table below lists ${textItems.length} text items that are extracted from the resume PDF added. A text item contains the text content and also some metadata about the content, e.g. its x, y positions in the document, whether the font is bolded, or whether it starts a new line. (Note that x,y position is relative to the bottom left corner of the page, which is the origin 0,0)`,
        zh: `下表列出了从添加的简历PDF中提取的${textItems.length}个文本项。文本项包含文本内容和有关内容的一些元数据，例如在文档中的x、y位置，字体是否加粗，或是否开始新行。(注意x、y位置是相对于页面左下角的，原点为0,0)`,
      },
      step2Title: {
        en: "Step 2. Group text items into lines",
        zh: "步骤2. 将文本项分组到行中",
      },
      step2Para1: {
        en: "The extracted text items aren't ready to use yet and have 2 main issues:",
        zh: "提取的文本项尚未准备好使用，并有2个主要问题：",
      },
      step2Issue1: {
        en: "Issue 1: They have some unwanted noises.",
        zh: "问题1: 它们有一些不必要的噪音。",
      },
      step2Issue1Detail: {
        en: 'Some single text items can get broken into multiple ones, as you might observe on the table above, e.g. a phone number "(123) 456-7890" might be broken into 3 text items "(123) 456", "-" and "7890".',
        zh: '一些单个文本项可能被分解为多个项，正如您可能在上表中观察到的，例如一个电话号码"(123) 456-7890"可能被分解为3个文本项"(123) 456"、"-"和"7890"。',
      },
      step2Solution1: {
        en: "Solution:",
        zh: "解决方案:",
      },
      step2Solution1Detail: {
        en: "To tackle this issue, the resume parser connects adjacent text items into one text item if their distance is smaller than the average typical character width, where",
        zh: "为了解决这个问题，如果相邻文本项之间的距离小于平均典型字符宽度，简历解析器会将它们连接成一个文本项，其中",
      },
      step2Formula: {
        en: "The average typical character width is calculated by dividing the sum of all text items' widths by the total number characters of the text items (Bolded texts and new line elements are excluded to not skew the results).",
        zh: "平均典型字符宽度是通过将所有文本项的宽度总和除以文本项的总字符数来计算的（加粗文本和新行元素被排除以免扭曲结果）。",
      },
      step2Issue2: {
        en: "Issue 2: They lack contexts and associations.",
        zh: "问题2: 它们缺乏上下文和关联。",
      },
      step2Issue2Detail: {
        en: "When we read a resume, we scan a resume line by line. Our brains can process each section via visual cues such as texts' boldness and proximity, where we can quickly associate texts closer together to be a related group. The extracted text items however currently don't have those contexts/associations and are just disjointed elements.",
        zh: "当我们阅读简历时，我们逐行扫描简历。我们的大脑可以通过视觉线索（如文本的粗体和邻近度）处理每个部分，我们可以快速将更接近的文本关联为相关的组。然而，提取的文本项目前没有这些上下文/关联，它们只是不连贯的元素。",
      },
      step2Solution2: {
        en: "Solution:",
        zh: "解决方案:",
      },
      step2Solution2Detail: {
        en: "To tackle this issue, the resume parser reconstructs those contexts and associations similar to how our brain would read and process the resume. It first groups text items into lines since we read text line by line. It then groups lines into sections, which will be discussed in the next step.",
        zh: "为了解决这个问题，简历解析器重建了这些上下文和关联，类似于我们的大脑读取和处理简历的方式。它首先将文本项分组到行中，因为我们逐行阅读文本。然后它将行分组到章节中，这将在下一步中讨论。",
      },
      step2Para2: {
        en: `At the end of step 2, the resume parser extracts ${lines.length} lines from the resume PDF added, as shown in the table below. The result is much more readable when displayed in lines. (Some lines might have multiple text items, which are separated by a blue vertical divider`,
        zh: `在步骤2结束时，简历解析器从添加的简历PDF中提取了${lines.length}行，如下表所示。以行形式显示的结果更易读。（有些行可能包含多个文本项，它们由蓝色垂直分隔符分隔`,
      },
      step3Title: {
        en: "Step 3. Group lines into sections",
        zh: "步骤3. 将行分组到章节中",
      },
      step3Para1: {
        en: "At step 2, the resume parser starts building contexts and associations to text items by first grouping them into lines. Step 3 continues the process to build additional associations by grouping lines into sections.",
        zh: "在步骤2中，简历解析器开始通过首先将文本项分组到行中来建立上下文和关联。步骤3通过将行分组到章节中继续这个过程，构建额外的关联。",
      },
      step3Para2: {
        en: "Note that every section (except the profile section) starts with a section title that takes up the entire line. This is a common pattern not just in resumes but also in books and blogs. The resume parser uses this pattern to group lines into the closest section title above these lines.",
        zh: "请注意，每个章节（除了个人资料章节）都以占据整行的章节标题开始。这是不仅在简历中，而且在书籍和博客中都很常见的模式。简历解析器使用这种模式将行分组到这些行上方最近的章节标题中。",
      },
      step3Para3: {
        en: "The resume parser applies some heuristics to detect a section title. The main heuristic to determine a section title is to check if it fulfills all 3 following conditions:",
        zh: "简历解析器应用一些启发式方法来检测章节标题。确定章节标题的主要启发式方法是检查它是否满足以下3个条件:",
      },
      step3Condition1: {
        en: "1. It is the only text item in the line",
        zh: "1. 它是行中唯一的文本项",
      },
      step3Condition2: {
        en: "2. It is bolded",
        zh: "2. 它是加粗的",
      },
      step3Condition3: {
        en: "3. Its letters are all UPPERCASE",
        zh: "3. 它的字母全部是大写",
      },
      step3Para4: {
        en: "In simple words, if a text item is double emphasized to be both bolded and uppercase, it is most likely a section title in a resume. This is generally true for a well formatted resume. There can be exceptions, but it is likely not a good use of bolded and uppercase in those cases.",
        zh: "简单来说，如果一个文本项被双重强调为既加粗又大写，那么它很可能是简历中的章节标题。对于格式良好的简历，这通常是正确的。可能有例外情况，但在这些情况下，加粗和大写可能不是很好的用法。",
      },
      step3Para5: {
        en: "The resume parser also has a fallback heuristic if the main heuristic doesn't apply. The fallback heuristic mainly performs a keyword matching against a list of common resume section title keywords.",
        zh: "如果主要启发式方法不适用，简历解析器还有一个备用启发式方法。备用启发式方法主要是对常见的简历章节标题关键词列表进行关键词匹配。",
      },
      step3Para6: {
        en: "At the end of step 3, the resume parser identifies the sections from the resume and groups those lines with the associated section title, as shown in the table below. Note that the section titles are bolded and the lines associated with the section are highlighted with the same colors.",
        zh: "在步骤3结束时，简历解析器从简历中识别出章节，并将这些行与相关的章节标题分组，如下表所示。请注意，章节标题是加粗的，与章节相关的行以相同的颜色突出显示。",
      },
      step4Title: {
        en: "Step 4. Extract resume from sections",
        zh: "步骤4. 从章节中提取简历",
      },
      step4Para1: {
        en: "Step 4 is the last step of the resume parsing process and is also the core of the resume parser, where it extracts resume information from the sections.",
        zh: "步骤4是简历解析过程的最后一步，也是简历解析器的核心，它从章节中提取简历信息。",
      },
      featureScoringTitle: {
        en: "Feature Scoring System",
        zh: "特征评分系统",
      },
      featureScoringPara1: {
        en: "The gist of the extraction engine is a feature scoring system. Each resume attribute to be extracted has a custom feature sets, where each feature set consists of a feature matching function and a feature matching score if matched (feature matching score can be a positive or negative number). To compute the final feature score of a text item for a particular resume attribute, it would run the text item through all its feature sets and sum up the matching feature scores. This process is carried out for all text items within the section, and the text item with the highest computed feature score is identified as the extracted resume attribute.",
        zh: "提取引擎的要点是一个特征评分系统。每个要提取的简历属性都有自定义的特征集，每个特征集包括一个特征匹配函数和匹配时的特征匹配分数（特征匹配分数可以是正数或负数）。为了计算特定简历属性的文本项的最终特征分数，它会将文本项通过所有特征集运行，并汇总匹配的特征分数。这个过程对章节内的所有文本项执行，具有最高计算特征分数的文本项被确定为提取的简历属性。",
      },
      featureScoringPara2: {
        en: "As a demonstration, the table below shows 3 resume attributes in the profile section of the resume PDF added.",
        zh: "作为演示，下表显示了添加的简历PDF的个人资料部分中的3个简历属性。",
      },
      featureSetTitle: {
        en: "Feature Sets",
        zh: "特征集",
      },
      featureSetPara1: {
        en: "Having explained the feature scoring system, we can dive more into how feature sets are constructed for a resume attribute. It follows 2 principles:",
        zh: "在解释了特征评分系统之后，我们可以更深入地研究如何为简历属性构建特征集。它遵循2个原则:",
      },
      featureSetPrinciple1: {
        en: "1. A resume attribute's feature sets are designed relative to all other resume attributes within the same section.",
        zh: "1. 一个简历属性的特征集是相对于同一章节内的所有其他简历属性设计的。",
      },
      featureSetPrinciple2: {
        en: "2. A resume attribute's feature sets are manually crafted based on its characteristics and likelihood of each characteristic.",
        zh: "2. 一个简历属性的特征集是根据其特征和每个特征的可能性手动制作的。",
      },
      featureSetPara2: {
        en: "The table below lists some of the feature sets for the resume attribute name. It contains feature function that matches the name attribute with positive feature score and also feature function that only matches other resume attributes in the section with negative feature score.",
        zh: "下表列出了简历属性姓名的一些特征集。它包含匹配姓名属性并具有正特征分数的特征函数，以及仅匹配章节中其他简历属性并具有负特征分数的特征函数。",
      },
      coreFeatureFunctionTitle: {
        en: "Core Feature Function",
        zh: "核心特征函数",
      },
      coreFeatureFunctionPara: {
        en: "Each resume attribute has multiple feature sets. They can be found in the source code under the extract-resume-from-sections folder and we won't list them all out here. Each resume attribute usually has a core feature function that greatly identifies them, so we will list out the core feature function below.",
        zh: "每个简历属性有多个特征集。它们可以在extract-resume-from-sections文件夹下的源代码中找到，我们不会在这里全部列出。每个简历属性通常都有一个能够很好地识别它们的核心特征函数，所以我们将在下面列出核心特征函数。",
      },
      specialCaseTitle: {
        en: "Special Case: Subsections",
        zh: "特殊情况: 子章节",
      },
      specialCasePara1: {
        en: "The last thing that is worth mentioning is subsections. For profile section, we can directly pass all the text items to the feature scoring systems. But for other sections, such as education and work experience, we have to first divide the section into subsections since there can be multiple schools or work experiences in the section. The feature scoring system then process each subsection to retrieve each's resume attributes and append the results.",
        zh: "最后值得一提的是子章节。对于个人资料章节，我们可以直接将所有文本项传递给特征评分系统。但对于其他章节，如教育和工作经验，我们必须首先将章节分成子章节，因为章节中可能有多个学校或工作经验。然后，特征评分系统处理每个子章节以检索每个的简历属性并附加结果。",
      },
      specialCasePara2: {
        en: "The resume parser applies some heuristics to detect a subsection. The main heuristic to determine a subsection is to check if the vertical line gap between 2 lines is larger than the typical line gap * 1.4, since a well formatted resume usually creates a new empty line break before adding the next subsection. There is also a fallback heuristic if the main heuristic doesn't apply to check if the text item is bolded.",
        zh: "简历解析器应用一些启发式方法来检测子章节。确定子章节的主要启发式方法是检查2行之间的垂直行间距是否大于典型行间距*1.4，因为格式良好的简历通常会在添加下一个子章节之前创建一个新的空行。如果主要启发式方法不适用，还有一个备用启发式方法来检查文本项是否加粗。",
      },
      conclusion: {
        en: "And that is everything about the OpenResume parser algorithm :)",
        zh: "这就是OpenResume解析器算法的全部内容 :)",
      },
      authorCredit: {
        en: "Written by",
        zh: "作者",
      },
      publicationDate: {
        en: "June 2023",
        zh: "2023年6月",
      },
      tableNameFeatureSets: {
        en: "Name Feature Sets",
        zh: "姓名特征集",
      },
      tableFeatureFunction: {
        en: "Feature Function",
        zh: "特征函数",
      },
      tableFeatureMatchingScore: {
        en: "Feature Matching Score",
        zh: "特征匹配分数",
      },
      tableResumeAttribute: {
        en: "Resume Attribute",
        zh: "简历属性",
      },
      tableCoreFeatureFunction: {
        en: "Core Feature Function",
        zh: "核心特征函数",
      },
      tableRegex: {
        en: "Regex",
        zh: "正则表达式",
      },
      tableTextContent: {
        en: "Text Content",
        zh: "文本内容",
      },
      tableMetadata: {
        en: "Metadata",
        zh: "元数据",
      },
      tableLines: {
        en: "Lines",
        zh: "行",
      },
      tableLineContent: {
        en: "Line Content",
        zh: "行内容",
      },
      tableTextWithHighestFeatureScore: {
        en: "Text (Highest Feature Score)",
        zh: "文本（最高特征分数）",
      },
      tableFeatureScoresOfOtherTexts: {
        en: "Feature Scores of Other Texts",
        zh: "其他文本的特征分数",
      },
    };

    return translations[key]?.[language] || key;
  };

  const getBadgeContent = (item: TextItem) => {
    const X1 = Math.round(item.x);
    const X2 = Math.round(item.x + item.width);
    const Y = Math.round(item.y);
    let content = `X₁=${X1} X₂=${X2} Y=${Y}`;
    if (X1 === X2) {
      content = `X=${X2} Y=${Y}`;
    }
    if (isBold(item)) {
      content = `${content} Bold`;
    }
    if (item.hasEOL) {
      content = `${content} NewLine`;
    }
    return content;
  };
  const step1TextItemsTable = [
    ["#", translate("tableTextContent"), translate("tableMetadata")],
    ...textItems.map((item, idx) => [
      idx + 1,
      item.text,
      <Badge key={idx}>{getBadgeContent(item)}</Badge>,
    ]),
  ];

  const step2LinesTable = [
    [translate("tableLines"), translate("tableLineContent")],
    ...lines.map((line, idx) => [
      idx + 1,
      line.map((item, idx) => (
        <span key={idx}>
          {item.text}
          {idx !== line.length - 1 && (
            <span className="select-none font-extrabold text-sky-400">
              &nbsp;&nbsp;{"|"}&nbsp;&nbsp;
            </span>
          )}
        </span>
      )),
    ]),
  ];

  const { profile, profileScores } = extractProfile(sections);

  // 动态生成 featureScoringNote 的翻译
  const getFeatureScoringNote = () => {
    if (language === "en") {
      return `In the resume PDF added, the resume attribute name is likely to be "${
        profile.name
      }" since its feature score is ${
        profileScores.name.find((item) => item.text === profile.name)?.score
      }, which is the highest feature score out of all text items in the profile section. (Some text items' feature scores can be negative, indicating they are very unlikely to be the targeted attribute)`;
    } else {
      return `在添加的简历PDF中，简历属性姓名很可能是"${
        profile.name
      }"，因为其特征分数是${
        profileScores.name.find((item) => item.text === profile.name)?.score
      }，这是简历个人资料部分中所有文本项中最高的特征分数。（一些文本项的特征分数可以是负数，表明它们极不可能是目标属性）`;
    }
  };

  const Scores = ({ scores }: { scores: TextScores }) => {
    return (
      <>
        {scores
          .sort((a, b) => b.score - a.score)
          .map((item, idx) => (
            <span key={idx} className="break-all">
              <Badge>{item.score}</Badge> {item.text}
              <br />
            </span>
          ))}
      </>
    );
  };
  const step4ProfileFeatureScoresTable = [
    [
      translate("tableResumeAttribute"),
      translate("tableTextWithHighestFeatureScore"),
      translate("tableFeatureScoresOfOtherTexts"),
    ],
    ["Name", profile.name, <Scores key={"Name"} scores={profileScores.name} />],
    [
      "Email",
      profile.email,
      <Scores key={"Email"} scores={profileScores.email} />,
    ],
    [
      "Phone",
      profile.phone,
      <Scores key={"Phone"} scores={profileScores.phone} />,
    ],
  ];

  const step4NameFeatureSetsTable = [
    [translate("tableFeatureFunction"), translate("tableFeatureMatchingScore")],
    ["Contains only letters, spaces or periods", "+3"],
    ["Is bolded", "+2"],
    ["Contains all uppercase letters", "+2"],
    ["Contains @", "-4 (match email)"],
    ["Contains number", "-4 (match phone)"],
    ["Contains ,", "-4 (match address)"],
    ["Contains /", "-4 (match url)"],
  ];

  const step4CoreFeatureFunctionTable = [
    [
      translate("tableResumeAttribute"),
      translate("tableCoreFeatureFunction"),
      translate("tableRegex"),
    ],
    ["Name", "Contains only letters, spaces or periods", "/^[a-zA-Z\\s\\.]+$/"],
    [
      "Email",
      <>
        Match email format xxx@xxx.xxx
        <br />
        xxx can be anything not space
      </>,
      "/\\S+@\\S+\\.\\S+/",
    ],
    [
      "Phone",
      <>
        Match phone format (xxx)-xxx-xxxx <br /> () and - are optional
      </>,
      "/\\(?\\d{3}\\)?[\\s-]?\\d{3}[\\s-]?\\d{4}/",
    ],
    [
      "Location",
      <>Match city and state format {"City, ST"}</>,
      "/[A-Z][a-zA-Z\\s]+, [A-Z]{2}/",
    ],
    ["Url", "Match url format xxx.xxx/xxx", "/\\S+\\.[a-z]+\\/\\S+/"],
    [
      "School",
      "Contains a school keyword, e.g. College, University, School",
      "",
    ],
    [
      "Degree",
      "Contains a degree keyword, e.g. Associate, Bachelor, Master",
      "",
    ],
    ["GPA", "Match GPA format x.xx", "/[0-4]\\.\\d{1,2}/"],
    [
      "Date",
      "Contains date keyword related to year, month, seasons or the word Present",
      "Year: /(?:19|20)\\d{2}/",
    ],
    [
      "Job Title",
      "Contains a job title keyword, e.g. Analyst, Engineer, Intern",
      "",
    ],
    ["Company", "Is bolded or doesn't match job title & date", ""],
    ["Project", "Is bolded or doesn't match date", ""],
  ];

  return (
    <article className="mt-10">
      <Heading className="text-primary !mt-0 border-t-2 pt-8">
        {translate("title")}
      </Heading>
      <Paragraph smallMarginTop={true}>{translate("subtitle")}</Paragraph>
      {/* Step 1. Read the text items from a PDF file */}
      <Heading level={2}>{translate("step1Title")}</Heading>
      <Paragraph smallMarginTop={true}>{translate("step1Para1")}</Paragraph>
      <Paragraph>{translate("step1Para2")}</Paragraph>
      <Paragraph>{translate("step1Para3")}</Paragraph>
      <div className="mt-4 max-h-72 overflow-y-scroll border scrollbar scrollbar-track-gray-100 scrollbar-thumb-gray-200 scrollbar-w-3">
        <Table
          table={step1TextItemsTable}
          className="!border-none"
          tdClassNames={["", "", "md:whitespace-nowrap"]}
        />
      </div>
      {/* Step 2. Group text items into lines */}
      <Heading level={2}>{translate("step2Title")}</Heading>
      <Paragraph smallMarginTop={true}>{translate("step2Para1")}</Paragraph>
      <Paragraph>
        <span className="mt-3 block font-semibold">
          {translate("step2Issue1")}
        </span>
        {translate("step2Issue1Detail")}
      </Paragraph>
      <Paragraph smallMarginTop={true}>
        <span className="font-semibold">{translate("step2Solution1")}</span>{" "}
        {translate("step2Solution1Detail")}
        <span
          dangerouslySetInnerHTML={{
            __html: `<math display="block">
                        <mrow>
                            <mn>Distance </mn>
                            <mo>=</mo>
                            <mn>RightTextItemX₁</mn>
                            <mo>-</mo>
                            <mn>LeftTextItemX₂</mn>
                        </mrow>
                    </math>`,
          }}
          className="my-2 block text-left text-base"
        />
        {translate("step2Formula")}
      </Paragraph>
      <Paragraph>
        <span className="mt-3 block font-semibold">
          {translate("step2Issue2")}
        </span>
        {translate("step2Issue2Detail")}
      </Paragraph>
      <Paragraph smallMarginTop={true}>
        <span className="font-semibold">{translate("step2Solution2")}</span>{" "}
        {translate("step2Solution2Detail")}
      </Paragraph>
      <Paragraph>
        {translate("step2Para2")}
        <span className="select-none font-extrabold text-sky-400">
          &nbsp;{"|"}&nbsp;
        </span>
        )
      </Paragraph>
      <div className="mt-4 max-h-96 overflow-y-scroll border scrollbar scrollbar-track-gray-100 scrollbar-thumb-gray-200 scrollbar-w-3">
        <Table table={step2LinesTable} className="!border-none" />
      </div>
      {/* Step 3. Group lines into sections */}
      <Heading level={2}>{translate("step3Title")}</Heading>
      <Paragraph smallMarginTop={true}>{translate("step3Para1")}</Paragraph>
      <Paragraph>{translate("step3Para2")}</Paragraph>
      <Paragraph>
        {translate("step3Para3")} <br />
        {translate("step3Condition1")} <br />
        {translate("step3Condition2")} <br />
        {translate("step3Condition3")}
        <br />
      </Paragraph>
      <Paragraph>{translate("step3Para4")}</Paragraph>
      <Paragraph>{translate("step3Para5")}</Paragraph>
      <Paragraph>{translate("step3Para6")}</Paragraph>
      <Step3SectionsTable sections={sections} />
      {/* Step 4. Extract resume from sections */}
      <Heading level={2}>{translate("step4Title")}</Heading>
      <Paragraph smallMarginTop={true}>{translate("step4Para1")}</Paragraph>
      <Heading level={3}>{translate("featureScoringTitle")}</Heading>
      <Paragraph smallMarginTop={true}>
        {translate("featureScoringPara1")}
      </Paragraph>
      <Paragraph>{translate("featureScoringPara2")}</Paragraph>
      <Table table={step4ProfileFeatureScoresTable} className="mt-4" />
      {(profileScores.name.find((item) => item.text === profile.name)?.score ||
        0) > 0 && (
        <Paragraph smallMarginTop={true}>{getFeatureScoringNote()}</Paragraph>
      )}
      <Heading level={3}>{translate("featureSetTitle")}</Heading>
      <Paragraph smallMarginTop={true}>
        {translate("featureSetPara1")} <br />
        {translate("featureSetPrinciple1")} <br />
        {translate("featureSetPrinciple2")}
      </Paragraph>
      <Paragraph>{translate("featureSetPara2")}</Paragraph>
      <Table
        table={step4NameFeatureSetsTable}
        title={translate("tableNameFeatureSets")}
        className="mt-4"
      />
      <Heading level={3}>{translate("coreFeatureFunctionTitle")}</Heading>
      <Paragraph smallMarginTop={true}>
        {translate("coreFeatureFunctionPara")}
      </Paragraph>
      <Table table={step4CoreFeatureFunctionTable} className="mt-4" />
      <Heading level={3}>{translate("specialCaseTitle")}</Heading>
      <Paragraph smallMarginTop={true}>
        {translate("specialCasePara1")}
      </Paragraph>
      <Paragraph smallMarginTop={true}>
        {translate("specialCasePara2")}
      </Paragraph>
      <Paragraph>{translate("conclusion")}</Paragraph>
      <Paragraph>
        {translate("authorCredit")}{" "}
        <Link href="https://github.com/xitanggg">Xitang</Link>{" "}
        {translate("publicationDate")}
      </Paragraph>
    </article>
  );
};

const Step3SectionsTable = ({
  sections,
}: {
  sections: ResumeSectionToLines;
}) => {
  // 使用 useLanguageRedux 钩子获取当前语言
  const { language } = useLanguageRedux();

  // 翻译函数
  const translate = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      tableLines: {
        en: "Lines",
        zh: "行",
      },
      tableLineContent: {
        en: "Line Content",
        zh: "行内容",
      },
      profile: {
        en: "PROFILE",
        zh: "个人资料",
      },
    };

    return translations[key]?.[language] || key;
  };

  const table: React.ReactNode[][] = [
    [translate("tableLines"), translate("tableLineContent")],
  ];
  const trClassNames = [];
  let lineCounter = 0;
  const BACKGROUND_COLORS = [
    "bg-red-50",
    "bg-yellow-50",
    "bg-orange-50",
    "bg-green-50",
    "bg-blue-50",
    "bg-purple-50",
  ] as const;
  const sectionsEntries = Object.entries(sections);

  const Line = ({ line }: { line: Line }) => {
    return (
      <>
        {line.map((item, idx) => (
          <span key={idx}>
            {item.text}
            {idx !== line.length - 1 && (
              <span className="select-none font-extrabold text-sky-400">
                &nbsp;&nbsp;{"|"}&nbsp;&nbsp;
              </span>
            )}
          </span>
        ))}
      </>
    );
  };

  for (let i = 0; i < sectionsEntries.length; i++) {
    const sectionBackgroundColor = BACKGROUND_COLORS[i % 6];
    const [sectionTitle, lines] = sectionsEntries[i];
    table.push([
      sectionTitle === "profile" ? "" : lineCounter,
      sectionTitle === "profile" ? translate("profile") : sectionTitle,
    ]);
    trClassNames.push(`${sectionBackgroundColor} font-bold`);
    lineCounter += 1;
    for (let j = 0; j < lines.length; j++) {
      table.push([lineCounter, <Line key={lineCounter} line={lines[j]} />]);
      trClassNames.push(sectionBackgroundColor);
      lineCounter += 1;
    }
  }

  return (
    <div className="mt-4 max-h-96 overflow-y-scroll border scrollbar scrollbar-track-gray-100 scrollbar-thumb-gray-200 scrollbar-w-3">
      <Table
        table={table}
        className="!border-none"
        trClassNames={trClassNames}
      />
    </div>
  );
};
