/// <reference types="vitest/config" />
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Julkaistaan GitHub Pagesiin projektisivuna: https://midnight-builds.github.io/pesispahkina/
// Ks. docs/adr/0003-github-pages-julkaisu.md
export default defineConfig({
  base: '/pesispahkina/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icon.svg', 'icon-maskable.svg'],
      manifest: {
        name: 'PesäPähkinä',
        short_name: 'PesäPähkinä',
        description: 'Opi pesäpallon säännöt pelaamalla.',
        lang: 'fi',
        theme_color: '#0f7a4d',
        background_color: '#0b1020',
        display: 'standalone',
        orientation: 'any',
        scope: '/pesispahkina/',
        start_url: '/pesispahkina/',
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
