#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
SCRIPT="$ROOT_DIR/scripts/lint_harness_references.sh"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

case_clean_fixture_ok() {
  cat >"$TMP_DIR/clean.md" <<'EOF'
Use `rules/shared/scope-guard.md`.
Use `.agents/references/shared/design-principle.md`.
Use `.agents/skills/shared/workflows/testing/01-unit-test/SKILL.md`.
Use `.agents/skills/families/apple/adapters/testing/swift-xcode/unit.md`.
EOF

  bash "$SCRIPT" "$TMP_DIR/clean.md" >/dev/null
  echo "case_clean_fixture_ok"
}

case_legacy_rules_fail_ok() {
  cat >"$TMP_DIR/legacy-rules.md" <<'EOF'
Read `rules/scope-guard.md`.
Read `rules/testing-rules.mdc`.
EOF

  if bash "$SCRIPT" "$TMP_DIR/legacy-rules.md" >"$TMP_DIR/out-rules" 2>&1; then
    echo "expected legacy rules fixture to fail" >&2
    exit 1
  fi

  grep -F "legacy-reference:" "$TMP_DIR/out-rules" >/dev/null
  grep -F "rules/shared/scope-guard.md" "$TMP_DIR/out-rules" >/dev/null
  grep -F "rules/families/apple/swift-testing.mdc" "$TMP_DIR/out-rules" >/dev/null
  echo "case_legacy_rules_fail_ok"
}

case_legacy_testing_fail_ok() {
  cat >"$TMP_DIR/legacy-testing.md" <<'EOF'
Use `.agents/skills/03-testing/01-unit-test/SKILL.md`.
Load `skills/03-testing/toolchain/unit-swift.md`.
Read `references/frontend-design/typography.md`.
EOF

  if bash "$SCRIPT" "$TMP_DIR/legacy-testing.md" >"$TMP_DIR/out-testing" 2>&1; then
    echo "expected legacy testing fixture to fail" >&2
    exit 1
  fi

  grep -F ".agents/skills/shared/workflows/testing/" "$TMP_DIR/out-testing" >/dev/null
  grep -F ".agents/skills/families/apple/adapters/testing/swift-xcode/" "$TMP_DIR/out-testing" >/dev/null
  grep -F ".agents/references/families/browser/frontend-design/" "$TMP_DIR/out-testing" >/dev/null
  echo "case_legacy_testing_fail_ok"
}

case_clean_fixture_ok
case_legacy_rules_fail_ok
case_legacy_testing_fail_ok
echo "all_tests_passed"
