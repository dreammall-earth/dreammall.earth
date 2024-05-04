#!/bin/bash

# find directories
SCRIPT_PATH=$(realpath $0)
SCRIPT_DIR=$(dirname $SCRIPT_PATH)
PROJECT_DIR="${SCRIPT_DIR}/../"
PRESENTER_DIR="${PROJECT_DIR}/presenter/"
FRONTEND_DIR="${PROJECT_DIR}/frontend/"
ADMIN_DIR="${PROJECT_DIR}/admin/"
BACKEND_DIR="${PROJECT_DIR}/backend/"

# navigate to project directory
cd ${PROJECT_DIR}

# find new version
VERSION="$(node -p -e "require('./package.json').version")"

# update version in sub projects
cd ${PRESENTER_DIR}
npm version ${VERSION}
cd ${FRONTEND_DIR}
npm version ${VERSION}
cd ${ADMIN_DIR}
npm version ${VERSION}
cd ${BACKEND_DIR}
npm version ${VERSION}

# generate changelog
cd ${PROJECT_DIR}
npx --yes auto-changelog --commit-limit 0 --latest-version ${VERSION}