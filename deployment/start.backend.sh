#!/bin/sh

# Find current directory & configure paths
SCRIPT_PATH=$(realpath $0)
SCRIPT_DIR=$(dirname $SCRIPT_PATH)/../backend
LOG_FILE=$SCRIPT_DIR/../log/$(date +"%Y-%m-%d_%T")_pm2.backend.log

cd $SCRIPT_DIR
NODE_ENV=production pm2 start --name backend "Z=UTC TS_NODE_BASEURL=./build node -r tsconfig-paths/register build/src/index.js" -l $LOG_FILE --log-date-format 'YYYY-MM-DD HH:mm:ss.SSS'
pm2 save