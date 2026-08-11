import { defineConfig, devices } from '@playwright/test';

// Savutesti ajetaan tuotantobuildia vasten (vite preview serveeraa dist/-hakemiston),
// jotta bundlaus, base-polku ja PWA-artefaktit tulevat testatuksi — ei dev-serveriä.
// Aja `npm run build` ennen `npm run test:e2e`.
export default defineConfig({
  testDir: 'e2e',
  use: {
    baseURL: 'http://127.0.0.1:4173',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4173 --strictPort',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !process.env.CI,
  },
});
