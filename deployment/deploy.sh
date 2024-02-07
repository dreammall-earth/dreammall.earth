#!/bin/sh

# Find current directory & configure paths
SCRIPT_PATH=$(realpath $0)
SCRIPT_DIR=$(dirname $SCRIPT_PATH)
TIMESTAMP=$(date +"%Y-%m-%d_%T")
LOG_PATH=$SCRIPT_DIR/../log
LOG_FILE=$LOG_PATH/${TIMESTAMP}_deploy.log
LOG_ERROR_FILE=$LOG_PATH/${TIMESTAMP}_deploy.error.log

exec 3>&1 1>>${LOG_FILE} 2>&1 2>>${LOG_ERROR_FILE}

{
    echo 'Start Deploy' 

    # Logrotate nginx logs
    mv $LOG_PATH/nginx.*.log $LOG_PATH/${TIMESTAMP}_nginx.*.log
    # trigger nginx logfile reload
    kill -USR1 `cat /var/run/nginx.pid`

    # stop all services
    pm2 stop all
    pm2 delete all
    pm2 save

    # Update git
    # assuming you are already on the right branch
    git pull -ff

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

    echo 'Finish Deploy'
} | tee /dev/fd/3