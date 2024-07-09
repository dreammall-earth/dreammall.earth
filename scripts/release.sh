#!/bin/bash

# find directories
SCRIPT_PATH=$(realpath $0)
SCRIPT_DIR=$(dirname $SCRIPT_PATH)
PROJECT_DIR="${SCRIPT_DIR}/../"

# navigate to project directory
cd ${PROJECT_DIR}

# find new version
VERSION="$(node -p -e "require('./package.json').version")"

# update version in sub projects
pnpm -r exec pnpm version ${VERSION}

# generate changelog
pnpm dlx auto-changelog --commit-limit 0 --latest-version ${VERSION}
