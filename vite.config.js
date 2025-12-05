import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Ensures the output directory for 'npm run build' is 'dist'
  build: {
    outDir: 'dist', 
  },
});