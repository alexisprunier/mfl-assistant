import babelParser from "@babel/eslint-parser";

module.exports = [{
  languageOptions: {
    parser: babelParser,
    parserOptions: {
      ecmaVersion: 12, // Enable parsing of ECMAScript 2021 (ES12)
      sourceType: "module", // Allow ECMAScript modules
    },
  },
  /*extends: [
    "eslint:recommended", // Basic recommended ESLint rules
    "plugin:react/recommended", // React specific linting (if using React)
  ],*/
  rules: {
    "no-console": "warn", // Warning on console usage
    "semi": ["error", "always"], // Enforce semicolons
    "quotes": ["error", "single"], // Enforce single quotes for strings
    "indent": ["error", 2], // Enforce 2-space indentation
  },
  settings: {
    react: {
      version: "detect", // Automatically detect the React version
    },
  },
}];