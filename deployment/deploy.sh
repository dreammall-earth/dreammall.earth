#!/bin/sh

# Find current directory & configure paths
SCRIPT_PATH=$(realpath $0)
SCRIPT_DIR=$(dirname $SCRIPT_PATH)

# Update git
# assuming you are already on the right branch
git pull -ff

# Presenter
$SCRIPT_DIR/build.presenter.sh

# Docs
$SCRIPT_DIR/build.docs.sh