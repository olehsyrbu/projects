import { readConfigs } from './config';

it('read props with no template in result set', () => {
  window.__MIR_APP__ = {
    config: {
      deploymentUrl: 'dsdsds',
      googleMapsApiKey: 'fsdfd',
      mixpanelToken: 'fdfdf',
      zendeskKey: 'fdfddf',
      api: {
        baseUrl: '$$$MIR_API_GATEWAY_BASE_URL$$$',
      },
      auth: {
        refreshSleepTimeout: '$$$MIR_AUTH_REFRESH_SLEEP_TIMEOUT_SEC$$',
        userIdleTimeout: '$$$MIR_AUTH_USER_IDLE_TIMEOUT_SEC$$$',
      },
      monitoring: {
        sentryDsn: '$$$MIR_SENTRY_DSN$$$',
        sentryEnv: '$$$MIR_SENTRY_ENV$$$',
      },
      launchDarklyClientId: '$$$MIR_DARK_LAUNCH_CLIENT_ID$$$',
    },
  };

  const result = readConfigs(window.__MIR_APP__.config);

  expect(result).toMatchObject({
    api: {
      baseUrl: 'http://localhost:3000/graphql',
    },
    auth: {
      refreshSleepTimeout: 180,
      userIdleTimeout: 1750,
    },
    whiteLabeling: {
      colors: [],
      mainLogoUrl: expect.stringContaining('logo.svg'),
      orgName: '',
    },
  });

  expect(window.__MIR_APP__).toMatchObject({
    config: {
      api: {
        baseUrl: '$$$MIR_API_GATEWAY_BASE_URL$$$',
      },
      auth: {
        refreshSleepTimeout: '$$$MIR_AUTH_REFRESH_SLEEP_TIMEOUT_SEC$$',
        userIdleTimeout: '$$$MIR_AUTH_USER_IDLE_TIMEOUT_SEC$$$',
      },
      deploymentUrl: 'dsdsds',
      launchDarklyClientId: '$$$MIR_DARK_LAUNCH_CLIENT_ID$$$',
      googleMapsApiKey: 'fsdfd',
      mixpanelToken: 'fdfdf',
      monitoring: {
        sentryDsn: '$$$MIR_SENTRY_DSN$$$',
        sentryEnv: '$$$MIR_SENTRY_ENV$$$',
      },
      zendeskKey: 'fdfddf',
    },
  });
});
