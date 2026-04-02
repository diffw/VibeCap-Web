#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="${1:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

copy_if_exists() {
  local rel="$1"
  if [[ -e "$ROOT_DIR/$rel" ]]; then
    mkdir -p "$TMP_DIR/$(dirname "$rel")"
    cp -R "$ROOT_DIR/$rel" "$TMP_DIR/$rel"
  fi
}

copy_if_exists "skills"
copy_if_exists "rules"
copy_if_exists "references"
copy_if_exists "scripts"
copy_if_exists ".harness-docs"
copy_if_exists ".vibe-doc"
copy_if_exists "AGENTS.md"
copy_if_exists "README.md"
copy_if_exists "CLAUDE.md"

bash "$TMP_DIR/scripts/generate_agents_readme.sh" "$TMP_DIR" >/dev/null

errors=()

compare_doc() {
  local rel="$1"
  if ! diff -u "$ROOT_DIR/$rel" "$TMP_DIR/$rel" >/dev/null; then
    errors+=("$rel is stale. remediation: run \`bash scripts/generate_agents_readme.sh .\` and commit the regenerated root docs.")
  fi
}

compare_doc "AGENTS.md"
compare_doc "README.md"
compare_doc "CLAUDE.md"

if ((${#errors[@]} > 0)); then
  printf '%s\n' "${errors[@]}" >&2
  exit 1
fi

echo "check_root_docs_freshness_ok"
