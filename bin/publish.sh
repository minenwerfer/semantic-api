#!/bin/bash

version_type="$1"
arguments="$(echo $@ | sed -r 's/^\w+ ?//')"

VERSION_TYPES=(
  patch
  minor
  major
)

function bump() {
  ls -ltrah
  npm version "$1"
}

function publish() {
  npm publish --access=public $@
}

function main() {
  if ! [[ "${VERSION_TYPES[*]}" =~ "$version_type" ]]; then
    echo "$0 ${VERSION_TYPES[*]}"
    exit
  fi

  find dist -maxdepth 1 | \
    xargs -I{} sh -c "cd {} && bump $version_type && publish" $arguments
}

export -f bump
export -f publish

main
