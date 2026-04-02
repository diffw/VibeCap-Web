#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="${1:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
HOTSPOT_LIMIT="${HOTSPOT_LIMIT:-10}"

blocking_checks=(
  "check_root_docs_freshness|bash scripts/check_root_docs_freshness.sh \"$ROOT_DIR\""
  "check_harness_structure|bash scripts/check_harness_structure.sh \"$ROOT_DIR\""
  "check_vibe_doc_skill_safety|bash scripts/check_vibe_doc_skill_safety.sh \"$ROOT_DIR\""
  "lint_harness_references|bash scripts/lint_harness_references.sh \"$ROOT_DIR/rules\" \"$ROOT_DIR/skills\" \"$ROOT_DIR/references\" \"$ROOT_DIR/AGENTS.md\" \"$ROOT_DIR/CLAUDE.md\" \"$ROOT_DIR/README.md\""
)

for entry in "${blocking_checks[@]}"; do
  name="${entry%%|*}"
  cmd="${entry#*|}"

  if ! eval "$cmd"; then
    echo "entropy_sweep_failed:$name" >&2
    exit 1
  fi
done

echo "entropy_sweep_blocking_checks_ok"

if [[ -f "$ROOT_DIR/scripts/report_hotspots.sh" ]]; then
  HOTSPOT_LIMIT="$HOTSPOT_LIMIT" bash "$ROOT_DIR/scripts/report_hotspots.sh" "$ROOT_DIR" || true
fi

echo "run_entropy_sweep_ok"
