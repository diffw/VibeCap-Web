#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
GEN_SCRIPT="$ROOT_DIR/scripts/generate_agents_readme.sh"

run_case_from_prd_spec() {
  local t
  t="$(mktemp -d)"
  mkdir -p "$t/.vibe-doc" "$t/skills/a" "$t/rules" "$t/references" "$t/scripts"

  cat >"$t/.vibe-doc/PRODUCT_PRD.md" <<'EOF'
# VibeCapture PRD

## One-Liner
Capture and annotate screenshots on macOS with agent-assisted workflow.

## Launch Platform
macOS
EOF

  cat >"$t/skills/a/SKILL.md" <<'EOF'
---
name: alpha
description: alpha skill
---
EOF

  bash "$GEN_SCRIPT" "$t" >/dev/null
  python3 - "$t" <<'PY'
import pathlib, sys
r = pathlib.Path(sys.argv[1])
agents = (r / "AGENTS.md").read_text(encoding="utf-8")
readme = (r / "README.md").read_text(encoding="utf-8")
assert "# AGENTS.md — VibeCapture Agent Context Router" in agents
assert "VibeCapture：Capture and annotate screenshots on macOS with agent-assisted workflow." in agents
assert "- 当前项目目标平台：`macOS`" in agents
assert "# VibeCapture" in readme
assert "Capture and annotate screenshots on macOS with agent-assisted workflow." in readme
assert "- 当前目标平台：`macOS`" in readme
print("case_from_prd_spec_ok")
PY
}

run_case_fallback_defaults() {
  local t
  t="$(mktemp -d)"
  mkdir -p "$t/skills/a" "$t/rules" "$t/references" "$t/scripts"

  cat >"$t/skills/a/SKILL.md" <<'EOF'
---
name: alpha
description: alpha skill
---
EOF

  bash "$GEN_SCRIPT" "$t" >/dev/null
  python3 - "$t" <<'PY'
import pathlib, sys
r = pathlib.Path(sys.argv[1])
agents = (r / "AGENTS.md").read_text(encoding="utf-8")
readme = (r / "README.md").read_text(encoding="utf-8")
assert "可复用的 AI Agent 工作流与规则仓库。" in agents
assert "`未声明`" in agents
assert "`未声明`" in readme
print("case_fallback_ok")
PY
}

run_case_ignore_generated_docs() {
  local t
  t="$(mktemp -d)"
  mkdir -p "$t/.vibe-doc" "$t/skills/a" "$t/rules" "$t/references" "$t/scripts"

  cat >"$t/AGENTS.md" <<'EOF'
# AGENTS.md — wrong-title
EOF
  cat >"$t/README.md" <<'EOF'
# README.md — wrong-title
EOF
  cat >"$t/.vibe-doc/product-spec.md" <<'EOF'
# VibeCap Product Spec

## One-Liner
Ship a lightweight screenshot workflow for browser extension users.

## Target Platform
Browser Extension
EOF
  cat >"$t/skills/a/SKILL.md" <<'EOF'
---
name: alpha
description: alpha skill
---
EOF

  bash "$GEN_SCRIPT" "$t" >/dev/null
  python3 - "$t" <<'PY'
import pathlib, sys
r = pathlib.Path(sys.argv[1])
agents = (r / "AGENTS.md").read_text(encoding="utf-8")
readme = (r / "README.md").read_text(encoding="utf-8")
assert "# AGENTS.md — VibeCap Product Agent Context Router" in agents
assert "# VibeCap Product" in readme
assert "wrong-title" not in agents
assert "wrong-title" not in readme
print("case_ignore_generated_docs_ok")
PY
}

