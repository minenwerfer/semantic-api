#!/bin/bash

COMMAND=$(expr "$1" \| "")
BUILD_COMPONENTS=

PACKAGES=(
  api
  common
  system
  types
)

function build() {
  tsc
  tsc -p tsconfig.esm.json

  for package in ${PACKAGES[*]}; do
    mkdir -p "dist/${package}"

    for mode in esm cjs; do
      cp -r "dist/${mode}/${package}" "dist/${package}/${mode}"
      test -e "dist/${package}/${mode}/node_modules" \
        || ln -s $(realpath "packages/${package}/node_modules") "dist/${package}/${mode}/node_modules"
    done

    cp "packages/${package}/package.json" "dist/${package}/package.json"
    echo '{"compilerOptions": {"type": "module"}}' | jq > "dist/${package}/esm/package.json"
    echo '{"compilerOptions": {"type": "commonjs"}}' | jq > "dist/${package}/cjs/package.json"
  done
}

function move_assets() {
  for mode in esm cjs; do
    cp -r packages/api/presets "dist/api/${mode}/presets"
  done
}

function cleanup() {
  rm -rf dist
}

{
  set -x
  cleanup
  build
  move_assets
}
