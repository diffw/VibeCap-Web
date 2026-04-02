#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
OUTPUT="$(HOTSPOT_LIMIT=3 bash "$ROOT_DIR/scripts/report_hotspots.sh" "$ROOT_DIR")"

if [[ "$OUTPUT" != hotspots_report* && "$OUTPUT" != hotspots_unavailable* ]]; then
  echo "unexpected hotspots output" >&2
  exit 1
fi

echo "case_report_hotspots_smoke_ok"
echo "all_tests_passed"
