import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  const target = process.env.VITE_APP_TARGET?.toString().trim().toLowerCase();

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'app-target-entry-resolver',
        enforce: 'pre',
        resolveId(id, importer) {
          if (target && importer && (id === './App.tsx' || id === './App' || id.endsWith('/App.tsx') || id.endsWith('/App'))) {
            if (/main\.tsx/.test(importer)) {
              if (target === 'landing') {
                return path.resolve(__dirname, 'src/AppLanding.tsx');
              }
              if (target === 'crm') {
                return path.resolve(__dirname, 'src/AppCrm.tsx');
              }
            }
          }
          return null;
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
