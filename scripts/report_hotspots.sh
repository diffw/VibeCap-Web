#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="${1:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
HOTSPOT_LIMIT="${HOTSPOT_LIMIT:-10}"
HOTSPOT_DAYS="${HOTSPOT_DAYS:-90 days ago}"

if ! git -C "$ROOT_DIR" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "hotspots_unavailable:not_a_git_repo"
  exit 0
fi

echo "hotspots_report"
echo "window:$HOTSPOT_DAYS"
echo "limit:$HOTSPOT_LIMIT"

git -C "$ROOT_DIR" log --since="$HOTSPOT_DAYS" --name-only --format='' -- . \
  | awk 'NF {count[$0]++} END {for (file in count) printf "%s %s\n", count[file], file}' \
  | sort -rn \
  | head -n "$HOTSPOT_LIMIT" \
  | awk '{printf "count:%s file:%s\n", $1, $2}'
