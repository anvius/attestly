import js from "@eslint/js";
import tseslint from "typescript-eslint";
import svelte from "eslint-plugin-svelte";

export default [
  {
    ignores: [".svelte-kit/**", "build/**", "dist/**", "node_modules/**", "*.cjs"]
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...svelte.configs["flat/recommended"],
  {
    files: ["**/*.svelte", "**/*.ts"],
    rules: {
      "@typescript-eslint/no-empty-object-type": "off"
    }
  }
];
