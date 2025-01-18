import * as Sentry from '@sentry/nextjs';

Sentry.init({
  debug: false,
  dsn: window.SENTRY_CONFIG.dsn,
  release: window.SENTRY_CONFIG.release,
  environment: window.SENTRY_CONFIG.environment,

  tracesSampleRate: window.SENTRY_CONFIG.tracesSampleRate,
  tracePropagationTargets: ['localhost', /^\//, window.SENTRY_CONFIG.host],

  ignoreErrors: [
    // ignore webkit extensions, see https://github.com/getsentry/sentry-javascript/discussions/5875
    '@webkit-masked-url(://hidden/)',
  ],
});
