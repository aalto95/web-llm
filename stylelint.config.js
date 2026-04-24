import { deepMerge, stylelintConfig } from "@config-federation/vue";

const customRules = {
	// extend here
};

export default deepMerge(stylelintConfig, customRules);
