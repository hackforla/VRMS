FROM node:14.11.0 AS development

RUN mkdir /srv/backend && chown node:node /srv/backend

WORKDIR /srv/backend

COPY --chown=node:node package.json yarn.lock ./

RUN yarn install --silent

RUN mkdir -p node_modules

FROM node:14.11.0-slim AS production

USER node

WORKDIR /srv/backend

COPY --chown=node:node package.json yarn.lock ./

COPY . .