#!/bin/sh

# Find current directory & configure paths
SCRIPT_PATH=$(realpath $0)
SCRIPT_DIR=$(dirname $SCRIPT_PATH)
PROJECT_ROOT=$SCRIPT_DIR/../../admin
LOG_FILE=$SCRIPT_DIR/../../log/$(date +"%Y-%m-%d_%T")_pm2.admin.log

cd $PROJECT_ROOT
export PORT=3002
pm2 start --name admin "build/index.cjs" -l $LOG_FILE --log-date-format 'YYYY-MM-DD HH:mm:ss.SSS'
pm2 save