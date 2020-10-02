FROM node:14.11.0 AS development

RUN mkdir /srv/client && chown node:node /srv/client

WORKDIR /srv/client

USER node

COPY --chown=node:node package.json yarn.lock ./

RUN yarn install --silent

RUN mkdir -p node_modules

# # TODO: Fix production application. We are currently serving static frontend assets from the backend. 
# FROM node:14.11.0-slim AS production

# USER node

# WORKDIR /srv/client

# COPY --from=development --chown=root:root /srv/backend/.env /srv/backend 
# COPY --from=development --chown=root:root /srv/client/.env /srv/backend 

# COPY . .

# CMD ["node", "index.js"]
