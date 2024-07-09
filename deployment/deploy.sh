#!/bin/sh

# Find current directory & configure paths
SCRIPT_PATH=$(realpath $0)
SCRIPT_DIR=$(dirname $SCRIPT_PATH)
PROJECT_ROOT=$SCRIPT_DIR/../../
TIMESTAMP=$(date +"%Y-%m-%d_%T")
LOG_PATH=$SCRIPT_DIR/../log
LOG_FILE=$LOG_PATH/${TIMESTAMP}_deploy.log
LOG_ERROR_FILE=$LOG_PATH/${TIMESTAMP}_deploy.error.log

exec 3>&1 1>>${LOG_FILE} 2>&1 2>>${LOG_ERROR_FILE}

{
    echo 'Start Deploy' 

    # Logrotate nginx logs
    (cd $LOG_PATH; for filename in nginx.*.log; do mv "$filename" "${TIMESTAMP}_${filename}"; done;)
    # trigger nginx logfile reload
    kill -USR1 `cat /var/run/nginx/nginx.pid`

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

    cd $PROJECT_ROOT
    pnpm install --include=dev

    # Backend & Database Migration
    $SCRIPT_DIR/scripts/build.backend.sh
    $SCRIPT_DIR/scripts/migrate.database.sh
    $SCRIPT_DIR/scripts/start.backend.sh

    # Admin
    $SCRIPT_DIR/scripts/build.admin.sh
    $SCRIPT_DIR/scripts/start.admin.sh

    # Frontend
    $SCRIPT_DIR/scripts/build.frontend.sh
    $SCRIPT_DIR/scripts/start.frontend.sh

    # Presenter
    $SCRIPT_DIR/scripts/build.presenter.sh
    $SCRIPT_DIR/scripts/start.presenter.sh

    # Docs
    $SCRIPT_DIR/scripts/build.docs.sh

    # restore node env
    NODE_ENV=$BACKUP_NODE_ENV

    echo 'Finish Deploy'
} | tee /dev/fd/3
