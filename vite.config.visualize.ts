import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import path from 'node:path';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    visualizer({
      open: true, // Automatically open in browser
      filename: 'dist/stats.html', // Output file
      gzipSize: true, // Show gzip size
      brotliSize: true // Show brotli size
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
