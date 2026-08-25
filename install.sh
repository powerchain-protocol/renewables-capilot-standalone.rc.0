#!/usr/bin/env sh
set -eu
SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
TARGET=${1:-.}
exec node "$SCRIPT_DIR/bootstrap.mjs" "$TARGET"
