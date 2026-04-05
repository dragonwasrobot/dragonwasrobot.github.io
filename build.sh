#!/usr/bin/env bash

set -ef -o pipefail

echo "Building..."

# Dependencies
npm ci

# Fonts

## Fontawesome
mkdir -p static/fontawesome/css
mkdir -p static/fontawesome/webfonts
cp ./node_modules/@fortawesome/fontawesome-free/css/all.min.css static/fontawesome/css/
cp -r ./node_modules/@fortawesome/fontawesome-free/webfonts static/fontawesome/

## Iosevka
mkdir -p static/iosevka/files
cp ./node_modules/@fontsource/iosevka/200.css static/iosevka/font.css
cp ./node_modules/@fontsource/iosevka/files/iosevka-latin-200-normal.woff static/iosevka/files/
cp ./node_modules/@fontsource/iosevka/files/iosevka-latin-200-normal.woff2 static/iosevka/files/

echo "Done!"
