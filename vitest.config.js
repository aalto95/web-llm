import { deepMerge, vitestConfig } from '@config-federation/vue';
import { mergeConfig } from 'vite';
import viteConfig from './vite.config';

const customRules = {
  // extend here
};

export default mergeConfig(viteConfig, deepMerge(vitestConfig, customRules));
