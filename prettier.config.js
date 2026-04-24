import { deepMerge, prettierConfig } from '@config-federation/vue';

const customRules = {
  // extend here
};

export default deepMerge(prettierConfig, customRules);
