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
    add_error "missing required anchor '$rel'. remediation: restore or move the canonical file to '$rel'."
  fi
}

legacy_file() {
  local rel="$1"
  local target="$2"
  if [[ -f "$ROOT_DIR/$rel" ]]; then
    add_error "legacy path '$rel' still exists. remediation: move/delete it and use '$target' instead."
  fi
}

legacy_dir_has_files() {
  local rel="$1"
  local target="$2"
  if [[ -d "$ROOT_DIR/$rel" ]] && find "$ROOT_DIR/$rel" -type f -print -quit | grep -q .; then
    add_error "legacy directory '$rel' still contains files. remediation: migrate its contents into '$target'."
  fi
}

require_file "rules/shared/scope-guard.md"
require_file "rules/shared/dev-principles.md"
require_file "rules/families/apple/swift-testing.mdc"
require_file "references/shared/design-principle.md"
require_file "skills/shared/workflows/testing/00-toolchain-generator/SKILL.md"
require_file "skills/shared/workflows/testing/01-unit-test/SKILL.md"
require_file "skills/families/apple/adapters/testing/swift-xcode/unit.md"
require_file "skills/platforms/ios/workflows/release/release-audit/SKILL.md"

legacy_file "rules/scope-guard.md" "rules/shared/scope-guard.md"
legacy_file "rules/dev-principles.md" "rules/shared/dev-principles.md"
legacy_file "rules/project-overview.md" "rules/shared/project-overview.md"
legacy_file "rules/testing-rules.mdc" "rules/families/apple/swift-testing.mdc"
legacy_file "rules/macos-coding.mdc" "rules/platforms/macos/macos-coding.mdc"
legacy_file "references/design-principle.md" "references/shared/design-principle.md"
legacy_file "references/ios-reference.md" "references/platforms/ios/ios-reference.md"
legacy_file "references/macos-reference.md" "references/platforms/macos/macos-reference.md"
legacy_file "references/web-reference.md" "references/platforms/web/web-reference.md"

legacy_dir_has_files "references/design system" "references/families/*/design-system or references/platforms/*/design-system"
legacy_dir_has_files "references/frontend-design" "references/families/browser/frontend-design"
legacy_dir_has_files "references/interactive-prototype" "references/families/browser/interactive-prototype"
legacy_dir_has_files "references/tech-best-practices" "references/shared|families|platforms/tech-best-practices"
legacy_dir_has_files "skills/00-start" "skills/shared/workflows/foundation"
legacy_dir_has_files "skills/01-design" "skills/shared/workflows/product + skills/families/browser/workflows/design + skills/platforms/*/assets"
legacy_dir_has_files "skills/02-develop" "skills/shared/workflows/develop + skills/families/apple/workflows/develop"
legacy_dir_has_files "skills/03-testing" "skills/shared/workflows/testing + skills/families/*/adapters/testing"
legacy_dir_has_files "skills/04-merge-gate" "skills/shared/workflows/merge"
legacy_dir_has_files "skills/fastlane-appstore" "skills/families/apple/workflows/release"
legacy_dir_has_files "skills/commit-code" "skills/shared/workflows/foundation/commit-code"
legacy_dir_has_files "skills/release-audit" "skills/platforms/ios/workflows/release/release-audit"
legacy_dir_has_files "skills/requirements-clarification" "skills/shared/workflows/foundation/requirement-clarification"

while IFS= read -r path; do
  rel="${path#$ROOT_DIR/}"
  if [[ "$rel" != *"/workflows/"*"/SKILL.md" ]]; then
    add_error "SKILL.md must live under a workflows/ subtree: '$rel'. remediation: move it to skills/<layer>/workflows/.../SKILL.md."
  fi
done < <(find "$ROOT_DIR/skills" -name SKILL.md -type f | sort)

while IFS= read -r path; do
  rel="${path#$ROOT_DIR/}"
  add_error "non-SKILL asset found under workflows: '$rel'. remediation: move templates, examples, or helper docs into skills/<layer>/assets/."
done < <(find "$ROOT_DIR/skills" -path '*/workflows/*' -type f ! -name SKILL.md | sort)

while IFS= read -r path; do
  rel="${path#$ROOT_DIR/}"
  add_error "SKILL.md found under assets: '$rel'. remediation: move executable skill instructions into skills/<layer>/workflows/ and keep assets data-only."
done < <(find "$ROOT_DIR/skills" -path '*/assets/*/SKILL.md' -type f | sort)

while IFS= read -r path; do
  rel="${path#$ROOT_DIR/}"
  add_error "SKILL.md found under adapters: '$rel'. remediation: adapters should be reference/config files, not executable skills."
done < <(find "$ROOT_DIR/skills" -path '*/adapters/*/SKILL.md' -type f | sort)

if ((${#errors[@]} > 0)); then
  printf '%s\n' "${errors[@]}" >&2
  exit 1
fi

echo "check_harness_structure_ok"
