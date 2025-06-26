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

/**
 * Register all fonts to React PDF so it can render fonts correctly in PDF
 */
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
            fontWeight: 400, // 使用数字400替代"normal"更加明确
          },
          {
            src: `https://cdn.jsdelivr.net/fontsource/fonts/${fontsourceName}@latest/${subset}-700-normal.ttf`,
            fontWeight: 700, // 使用数字700替代"bold"更加明确
          },
        ],
      });
    });
  }, []);
};

export const useRegisterReactPDFHyphenationCallback = (fontFamily: string) => {
  useEffect(() => {
    if (ENGLISH_FONT_FAMILIES.includes(fontFamily as any)) {
      // Disable hyphenation for English Font Family so the word wraps each line
      // https://github.com/diegomura/react-pdf/issues/311#issuecomment-548301604
      Font.registerHyphenationCallback((word) => [word]);
    } else {
      // React PDF doesn't understand how to wrap non-english word on line break
      // A workaround is to add an empty character after each word
      // Reference https://github.com/diegomura/react-pdf/issues/1568
      Font.registerHyphenationCallback((word) =>
        word
          .split("")
          .map((char) => [char, ""])
          .flat(),
      );
    }
  }, [fontFamily]);
};
