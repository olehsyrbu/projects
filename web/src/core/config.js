import logoUrl from '@/images/logo.svg';

export function readConfigs(overrides) {
  let sentryTraceSampleRate = process.env.MIR_SENTRY_TRACE_SAMPLE_RATE;
  let sentryDebug = process.env.MIR_SENTRY_DEBUG;

  if (process.env.NODE_ENV === 'production') {
    sentryTraceSampleRate = overrides.monitoring.sentryTraceSampleRate;
    sentryDebug = overrides.monitoring.sentryDebug;
  }

  sentryTraceSampleRate = Number.parseFloat(sentryTraceSampleRate) || 0;
  sentryDebug = sentryDebug === 'true';

  const defaults = {
    deploymentUrl: process.env.MIR_DEPLOYMENT_URL,
    googleMapsApiKey: process.env.MIR_GOOGLE_MAP_API_KEY,
    mixpanelToken: process.env.MIR_MIXPANEL_TOKEN,
    zendeskKey: process.env.MIR_ZENDESK_KEY,
    fullstoryOrgId: process.env.MIR_FULLSTORY_ORG_ID,
    copyrightPolicyUrl: process.env.MIR_COPYRIGHT_POLICY,
    privacyPolicyUrl: process.env.MIR_PRIVACY_POLICY,
    termsOfUseUrl: process.env.MIR_TERMS_OF_USE,
    api: {
      baseUrl: process.env.MIR_API_GATEWAY_BASE_URL || 'http://localhost:3000/graphql',
    },
    // hardcoding mapping of orgs to insurance types, we are going to migrate to backend when more insurances come in
    organizationInsuranceTypes: {
      bcbsks: ['BCBS04'],
    },
    whiteLabeling: {
      mainLogoUrl: logoUrl,
      orgName: '',
      colors: [],
      subdomain: process.env.MIR_DOMAIN_DEV_ORG_FALLBACK,
    },
    rootOrganization: {
      slug: 'miresource',
      name: 'MiResource',
    },
    auth: {
      refreshSleepTimeout: process.env.MIR_AUTH_REFRESH_SLEEP_TIMEOUT_SEC || 180,
      userIdleTimeout: process.env.MIR_AUTH_USER_IDLE_TIMEOUT_SEC || 1750,
    },
    monitoring: {
      sentryDsn: process.env.MIR_SENTRY_DSN,
      sentryEnv: process.env.MIR_SENTRY_ENV,
      sentryTraceSampleRate,
      sentryDebug,
    },
    launchDarklyClientId: process.env.MIR_DARK_LAUNCH_CLIENT_ID,
    shouldMockNetwork:
      process.env.MIR_MOCK_NETWORK === 'true' && process.env.NODE_ENV === 'development',
    onDemandCaseManagementUrl: process.env.MIR_ON_DEMAND_CASE_MANAGEMENT_URL,
    mindLogger: {
      baseUrl: process.env.MIR_MINDLOGGER_API_URL,
      credentials: process.env.MIR_MINDLOGGER_API_CREDENTIALS,
    },
    learningCenterUrl: 'https://www.learn.miresource.com',
    gpaUploadTemplate: 'https://assets.miresource.com/GPA_template.xlsx',
    ncsuEmergencyUrl: 'https://assets.miresource.com/NCSU_mental_health_emergency.pdf',
  };

  let result = defaults;

  if (process.env.NODE_ENV === 'production') {
    result = {
      ...defaults,
      ...overrides,
      monitoring: {
        ...overrides.monitoring,
        sentryTraceSampleRate,
        sentryDebug,
      },
    };
  }

  return result;
}

export default readConfigs(window.__MIR_APP__ ? window.__MIR_APP__.config : {});
