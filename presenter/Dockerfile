FROM node:21-alpine3.17 AS base

# ENVs (available in production aswell, can be overwritten by commandline or env file)
## DOCKER_WORKDIR would be a classical ARG, but that is not multi layer persistent - shame
ENV DOCKER_WORKDIR="/app"
## We Cannot do `$(date -u +'%Y-%m-%dT%H:%M:%SZ')` here so we use unix timestamp=0
ENV BUILD_DATE="1970-01-01T00:00:00.00Z"
## We cannot do $(npm run version).${BUILD_NUMBER} here so we default to 0.0.0.0
ENV BUILD_VERSION="0.0.0.0"
## We cannot do `$(git rev-parse --short HEAD)` here so we default to 0000000
ENV BUILD_COMMIT="0000000"
## SET NODE_ENV
ENV NODE_ENV="production"
## App relevant Envs
ENV PORT="3000"

# Labels
LABEL org.label-schema.build-date="${BUILD_DATE}"
LABEL org.label-schema.name="dreamMall:presenter"
LABEL org.label-schema.description="DreamMall Presenter"
LABEL org.label-schema.usage="https://github.com/dreammall-earth/dreammall.earth/tree/master/presenter/README.md"
LABEL org.label-schema.url="https://github.com/dreammall-earth/dreammall.earth/tree/master/presenter"
LABEL org.label-schema.vcs-url="https://github.com/dreammall-earth/dreammall.earth/tree/master/presenter/"
LABEL org.label-schema.vcs-ref="${BUILD_COMMIT}"
LABEL org.label-schema.vendor="DreamMall"
LABEL org.label-schema.version="${BUILD_VERSION}"
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
COPY --from=build ${DOCKER_WORKDIR}/server ./server
COPY --from=build ${DOCKER_WORKDIR}/tsconfig.json ./tsconfig.json

# Run command
CMD /bin/sh -c "npm run server:prod"
