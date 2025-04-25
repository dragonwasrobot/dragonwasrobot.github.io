#!/usr/bin/env bash

set -ef -o pipefail

echo "Building..."

# Dependencies
npm install

# Fontawesome
mkdir -p static/fontawesome/css
mkdir -p static/fontawesome/webfonts
cp ./node_modules/@fortawesome/fontawesome-free/css/all.min.css static/fontawesome/css/
cp -r ./node_modules/@fortawesome/fontawesome-free/webfonts static/fontawesome/

# Start and watch
npm run dev
