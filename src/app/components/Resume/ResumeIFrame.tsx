"use client";
import { useMemo } from "react";
import Frame from "react-frame-component";
import {
  A4_HEIGHT_PX,
  A4_WIDTH_PX,
  A4_WIDTH_PT,
  LETTER_HEIGHT_PX,
  LETTER_WIDTH_PX,
  LETTER_WIDTH_PT,
} from "lib/constants";
import dynamic from "next/dynamic";
import { getAllFontFamiliesToLoad } from "components/fonts/lib";
import { getFontDetails } from "components/fonts/hooks";

const getIframeInitialContent = (isA4: boolean) => {
  const width = isA4 ? A4_WIDTH_PT : LETTER_WIDTH_PT;
  const allFontFamilies = getAllFontFamiliesToLoad();

  const allFontFamiliesPreloadLinks = allFontFamilies
    .map((font) => {
      const { fontsourceName, subset } = getFontDetails(font);
      return `<link rel="preload" as="font" href="https://cdn.jsdelivr.net/fontsource/fonts/${fontsourceName}@latest/${subset}-400-normal.ttf" type="font/ttf" crossorigin="anonymous">
<link rel="preload" as="font" href="https://cdn.jsdelivr.net/fontsource/fonts/${fontsourceName}@latest/${subset}-700-normal.ttf" type="font/ttf" crossorigin="anonymous">`;
    })
    .join("");

  const allFontFamiliesFontFaces = allFontFamilies
    .map((font) => {
      const { fontsourceName, subset } = getFontDetails(font);
      return `@font-face {font-family: "${font}"; src: url("https://cdn.jsdelivr.net/fontsource/fonts/${fontsourceName}@latest/${subset}-400-normal.ttf");}
@font-face {font-family: "${font}"; src: url("https://cdn.jsdelivr.net/fontsource/fonts/${fontsourceName}@latest/${subset}-700-normal.ttf"); font-weight: bold;}`;
    })
    .join("");

  return `<!DOCTYPE html>
<!DOCTYPE html>
<html>
  <head>
    ${allFontFamiliesPreloadLinks}
    <style>
      ${allFontFamiliesFontFaces}
    </style>
  </head>
  <body style='overflow: hidden; width: ${width}pt; margin: 0; padding: 0; -webkit-text-size-adjust:none; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; text-rendering: optimizeLegibility;'>
    <div></div>
  </body>
</html>`;
};

const ResumeIframe = ({
  documentSize,
  scale,
  children,
  enablePDFViewer = false,
  showToolbar = true,
}: {
  documentSize: string;
  scale: number;
  children: React.ReactNode;
  enablePDFViewer?: boolean;
  showToolbar?: boolean;
}) => {
  const isA4 = documentSize === "A4";
  const iframeInitialContent = useMemo(
    () => getIframeInitialContent(isA4),
    [isA4],
  );

  if (enablePDFViewer) {
    return (
      <DynamicPDFViewer className="h-full w-full">
        {children as any}
      </DynamicPDFViewer>
    );
  }
  const width = isA4 ? A4_WIDTH_PX : LETTER_WIDTH_PX;
  const height = isA4 ? A4_HEIGHT_PX : LETTER_HEIGHT_PX;

  return (
    <div
      style={{
        maxWidth: `${width * scale}px`,
        maxHeight: `${height * scale}px`,
      }}
    >
      <div
        style={{
          width: `${width}px`,
          height: `${height}px`,
          transform: `scale(${scale})`,
        }}
        className={`origin-top-left bg-white shadow-lg`}
      >
        <Frame
          style={{ width: "100%", height: "100%" }}
          initialContent={iframeInitialContent}
          key={isA4 ? "A4" : "LETTER"}
        >
          {children}
        </Frame>
      </div>
    </div>
  );
};

export const ResumeIframeCSR = dynamic(() => Promise.resolve(ResumeIframe), {
  ssr: false,
});

const DynamicPDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((module) => module.PDFViewer),
  {
    ssr: false,
  },
);
