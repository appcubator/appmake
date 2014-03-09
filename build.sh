#!/usr/bin/env bash

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

pushd $DIR/client


echo "[BUILD] Compiling templates"
./mk
echo "[BUILD] Compiling expander"
browserify $DIR/frontend/expander.js -o $DIR/client/app/scripts/expander-browser.js

popd
