import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import { seoPlugin } from './vite-seo-plugin.ts';
import { readFileSync } from 'node:fs';

const packageJson = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf8'),
) as { version: string };

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  return {
    define: {
      __APP_VERSION__: JSON.stringify(packageJson.version),
    },
    plugins: [react(), seoPlugin(env.VITE_SITE_URL ?? '')],
    server: { port: 5173 },
  };
});
