import { baseConfig } from "../eslint.config.mjs";
import globals from "globals";

export default [
  ...baseConfig,
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js"],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      // Add client-specific rules here
    },
  },
];
