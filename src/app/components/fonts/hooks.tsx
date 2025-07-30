import { useEffect } from "react";
import { Font } from "@react-pdf/renderer";
import { ENGLISH_FONT_FAMILIES } from "components/fonts/constants";
import { getAllFontFamiliesToLoad } from "components/fonts/lib";

export const getFontDetails = (fontFamily: string) => {
  let fontsourceName = fontFamily.toLowerCase();
  let subset = "latin";

  switch (fontFamily) {
    case "OpenSans":
      fontsourceName = "open-sans";
      break;
    case "RobotoSlab":
      fontsourceName = "roboto-slab";
      break;
    case "PlayfairDisplay":
      fontsourceName = "playfair-display";
      break;
    case "NotoSansSC":
      fontsourceName = "noto-sans-sc";
      subset = "chinese-simplified";
      break;
  }
  return { fontsourceName, subset };
};

export const useRegisterReactPDFFont = () => {
  useEffect(() => {
    const allFontFamilies = getAllFontFamiliesToLoad();
    allFontFamilies.forEach((fontFamily) => {
      const { fontsourceName, subset } = getFontDetails(fontFamily);
      Font.register({
        family: fontFamily,
        fonts: [
          {
            src: `https://cdn.jsdelivr.net/fontsource/fonts/${fontsourceName}@latest/${subset}-400-normal.ttf`,
            fontWeight: 400,
          },
          {
            src: `https://cdn.jsdelivr.net/fontsource/fonts/${fontsourceName}@latest/${subset}-700-normal.ttf`,
            fontWeight: 700,
          },
        ],
      });
    });
  }, []);
};

export const useRegisterReactPDFHyphenationCallback = (fontFamily: string) => {
  useEffect(() => {
    if (ENGLISH_FONT_FAMILIES.includes(fontFamily as any)) {
      Font.registerHyphenationCallback((word) => [word]);
    } else {
      Font.registerHyphenationCallback((word) =>
        word
          .split("")
          .map((char) => [char, ""])
          .flat(),
      );
    }
  }, [fontFamily]);
};
