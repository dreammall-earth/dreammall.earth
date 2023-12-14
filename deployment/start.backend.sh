#!/bin/sh

# Find current directory & configure paths
SCRIPT_PATH=$(realpath $0)
SCRIPT_DIR=$(dirname $SCRIPT_PATH)/../backend

cd $SCRIPT_DIR
NODE_ENV=productio pm2 start --name backend "npm run start" # -l $LOG_PATH/pm2.dht-node.$TODAY.log --log-date-format 'YYYY-MM-DD HH:mm:ss.SSS'
pm2 save