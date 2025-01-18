/**
 * @type {import('next').NextConfig}
 */
const pkg = require('./package.json');

module.exports = {
  output: 'standalone',
  reactStrictMode: false,
  env: {
    SENTRY_RELEASE: pkg.version,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  headers: () => [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=31536000; includeSubDomains; preload;',
        },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        {
          key: 'Content-Security-Policy',
          value: `default-src 'self' data:; script-src 'self' * 'unsafe-inline' 'unsafe-eval'; style-src 'unsafe-inline' * 'self' data:; font-src * 'self' data:; connect-src 'self' * blob:; img-src * 'self' data: blob:; child-src * 'self'; frame-src * 'self';`,
        },
      ],
    },
  ],
  webpack: (config) => {
    config.module.rules = config.module.rules.map((rule) => {
      return rule.loader === 'next-image-loader'
        ? { test: rule.test, type: 'asset/resource' }
        : rule;
    });
    return config;
  },
};

const { withSentryConfig } = require('@sentry/nextjs');

module.exports = withSentryConfig(
  module.exports,
  {
    release: pkg.version,
    silent: true,
    org: 'miresource',
    project: 'miresource',
  },
  {
    widenClientFileUpload: true,
    tunnelRoute: '/monitoring',
    hideSourceMaps: true,
    disableLogger: true,
  },
);
