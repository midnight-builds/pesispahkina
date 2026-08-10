import { defineConfig, type Plugin } from 'vitest/config';
import { loadEnv, type HtmlTagDescriptor } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// Injektoi GoatCounter-skriptin ja sitä vastaavan CSP:n käännettyyn index.htmliin.
// Ilman PUBLIC_GOATCOUNTER_URL:ia analytiikkaa ei lisätä, mutta CSP asetetaan silti.
// Ks. docs/adr/0008-analytiikka-goatcounter.md
function analyticsAndCsp(env: Record<string, string>): Plugin {
  const url = env.PUBLIC_GOATCOUNTER_URL?.trim();
  // Origin ilman URL-konstruktoria: tsconfig.node ei sisällä DOM/Node-tyyppejä.
  const origin = url ? (/^https?:\/\/[^/]+/.exec(url)?.[0] ?? null) : null;
  const scriptSrc = url ? url.replace(/\/[^/]*$/, '') + '/count.js' : null;
  const allow = (directive: string) => `${directive} 'self'${origin ? ' ' + origin : ''}`;
  const csp = [
    "default-src 'self'",
    allow('script-src'),
    allow('connect-src'),
    `${allow('img-src')} data:`,
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self' data:",
    "base-uri 'self'",
    "form-action 'none'",
    "object-src 'none'",
    "manifest-src 'self'",
  ].join('; ');

  return {
    name: 'pesispahkina-analytics-csp',
    apply: 'build',
    transformIndexHtml() {
      const tags: HtmlTagDescriptor[] = [
        {
          tag: 'meta',
          attrs: { 'http-equiv': 'Content-Security-Policy', content: csp },
          injectTo: 'head-prepend',
        },
      ];
      if (url && scriptSrc) {
        tags.push({
          tag: 'script',
          attrs: { async: true, 'data-goatcounter': url, src: scriptSrc },
          injectTo: 'head',
        });
      }
      return tags;
    },
  };
}

// Julkaistaan GitHub Pagesiin custom domainin juuressa: https://pesispahkina.talonpoika.dev/
// Ks. docs/adr/0003-github-pages-julkaisu.md
export default defineConfig(({ mode }) => ({
  base: '/',
  envPrefix: ['VITE_', 'PUBLIC_'],
  plugins: [
    analyticsAndCsp(loadEnv(mode, '.', '')),
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
}));
