#!/usr/bin/env bash

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

assets=$DIR/client/app
echo "Deploying: $assets"

s3cmd sync --force --reduced-redundancy --acl-public $assets s3://appmake-hosting/

