#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="${1:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
AGENTS_DIR="$ROOT_DIR/.agents"
GEN_SCRIPT="$AGENTS_DIR/scripts/generate_agents_readme.sh"
SYNC_SCRIPT="$AGENTS_DIR/scripts/sync_claude_skills.sh"

if [[ ! -d "$ROOT_DIR" ]]; then
  echo "Error: host root not found: $ROOT_DIR" >&2
  exit 1
fi

if [[ ! -d "$AGENTS_DIR" ]]; then
  echo "Error: .agents directory not found under $ROOT_DIR" >&2
  exit 1
fi

if [[ ! -f "$GEN_SCRIPT" ]]; then
  echo "Error: host bridge generator missing: $GEN_SCRIPT" >&2
  exit 1
fi

if [[ ! -f "$SYNC_SCRIPT" ]]; then
  echo "Error: Claude skill sync script missing: $SYNC_SCRIPT" >&2
  exit 1
fi

bash "$GEN_SCRIPT" "$ROOT_DIR" --outputs agents,claude
bash "$SYNC_SCRIPT" "$ROOT_DIR"

echo "Updated host bridge docs:"
echo "- $ROOT_DIR/AGENTS.md"
echo "- $ROOT_DIR/CLAUDE.md"
echo "Preserved host README.md"
echo "Synced Claude skills to $ROOT_DIR/.claude/skills"
