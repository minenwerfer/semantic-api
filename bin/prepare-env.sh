#!/bin/bash

packages=(
  api
  common
  system
  types
)

set -x
rm -rf dist/staging
tsc -p tsconfig.watch.json

mkdir -p dist && cd dist
for package in ${packages[*]}; do
  cp ../packages/$package/package.json staging/$package/
  npm i staging/$package/
done

mkdir -p ../playground && cd ../playground
rm -rfv package-lock.json node_modules
for package in ${packages[*]}; do
  npm i ../dist/staging/$package/
done

cd ../dist
find staging -name package\.json -delete

