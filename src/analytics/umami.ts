const PROD_HOSTNAME = 'pesispahkina.talonpoika.dev';
const TRACKER_SCRIPT_ID = 'umami-tracker';
const RECORDER_SCRIPT_ID = 'umami-recorder';
const TRACKER_SCRIPT_URL = '/script.js';
const RECORDER_SCRIPT_URL = '/recorder.js';

function appendScript(id: string, src: string, attrs: Record<string, string>) {
  if (document.getElementById(id)) {
    return;
  }

  const script = document.createElement('script');
  script.id = id;
  script.async = true;
  script.defer = true;
  script.src = src;

  Object.entries(attrs).forEach(([name, value]) => {
    script.setAttribute(name, value);
  });

  document.head.appendChild(script);
}

export function shouldEnableUmami(env = import.meta.env, hostname = window.location.hostname): boolean {
  return Boolean(
    env.PROD && env.VITE_UMAMI_URL && env.VITE_UMAMI_WEBSITE_ID && hostname === PROD_HOSTNAME,
  );
}

export function installUmami(env = import.meta.env, hostname = window.location.hostname) {
  if (!shouldEnableUmami(env, hostname)) {
    return;
  }

  const hostUrl = String(env.VITE_UMAMI_URL).replace(/\/$/, '');
  const websiteId = String(env.VITE_UMAMI_WEBSITE_ID).trim();
  const scriptOrigin = new URL(hostUrl).origin;
  const trackerSrc = new URL(TRACKER_SCRIPT_URL, `${scriptOrigin}/`).toString();
  const recorderSrc = new URL(RECORDER_SCRIPT_URL, `${scriptOrigin}/`).toString();
  const sharedAttrs = {
    'data-website-id': websiteId,
    'data-host-url': hostUrl,
  };

  appendScript(TRACKER_SCRIPT_ID, trackerSrc, {
    ...sharedAttrs,
    'data-domains': PROD_HOSTNAME,
  });
  appendScript(RECORDER_SCRIPT_ID, recorderSrc, sharedAttrs);
}