run_case_skills_order_and_triggers() {
  local t
  t="$(mktemp -d)"
  mkdir -p "$t/skills/00-start/aaa" "$t/skills/01-design/bbb" "$t/skills/02-develop/ccc" "$t/rules" "$t/references" "$t/scripts"

  cat >"$t/skills/01-design/bbb/SKILL.md" <<'EOF'
---
name: design-flow
description: design stage skill
---

Run this skill immediately when the user says:
- `生成设计`
EOF

  cat >"$t/skills/00-start/aaa/SKILL.md" <<'EOF'
---
name: start-flow
description: startup stage skill
---

Use when user mentions "#启动项目".
EOF

  cat >"$t/skills/02-develop/ccc/SKILL.md" <<'EOF'
---
name: dev-flow
description: develop stage skill
---

Triggered by "修复问题"
EOF

  bash "$GEN_SCRIPT" "$t" >/dev/null
  python3 - "$t" <<'PY'
import pathlib, sys
r = pathlib.Path(sys.argv[1])
readme = (r / "README.md").read_text(encoding="utf-8")
agents = (r / "AGENTS.md").read_text(encoding="utf-8")
assert "## Skills 清单（按实际扫描顺序）" in readme
pos_start = readme.find("`00-start`")
pos_design = readme.find("`01-design`")
pos_dev = readme.find("`02-develop`")
assert -1 not in (pos_start, pos_design, pos_dev)
assert pos_start < pos_design < pos_dev
assert "生成设计" in readme
assert "#启动项目" in readme
assert "修复问题" in readme
assert "## Skill 路由真相源" in agents
assert "`AGENTS.md` 是 AI 任务的唯一运行时路由入口" in agents
assert "`README.md` 只服务人类说明，不作为运行时指令源" in agents
assert "`AGENTS.md` 不维护手写 Skill 总表" in agents
assert "## 默认执行循环（硬模板）" in agents
assert "`route`：按本文件确定 rules / skills" in agents
assert "禁止把执行循环缩成 `edit -> build -> reply`" in agents
assert "Rules Used / Skills Used 回执" in agents
assert "| Skill | 路径 | 用途 | 触发关键词 |" not in agents
print("case_skills_order_and_triggers_ok")
PY
}

run_case_layered_structure() {
  local t
  t="$(mktemp -d)"
  mkdir -p \
    "$t/skills/shared/workflows/foundation/a" \
    "$t/skills/families/apple/workflows/release/b" \
    "$t/skills/platforms/ios/workflows/release/c" \
    "$t/rules" "$t/references" "$t/scripts"

  cat >"$t/skills/shared/workflows/foundation/a/SKILL.md" <<'EOF'
---
name: shared-flow
description: shared workflow
---
EOF

  cat >"$t/skills/families/apple/workflows/release/b/SKILL.md" <<'EOF'
---
name: apple-flow
description: apple workflow
---
EOF

  cat >"$t/skills/platforms/ios/workflows/release/c/SKILL.md" <<'EOF'
---
name: ios-flow
description: ios workflow
---
EOF

  bash "$GEN_SCRIPT" "$t" >/dev/null
  python3 - "$t" <<'PY'
import pathlib, sys
r = pathlib.Path(sys.argv[1])
readme = (r / "README.md").read_text(encoding="utf-8")
assert "`shared/`" in readme
assert "`families/`" in readme
assert "`platforms/`" in readme
assert "skills/shared/workflows/foundation/a/SKILL.md" in readme
assert "skills/families/apple/workflows/release/b/SKILL.md" in readme
assert "skills/platforms/ios/workflows/release/c/SKILL.md" in readme
print("case_layered_structure_ok")
PY
}

run_case_ignore_incidental_platform_mentions() {
  local t
  t="$(mktemp -d)"
  mkdir -p "$t/.vibe-doc" "$t/skills/a" "$t/rules" "$t/references" "$t/scripts"

  cat >"$t/.vibe-doc/notes.md" <<'EOF'
# Internal Notes

This repository may contain templates for iOS, macOS, Web, and Browser Extension projects.
EOF

  cat >"$t/skills/a/SKILL.md" <<'EOF'
---
name: alpha
description: alpha skill
---
EOF

  bash "$GEN_SCRIPT" "$t" >/dev/null
  python3 - "$t" <<'PY'
import pathlib, sys
r = pathlib.Path(sys.argv[1])
agents = (r / "AGENTS.md").read_text(encoding="utf-8")
readme = (r / "README.md").read_text(encoding="utf-8")
assert "`未声明`" in agents
assert "`未声明`" in readme
print("case_ignore_incidental_platform_mentions_ok")
PY
}

run_case_harness_docs_folder() {
  local t
  t="$(mktemp -d)"
  mkdir -p "$t/.harness-docs" "$t/skills/a" "$t/rules" "$t/references" "$t/scripts"

  cat >"$t/.harness-docs/harness-engineering-master-review.md" <<'EOF'
# Harness Coding Review

## One-Liner
Maintain the reusable harness repository itself.
EOF

  cat >"$t/skills/a/SKILL.md" <<'EOF'
---
name: alpha
description: alpha skill
---
EOF

  bash "$GEN_SCRIPT" "$t" >/dev/null
  python3 - "$t" <<'PY'
import pathlib, sys
r = pathlib.Path(sys.argv[1])
agents = (r / "AGENTS.md").read_text(encoding="utf-8")
readme = (r / "README.md").read_text(encoding="utf-8")
assert "| Harness Docs | `.harness-docs/` | 仓库自身评估与执行文档 |" in agents
assert "├── .harness-docs/" in readme
assert "`Harness Repo（多平台元仓库）`" in agents
assert "`Harness Repo（多平台元仓库）`" in readme
print("case_harness_docs_folder_ok")
PY
}

