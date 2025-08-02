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
import { useLanguageRedux } from "../../../lib/hooks/useLanguageRedux";

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

export const FontFamilySelectionsCSR = dynamic(
  () => Promise.resolve(FontFamilySelections),
  {
    ssr: false,
  },
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
  const { language } = useLanguageRedux();

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
  const { language } = useLanguageRedux();

  const translateTemplate = (template: Template) => {
    const translations: Record<string, Record<string, { name: string }>> = {
      classic: {
        en: {
          name: "Classic",
        },
        zh: {
          name: "经典模板",
        },
      },
      professional: {
        en: {
          name: "Professional",
        },
        zh: {
          name: "专业模板",
        },
      },
      modern: {
        en: {
          name: "Modern",
        },
        zh: {
          name: "现代模板",
        },
      },
      elegant: {
        en: {
          name: "Elegant",
        },
        zh: {
          name: "优雅模板",
        },
      },
      creative: {
        en: {
          name: "Creative",
        },
        zh: {
          name: "创意模板",
        },
      },
      tech: {
        en: {
          name: "Tech",
        },
        zh: {
          name: "科技模板",
        },
      },
      minimal: {
        en: {
          name: "Minimal",
        },
        zh: {
          name: "极简模板",
        },
      },
      compact: {
        en: {
          name: "Compact",
        },
        zh: {
          name: "紧凑模板",
        },
      },
    };

    return (
      translations[template.id]?.[language] || {
        name: template.name,
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
            </div>
          </Selection>
        );
      })}
    </SelectionsWrapper>
  );
};
