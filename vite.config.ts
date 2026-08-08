import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Julkaistaan GitHub Pagesiin custom domainin juuressa: https://pesispahkina.talonpoika.dev/
// Ks. docs/adr/0003-github-pages-julkaisu.md
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icon.svg', 'icon-maskable.svg'],
      manifest: {
        name: 'PesisPähkinä',
        short_name: 'PesisPähkinä',
        description: 'Opi pesäpallon säännöt pelaamalla.',
        lang: 'fi',
        theme_color: '#0f7a4d',
        background_color: '#0b1020',
        display: 'standalone',
        orientation: 'any',
        scope: '/',
        start_url: '/',
        icons: [
          { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          { src: 'icon-maskable.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
        ],
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'node',
  },
});
