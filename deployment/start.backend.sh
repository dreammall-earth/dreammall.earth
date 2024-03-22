#!/bin/sh

# Find current directory & configure paths
SCRIPT_PATH=$(realpath $0)
SCRIPT_DIR=$(dirname $SCRIPT_PATH)/../backend
LOG_FILE=$SCRIPT_DIR/../log/$(date +"%Y-%m-%d_%T")_pm2.backend.log

cd $SCRIPT_DIR
NODE_ENV=production TZ=UTC TS_NODE_BASEURL=./build pm2 start --name backend "node -r tsconfig-paths/register build/src/index.js" -l $LOG_FILE --log-date-format 'YYYY-MM-DD HH:mm:ss.SSS'
pm2 save
