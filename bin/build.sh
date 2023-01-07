#!/bin/bash

COMMAND=$(expr "$1" \| "")
BUILD_COMPONENTS=

PACKAGES=(
  api
  common
  system
  types
)

function do_pack() {
  for package in ${PACKAGES[*]}; do
    cp "packages/${package}/package.json" "dist/${package}/package.json"
  done
}

tsc || true && \
  cp -r packages/api/presets dist/api && \
  cp packages/api/RELEASE.yml dist/api/ 2>/dev/null && \
  [ ! -z $BUILD_COMPONENTS ] && (cd web && npm run build)

case "$COMMAND" in
  pack)
    do_pack
  ;;
esac
