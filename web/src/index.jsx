import './styles/main.css';
import { createRoot } from 'react-dom/client';
import { initialize } from 'launchdarkly-js-client-sdk';
import { LDProvider } from 'launchdarkly-react-client-sdk';
import * as FullStory from '@fullstory/browser';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import App from './App';
import config from '@/core/config';
import graphQLClient from '@/core/api/graphQLClient';
import { logger } from '@/core/logger';
import mixpanel from '@/core/mixpanel';
import { getSubdomain } from '@/modules/organization';

// eslint-disable-next-line no-undef
window.__MIR_APP__.version = __MIR_APP_VERSION__;

if (process.env.NODE_ENV === 'development') {
  window.__MIR_APP__.client = graphQLClient;

  if (config.shouldMockNetwork) {
    const { setupMocks } = require('@/tools/test-server/setupMocks');

    const worker = setupMocks();
    worker.start();
  }
}

if (config.monitoring.sentryEnv && config.monitoring.sentryDsn) {
  const tracePropagationTargets = ['localhost', /^\//];

  if (config.api.baseUrl) {
    const apiHost = new URL(config.api.baseUrl).host;
    tracePropagationTargets.push(apiHost);
  }

  Sentry.init({
    release: window.__MIR_APP__.version,
    dsn: config.monitoring.sentryDsn,
    environment: config.monitoring.sentryEnv,
    debug: config.monitoring.sentryDebug,
    integrations: [
      new Integrations.BrowserTracing({
        tracePropagationTargets,
      }),
    ],
    tracesSampleRate: config.monitoring.sentryTraceSampleRate,
    ignoreErrors: [
      // ignore webkit extensions, see https://github.com/getsentry/sentry-javascript/discussions/5875
      '@webkit-masked-url(://hidden/)',
    ],
  });
}

logger.info('Starting App with: ', {
  ...window.__MIR_APP__,
});

let subdomain = getSubdomain();

let ldClient = initialize(
  config.launchDarklyClientId,
  {
    kind: 'multi',
    user: { kind: 'user', anonymous: true },
    organization: subdomain
      ? { kind: 'organization', key: subdomain }
      : {
          kind: 'organization',
          key: config.rootOrganization.slug,
          name: config.rootOrganization.name,
        },
  },
  { sendEventsOnlyForVariation: true },
);

await ldClient.waitForInitialization();

if (config.fullstoryOrgId) {
  FullStory.init({
    orgId: config.fullstoryOrgId,
    devMode: !ldClient.variation('fullstory'),
  });
}

mixpanel.init(config.mixpanelToken);
mixpanel.set_group('organization', subdomain ?? config.rootOrganization.slug);

if (!ldClient.variation('mixpanel')) {
  mixpanel.disable();
}

let container = document.getElementById('app');
let root = createRoot(container);

root.render(
  <LDProvider ldClient={ldClient} reactOptions={{ useCamelCaseFlagKeys: false }}>
    <App />
  </LDProvider>,
);

if (module.hot) {
  module.hot.accept();
}
