import { deepMerge, eslintConfig } from "@config-federation/vue";

const customRules = {
	rules: {
		"vue/multi-word-component-names": "off",
		"@typescript-eslint/no-unused-vars": "off",
	},
};

export default deepMerge(eslintConfig, customRules);
