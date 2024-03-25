#!/bin/bash
SCRIPT_PATH=$(realpath $0)
SCRIPT_DIR=$(dirname $SCRIPT_PATH)

# delete last backup & backup
sudo chmod 777 -R $SCRIPT_DIR/database
rm -R $SCRIPT_DIR/database.old || true
mv $SCRIPT_DIR/database $SCRIPT_DIR/database.old

7z x $SCRIPT_DIR/database.7z -o$SCRIPT_DIR/database/