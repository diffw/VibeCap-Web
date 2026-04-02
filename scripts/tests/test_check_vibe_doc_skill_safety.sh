#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
SCRIPT="$ROOT_DIR/scripts/check_vibe_doc_skill_safety.sh"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

skill_paths=(
  "skills/shared/workflows/product/new-project-prd/SKILL.md"
  "skills/shared/workflows/product/ia-user-flow/SKILL.md"
  "skills/shared/workflows/product/architecture-design/SKILL.md"
  "skills/shared/workflows/product/product-spec/SKILL.md"
  "skills/shared/workflows/product/design-token-generator/SKILL.md"
  "skills/shared/workflows/foundation/manage-backlog/SKILL.md"
)

write_safe_skill() {
  local path="$1"
  mkdir -p "$(dirname "$path")"
  cat >"$path" <<'EOF'
## .vibe-doc Preservation Gate

- Read `.agents/rules/shared/vibe-doc-preservation.md` before creating or updating any `.vibe-doc/*` file.
- Never overwrite a non-empty `.vibe-doc` document with a blank file or raw template.
- If the target file exists, update in place.
EOF
}

build_minimal_fixture() {
  local dir="$1"
  mkdir -p "$dir/rules/shared"
  cat >"$dir/rules/shared/vibe-doc-preservation.md" <<'EOF'
# rule
EOF

  local rel
  for rel in "${skill_paths[@]}"; do
    write_safe_skill "$dir/$rel"
  done
}

case_repo_ok() {
  bash "$SCRIPT" "$ROOT_DIR" >/dev/null
  echo "case_repo_ok"
}

case_fixture_ok() {
  local dir="$TMP_DIR/ok"
  build_minimal_fixture "$dir"
  bash "$SCRIPT" "$dir" >/dev/null
  echo "case_fixture_ok"
}

case_missing_gate_fails_ok() {
  local dir="$TMP_DIR/fail"
  build_minimal_fixture "$dir"
  python3 - <<'PY' "$dir/skills/shared/workflows/product/product-spec/SKILL.md"
import pathlib, sys
path = pathlib.Path(sys.argv[1])
text = path.read_text(encoding="utf-8")
text = text.replace("## .vibe-doc Preservation Gate\n\n", "", 1)
path.write_text(text, encoding="utf-8")
PY

  if bash "$SCRIPT" "$dir" >"$dir/out" 2>&1; then
    echo "expected missing preservation gate to fail" >&2
    exit 1
  fi

  grep -F "missing safety phrase in 'skills/shared/workflows/product/product-spec/SKILL.md': ## .vibe-doc Preservation Gate" "$dir/out" >/dev/null
  echo "case_missing_gate_fails_ok"
}

case_repo_ok
case_fixture_ok
case_missing_gate_fails_ok
echo "all_tests_passed"
