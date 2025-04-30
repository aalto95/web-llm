import { eslintConfig } from "@config-federation/vue";

export default [
  ...eslintConfig,
  {
    rules: {
      "vue/multi-word-component-names": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
];
