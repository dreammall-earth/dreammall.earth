FROM node:21-alpine3.17 as base

# ENVs (available in production aswell, can be overwritten by commandline or env file)
## DOCKER_WORKDIR would be a classical ARG, but that is not multi layer persistent - shame
ENV DOCKER_WORKDIR="/app"
## SET NODE_ENV
ENV NODE_ENV="production"
## App relevant Envs
ENV PORT="3000"

# Labels
LABEL org.label-schema.name="dreammall"
LABEL org.label-schema.description="DreamMall"
LABEL org.label-schema.usage="https://github.com/dreammall-earth/dreammall.earth/blob/master/README.md"
LABEL org.label-schema.url="https://github.com/dreammall-earth/dreammall.earth/"
LABEL org.label-schema.vcs-url="https://github.com/dreammall-earth/dreammall.earth/tree/master/"
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
# DOCUMENTATION ##################################################################
##################################################################################
FROM base as documentation

# We don't need to copy or build anything since we gonna bind to the
# local filesystem which will need a rebuild anyway

# Run command
# (for development we need to execute npm install since the
#  node_modules are on another volume and need updating)
CMD /bin/sh -c "npm install && npm run docs:dev"
