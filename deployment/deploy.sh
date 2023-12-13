#!/bin/sh

# Find current directory & configure paths
SCRIPT_PATH=$(realpath $0)
SCRIPT_DIR=$(dirname $SCRIPT_PATH)

# Update git
# assuming you are already on the right branch
git pull -ff

# stop all services
pm2 stop all
pm2 delete all
pm2 save

# Backend
$SCRIPT_DIR/build.backend.sh

# Presenter
$SCRIPT_DIR/build.presenter.sh
$SCRIPT_DIR/start.presenter.sh

# Docs
$SCRIPT_DIR/build.docs.sh