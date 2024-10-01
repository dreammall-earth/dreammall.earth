FROM node:21-alpine3.17 AS base

# ENVs (available in production aswell, can be overwritten by commandline or env file)
## DOCKER_WORKDIR would be a classical ARG, but that is not multi layer persistent - shame
ENV DOCKER_WORKDIR="/app"
## SET NODE_ENV
ENV NODE_ENV="production"
## App relevant Envs
ENV PORT="3000"

# Labels
LABEL org.label-schema.name="dreamMall:presenter"
LABEL org.label-schema.description="DreamMall Presenter"
LABEL org.label-schema.usage="https://github.com/dreammall-earth/dreammall.earth/tree/master/presenter/README.md"
LABEL org.label-schema.url="https://github.com/dreammall-earth/dreammall.earth/tree/master/presenter"
LABEL org.label-schema.vcs-url="https://github.com/dreammall-earth/dreammall.earth/tree/master/presenter/"
LABEL org.label-schema.vendor="DreamMall"
LABEL org.label-schema.schema-version="1.0"
LABEL maintainer="info@it4c.dev"

# Install Additional Software
## install: node-gyp dependencies
# RUN apk --no-cache add g++ make python3

# Settings
## Expose Container Port
EXPOSE ${PORT}

## Workdir
RUN mkdir -p ${DOCKER_WORKDIR}
WORKDIR ${DOCKER_WORKDIR}

##################################################################################
# DEVELOPMENT (Connected to the local environment, to reload on demand) ##########
##################################################################################
FROM base AS development

# We don't need to copy or build anything since we gonna bind to the
# local filesystem which will need a rebuild anyway

# Run command
# (for development we need to execute npm install since the
#  node_modules are on another volume and need updating)
CMD /bin/sh -c "npm install && npm run dev"

##################################################################################
# STORYBOOK ######################################################################
##################################################################################
FROM base AS storybook

# We don't need to copy or build anything since we gonna bind to the
# local filesystem which will need a rebuild anyway

# Run command
# (for development we need to execute npm install since the
#  node_modules are on another volume and need updating)
CMD /bin/sh -c "npm install && npm run storybook"

##################################################################################
# BUILD (Does contain all files and is therefore bloated) ########################
##################################################################################
FROM base AS build

COPY package.json package-lock.json ./
RUN npm install --include=dev --frozen-lockfile --non-interactive
COPY . .
RUN npm run build

##################################################################################
# PRODUCTION (Does contain only "binary"- and static-files to reduce image size) #
##################################################################################
FROM base AS production

COPY --from=build ${DOCKER_WORKDIR}/package.json ${DOCKER_WORKDIR}/package-lock.json ./
RUN npm install --omit=dev --frozen-lockfile --non-interactive

COPY --from=build ${DOCKER_WORKDIR}/build ./build
# This file is created when building and prevents vike to find the server entry point if not present
COPY --from=build ${DOCKER_WORKDIR}/node_modules/@brillout/vite-plugin-server-entry/dist/runtime/autoImporter.js ./node_modules/@brillout/vite-plugin-server-entry/dist/runtime/autoImporter.js

COPY --from=build ${DOCKER_WORKDIR}/server ./server
COPY --from=build ${DOCKER_WORKDIR}/tsconfig.json ./tsconfig.json

# Run command
CMD /bin/sh -c "npm run server"
