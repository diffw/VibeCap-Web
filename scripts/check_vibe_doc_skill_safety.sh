#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="${1:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"

errors=()

add_error() {
  errors+=("$1")
}

require_file() {
  local rel="$1"
  if [[ ! -f "$ROOT_DIR/$rel" ]]; then
    add_error "missing required file '$rel'. remediation: restore it before generating .vibe-doc content."
  fi
}

require_phrase() {
  local rel="$1"
  local phrase="$2"
  if ! grep -Fq "$phrase" "$ROOT_DIR/$rel"; then
    add_error "missing safety phrase in '$rel': $phrase. remediation: add the standard .vibe-doc preservation gate."
  fi
}

require_file "rules/shared/vibe-doc-preservation.md"

skills=(
  "skills/shared/workflows/product/new-project-prd/SKILL.md"
  "skills/shared/workflows/product/ia-user-flow/SKILL.md"
  "skills/shared/workflows/product/architecture-design/SKILL.md"
  "skills/shared/workflows/product/product-spec/SKILL.md"
  "skills/shared/workflows/product/design-token-generator/SKILL.md"
  "skills/shared/workflows/foundation/manage-backlog/SKILL.md"
)

for rel in "${skills[@]}"; do
  require_file "$rel"
  if [[ -f "$ROOT_DIR/$rel" ]]; then
    require_phrase "$rel" "## .vibe-doc Preservation Gate"
    require_phrase "$rel" "Read \`.agents/rules/shared/vibe-doc-preservation.md\` before creating or updating any \`.vibe-doc/*\` file."
    require_phrase "$rel" "Never overwrite a non-empty \`.vibe-doc\` document with a blank file or raw template."
  fi
done

if ((${#errors[@]} > 0)); then
  printf '%s\n' "${errors[@]}" >&2
  exit 1
fi

echo "check_vibe_doc_skill_safety_ok"
