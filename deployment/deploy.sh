#!/bin/sh

# Find current directory & configure paths
SCRIPT_PATH=$(realpath $0)
SCRIPT_DIR=$(dirname $SCRIPT_PATH)
LOG_DIR=$SCRIPT_DIR/../log/$(date +"%Y-%m-%d %T")

# Create logfdir
mkdir "$LOG_DIR"

echo 'Start Deploy' >> $LOG_DIR/deploy.log

# Update git
# assuming you are already on the right branch
git pull -ff >> $LOG_DIR/deploy.log 2>> $LOG_DIR/deploy.error.log

# stop all services
pm2 stop all >> $LOG_DIR/deploy.log 2>> $LOG_DIR/deploy.error.log
pm2 delete all >> $LOG_DIR/deploy.log 2>> $LOG_DIR/deploy.error.log
pm2 save >> $LOG_DIR/deploy.log 2>> $LOG_DIR/deploy.error.log

# run as production
BACKUP_NODE_ENV=$NODE_ENV
export NODE_ENV=production

# Backend & Database Migration
$SCRIPT_DIR/build.backend.sh >> $LOG_DIR/deploy.backend.log 2>> $LOG_DIR/deploy.backend.error.log
$SCRIPT_DIR/migrate.database.sh >> $LOG_DIR/deploy.backend.log 2>> $LOG_DIR/deploy.backend.error.log
$SCRIPT_DIR/start.backend.sh >> $LOG_DIR/deploy.backend.log 2>> $LOG_DIR/deploy.backend.error.log

# Presenter
$SCRIPT_DIR/build.presenter.sh >> $LOG_DIR/deploy.presenter.log 2>> $LOG_DIR/deploy.presenter.error.log
$SCRIPT_DIR/start.presenter.sh >> $LOG_DIR/deploy.presenter.log 2>> $LOG_DIR/deploy.presenter.error.log

# Docs
$SCRIPT_DIR/build.docs.sh >> $LOG_DIR/deploy.docs.log 2>> $LOG_DIR/deploy.docs.error.log

# restore node env
NODE_ENV=$BACKUP_NODE_ENV

echo 'Finish Deploy' >> $LOG_DIR/deploy.log