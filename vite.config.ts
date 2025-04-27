import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { componentTagger } from 'lovable-tagger';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/blog/',  // Base path for GitHub Pages (this should be the subdirectory where your site is hosted)
  build: {
    outDir: 'dist',  // Output directory for the build
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),  // Conditionally apply the componentTagger plugin in development mode
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, './src'),  // Path alias for cleaner imports
    },
  },
}));
