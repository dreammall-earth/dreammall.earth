#!/bin/bash
SCRIPT_PATH=$(realpath $0)
SCRIPT_DIR=$(dirname $SCRIPT_PATH)

# delete last backup & backup
rm -R $SCRIPT_DIR/database.old.7z || true
mv $SCRIPT_DIR/database.7z $SCRIPT_DIR/database.old.7z

# make the databse folder readable by everyone
sudo chmod 777 -R $SCRIPT_DIR/database

7z a -t7z -m0=lzma -mx=9 -mfb=64 -md=32m -ms=on $SCRIPT_DIR/database.7z $SCRIPT_DIR/database/{*,.[!.]*}