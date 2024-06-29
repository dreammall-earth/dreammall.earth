#!/bin/sh

# Find current directory & configure paths
SCRIPT_PATH=$(realpath $0)
SCRIPT_DIR=$(dirname $SCRIPT_PATH)
PROJECT_ROOT=$SCRIPT_DIR/../../backend

# Build the project
cd $PROJECT_ROOT
pnpm run db:migrate:deploy
