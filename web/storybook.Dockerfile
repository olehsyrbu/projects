
FROM nginx:stable-alpine as prod
COPY ./storybook-static /srv/miresource-storybook
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./storybook.default.conf /etc/nginx/conf.d/default.conf
WORKDIR /srv/miresource-storybook
ARG TIME=undefined
ARG BRANCH=undefined
ARG COMMIT_SHORT_HASH=undefined
ARG COMMIT_HASH=undefined
ARG GIT_URL=undefined
LABEL ci.build.layer="miresource-storybook.prod"
LABEL ci.build.branch="$BRANCH"
LABEL ci.build.commit="$COMMIT_SHORT_HASH"
LABEL ci.build.created="$TIME"
