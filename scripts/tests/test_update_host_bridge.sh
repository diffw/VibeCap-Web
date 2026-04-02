#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/../.." && pwd)"
SCRIPT="$ROOT_DIR/scripts/update_host_bridge.sh"
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

case_host_bridge_preserves_readme_ok() {
  local dir="$TMP_DIR/host"
  copy_agents_repo "$dir"

  cat >"$dir/.vibe-doc/PRODUCT_SPEC.md" <<'EOF'
# VibeCap 产品规格文档（反向工程版）

### 1.1 产品定位
VibeCap 是一个 macOS 菜单栏应用。
EOF

  cat >"$dir/README.md" <<'EOF'
# Host README

Do not rewrite me.
EOF

  bash "$SCRIPT" "$dir" >"$dir/out"

  python3 - "$dir" <<'PY'
import pathlib, sys
r = pathlib.Path(sys.argv[1])
agents = (r / "AGENTS.md").read_text(encoding="utf-8")
claude = (r / "CLAUDE.md").read_text(encoding="utf-8")
readme = (r / "README.md").read_text(encoding="utf-8")
assert "# AGENTS.md — VibeCap Agent Context Router" in agents
assert "- 当前项目目标平台：`macOS`" in agents
assert "`AGENTS.md` 是 AI 任务的唯一运行时路由入口" in agents
assert "## 默认执行循环（硬模板）" in agents
assert ".agents/rules/shared/scope-guard.md" in claude
assert "`README.md` 只给人读，不作为执行指令源" in claude
assert "`build -> validate -> summary -> receipt`" in claude
assert "必须完成 `AGENTS.md` 中要求的 rules / skills 加载" in claude
assert "Rules Used / Skills Used" in claude
assert readme == "# Host README\n\nDo not rewrite me.\n"
assert (r / ".claude/skills").exists()
print("case_host_bridge_preserves_readme_ok")
PY

  grep -F "Preserved host README.md" "$dir/out" >/dev/null
}

case_missing_agents_fails_ok() {
  local dir="$TMP_DIR/no-agents"
  mkdir -p "$dir"

  if bash "$SCRIPT" "$dir" >"$dir/out" 2>&1; then
    echo "expected update_host_bridge to fail without .agents" >&2
    exit 1
  fi

  grep -F "Error: .agents directory not found" "$dir/out" >/dev/null
  echo "case_missing_agents_fails_ok"
}

case_host_bridge_preserves_readme_ok
case_missing_agents_fails_ok
echo "all_tests_passed"
