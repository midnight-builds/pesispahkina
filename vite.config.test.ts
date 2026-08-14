import { describe, expect, it } from 'vitest';
import { buildCsp, getAnalyticsOrigin } from './vite.config';

describe('analytics CSP', () => {
  it('uses the Umami origin for script and connect directives', () => {
    const env = {
      VITE_UMAMI_URL: 'https://analytics.talonpoika.dev',
    };

    expect(getAnalyticsOrigin(env)).toBe('https://analytics.talonpoika.dev');
    expect(buildCsp(env)).toContain("script-src 'self' https://analytics.talonpoika.dev");
    expect(buildCsp(env)).toContain("connect-src 'self' https://analytics.talonpoika.dev");
    expect(buildCsp(env)).toContain("img-src 'self' data:");
    expect(buildCsp(env)).not.toContain('goatcounter');
  });
});
