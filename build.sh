#!/usr/bin/env bash
set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

pushd $DIR/client

echo '[BUILD] Running `bower install`'
bower install
echo '[BUILD] Running `grunt build`'
grunt build

# TODO check if STATIC_URL is unset
echo '[BUILD] Replacing /client/app with $STATIC_URL in client/dist/index.html'
sed -i '' s/\\/client\\/app\\//$STATIC_URL/g dist/index.html

popd

echo "[BUILD] Done"
