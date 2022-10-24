# --------------> The build image
FROM node:16-alpine AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci && npm cache clean --force
 
# --------------> The production image
FROM node:16-alpine
RUN apk add dumb-init
WORKDIR /usr/src/app
COPY --chown=node:node --from=build /usr/src/app/node_modules /usr/src/app/node_modules
COPY --chown=node:node . /usr/src/app/
RUN chown -R node:node /usr/src/app
USER node
CMD ["dumb-init", "node", "server.js"]
