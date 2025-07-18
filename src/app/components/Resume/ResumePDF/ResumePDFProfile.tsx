import { View, Image as PDFImage } from "@react-pdf/renderer";
import {
  ResumePDFIcon,
  type IconType,
} from "components/Resume/ResumePDF/common/ResumePDFIcon";
import { styles, spacing } from "components/Resume/ResumePDF/styles";
import {
  ResumePDFLink,
  ResumePDFSection,
  ResumePDFText,
  ResumePDFBulletList,
} from "components/Resume/ResumePDF/common";
import type { ResumeProfile } from "lib/redux/types";
import type { TemplateStyles } from "components/Resume/ResumePDF/templates";

export const ResumePDFProfile = ({
  profile,
  themeColor,
  isPDF,
  templateStyles,
}: {
  profile: ResumeProfile;
  themeColor: string;
  isPDF: boolean;
  templateStyles: TemplateStyles;
}) => {
  const { name, email, phone, url, summary, location, photoUrl } = profile;
  const iconProps = { email, phone, location, url };

  const hasPhoto = Boolean(photoUrl);
  const hasSummary =
    Array.isArray(summary) &&
    summary.length > 0 &&
    summary.some((line) => line.trim() !== "");

  // 创建照片元素，根据isPDF参数决定使用React-PDF的Image组件还是HTML img标签
  const PhotoElement = () => {
    if (!hasPhoto) return null;

    if (isPDF) {
      return (
        <View
          style={{
            width: "80pt", // 增加了宽度，从60pt改为80pt
            height: "80pt", // 增加了高度，从60pt改为80pt
            marginLeft: spacing["4"],
            overflow: "hidden",
            borderRadius: "4pt",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <PDFImage
            src={photoUrl}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        </View>
      );
    } else {
      return (
        <div
          style={{
            width: "80pt",
            height: "80pt",
            marginLeft: "12pt",
            overflow: "hidden",
            borderRadius: "4pt",
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img
            src={photoUrl}
            alt="Profile"
            style={{
              objectFit: "contain",
              width: "100%",
              height: "100%",
            }}
          />
        </div>
      );
    }
  };

  return (
    <ResumePDFSection
      style={{ marginTop: spacing["4"], ...templateStyles.section }}
    >
      <View
        style={{
          ...styles.flexRow,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={{ flex: 1, marginRight: spacing["2"] }}>
          {/* 添加右侧边距，为照片腾出更多空间 */}
          <ResumePDFText
            bold={true}
            themeColor={themeColor}
            style={{
              ...templateStyles.name,
              ...templateStyles.headerText,
            }}
          >
            {name}
          </ResumePDFText>
          {hasSummary && (
            <View style={{ marginTop: spacing["1"] }}>
              <ResumePDFBulletList
                items={summary}
                bulletStyle={templateStyles.bullet}
              />
            </View>
          )}
        </View>
        <PhotoElement />
      </View>
      <View
        style={{
          ...styles.flexRowBetween,
          flexWrap: "wrap",
          marginTop: spacing["0.5"],
          ...templateStyles.contact,
        }}
      >
        {Object.entries(iconProps).map(([key, value]) => {
          if (!value) return null;

          let iconType = key as IconType;
          if (key === "url") {
            if (value.includes("github")) {
              iconType = "url_github";
            } else if (value.includes("linkedin")) {
              iconType = "url_linkedin";
            }
          }

          const shouldUseLinkWrapper = ["email", "url", "phone"].includes(key);
          const Wrapper = ({ children }: { children: React.ReactNode }) => {
            if (!shouldUseLinkWrapper) return <>{children}</>;

            let src = "";
            switch (key) {
              case "email": {
                src = `mailto:${value}`;
                break;
              }
              case "phone": {
                src = `tel:${value.replace(/[^\d+]/g, "")}`;
                break;
              }
              default: {
                src = value.startsWith("http") ? value : `https://${value}`;
              }
            }

            return (
              <ResumePDFLink src={src} isPDF={isPDF}>
                {children}
              </ResumePDFLink>
            );
          };

          return (
            <View
              key={key}
              style={{
                ...styles.flexRow,
                alignItems: "center",
                gap: spacing["1"],
              }}
            >
              <ResumePDFIcon type={iconType} isPDF={isPDF} />
              <Wrapper>
                <ResumePDFText style={templateStyles.headerText}>
                  {value}
                </ResumePDFText>
              </Wrapper>
            </View>
          );
        })}
      </View>
    </ResumePDFSection>
  );
};
