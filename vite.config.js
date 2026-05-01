import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // Whenever the frontend calls /scorm-lms, Vite will forward it to the backend
      '/scorm-lms': {
        target: 'http://localhost:3044',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
