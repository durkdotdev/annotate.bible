module.exports = {
  extends: ["next", "turbo", "prettier"],
  parser: "@typescript-eslint/parser",
  plugins: [
    "@typescript-eslint",
    "chakra-ui",
    "simple-import-sort",
    "unused-imports"
  ],
  rules: {
    "@next/next/no-html-link-for-pages": "off",
    "@typescript-eslint/indent": ["error", 2],
    "chakra-ui/props-order": "error",
    "chakra-ui/props-shorthand": "error",
    "chakra-ui/require-specific-component": "error",
    "react/jsx-key": "off",
    "react-hooks/exhaustive-deps": "off",
    "simple-import-sort/imports": "error",
    "unused-imports/no-unused-imports": "error"
  }
};
