#!/bin/bash

version_type=$(echo $@ | grep -oP '(?<=--bump )([^ $]+)')
packages=$(echo $@ | grep -oP '(?<=--packages )([^ $]+)')
npm_arguments=$(echo $@ | grep -oP '(?<=--npm-args )([^$]+)')

VERSION_TYPES=(
  patch
  minor
  major
)

function usage() {
  echo "Usage: $0 [--bump ($(echo ${VERSION_TYPES[*]} | tr ' ' '|'))] [--packages ($(ls -1 packages | tr '\n' '|'))] [--npm-args NPM_ARGS]"
  echo ""
  echo "  --bump VERSION_TYPE       bumps package version semver segment and publishes package to npm"
  echo "  --packages PACKAGES       bumps/publishes only PACKAGES separated by comma"
  echo "  --npm-args NPM_ARGS       passes additional parameters to npm publish"
}

function publish() {
  echo $packages | \
    xargs -I{} sh -c "cd dist/{} && npm publish --access=public" $npm_arguments
}

function build() {
  tsc
  tsc -p tsconfig.esm.json

  for package in $packages; do
    mkdir -p "dist/${package}"

    for mode in esm cjs; do
      cp -r "dist/${mode}/${package}" "dist/${package}/${mode}"
      test -e "dist/${package}/${mode}/node_modules" \
        || ln -s $(realpath "packages/${package}/node_modules") "dist/${package}/${mode}/node_modules"
    done

    if ! [ -z "$version_type" ]; then
      (cd "packages/${package}" && npm version "$version_type")
    fi

    cp "packages/${package}/package.json" "dist/${package}/package.json"
    echo '{"type": "module"}' | jq > "dist/${package}/esm/package.json"
    echo '{"type": "commonjs"}' | jq > "dist/${package}/cjs/package.json"
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

if [ "$1" == "-h" ]; then
  usage
  exit
fi

if ! test -z $packages; then
  packages=$(echo ${packages[*]} | tr ',' '\n')
else
  packages=$(ls -1 packages)
fi


set -x
cleanup
build
move_assets

if ! [ -z "$version_type" ]; then
  if ! [[ "${VERSION_TYPES[*]}" =~ "$version_type" ]]; then
    echo "$0 ${VERSION_TYPES[*]}"
    exit
  fi

  publish
fi