run_case_partial_outputs_preserve_readme() {
  local t
  t="$(mktemp -d)"
  mkdir -p "$t/.agents/skills/shared/workflows/foundation/a" "$t/.agents/rules" "$t/.agents/references" "$t/.agents/scripts" "$t/.vibe-doc"

  cat >"$t/.vibe-doc/PRODUCT_SPEC.md" <<'EOF'
# VibeCap 产品规格文档（反向工程版）

### 1.1 产品定位
VibeCap 是一个 macOS 菜单栏应用。
EOF

  cat >"$t/.agents/skills/shared/workflows/foundation/a/SKILL.md" <<'EOF'
---
name: alpha
description: alpha skill
---
EOF

  cat >"$t/README.md" <<'EOF'
# Host Project README

Keep me untouched.
EOF

  bash "$GEN_SCRIPT" "$t" --outputs agents,claude >/dev/null
  python3 - "$t" <<'PY'
import pathlib, sys
r = pathlib.Path(sys.argv[1])
agents = (r / "AGENTS.md").read_text(encoding="utf-8")
claude = (r / "CLAUDE.md").read_text(encoding="utf-8")
readme = (r / "README.md").read_text(encoding="utf-8")
assert "# AGENTS.md — VibeCap Agent Context Router" in agents
assert "`macOS`" in agents
assert ".agents/rules/shared/scope-guard.md" in claude
assert "`README.md` 只给人读，不作为执行指令源" in claude
assert "/plan" in claude
assert "`build -> validate -> summary -> receipt`" in claude
assert "必须完成 `AGENTS.md` 中要求的 rules / skills 加载" in claude
assert "Rules Used / Skills Used" in claude
assert readme == "# Host Project README\n\nKeep me untouched.\n"
print("case_partial_outputs_preserve_readme_ok")
PY
}

run_case_real_project_meta_priority() {
  local t
  t="$(mktemp -d)"
  mkdir -p "$t/.vibe-doc" "$t/.agents/skills/shared/workflows/foundation/a" "$t/.agents/rules" "$t/.agents/references" "$t/.agents/scripts"

  cat >"$t/.vibe-doc/PRODUCT_SPEC.md" <<'EOF'
# VibeCap 产品规格文档（反向工程版）

VibeCap 是一个 macOS 菜单栏应用。
EOF

  cat >"$t/.vibe-doc/IAP_SPEC.md" <<'EOF'
# IAP 功能清单 & 付费卡点规格（长期维护版）

仅描述 IAP 功能。
EOF

  cat >"$t/.vibe-doc/PRD-library.md" <<'EOF'
# VibeCap — 本地图库与截图管理 PRD

### 1.4 Platforms

| Platform | Priority | Notes |
|----------|----------|-------|
| macOS | P0 | 现有平台，功能扩展 |
EOF

  cat >"$t/.agents/skills/shared/workflows/foundation/a/SKILL.md" <<'EOF'
---
name: alpha
description: alpha skill
---
EOF

  bash "$GEN_SCRIPT" "$t" >/dev/null
  python3 - "$t" <<'PY'
import pathlib, sys
r = pathlib.Path(sys.argv[1])
agents = (r / "AGENTS.md").read_text(encoding="utf-8")
readme = (r / "README.md").read_text(encoding="utf-8")
claude = (r / "CLAUDE.md").read_text(encoding="utf-8")
assert "# AGENTS.md — VibeCap Agent Context Router" in agents
assert "- 当前项目目标平台：`macOS`" in agents
assert "# VibeCap" in readme
assert "- 当前目标平台：`macOS`" in readme
assert "IAP 功能清单 & 付费卡点规格" not in agents
assert ".agents/rules/shared/dev-principles.md" in claude
assert "`AGENTS.md` 是唯一 AI 运行时入口" in claude
assert "Bug 修复若已改生产代码，修复后必须立即跑受影响测试" in claude
assert "BUILD SUCCEEDED" not in claude
print("case_real_project_meta_priority_ok")
PY
}

run_case_from_prd_spec
run_case_fallback_defaults
run_case_ignore_generated_docs
run_case_skills_order_and_triggers
run_case_layered_structure
run_case_ignore_incidental_platform_mentions
run_case_harness_docs_folder
run_case_partial_outputs_preserve_readme
run_case_real_project_meta_priority

echo "all_tests_passed"
