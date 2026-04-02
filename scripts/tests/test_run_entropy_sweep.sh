#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
SCRIPT="$ROOT_DIR/scripts/run_entropy_sweep.sh"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

copy_repo_fixture() {
  local dir="$1"
  mkdir -p "$dir"
  cp -R "$ROOT_DIR/skills" "$dir/skills"
  cp -R "$ROOT_DIR/rules" "$dir/rules"
  cp -R "$ROOT_DIR/references" "$dir/references"
  cp -R "$ROOT_DIR/scripts" "$dir/scripts"
  if [[ -d "$ROOT_DIR/.harness-docs" ]]; then
    cp -R "$ROOT_DIR/.harness-docs" "$dir/.harness-docs"
  fi
  if [[ -d "$ROOT_DIR/.vibe-doc" ]]; then
    cp -R "$ROOT_DIR/.vibe-doc" "$dir/.vibe-doc"
  fi
  cp "$ROOT_DIR/AGENTS.md" "$dir/AGENTS.md"
  cp "$ROOT_DIR/README.md" "$dir/README.md"
  cp "$ROOT_DIR/CLAUDE.md" "$dir/CLAUDE.md"
}

case_repo_ok() {
  HOTSPOT_LIMIT=3 bash "$SCRIPT" "$ROOT_DIR" >/dev/null
  echo "case_repo_ok"
}

case_stale_docs_fail_ok() {
  local dir="$TMP_DIR/stale-sweep"
  copy_repo_fixture "$dir"
  printf '\nSTALE\n' >> "$dir/CLAUDE.md"

  if HOTSPOT_LIMIT=3 bash "$SCRIPT" "$dir" >"$dir/out" 2>&1; then
    echo "expected stale sweep fixture to fail" >&2
    exit 1
  fi

  grep -F "entropy_sweep_failed:check_root_docs_freshness" "$dir/out" >/dev/null
  echo "case_stale_docs_fail_ok"
}

case_repo_ok
case_stale_docs_fail_ok
echo "all_tests_passed"
