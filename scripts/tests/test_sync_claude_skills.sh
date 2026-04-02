#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
SYNC_SCRIPT="$ROOT_DIR/scripts/sync_claude_skills.sh"

run_case_nested_sync_and_cleanup() {
  local t
  t="$(mktemp -d)"
  mkdir -p \
    "$t/skills/shared/workflows/foundation/alpha" \
    "$t/skills/families/apple/workflows/release/beta" \
    "$t/.claude/skills/obsolete/path"

  cat >"$t/skills/shared/workflows/foundation/alpha/SKILL.md" <<'EOF'
---
name: alpha
description: alpha description
---

Full body should not be copied.
EOF

  cat >"$t/skills/families/apple/workflows/release/beta/SKILL.md" <<'EOF'
---
name: beta
description: |
  beta description
  continues here
---

Full body should not be copied.
EOF

  cat >"$t/.claude/skills/obsolete/path/SKILL.md" <<'EOF'
---
name: obsolete
description: obsolete
---
EOF

  bash "$SYNC_SCRIPT" "$t" >/dev/null

  python3 - "$t" <<'PY'
import pathlib, sys
r = pathlib.Path(sys.argv[1])
alpha = (r / ".claude/skills/shared/workflows/foundation/alpha/SKILL.md").read_text(encoding="utf-8")
beta = (r / ".claude/skills/families/apple/workflows/release/beta/SKILL.md").read_text(encoding="utf-8")
assert "name: alpha" in alpha
assert "description: alpha description" in alpha
assert "Read `skills/shared/workflows/foundation/alpha/SKILL.md`" in alpha
assert "Full body should not be copied." not in alpha
assert "beta description" in beta
assert "continues here" in beta
assert "Read `skills/families/apple/workflows/release/beta/SKILL.md`" in beta
assert not (r / ".claude/skills/obsolete/path/SKILL.md").exists()
print("case_nested_sync_and_cleanup_ok")
PY
}

run_case_nested_sync_and_cleanup

echo "all_tests_passed"
