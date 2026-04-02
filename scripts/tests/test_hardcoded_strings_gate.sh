#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
CHECK_SCRIPT="$ROOT_DIR/scripts/check-hardcoded-strings.sh"

run_case_localized_pass() {
  local t
  t="$(mktemp -d)"
  cat >"$t/LocalizedView.swift" <<'EOF'
import SwiftUI

struct LocalizedView: View {
    var body: some View {
        Text(String(localized: "welcome_title"))
    }
}
EOF
  bash "$CHECK_SCRIPT" "$t/LocalizedView.swift" >/dev/null
  echo "case_localized_pass_ok"
}

run_case_hardcoded_fail() {
  local t
  t="$(mktemp -d)"
  local output
  cat >"$t/HardcodedView.swift" <<'EOF'
import SwiftUI

struct HardcodedView: View {
    var body: some View {
        Text("Welcome")
    }
}
EOF
  if output="$(bash "$CHECK_SCRIPT" "$t/HardcodedView.swift" 2>&1)"; then
    echo "Expected hardcoded string gate to fail" >&2
    exit 1
  fi
  [[ "$output" == *"Found 1 hardcoded UI string violation"* ]]
  [[ "$output" == *"Wrap each string with String(localized:"* ]]
  echo "case_hardcoded_fail_ok"
}

run_case_localized_pass
run_case_hardcoded_fail

echo "all_tests_passed"
