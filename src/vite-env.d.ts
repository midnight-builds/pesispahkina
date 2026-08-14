/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface ImportMetaEnv {
  readonly VITE_UMAMI_URL?: string;
  readonly VITE_UMAMI_WEBSITE_ID?: string;
  readonly VITE_CANONICAL_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
