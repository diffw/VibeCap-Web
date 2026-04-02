#!/usr/bin/env bash
set -euo pipefail

if [ $# -ge 1 ] && [ -n "${1:-}" ]; then
  ROOT="$1"
elif command -v git >/dev/null 2>&1 && git rev-parse --show-toplevel >/dev/null 2>&1; then
  ROOT="$(git rev-parse --show-toplevel)"
else
  ROOT="$(pwd)"
fi

DST="$ROOT/.claude/skills"
SRC=""
POINTER_PREFIX=""

if [ -d "$ROOT/.agents/skills" ]; then
  SRC="$ROOT/.agents/skills"
  POINTER_PREFIX=".agents/skills"
elif [ -d "$ROOT/skills" ]; then
  SRC="$ROOT/skills"
  POINTER_PREFIX="skills"
else
  echo "Error: source skills directory not found under $ROOT/.agents/skills or $ROOT/skills" >&2
  exit 1
fi

if [ -L "$DST" ]; then
  echo "Error: $DST is a symlink. Remove it first, then re-run sync." >&2
  exit 1
fi

mkdir -p "$ROOT/.claude" "$DST"

processed=0
expected_paths="$(mktemp)"
trap 'rm -f "$expected_paths"' EXIT

while IFS= read -r src_file; do
  [ -f "$src_file" ] || continue

  rel_skill_path="${src_file#"$SRC"/}"
  rel_skill_dir="$(dirname "$rel_skill_path")"
  dst_dir="$DST/$rel_skill_dir"
  dst_file="$dst_dir/SKILL.md"

  mkdir -p "$dst_dir"

  {
    echo "---"
    awk '
      BEGIN { keep_desc = 0 }
      /^name:[[:space:]]/ {
        print
        next
      }
      /^description:[[:space:]]*/ {
        print
        keep_desc = 1
        next
      }
      keep_desc == 1 {
        if ($0 ~ /^[[:space:]]+/) {
          print
          next
        }
        keep_desc = 0
      }
    ' "$src_file"
    echo "---"
    echo
    echo "Read \`$POINTER_PREFIX/$rel_skill_dir/SKILL.md\` for complete instructions before proceeding."
  } >"$dst_file"

  printf '%s\n' "$dst_file" >>"$expected_paths"
  processed=$((processed + 1))
done < <(find "$SRC" -type f -name 'SKILL.md' | sort)

while IFS= read -r existing_file; do
  [ -f "$existing_file" ] || continue
  if ! grep -Fqx "$existing_file" "$expected_paths"; then
    rm -f "$existing_file"
  fi
done < <(find "$DST" -type f -name 'SKILL.md' | sort)

find "$DST" -type d -empty -delete

echo "Synced $processed skills to $DST"
