#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
CHECK_SCRIPT="$ROOT_DIR/scripts/check_strict_execution.sh"
FIXTURES_DIR="$ROOT_DIR/scripts/tests/fixtures/fake-tasks"

expect_pass() {
  local case_name="$1"
  bash "$CHECK_SCRIPT" "$FIXTURES_DIR/$case_name" >/dev/null
  echo "pass:$case_name"
}

expect_fail() {
  local case_name="$1"
  local expected_text="$2"
  local output
  if output="$(bash "$CHECK_SCRIPT" "$FIXTURES_DIR/$case_name" 2>&1)"; then
    echo "Expected failure for $case_name but command passed" >&2
    exit 1
  fi
  if [[ "$output" != *"$expected_text"* ]]; then
    echo "Expected failure output for $case_name to contain: $expected_text" >&2
    echo "Actual output:" >&2
    echo "$output" >&2
    exit 1
  fi
  echo "fail:$case_name"
}

expect_pass "feature_with_unit_test"
expect_pass "bugfix_complete"
expect_pass "metadata_with_waiver"
expect_fail "feature_missing_unit_test" 'missing required receipt `unit_test`'
expect_fail "bugfix_missing_root_cause" 'missing required receipt `root_cause`'
expect_fail "feature_with_nonwaivable_waiver" 'waiver not allowed for required receipt `unit_test`'
expect_fail "metadata_missing_waiver" 'missing required receipt `manual_review`'

echo "all_tests_passed"
