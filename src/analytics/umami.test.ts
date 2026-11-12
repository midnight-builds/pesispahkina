// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { installUmami, shouldEnableUmami, trackEvent } from './umami';

describe('Umami analytics loader', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
  });

  it('enables analytics only on the production hostname', () => {
    expect(
      shouldEnableUmami({
        PROD: true,
        VITE_UMAMI_URL: 'https://analytics.talonpoika.dev',
        VITE_UMAMI_WEBSITE_ID: 'site-id',
      } as ImportMetaEnv, 'localhost'),
    ).toBe(false);

    expect(
      shouldEnableUmami({
        PROD: true,
        VITE_UMAMI_URL: 'https://analytics.talonpoika.dev',
        VITE_UMAMI_WEBSITE_ID: 'site-id',
      } as ImportMetaEnv, 'pesispahkina.talonpoika.dev'),
    ).toBe(true);
  });

  it('injects tracker and recorder scripts with the expected attributes', () => {
    installUmami({
      PROD: true,
      VITE_UMAMI_URL: 'https://analytics.talonpoika.dev',
      VITE_UMAMI_WEBSITE_ID: '5da21708-6326-4f42-a192-fc6d55705427',
    } as ImportMetaEnv, 'pesispahkina.talonpoika.dev');

    const tracker = document.getElementById('umami-tracker');
    const recorder = document.getElementById('umami-recorder');

    expect(tracker).not.toBeNull();
    expect(tracker?.getAttribute('src')).toBe('https://analytics.talonpoika.dev/script.js');
    expect(tracker?.getAttribute('data-website-id')).toBe('5da21708-6326-4f42-a192-fc6d55705427');
    expect(tracker?.getAttribute('data-host-url')).toBe('https://analytics.talonpoika.dev');
    expect(tracker?.getAttribute('data-domains')).toBe('pesispahkina.talonpoika.dev');
    expect(recorder?.getAttribute('src')).toBe('https://analytics.talonpoika.dev/recorder.js');
    expect(recorder?.getAttribute('data-website-id')).toBe('5da21708-6326-4f42-a192-fc6d55705427');

    installUmami({
      PROD: true,
      VITE_UMAMI_URL: 'https://analytics.talonpoika.dev',
      VITE_UMAMI_WEBSITE_ID: '5da21708-6326-4f42-a192-fc6d55705427',
    } as ImportMetaEnv, 'pesispahkina.talonpoika.dev');

    expect(document.querySelectorAll('#umami-tracker')).toHaveLength(1);
    expect(document.querySelectorAll('#umami-recorder')).toHaveLength(1);
  });
});

describe('trackEvent', () => {
  afterEach(() => {
    delete window.umami;
  });

  it('forwards the event to the Umami tracker', () => {
    const track = vi.fn();
    window.umami = { track };

    trackEvent('kierros-aloitettu', { nakokulma: 'pelaaja', ikaluokka: 'G', vaikeustaso: 'aloittelija' });

    expect(track).toHaveBeenCalledWith('kierros-aloitettu', {
      nakokulma: 'pelaaja',
      ikaluokka: 'G',
      vaikeustaso: 'aloittelija',
    });
  });

  it('is a no-op when the tracker is missing or throws', () => {
    expect(() => trackEvent('kierros-valmis')).not.toThrow();

    window.umami = {
      track: () => {
        throw new Error('blocked');
      },
    };
    expect(() => trackEvent('kierros-valmis')).not.toThrow();
  });
});
