#!/bin/sh

# Find current directory & configure paths
SCRIPT_PATH=$(realpath $0)
SCRIPT_DIR=$(dirname $SCRIPT_PATH)
PROJECT_ROOT=$SCRIPT_DIR/../../frontend
LOG_FILE=$SCRIPT_DIR/../../log/$(date +"%Y-%m-%d_%T")_pm2.frontend.log

cd $PROJECT_ROOT
export PORT=3000
pm2 start --name frontend "server/index.ts" --interpreter="node" --node-args="--import tsx" -l $LOG_FILE --log-date-format 'YYYY-MM-DD HH:mm:ss.SSS'
pm2 save
