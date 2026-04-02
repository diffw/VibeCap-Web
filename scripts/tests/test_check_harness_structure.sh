#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
SCRIPT="$ROOT_DIR/scripts/check_harness_structure.sh"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

make_valid_fixture() {
  local dir="$1"
  mkdir -p \
    "$dir/rules/shared" \
    "$dir/rules/families/apple" \
    "$dir/references/shared" \
    "$dir/skills/shared/workflows/testing/00-toolchain-generator" \
    "$dir/skills/shared/workflows/testing/01-unit-test" \
    "$dir/skills/families/apple/adapters/testing/swift-xcode" \
    "$dir/skills/platforms/ios/workflows/release/release-audit"

  touch "$dir/rules/shared/scope-guard.md"
  touch "$dir/rules/shared/dev-principles.md"
  touch "$dir/rules/families/apple/swift-testing.mdc"
  touch "$dir/references/shared/design-principle.md"
  touch "$dir/skills/shared/workflows/testing/00-toolchain-generator/SKILL.md"
  touch "$dir/skills/shared/workflows/testing/01-unit-test/SKILL.md"
  touch "$dir/skills/families/apple/adapters/testing/swift-xcode/unit.md"
  touch "$dir/skills/platforms/ios/workflows/release/release-audit/SKILL.md"
}

case_repo_ok() {
  bash "$SCRIPT" "$ROOT_DIR" >/dev/null
  echo "case_repo_ok"
}

case_fixture_ok() {
  local dir="$TMP_DIR/pass"
  make_valid_fixture "$dir"
  bash "$SCRIPT" "$dir" >/dev/null
  echo "case_fixture_ok"
}

case_legacy_layout_fails() {
  local dir="$TMP_DIR/fail-legacy"
  make_valid_fixture "$dir"
  mkdir -p "$dir/rules"
  touch "$dir/rules/scope-guard.md"

  if bash "$SCRIPT" "$dir" >"$dir/out" 2>&1; then
    echo "expected legacy layout fixture to fail" >&2
    exit 1
  fi

  grep -F "legacy path 'rules/scope-guard.md' still exists." "$dir/out" >/dev/null
  grep -F "rules/shared/scope-guard.md" "$dir/out" >/dev/null
  echo "case_legacy_layout_fails_ok"
}

case_workflow_asset_fails() {
  local dir="$TMP_DIR/fail-workflow-asset"
  make_valid_fixture "$dir"
  mkdir -p "$dir/skills/shared/workflows/product/example"
  touch "$dir/skills/shared/workflows/product/example/template.md"

  if bash "$SCRIPT" "$dir" >"$dir/out" 2>&1; then
    echo "expected workflow asset fixture to fail" >&2
    exit 1
  fi

  grep -F "non-SKILL asset found under workflows" "$dir/out" >/dev/null
  echo "case_workflow_asset_fails_ok"
}

case_repo_ok
case_fixture_ok
case_legacy_layout_fails
case_workflow_asset_fails
echo "all_tests_passed"
