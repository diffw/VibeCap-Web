#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
CHECK_SCRIPT="$ROOT_DIR/scripts/check_release_preflight.sh"

write_locale() {
  local base="$1"
  local locale="$2"
  local keywords="${3:-faith,verse,prayer}"
  mkdir -p "$base/fastlane/metadata/$locale"
  cat >"$base/fastlane/metadata/$locale/name.txt" <<'EOF'
Daily Verse
EOF
  cat >"$base/fastlane/metadata/$locale/subtitle.txt" <<'EOF'
Scripture and prayer
EOF
  printf '%s\n' "$keywords" >"$base/fastlane/metadata/$locale/keywords.txt"
  cat >"$base/fastlane/metadata/$locale/description.txt" <<'EOF'
Scripture reading and prayer workflow.
EOF
  cat >"$base/fastlane/metadata/$locale/promotional_text.txt" <<'EOF'
Stay grounded with a simple daily verse habit.
EOF
  cat >"$base/fastlane/metadata/$locale/release_notes.txt" <<'EOF'
Bug fixes and improvements.
EOF
}

expect_pass() {
  local dir="$1"
  bash "$CHECK_SCRIPT" "$dir" >/dev/null
}

expect_fail() {
  local dir="$1"
  local expected="$2"
  local output
  if output="$(bash "$CHECK_SCRIPT" "$dir" 2>&1)"; then
    echo "Expected release preflight to fail but it passed" >&2
    exit 1
  fi
  if [[ "$output" != *"$expected"* ]]; then
    echo "Expected output to contain: $expected" >&2
    echo "$output" >&2
    exit 1
  fi
}

run_case_complete_release() {
  local t
  t="$(mktemp -d)"
  mkdir -p "$t/fastlane" "$t/.agents"
  touch "$t/fastlane/Fastfile"
  write_locale "$t" "en-US"
  write_locale "$t" "zh-Hans"
  cat >"$t/.agents/appstore-markets.json" <<'EOF'
{"markets":["en-US","zh-Hans"]}
EOF
  cat >"$t/fastlane/metadata/reviewed-locales.json" <<'EOF'
["zh-Hans"]
EOF
  expect_pass "$t"
  echo "case_complete_release_ok"
}

run_case_missing_market_locale() {
  local t
  t="$(mktemp -d)"
  mkdir -p "$t/fastlane" "$t/.agents"
  touch "$t/fastlane/Fastfile"
  write_locale "$t" "en-US"
  cat >"$t/.agents/appstore-markets.json" <<'EOF'
{"markets":["en-US","ja"]}
EOF
  expect_fail "$t" "metadata locale missing for markets: ja"
  echo "case_missing_market_locale_ok"
}

run_case_missing_chinese_review() {
  local t
  t="$(mktemp -d)"
  mkdir -p "$t/fastlane" "$t/.agents"
  touch "$t/fastlane/Fastfile"
  write_locale "$t" "en-US"
  write_locale "$t" "zh-Hans"
  cat >"$t/.agents/appstore-markets.json" <<'EOF'
{"markets":["en-US","zh-Hans"]}
EOF
  expect_fail "$t" "missing fastlane/metadata/reviewed-locales.json"
  echo "case_missing_chinese_review_ok"
}

run_case_keywords_limit_exceeded() {
  local t
  t="$(mktemp -d)"
  mkdir -p "$t/fastlane" "$t/.agents"
  touch "$t/fastlane/Fastfile"
  write_locale "$t" "en-US" "scripture,meditation,encouragement,discipleship,reflection,gratitude,community,translation,sermon,devotional"
  cat >"$t/.agents/appstore-markets.json" <<'EOF'
{"markets":["en-US"]}
EOF
  expect_fail "$t" "en-US/keywords.txt exceeds limit 100"
  echo "case_keywords_limit_exceeded_ok"
}

run_case_complete_release
run_case_missing_market_locale
run_case_missing_chinese_review
run_case_keywords_limit_exceeded

echo "all_tests_passed"
