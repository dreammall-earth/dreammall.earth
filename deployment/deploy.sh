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

# run as production
BACKUP_NODE_ENV=$NODE_ENV
export NODE_ENV=production

# Backend & Database Migration
$SCRIPT_DIR/build.backend.sh
$SCRIPT_DIR/migrate.database.sh
$SCRIPT_DIR/start.backend.sh

# Presenter
$SCRIPT_DIR/build.presenter.sh
$SCRIPT_DIR/start.presenter.sh

# Docs
$SCRIPT_DIR/build.docs.sh

# restore node env
NODE_ENV=$BACKUP_NODE_ENV