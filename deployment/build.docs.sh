#!/bin/sh

# Find current directory & configure paths
SCRIPT_PATH=$(realpath $0)
SCRIPT_DIR=$(dirname $SCRIPT_PATH)
PROJECT_ROOT=$SCRIPT_DIR/..
BUILD_DIR=$PROJECT_ROOT/build/docs

# Build the project
cd $PROJECT_ROOT
rm -R $BUILD_DIR

export VUEPRESS_BASE=/docs/

npm install
npm run docs:build
