import { baseConfig } from "../eslint.config.mjs";
import globals from "globals";

export default [
  ...baseConfig,
  {
    files: ["**/*.ts"],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // Add server-specific rules here
    },
  },
];
