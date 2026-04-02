#!/usr/bin/env bash
set -euo pipefail

if (($# > 0)); then
  targets=("$@")
else
  targets=(rules skills references AGENTS.md CLAUDE.md README.md)
fi

fail=0

report_matches() {
  local pattern="$1"
  local remediation="$2"
  local results

  results="$(rg -n -F "$pattern" "${targets[@]}" 2>/dev/null || true)"
  if [[ -z "$results" ]]; then
    return
  fi

  fail=1
  while IFS= read -r line; do
    [[ -n "$line" ]] || continue
    printf 'legacy-reference: %s\n' "$line" >&2
    printf 'remediation: %s\n' "$remediation" >&2
  done <<< "$results"
}

report_matches "rules/scope-guard.md" "replace with \`rules/shared/scope-guard.md\`."
report_matches "rules/dev-principles.md" "replace with \`rules/shared/dev-principles.md\`."
report_matches "rules/testing-rules.mdc" "replace with \`rules/families/apple/swift-testing.mdc\`."
report_matches "references/design-principle.md" "replace with \`.agents/references/shared/design-principle.md\`."
report_matches "references/frontend-design/" "replace with \`.agents/references/families/browser/frontend-design/\`."
report_matches "references/interactive-prototype/" "replace with \`.agents/references/families/browser/interactive-prototype/\`."
report_matches "references/design system/" "replace with the appropriate layered design-system path under \`.agents/references/families/\` or \`.agents/references/platforms/\`."
report_matches ".agents/skills/03-testing/" "replace testing methodology refs with \`.agents/skills/shared/workflows/testing/\` and adapter refs with \`.agents/skills/families/apple/adapters/testing/swift-xcode/\`."
report_matches "skills/03-testing/toolchain/" "replace with the layered testing adapter path, currently \`.agents/skills/families/apple/adapters/testing/swift-xcode/\`."
report_matches "skills/requirements-clarification/SKILL.md" "replace with \`.agents/skills/shared/workflows/foundation/requirement-clarification/SKILL.md\`."
report_matches "skills/commit-code/SKILL.md" "replace with \`.agents/skills/shared/workflows/foundation/commit-code/SKILL.md\`."
report_matches "skills/fastlane-appstore/" "replace with \`.agents/skills/families/apple/workflows/release/\`."
report_matches "skills/release-audit/SKILL.md" "replace with \`.agents/skills/platforms/ios/workflows/release/release-audit/SKILL.md\`."
report_matches "skills/02-develop/Localization/SKILL.md" "replace with \`.agents/skills/families/apple/workflows/develop/localization-handler/SKILL.md\`."

if ((fail)); then
  exit 1
fi

echo "lint_harness_references_ok"
