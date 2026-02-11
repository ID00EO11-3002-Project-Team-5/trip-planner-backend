// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // This replaces the old --ext .ts flag
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      // Add any specific TypeScript rules here
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  {
    // Files to ignore (replaces .eslintignore)
    ignores: ["dist/**", "node_modules/**", "build/**"],
  },
);
