import type { GeneralSetting } from "lib/redux/settingsSlice";
import { PX_PER_PT } from "lib/constants";
import {
  FONT_FAMILY_TO_STANDARD_SIZE_IN_PT,
  FONT_FAMILY_TO_DISPLAY_NAME,
  type FontFamily,
} from "components/fonts/constants";
import { getAllFontFamiliesToLoad } from "components/fonts/lib";
import {
  getAllTemplates,
  type Template,
} from "components/Resume/ResumePDF/templates";
import dynamic from "next/dynamic";
import { useLanguage } from "../../../i18n/LanguageContext";

const Selection = ({
  selectedColor,
  isSelected,
  style = {},
  onClick,
  children,
}: {
  selectedColor: string;
  isSelected: boolean;
  style?: React.CSSProperties;
  onClick: () => void;
  children: React.ReactNode;
}) => {
  const selectedStyle = {
    color: "white",
    backgroundColor: selectedColor,
    borderColor: selectedColor,
    ...style,
  };

  return (
    <div
      className="flex w-[105px] cursor-pointer items-center justify-center rounded-md border border-gray-300 py-1.5 shadow-sm hover:border-gray-400 hover:bg-gray-100"
      onClick={onClick}
      style={isSelected ? selectedStyle : style}
      onKeyDown={(e) => {
        if (["Enter", " "].includes(e.key)) onClick();
      }}
      tabIndex={0}
    >
      {children}
    </div>
  );
};

const SelectionsWrapper = ({ children }: { children: React.ReactNode }) => {
  return <div className="mt-2 flex flex-wrap gap-3">{children}</div>;
};

const FontFamilySelections = ({
  selectedFontFamily,
  themeColor,
  handleSettingsChange,
}: {
  selectedFontFamily: string;
  themeColor: string;
  handleSettingsChange: (field: GeneralSetting, value: string) => void;
}) => {
  const allFontFamilies = getAllFontFamiliesToLoad();
  return (
    <SelectionsWrapper>
      {allFontFamilies.map((fontFamily, idx) => {
        const isSelected = selectedFontFamily === fontFamily;
        const standardSizePt = FONT_FAMILY_TO_STANDARD_SIZE_IN_PT[fontFamily];
        return (
          <Selection
            key={idx}
            selectedColor={themeColor}
            isSelected={isSelected}
            style={{
              fontFamily,
              fontSize: `${standardSizePt * PX_PER_PT}px`,
            }}
            onClick={() => handleSettingsChange("fontFamily", fontFamily)}
          >
            {FONT_FAMILY_TO_DISPLAY_NAME[fontFamily]}
          </Selection>
        );
      })}
    </SelectionsWrapper>
  );
};

/**
 * Load FontFamilySelections client side since it calls getAllFontFamiliesToLoad,
 * which uses navigator object that is only available on client side
 */
export const FontFamilySelectionsCSR = dynamic(
  () => Promise.resolve(FontFamilySelections),
  {
    ssr: false,
  }
);

export const FontSizeSelections = ({
  selectedFontSize,
  fontFamily,
  themeColor,
  handleSettingsChange,
}: {
  fontFamily: FontFamily;
  themeColor: string;
  selectedFontSize: string;
  handleSettingsChange: (field: GeneralSetting, value: string) => void;
}) => {
  const standardSizePt = FONT_FAMILY_TO_STANDARD_SIZE_IN_PT[fontFamily];
  const compactSizePt = standardSizePt - 1;
  const { language } = useLanguage();
  // 字体大小选项的翻译
  const getSizeLabel = (idx: number) => {
    const labels: Record<string, string[]> = {
      en: ["Compact", "Standard", "Large"],
      zh: ["紧凑", "标准", "大号"],
    };

    return labels[language as keyof typeof labels]?.[idx] || labels.zh[idx];
  };

  return (
    <SelectionsWrapper>
      {[0, 1, 2].map((idx) => {
        const fontSizePt = String(compactSizePt + idx);
        const isSelected = fontSizePt === selectedFontSize;
        return (
          <Selection
            key={idx}
            selectedColor={themeColor}
            isSelected={isSelected}
            style={{
              fontFamily,
              fontSize: `${Number(fontSizePt) * PX_PER_PT}px`,
            }}
            onClick={() => handleSettingsChange("fontSize", fontSizePt)}
          >
            {getSizeLabel(idx)}
          </Selection>
        );
      })}
    </SelectionsWrapper>
  );
};

