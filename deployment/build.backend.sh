#!/bin/sh

# Find current directory & configure paths
SCRIPT_PATH=$(realpath $0)
SCRIPT_DIR=$(dirname $SCRIPT_PATH)
PROJECT_ROOT=$SCRIPT_DIR/../backend
BUILD_DIR=$PROJECT_ROOT/build

# Build the project
cd $PROJECT_ROOT
rm -R $BUILD_DIR
npm install --dev
npm run build
