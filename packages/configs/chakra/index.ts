import { type ThemeConfig, extendTheme } from "@chakra-ui/react";
import colors from "open-color";

const openColorKeys = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const chakraColorKeys = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
const formattedColors = Object.assign(
  {},
  ...Object.keys(colors).map((color) => {
    const formattedColor: any = {};
    openColorKeys.forEach((key, index) => {
      formattedColor[chakraColorKeys[index]] =
        colors[color as keyof typeof colors][key];
    });
    return { [color]: formattedColor };
  })
);
const highlightColors = Object.assign(
  {},
  ...["yellow", "blue", "green"].map((color) => {
    const color200 =
      formattedColors[color as keyof typeof formattedColors][200];
    return {
      [`highlight-${color}`]: {
        default: `${color200}CC`,
        _dark: `${color200}4D`
      }
    };
  })
);

const themeConfig: ThemeConfig = {
  initialColorMode: "system",
  useSystemColorMode: true
};

const config = {
  colors: formattedColors,
  config: themeConfig,
  semanticTokens: {
    colors: {
      active: {
        default: formattedColors.violet[600],
        _dark: formattedColors.violet[300]
      },
      "base-alt": {
        default: formattedColors.gray[100],
        _dark: formattedColors.gray[700]
      },
      "base-modal": {
        default: "white",
        _dark: formattedColors.gray[700]
      },
      "base-text": {
        default: formattedColors.gray[600],
        _dark: formattedColors.gray[300]
      },
      ...highlightColors
    }
  }
};

export default extendTheme(config);
