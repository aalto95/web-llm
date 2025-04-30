// prettier.config.js

import { deepMerge, prettierConfig } from "@config-federation/vue";

const customs = {
  // extend here
};

export default deepMerge(prettierConfig, customs);
