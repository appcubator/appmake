#!/bin/bash

echo "Making templates and stylesheets"
grunt jst:compile
echo "Copying templates..."
cp .tmp/scripts/templates.js app/scripts/templates.js
grunt compass:server
cp .tmp/styles/main.css app/styles/main.css
echo "Done!"
