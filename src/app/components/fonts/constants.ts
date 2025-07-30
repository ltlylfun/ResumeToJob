const SANS_SERIF_ENGLISH_FONT_FAMILIES = [
  "Roboto",
  "Lato",
  "Montserrat",
  "OpenSans",
  "Raleway",
] as const;

const SERIF_ENGLISH_FONT_FAMILIES = [
  "Caladea",
  "Lora",
  "RobotoSlab",
  "PlayfairDisplay",
  "Merriweather",
] as const;

export const ENGLISH_FONT_FAMILIES = [
  ...SANS_SERIF_ENGLISH_FONT_FAMILIES,
  ...SERIF_ENGLISH_FONT_FAMILIES,
];
type EnglishFontFamily = (typeof ENGLISH_FONT_FAMILIES)[number];

export const NON_ENGLISH_FONT_FAMILIES = ["NotoSansSC"] as const;
type NonEnglishFontFamily = (typeof NON_ENGLISH_FONT_FAMILIES)[number];

export const NON_ENGLISH_FONT_FAMILY_TO_LANGUAGE: Record<
  NonEnglishFontFamily,
  string[]
> = {
  NotoSansSC: ["zh", "zh-CN", "zh-TW"],
};

export type FontFamily = EnglishFontFamily | NonEnglishFontFamily;
export const FONT_FAMILY_TO_STANDARD_SIZE_IN_PT: Record<FontFamily, number> = {
  // Sans Serif Fonts
  Roboto: 11,
  Lato: 11,
  Montserrat: 10,
  OpenSans: 10,
  Raleway: 10,
  // Serif Fonts
  Caladea: 11,
  Lora: 11,
  RobotoSlab: 10,
  PlayfairDisplay: 10,
  Merriweather: 10,
  // Non-English Fonts
  NotoSansSC: 11,
};

export const FONT_FAMILY_TO_DISPLAY_NAME: Record<FontFamily, string> = {
  // Sans Serif Fonts
  Roboto: "Roboto (仅英文)",
  Lato: "Lato (仅英文)",
  Montserrat: "Montserrat (仅英文)",
  OpenSans: "Open Sans (仅英文)",
  Raleway: "Raleway (仅英文)",
  // Serif Fonts
  Caladea: "Caladea (仅英文)",
  Lora: "Lora (仅英文)",
  RobotoSlab: "Roboto Slab (仅英文)",
  PlayfairDisplay: "Playfair Display (仅英文)",
  Merriweather: "Merriweather (仅英文)",
  // Non-English Fonts
  NotoSansSC: "思源黑体(简体)",
};
