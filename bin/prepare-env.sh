#!/bin/bash

packages=(
  api
  common
  system
  types
)

set -x
tsc -p tsconfig.watch.json

mkdir -p dist && cd dist
for package in ${packages[*]}; do
  npm i staging/$package/
done

find staging/* -maxdepth 0 -exec sh -c "echo {\"version\":\"1.0.0\"} | tee {}/package.json" \;