export const DocumentSizeSelections = ({
  selectedDocumentSize,
  themeColor,
  handleSettingsChange,
}: {
  themeColor: string;
  selectedDocumentSize: string;
  handleSettingsChange: (field: GeneralSetting, value: string) => void;
}) => {
  const { language } = useLanguage();

  // 文档大小描述的翻译
  const getDocSizeDescription = (type: string) => {
    if (type === "Letter") {
      return language === "en" ? "(US, Canada)" : "(美国, 加拿大)";
    } else {
      return language === "en" ? "(Global Standard)" : "(全球标准)";
    }
  };

  return (
    <SelectionsWrapper>
      {["A4", "Letter"].map((type, idx) => {
        return (
          <Selection
            key={idx}
            selectedColor={themeColor}
            isSelected={type === selectedDocumentSize}
            onClick={() => handleSettingsChange("documentSize", type)}
          >
            <div className="flex flex-col items-center">
              <div>{type}</div>
              <div className="text-xs">{getDocSizeDescription(type)}</div>
            </div>
          </Selection>
        );
      })}
    </SelectionsWrapper>
  );
};

export const TemplateSelections = ({
  selectedTemplate,
  themeColor,
  handleSettingsChange,
}: {
  themeColor: string;
  selectedTemplate: string;
  handleSettingsChange: (field: GeneralSetting, value: string) => void;
}) => {
  const templates = getAllTemplates();
  const { language } = useLanguage();

  // 模板名称和描述的翻译
  const translateTemplate = (template: Template) => {
    const translations: Record<
      string,
      Record<string, { name: string; description: string }>
    > = {
      classic: {
        en: {
          name: "Classic",
          description: "Simple and clean traditional design",
        },
        zh: {
          name: "经典模板",
          description: "简洁明了的传统设计",
        },
      },
      professional: {
        en: {
          name: "Professional",
          description: "Corporate style emphasizing professionalism",
        },
        zh: {
          name: "专业模板",
          description: "强调专业性和清晰度的企业风格",
        },
      },
      modern: {
        en: {
          name: "Modern",
          description: "Modern design with colored header",
        },
        zh: {
          name: "现代模板",
          description: "带有彩色标题区的现代设计",
        },
      },
      elegant: {
        en: {
          name: "Elegant",
          description: "Minimalist elegant premium design",
        },
        zh: {
          name: "优雅模板",
          description: "简约大气的高级设计",
        },
      },
      creative: {
        en: {
          name: "Creative",
          description: "Modern style for creative industries",
        },
        zh: {
          name: "创意模板",
          description: "适合设计和创意行业的现代风格",
        },
      },
      tech: {
        en: {
          name: "Tech",
          description: "Modern digital style for tech field",
        },
        zh: {
          name: "科技模板",
          description: "适合科技领域的现代数字风格",
        },
      },
      minimal: {
        en: {
          name: "Minimal",
          description: "Clean and crisp minimalist design",
        },
        zh: {
          name: "极简模板",
          description: "干净利落的最小化设计",
        },
      },
      compact: {
        en: {
          name: "Compact",
          description: "For candidates with extensive content",
        },
        zh: {
          name: "紧凑模板",
          description: "适合需要展示大量内容的求职者",
        },
      },
    };

    return (
      translations[template.id]?.[language] || {
        name: template.name,
        description: template.description,
      }
    );
  };

  return (
    <SelectionsWrapper>
      {templates.map((template) => {
        const isSelected = template.id === selectedTemplate;
        const translatedTemplate = translateTemplate(template);
        return (
          <Selection
            key={template.id}
            selectedColor={themeColor}
            isSelected={isSelected}
            style={{ width: "140px" }}
            onClick={() => handleSettingsChange("template", template.id)}
          >
            <div className="flex flex-col items-center">
              <div>{translatedTemplate.name}</div>
              <div className="text-center text-xs">
                {translatedTemplate.description}
              </div>
            </div>
          </Selection>
        );
      })}
    </SelectionsWrapper>
  );
};
