# ui-main

Code base for frontend browser client

## Start project

### Install dependencies

`npm install`

### Run dev-server

`npm start`

It connects to shared dev instance by reading hardcoded configs from `src/config.js`

### Contribution

To learn about our design designs, project structure etc, follow [Contribution Guide](CONTRIBUTION.md)

## Configuration

`.env` file contains a set of default variables values. Most of these values are the same for all evironments.

In order to override those values locally you can:

- create `.env.local` files and put the only the variables you want to override
- provide system variables

Variables source priority:

1. system variables
2. `.env.local`
3. `.env`

To decouple configuration from a build time we extended `.env` config with global override (see `src/index.html` for `__MIR__APP__`).

Idea is that application during build time still inject `.env` values to code bundles, however when app executed in browser it checks `__MIR_APP__.config` for parametrization, and replace pre-build defaults

### Build

Search and replace placeholders like `$$$COME_CONGIG_NAME$$$` in target `index.html`
Replace ALL placeholders, don't left unfilled placeholders

### Development

Nothing changes except, when we introduce config for a runtime, for example some secret key for third-party service or
base url etc we have to extemd `__MIR__APP.config` and mix it properly with env configs

## White Labeling

### Dev Mode

To change `whitelabeling` provide subdomain to test for `MIR_DOMAIN_DEV_ORG_FALLBACK` in `.env.local`, if you don't need it, just left empty

### Production

Application search for subdomain in url for example `https://my-company.foofooo.blblblblb.com`, so
subdomain (aka org name) would be `my-company`
