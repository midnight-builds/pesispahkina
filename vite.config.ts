import { defineConfig, type Plugin } from 'vitest/config';
import { loadEnv, type HtmlTagDescriptor } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const DEFAULT_CANONICAL_URL = 'https://pesispahkina.talonpoika.dev/';

export function getAnalyticsOrigin(env: Record<string, string>): string | null {
  const url = env.VITE_UMAMI_URL?.trim();
  return url ? (/^https?:\/\/[^/]+/.exec(url)?.[0] ?? null) : null;
}

export function buildCsp(env: Record<string, string>): string {
  const analyticsOrigin = getAnalyticsOrigin(env);
  const allow = (directive: string) => `${directive} 'self'${analyticsOrigin ? ' ' + analyticsOrigin : ''}`;

  return [
    "default-src 'self'",
    allow('script-src'),
    allow('connect-src'),
    "img-src 'self' data:",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self' data:",
    "base-uri 'self'",
    "form-action 'none'",
    "object-src 'none'",
    "manifest-src 'self'",
  ].join('; ');
}

// Lisää buildiin CSP:n ja canonical-linkin. Umami-skriptit ladataan runtime-puolella
// vain tuotannossa ja vain canonical-hostilla.
function analyticsCsp(env: Record<string, string>): Plugin {
  const csp = buildCsp(env);
  const canonicalUrl = env.VITE_CANONICAL_URL?.trim() || DEFAULT_CANONICAL_URL;

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
        {
          tag: 'link',
          attrs: { rel: 'canonical', href: canonicalUrl },
          injectTo: 'head',
        },
      ];
      return tags;
    },
  };
}

// Julkaistaan GitHub Pagesiin custom domainin juuressa: https://pesispahkina.talonpoika.dev/
// Ks. docs/adr/0003-github-pages-julkaisu.md
export default defineConfig(({ mode }) => ({
  base: '/',
  envPrefix: ['VITE_'],
  plugins: [
    analyticsCsp(loadEnv(mode, '.', '')),
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
    // e2e/ on Playwrightin, ei vitestin — oletus-include poimisi *.spec.ts:n.
    exclude: ['node_modules/**', 'e2e/**'],
  },
}));
