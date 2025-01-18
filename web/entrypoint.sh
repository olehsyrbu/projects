#!/bin/sh
# set -ux
cd /srv/miresource-web

sed -i "s#\\\$\\\$\\\$MIR_API_GATEWAY_BASE_URL\\\$\\\$\\\$#${API_BASE_URL}#g" index.html
sed -i "s#\\\$\\\$\\\$MIR_GOOGLE_MAP_API_KEY\\\$\\\$\\\$#${GOOGLE_MAPS_API_KEY}#g" index.html
sed -i "s#\\\$\\\$\\\$MIR_MIXPANEL_TOKEN\\\$\\\$\\\$#${MIXPANEL_TOKEN}#g" index.html
sed -i "s#\\\$\\\$\\\$MIR_ZENDESK_KEY\\\$\\\$\\\$#${MIR_ZENDESK_KEY}#g" index.html
sed -i "s#\\\$\\\$\\\$MIR_DEPLOYMENT_URL\\\$\\\$\\\$#${DEPLOYMENT_URL}#g" index.html
sed -i "s#\\\$\\\$\\\$MIR_SENTRY_ENV\\\$\\\$\\\$#${SENTRY_ENV}#g" index.html
sed -i "s#\\\$\\\$\\\$MIR_SENTRY_DSN\\\$\\\$\\\$#${SENTRY_DSN}#g" index.html
sed -i "s#\\\$\\\$\\\$MIR_SENTRY_TRACE_SAMPLE_RATE\\\$\\\$\\\$#${SENTRY_TRACE_SAMPLE_RATE}#g" index.html
sed -i "s#\\\$\\\$\\\$MIR_SENTRY_DEBUG\\\$\\\$\\\$#${SENTRY_DEBUG}#g" index.html
sed -i "s#\\\$\\\$\\\$MIR_DARK_LAUNCH_CLIENT_ID\\\$\\\$\\\$#${MIR_DARK_LAUNCH_CLIENT_ID}#g" index.html
sed -i "s#\\\$\\\$\\\$MIR_ON_DEMAND_CASE_MANAGEMENT_URL\\\$\\\$\\\$#${MIR_ON_DEMAND_CASE_MANAGEMENT_URL}#g" index.html
sed -i "s#\\\$\\\$\\\$MIR_MINDLOGGER_API_URL\\\$\\\$\\\$#${MIR_MINDLOGGER_API_URL}#g" index.html
sed -i "s#\\\$\\\$\\\$MIR_MINDLOGGER_API_CREDENTIALS\\\$\\\$\\\$#${MIR_MINDLOGGER_API_CREDENTIALS}#g" index.html
sed -i "s#\\\$\\\$\\\$MIR_FULLSTORY_ORG_ID\\\$\\\$\\\$#${MIR_FULLSTORY_ORG_ID}#g" index.html
sed -i "s#\\\$\\\$\\\$MIR_GOOGLE_VERIFICATION_ID\\\$\\\$\\\$#${MIR_GOOGLE_VERIFICATION_ID}#g" index.html

if [[ ${DEPLOYMENT_URL} == miresource.com ]]; then
rm -rf *.map
fi
