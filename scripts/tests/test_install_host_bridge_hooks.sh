#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
SCRIPT="$ROOT_DIR/scripts/install_host_bridge_hooks.sh"
TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

copy_agents_repo() {
  local dir="$1"
  mkdir -p "$dir/.agents" "$dir/.claude" "$dir/.vibe-doc"
  cp -R "$ROOT_DIR/skills" "$dir/.agents/skills"
  cp -R "$ROOT_DIR/rules" "$dir/.agents/rules"
  cp -R "$ROOT_DIR/references" "$dir/.agents/references"
  cp -R "$ROOT_DIR/scripts" "$dir/.agents/scripts"
  cp "$ROOT_DIR/AGENTS.md" "$dir/.agents/AGENTS.md"
  cp "$ROOT_DIR/CLAUDE.md" "$dir/.agents/CLAUDE.md"
  cp "$ROOT_DIR/README.md" "$dir/.agents/README.md"
  cp "$ROOT_DIR/CHANGELOG.md" "$dir/.agents/CHANGELOG.md"
}

case_install_and_run_hooks_ok() {
  local dir="$TMP_DIR/host"
  copy_agents_repo "$dir"

  cat >"$dir/.vibe-doc/PRODUCT_SPEC.md" <<'EOF'
# VibeCap 产品规格文档（反向工程版）

### 1.1 产品定位
VibeCap 是一个 macOS 菜单栏应用。
EOF

  cat >"$dir/README.md" <<'EOF'
# Host README

Keep me.
EOF

  git -C "$dir" init -q >/dev/null
  git -C "$dir/.agents" init -q >/dev/null

  bash "$SCRIPT" "$dir" >/dev/null

  test -x "$dir/.git/hooks/post-merge"
  test -x "$dir/.git/hooks/post-checkout"
  test -x "$dir/.agents/.git/hooks/post-merge"
  test -x "$dir/.agents/.git/hooks/post-checkout"

  (cd "$dir" && ./.git/hooks/post-merge)

  python3 - "$dir" <<'PY'
import pathlib, sys
r = pathlib.Path(sys.argv[1])
agents = (r / "AGENTS.md").read_text(encoding="utf-8")
claude = (r / "CLAUDE.md").read_text(encoding="utf-8")
readme = (r / "README.md").read_text(encoding="utf-8")
assert "# AGENTS.md — VibeCap Agent Context Router" in agents
assert ".agents/rules/shared/scope-guard.md" in claude
assert readme == "# Host README\n\nKeep me.\n"
print("case_install_and_run_hooks_ok")
PY
}

case_existing_non_shell_hook_fails_ok() {
  local dir="$TMP_DIR/non-shell"
  copy_agents_repo "$dir"
  git -C "$dir" init -q >/dev/null
  git -C "$dir/.agents" init -q >/dev/null

  printf '#!/usr/bin/env python3\nprint("custom")\n' >"$dir/.git/hooks/post-merge"

  if bash "$SCRIPT" "$dir" >"$dir/out" 2>&1; then
    echo "expected installer to refuse non-shell hook" >&2
    exit 1
  fi

  grep -F "Refusing to modify it" "$dir/out" >/dev/null
  echo "case_existing_non_shell_hook_fails_ok"
}

case_install_and_run_hooks_ok
case_existing_non_shell_hook_fails_ok
echo "all_tests_passed"
