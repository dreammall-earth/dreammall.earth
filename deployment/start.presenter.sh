#!/bin/sh

# Find current directory & configure paths
SCRIPT_PATH=$(realpath $0)
SCRIPT_DIR=$(dirname $SCRIPT_PATH)/../presenter
LOG_FILE=$SCRIPT_DIR/../log/$(date +"%Y-%m-%d_%T")_pm2.presenter.log

cd $SCRIPT_DIR
pm2 start --name presenter "build/index.cjs" -l $LOG_FILE --log-date-format 'YYYY-MM-DD HH:mm:ss.SSS'
pm2 save