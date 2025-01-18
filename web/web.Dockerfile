FROM nginx:stable-alpine as prod
COPY ./dist /srv/miresource-web
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./web.default.conf /etc/nginx/conf.d/default.conf
COPY ./entrypoint.sh /docker-entrypoint.d/
RUN chmod +x /docker-entrypoint.d/entrypoint.sh
WORKDIR /srv/miresource-web
ARG TIME=undefined
ARG BRANCH=undefined
ARG COMMIT_SHORT_HASH=undefined
ARG COMMIT_HASH=undefined
ARG GIT_URL=undefined
LABEL ci.build.layer="miresource-web.prod"
LABEL ci.build.branch="$BRANCH"
LABEL ci.build.commit="$COMMIT_SHORT_HASH"
LABEL ci.build.created="$TIME"
