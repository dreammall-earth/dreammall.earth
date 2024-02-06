#!/bin/sh

# Find current directory & configure paths
SCRIPT_PATH=$(realpath $0)
SCRIPT_DIR=$(dirname $SCRIPT_PATH)
LOG_FILE=$SCRIPT_DIR/../log/$(date +"%Y-%m-%d %T")_deploy.log

exec 3>&1 1>>${LOG_FILE} 2>&1

echo 'Start Deploy' | tee /dev/fd/3

# Update git
# assuming you are already on the right branch
git pull -ff | tee /dev/fd/3

# stop all services
pm2 stop all | tee /dev/fd/3
pm2 delete all | tee /dev/fd/3
pm2 save | tee /dev/fd/3

# run as production
BACKUP_NODE_ENV=$NODE_ENV
export NODE_ENV=production

# Backend & Database Migration
$SCRIPT_DIR/build.backend.sh | tee /dev/fd/3
$SCRIPT_DIR/migrate.database.sh | tee /dev/fd/3
$SCRIPT_DIR/start.backend.sh | tee /dev/fd/3

# Presenter
$SCRIPT_DIR/build.presenter.sh | tee /dev/fd/3
$SCRIPT_DIR/start.presenter.sh | tee /dev/fd/3

# Docs
$SCRIPT_DIR/build.docs.sh | tee /dev/fd/3

# restore node env
NODE_ENV=$BACKUP_NODE_ENV

echo 'Finish Deploy' | tee /dev/fd/3