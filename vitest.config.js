// vitest.config.js

import { deepMerge, vitestConfig } from "@config-federation/vue";
import { mergeConfig } from "vite";
import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  deepMerge(vitestConfig, {
    // extend here
  }),
);
