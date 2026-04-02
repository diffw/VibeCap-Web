#!/usr/bin/env bash
set -euo pipefail

ROOT=""
OUTPUT_DOCS="agents,readme,claude"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --outputs)
      if [[ $# -lt 2 || -z "${2:-}" ]]; then
        echo "Error: --outputs requires a comma-separated value" >&2
        exit 1
      fi
      OUTPUT_DOCS="$2"
      shift 2
      ;;
    *)
      if [[ -n "$ROOT" ]]; then
        echo "Error: unexpected extra argument '$1'" >&2
        exit 1
      fi
      ROOT="$1"
      shift
      ;;
  esac
done

if [[ -z "$ROOT" ]]; then
  if command -v git >/dev/null 2>&1 && git rev-parse --show-toplevel >/dev/null 2>&1; then
    ROOT="$(git rev-parse --show-toplevel)"
  else
    ROOT="$(pwd)"
  fi
fi

if [ ! -d "$ROOT" ]; then
  echo "Error: root path not found: $ROOT" >&2
  exit 1
fi

ROOT_ABS="$(cd "$ROOT" && pwd)"
export ROOT_ABS
export OUTPUT_DOCS

python3 - <<'PY'
import os
import pathlib
import re
from collections import defaultdict

root = pathlib.Path(os.environ["ROOT_ABS"])
selected_outputs = {
    token.strip().lower()
    for token in os.environ.get("OUTPUT_DOCS", "agents,readme,claude").split(",")
    if token.strip()
}
valid_outputs = {"agents", "readme", "claude"}
invalid = selected_outputs - valid_outputs
if invalid:
    raise SystemExit(f"Error: unsupported output targets: {', '.join(sorted(invalid))}")
if not selected_outputs:
    raise SystemExit("Error: no output targets selected")


def parse_frontmatter(skill_md: pathlib.Path):
    text = skill_md.read_text(encoding="utf-8")
    lines = text.splitlines()
    if len(lines) < 3 or lines[0].strip() != "---":
        return None, None

    name = None
    desc = None
    i = 1
    while i < len(lines):
        line = lines[i]
        if line.strip() == "---":
            break
        if line.startswith("name:"):
            name = line.split(":", 1)[1].strip()
        elif line.startswith("description:"):
            val = line.split(":", 1)[1].strip()
            if val in {">", ">-", "|", "|-"}:
                block = []
                i += 1
                while i < len(lines):
                    nxt = lines[i]
                    if nxt.startswith(" ") or nxt.startswith("\t"):
                        block.append(nxt.strip())
                        i += 1
                        continue
                    i -= 1
                    break
                desc = " ".join(block).strip()
            else:
                block = [val] if val else []
                i += 1
                while i < len(lines):
                    nxt = lines[i]
                    if nxt.startswith(" ") or nxt.startswith("\t"):
                        block.append(nxt.strip())
                        i += 1
                        continue
                    i -= 1
                    break
                desc = " ".join(block).strip()
        i += 1
    return name, desc


def extract_trigger_keywords(skill_md: pathlib.Path):
    text = skill_md.read_text(encoding="utf-8", errors="ignore")
    lines = text.splitlines()
    phrases = []

    def push(v: str):
        vv = re.sub(r"\s+", " ", v).strip()
        if not vv:
            return
        if "/" in vv and vv.count("/") >= 1:
            return
        if vv not in phrases:
            phrases.append(vv)

    def collect_from_line(ln: str):
        for m in re.findall(r"`([^`]{1,80})`", ln):
            push(m)
        for m in re.findall(r"\"([^\"]{1,80})\"", ln):
            push(m)
        for m in re.findall(r"'([^']{1,80})'", ln):
            push(m)
        for m in re.findall(r"(#[-\w\u4e00-\u9fff]+)", ln):
            push(m)

    for idx, ln in enumerate(lines):
        hit = re.search(r"(?i)(user says|user mentions|triggered by|triggered when|use when|当用户说|触发)", ln)
        if not hit:
            continue
        # Capture keywords from the matched line and nearby bullet lines.
        window = lines[idx : min(idx + 8, len(lines))]
        for w in window:
            if re.match(r"^\s*#{1,6}\s+", w):
                break
            collect_from_line(w)

    if not phrases:
        # Fallback: look at the first 40 lines for explicit hashtags.
        for ln in lines[:40]:
            for m in re.findall(r"(#[-\w\u4e00-\u9fff]+)", ln):
                push(m)

    return phrases


def skill_sort_key(rel_skill_dir: str):
    top = rel_skill_dir.split("/", 1)[0] if rel_skill_dir else "misc"
    phase_priority = {
        "shared": 0,
        "families": 1,
        "platforms": 2,
        "00-start": 0,
        "01-design": 10,
        "02-develop": 11,
        "03-testing": 12,
        "04-merge-gate": 13,
        "fastlane-appstore": 14,
        "release-audit": 15,
        "commit-code": 16,
        "requirements-clarification": 17,
    }
    nums = []
    for seg in rel_skill_dir.split("/"):
        m = re.match(r"^(\d+)-", seg)
        if m:
            nums.append(int(m.group(1)))
        else:
            nums.append(999)
    return (phase_priority.get(top, 50), nums, rel_skill_dir)


def esc_md(v: str):
    return v.replace("|", "\\|")


def has_cjk(text: str):
    return bool(re.search(r"[\u4e00-\u9fff]", text))


def cjk_ratio(text: str):
    if not text:
        return 0.0
    total = len(re.sub(r"\s+", "", text))
    if total == 0:
        return 0.0
    cjk = len(re.findall(r"[\u4e00-\u9fff]", text))
    return cjk / total


def build_purpose_cn(name: str, desc: str, trigger_text: str):
    if desc and has_cjk(desc) and cjk_ratio(desc) >= 0.2:
        return desc
    if trigger_text and trigger_text != "见 SKILL.md":
        return f"用于处理：{trigger_text}"
    return f"用于执行 `{name}` 相关任务"


def collect_meta_docs(repo_root: pathlib.Path):
    docs = []
    seen = set()
    search_roots = []
    if (repo_root / ".harness-docs").exists():
        search_roots.append(repo_root / ".harness-docs")
    if (repo_root / ".vibe-doc").exists():
        search_roots.append(repo_root / ".vibe-doc")
    search_roots.append(repo_root)

    for base in search_roots:
        if not base.exists():
            continue
        for p in base.rglob("*.md"):
            if not p.is_file():
                continue
            if p in seen:
                continue
            rel = p.relative_to(repo_root).as_posix()
            if rel in {"AGENTS.md", "README.md"}:
                continue
            if rel.startswith(("skills/", "rules/", "references/", "scripts/", ".agents/")):
                continue
            seen.add(p)
            score = 0
            name_l = p.name.lower()
            if "prd" in name_l:
                score += 4
            if "spec" in name_l:
                score += 4
            if rel.startswith((".harness-docs/", ".vibe-doc/")):
                score += 2
            if score > 0:
                stem = p.stem.lower()
                rel = p.relative_to(repo_root).as_posix().lower()
                priority = 0
                if re.match(r"^product[_-]?spec", stem):
                    priority += 60
                elif re.match(r"^product[_-]?prd", stem):
                    priority += 60
                elif re.match(r"^implementation[_-]?product[_-]?spec", stem):
                    priority += 55
                elif re.match(r"^prd(?:[_-]|$)", stem):
                    priority += 50
                elif re.match(r"^spec(?:[_-]|$)", stem):
                    priority += 45
                elif stem == "readme":
                    priority += 20

                if re.search(r"(acceptance|report|retrospective|guide|review|test|plan|matrix|backlogs)", stem):
                    priority -= 20

                docs.append((score, priority, rel, p))
    docs.sort(key=lambda x: (-x[0], -x[1], len(x[2]), x[2]))
    return [p for _, _, _, p in docs]


def extract_project_meta(repo_root: pathlib.Path):
    project_name = repo_root.name
    one_liner = None
    target_platform = None
    candidates = collect_meta_docs(repo_root)
    product_signal_docs = [p for p in candidates if ("prd" in p.name.lower() or "spec" in p.name.lower())]

    keyword_map = [
        ("browser extension", "Browser Extension"),
        ("extension", "Browser Extension"),
        ("插件", "Browser Extension"),
        ("macos", "macOS"),
        ("ios", "iOS"),
        ("web", "Web"),
        ("网站", "Web"),
    ]

    for p in candidates[:20]:
        text = p.read_text(encoding="utf-8", errors="ignore")

        if project_name == repo_root.name:
            h1 = re.search(r"(?m)^#\s+(.+)$", text)
            if h1:
                raw = h1.group(1).strip()
                parts = re.split(r"\s*[—-]\s*", raw, maxsplit=1)
                if len(parts) == 2 and re.search(r"(prd|spec|规格|文档)", parts[1], flags=re.IGNORECASE):
                    raw = parts[0].strip()
                raw = re.sub(r"\b(PRD|Spec|Specification)\b.*$", "", raw, flags=re.IGNORECASE).strip(" -|：:")
                raw = re.sub(r"(产品规格文档|产品规格|事实级产品规格).*?$", "", raw).strip(" -|：:")
                if raw:
                    project_name = raw

        allow_product_meta = p in product_signal_docs

        if allow_product_meta and not one_liner:
            inline = re.search(
                r"(?im)^\s*(?:\*\*)?(?:one-?liner|一句话(?:介绍|描述)?|项目简介|产品简介)(?:\*\*)?\s*[:：]\s*(.+)$",
                text,
            )
            if inline:
                line = inline.group(1).strip()
                line = re.sub(r"^\[To be filled\]$", "", line, flags=re.IGNORECASE).strip()
                if line:
                    one_liner = line
            else:
                sec = re.search(r"(?im)^#{1,6}\s*(?:one-?liner|一句话(?:介绍|描述)?|项目简介|产品简介)\s*$", text)
                if sec:
                    rest = text[sec.end() :].splitlines()
                    for ln in rest:
                        s = ln.strip().strip("> ").strip()
                        if not s or s.startswith("#") or s.startswith("|") or s.lower() == "[to be filled]":
                            continue
                        one_liner = s
                        break

        if allow_product_meta and not target_platform:
            line_match = re.search(r"(?im)^\s*(?:目标平台|platforms?|launch platform)\s*[:：]\s*(.+)$", text)
            if line_match:
                scan_text = line_match.group(1).lower()
                for kw, label in keyword_map:
                    if kw in scan_text:
                        target_platform = label
                        break
            else:
                sec = re.search(r"(?im)^#{1,6}\s*(?:目标平台|platforms?|launch platform)\s*$", text)
                if sec:
                    rest = text[sec.end() :].splitlines()
                    for ln in rest:
                        s = ln.strip().strip("> ").strip()
                        if not s or s.startswith("#") or s.startswith("|"):
                            continue
                        scan_text = s.lower()
                        for kw, label in keyword_map:
                            if kw in scan_text:
                                target_platform = label
                                break
                        break

        if allow_product_meta and not target_platform:
            lines = text.splitlines()
            for idx, ln in enumerate(lines):
                if "|" in ln and re.search(r"(?i)\|\s*(?:platform|平台)\s*\|", ln):
                    for row in lines[idx + 1 : idx + 8]:
                        if "|" not in row:
                            break
                        scan_text = row.lower()
                        for kw, label in keyword_map:
                            if kw in scan_text:
                                target_platform = label
                                break
                        if target_platform:
                            break
                if target_platform:
                    break

        if allow_product_meta and not target_platform:
            snippet = "\n".join(text.splitlines()[:120]).lower()
            narrative_patterns = [
                r"(?:是一个|应用类型|适用范围|product type|app type|is an?|is a).{0,40}(browser extension|extension|macos|ios|web)",
                r"(browser extension|extension|macos|ios|web).{0,24}(?:app|应用|menu bar app|extension|插件)",
            ]
            for pattern in narrative_patterns:
                m = re.search(pattern, snippet, flags=re.IGNORECASE | re.DOTALL)
                if not m:
                    continue
                scan_text = " ".join(g for g in m.groups() if g).lower()
                for kw, label in keyword_map:
                    if kw in scan_text:
                        target_platform = label
                        break
                if target_platform:
                    break

        if one_liner and target_platform and project_name != repo_root.name:
            break

    if not one_liner:
        one_liner = "可复用的 AI Agent 工作流与规则仓库。"
    if not target_platform:
        if (repo_root / ".harness-docs").exists() and not (repo_root / ".agents").exists():
            target_platform = "Harness Repo（多平台元仓库）"
        else:
            target_platform = "未声明"

    return project_name, one_liner, target_platform


def resolve_labeled_path(base_root: pathlib.Path, label_prefix: str, candidates):
    for candidate in candidates:
        rel_path = pathlib.Path(candidate)
        if (base_root / rel_path).exists():
            return f"{label_prefix}{rel_path.as_posix()}"
    first = pathlib.Path(candidates[0])
    return f"{label_prefix}{first.as_posix()}"


skills_root = root / "skills"
rules_root = root / "rules"
refs_root = root / "references"
scripts_root = root / "scripts"
skills_path_label = "skills/"
rules_path_label = "rules/"
refs_path_label = "references/"
scripts_path_label = "scripts/"

if (root / ".agents" / "skills").exists():
    skills_root = root / ".agents" / "skills"
    skills_path_label = ".agents/skills/"
if (root / ".agents" / "rules").exists():
    rules_root = root / ".agents" / "rules"
    rules_path_label = ".agents/rules/"
if (root / ".agents" / "references").exists():
    refs_root = root / ".agents" / "references"
    refs_path_label = ".agents/references/"
if (root / ".agents" / "scripts").exists():
    scripts_root = root / ".agents" / "scripts"
    scripts_path_label = ".agents/scripts/"

skill_files = sorted(skills_root.rglob("SKILL.md")) if skills_root.exists() else []
rule_files = sorted([p for p in rules_root.rglob("*") if p.is_file()]) if rules_root.exists() else []
ref_paths = sorted([p for p in refs_root.rglob("*") if p.is_file()]) if refs_root.exists() else []
script_files = sorted([p for p in scripts_root.rglob("*") if p.is_file()]) if scripts_root.exists() else []

skills_rows = []
skills_groups = defaultdict(list)
for sf in skill_files:
    rel = sf.relative_to(root).as_posix()
    rel_skill_dir = sf.parent.relative_to(skills_root).as_posix()
    top_group = rel_skill_dir.split("/", 1)[0] if rel_skill_dir else "misc"
    name, desc = parse_frontmatter(sf)
    display_name = name or rel_skill_dir.replace("/", "-")
    display_desc = desc or "见 SKILL.md 定义"
    display_desc = re.sub(r"\s+", " ", display_desc).strip()
    display_desc = esc_md(display_desc)
    if len(display_desc) > 140:
        display_desc = display_desc[:137] + "..."
    triggers = extract_trigger_keywords(sf)
    trigger_text = "、".join(triggers[:6]) if triggers else "见 SKILL.md"
    trigger_text = esc_md(trigger_text)
    if len(trigger_text) > 140:
        trigger_text = trigger_text[:137] + "..."
    purpose_cn = build_purpose_cn(display_name, display_desc, trigger_text)
    purpose_cn = esc_md(re.sub(r"\s+", " ", purpose_cn).strip())
    if len(purpose_cn) > 140:
        purpose_cn = purpose_cn[:137] + "..."

    skills_rows.append(
        {
            "phase": top_group,
            "sort_dir": rel_skill_dir,
            "name": display_name,
            "path": rel,
            "desc": display_desc,
            "purpose_cn": purpose_cn,
            "triggers": trigger_text,
        }
    )
    skills_groups[top_group].append(rel_skill_dir)

skills_rows.sort(key=lambda x: skill_sort_key(x["sort_dir"]))
for key in skills_groups:
    skills_groups[key] = sorted(skills_groups[key], key=skill_sort_key)

target_platform = "<iOS | macOS | Web | Browser Extension>"
project_name, one_liner, target_platform = extract_project_meta(root)
scope_guard_rel = resolve_labeled_path(rules_root, rules_path_label, ["shared/scope-guard.md", "scope-guard.md"])
dev_principles_rel = resolve_labeled_path(rules_root, rules_path_label, ["shared/dev-principles.md", "dev-principles.md"])
vibe_doc_preserve_rel = resolve_labeled_path(
    rules_root,
    rules_path_label,
    ["shared/vibe-doc-preservation.md"],
)
execution_receipt_rel = resolve_labeled_path(
    rules_root,
    rules_path_label,
    ["shared/execution-receipt.md"],
)
testing_rules_rel = resolve_labeled_path(
    rules_root,
    rules_path_label,
    ["families/apple/swift-testing.mdc", "testing-rules.mdc"],
)
unit_test_skill_rel = resolve_labeled_path(
    skills_root,
    skills_path_label,
    ["shared/workflows/testing/01-unit-test/SKILL.md", "03-testing/01-unit-test/SKILL.md"],
)
integration_test_skill_rel = resolve_labeled_path(
    skills_root,
    skills_path_label,
    ["shared/workflows/testing/02-integration-test/SKILL.md", "03-testing/02-integration-test/SKILL.md"],
)
systematic_debugging_skill_rel = resolve_labeled_path(
    skills_root,
    skills_path_label,
    ["shared/workflows/develop/systematic-debugging/SKILL.md", "02-develop/systematic-debugging/SKILL.md"],
)
localization_skill_rel = resolve_labeled_path(
    skills_root,
    skills_path_label,
    [
        "families/apple/workflows/develop/localization-handler/SKILL.md",
        "02-develop/Localization/SKILL.md",
    ],
)

platform_rule_candidates = {
    "macOS": ["platforms/macos/macos-coding.mdc"],
}
platform_rule_rel = None
if target_platform in platform_rule_candidates:
    platform_rule_rel = resolve_labeled_path(
        rules_root,
        rules_path_label,
        platform_rule_candidates[target_platform],
    )

module_rows = [
    ("Skills", skills_path_label, "Agent workflow 能力定义"),
    ("Rules", rules_path_label, "开发规范与测试规则"),
    ("References", refs_path_label, "技术与设计参考文档"),
    ("Scripts", scripts_path_label, "自动化脚本与工具"),
]
if (root / ".vibe-doc").exists():
    module_rows.append(("Product Docs", ".vibe-doc/", "产品与设计过程文档"))
if (root / ".harness-docs").exists():
    module_rows.append(("Harness Docs", ".harness-docs/", "仓库自身评估与执行文档"))

agents_lines = []
agents_lines.append(f"# AGENTS.md — {project_name} Agent Context Router")
agents_lines.append("")
agents_lines.append("## 项目概要")
agents_lines.append("")
agents_lines.append(f"{project_name}：{one_liner}")
agents_lines.append("")
agents_lines.append("## 目标平台（单平台）")
agents_lines.append("")
agents_lines.append(f"- 当前项目目标平台：`{target_platform}`")
if target_platform == "Harness Repo（多平台元仓库）":
    agents_lines.append("- 当前仓库本身是多平台 Harness 元仓库；宿主项目应在 PRD / Spec 中声明单一目标平台。")
elif target_platform == "未声明":
    agents_lines.append("- 请先在 PRD / Spec 中声明目标平台，再展开实现、测试与发布方案。")
else:
    agents_lines.append("- 仅对目标平台生成实现、测试与发布方案；非目标平台默认不展开。")
agents_lines.append("")
agents_lines.append("## 模块总览")
agents_lines.append("")
agents_lines.append("| 模块 | 路径 | 说明 |")
agents_lines.append("|---|---|---|")
for mod, path, desc in module_rows:
    agents_lines.append(f"| {mod} | `{path}` | {desc} |")
agents_lines.append("")
agents_lines.append("## Skill 路由真相源")
agents_lines.append("")
agents_lines.append("- `AGENTS.md` 是 AI 任务的唯一运行时路由入口。")
agents_lines.append("- `README.md` 只服务人类说明，不作为运行时指令源。")
agents_lines.append(f"- Skill 详细定义以 `{skills_path_label}**/SKILL.md` 为真相源；仅在 `AGENTS.md` 已判定命中后再打开具体 Skill。")
agents_lines.append(f"- 非必要禁止全量递归扫描 `{skills_path_label}`；只有路径缺失、规则冲突或用户明确要求时才回退到树扫描。")
agents_lines.append("- `AGENTS.md` 不维护手写 Skill 总表，避免重复索引漂移。")
agents_lines.append("")
agents_lines.append("## 运行时强制路由（硬门禁）")
agents_lines.append("")
agents_lines.append(f"- 任何代码变更任务：先读 `{scope_guard_rel}` 与 `{dev_principles_rel}`。")
agents_lines.append(f"- 若任务涉及 Apple 平台代码、测试或发布：第一次代码编辑前必须读取 `{testing_rules_rel}`。")
if platform_rule_rel:
    agents_lines.append(f"- 当前目标平台为 `{target_platform}`：第一次代码编辑前还必须读取 `{platform_rule_rel}`。")
agents_lines.append(f"- 任何生产代码编辑：第一次代码编辑前至少读取 `{unit_test_skill_rel}`，并在每个代码批次后执行 Validation Scaling 对应的测试。")
agents_lines.append(f"- Bug 修复：第一次 patch 前先读取 `{systematic_debugging_skill_rel}`；修复后必须立即运行受影响测试，未跑测试不得回复“已修复”。")
agents_lines.append(f"- 跨 3+ 模块、feature completion 或明确的集成改动：补读 `{integration_test_skill_rel}`。")
agents_lines.append(f"- 修改 `.strings` 或新增用户可见文案：补读 `{localization_skill_rel}`。")
agents_lines.append("")
agents_lines.append("## 上下文加载规则（按需读取）")
agents_lines.append("")
agents_lines.append(f"0. **Scope Lock（硬门禁 — 强制第一步）**：收到代码变更任务后，第一条工作消息**必须**是 Scope Card。在 Scope Card 输出之前，**禁止调用**任何文件读写、搜索、编辑、Bash 工具（唯一例外：读取 `{scope_guard_rel}` 本身）。违反此门禁的操作视为无效。")
agents_lines.append(f"1. 先读任务相关 `{rules_path_label}`；Skill 路由只由 `AGENTS.md` 当前任务类型与“运行时强制路由”决定，再读对应 `{skills_path_label}**/SKILL.md`。")
agents_lines.append(f"2. 仅在 Skill 明确引用时读取 `{refs_path_label}`。")
agents_lines.append(f"3. 若任务会创建或更新 `.vibe-doc/`，先读取 `{vibe_doc_preserve_rel}` 并遵守 preserve-first 规则。")
agents_lines.append(f"4. 完成修改后按 Scope Card 的验证计划执行测试/校验，并在回复末尾按 `{execution_receipt_rel}` 输出 Rules Used / Skills Used 回执。")
agents_lines.append(f"5. Skill 详细定义以 `{skills_path_label}**/SKILL.md` 为准，但运行时禁止把整棵 Skills 树当作默认入口。")
agents_lines.append("6. **超限即停**：操作过程中触达 Scope Card 声明的预算上限时，立即停止并向用户申请扩范围，未获批准不继续。")
agents_lines.append("")
agents_lines.append("## 默认执行循环（硬模板）")
agents_lines.append("")
agents_lines.append("1. `route`：按本文件确定 rules / skills。")
agents_lines.append("2. `edit`：做最小必要改动。")
agents_lines.append("3. `build`：执行编译或目标级验证。")
agents_lines.append("4. `validate`：按 Validation Scaling 与已触发 testing tier 跑真实测试。")
agents_lines.append("5. `summary`：输出 Testing Summary 或明确说明为何本次按规则无需测试。")
agents_lines.append("6. `receipt`：输出 Rules Used / Skills Used。")
agents_lines.append("7. `reply`：只有完成前六步后，才能向用户报告完成。")
agents_lines.append("")
agents_lines.append("- 禁止把执行循环缩成 `edit -> build -> reply`。")
agents_lines.append("")
agents_lines.append("## 完成标准（Definition of Done）")
agents_lines.append("")
agents_lines.append("- 变更与需求一致，无未解释偏差。")
agents_lines.append("- 相关测试已执行并给出真实结果。")
agents_lines.append("- 路径引用有效，文档与实际结构一致。")
agents_lines.append("- 不提交系统垃圾文件（如 `.DS_Store`）。")
agents_lines.append('- **优化类变更必须记录 `CHANGELOG.md`**：对 rules、skills、agents、scripts 或任何工作流配置的优化性变更，必须在 `CHANGELOG.md` 顶部追加记录，包含"优化了什么"和"为什么要做这个优化"。未记录 = 未完成。')
agents_lines.append("")
agents_lines.append("## 压缩恢复（Compaction Recovery）")
agents_lines.append("")
agents_lines.append("1. 重新读取 `AGENTS.md`。")
agents_lines.append("2. 重新读取当前任务计划（如有）。")
agents_lines.append("3. 重新读取正在编辑的关键文件与相关规则/技能。")
agents_lines.append("")

readme_lines = []
readme_lines.append(f"# {project_name}")
readme_lines.append("")
readme_lines.append(one_liner)
readme_lines.append("")
readme_lines.append("## 目标平台")
readme_lines.append("")
readme_lines.append(f"- 当前目标平台：`{target_platform}`")
if target_platform == "Harness Repo（多平台元仓库）":
    readme_lines.append("- 说明：当前仓库是多平台 Harness 元仓库；接入到宿主项目后应收敛为单一目标平台。")
elif target_platform == "未声明":
    readme_lines.append("- 说明：请先在 PRD / Spec 中声明目标平台，再生成面向实现的工作流。")
else:
    readme_lines.append("- 说明：本仓库采用单平台优先策略，不默认同时覆盖四端。")
readme_lines.append("")
readme_lines.append("## 项目结构")
readme_lines.append("")
readme_lines.append("```text")
readme_lines.append(".")
readme_lines.append("├── AGENTS.md")
readme_lines.append("├── README.md")
for _, path, _ in module_rows:
    readme_lines.append(f"├── {path.rstrip('/')}/")
readme_lines.append("```")
readme_lines.append("")
if (root / ".harness-docs").exists() and not (root / ".agents").exists():
    readme_lines.append("## 宿主项目接入")
    readme_lines.append("")
    readme_lines.append("推荐把本仓库作为 submodule 挂到宿主项目根目录的 `.agents/`。")
    readme_lines.append("")
    readme_lines.append("接入后，宿主项目根目录的桥接文档刷新入口是：")
    readme_lines.append("- `bash .agents/scripts/update_host_bridge.sh .`")
    readme_lines.append("- 可选自动化：`bash .agents/scripts/install_host_bridge_hooks.sh .`")
    readme_lines.append("- 该桥接流程默认只更新根目录 `AGENTS.md` / `CLAUDE.md` 与 `.claude/skills`，不会覆盖宿主项目 `README.md`")
    readme_lines.append("")
readme_lines.append("## Skills 分组")
readme_lines.append("")
for group in sorted(skills_groups.keys(), key=skill_sort_key):
    items = ", ".join(f"`{s}`" for s in skills_groups[group][:8])
    if len(skills_groups[group]) > 8:
        items += " ..."
    readme_lines.append(f"- `{group}/`：{items if items else '暂无'}")
readme_lines.append("")
readme_lines.append("## Skills 清单（按实际扫描顺序）")
readme_lines.append("")
readme_lines.append("| 阶段 | Skill | 作用 | 触发关键词 | 路径 |")
readme_lines.append("|---|---|---|---|---|")
for row in skills_rows:
    readme_lines.append(
        f"| `{row['phase']}` | `{row['name']}` | {row['purpose_cn']} | {row['triggers']} | `{row['path']}` |"
    )
readme_lines.append("")
readme_lines.append("## Rules 与 References")
readme_lines.append("")
readme_lines.append(f"- `{rules_path_label}`：共 {len(rule_files)} 个文件")
readme_lines.append(f"- `{refs_path_label}`：共 {len(ref_paths)} 个文件")
readme_lines.append(f"- `{scripts_path_label}`：共 {len(script_files)} 个文件")
readme_lines.append("")
readme_lines.append("## 文档生成约定")
readme_lines.append("")
readme_lines.append("当用户说“生成 agents.md”或“生成 readme.md”时：")
readme_lines.append("- 同时全量更新根目录 `AGENTS.md` 与 `README.md`")
readme_lines.append("- 基于当前仓库真实结构重新生成")
readme_lines.append("- 输出语言为中文，结构简洁")
readme_lines.append("")

claude_lines = []
claude_lines.append("# CLAUDE.md")
claude_lines.append("")
claude_lines.append("任何任务开始前，必须先读取以下文件：")
claude_lines.append("")
claude_lines.append("1. `AGENTS.md` — 项目规则路由")
claude_lines.append(f"2. `{scope_guard_rel}` — Scope Card（强制前置）")
claude_lines.append(f"3. `{dev_principles_rel}` — 开发原则")
claude_lines.append("4. 返回 `AGENTS.md`，按其中的“运行时强制路由”和“默认执行循环”继续执行")
claude_lines.append("")
claude_lines.append("## Claude Code 执行交接（硬门禁）")
claude_lines.append("")
claude_lines.append("1. `/plan`、规划阶段或任何高层方案输出，都**不替代**执行侧的 rules / skills 加载。进入第一次代码编辑前，必须重新回到执行模式并完成下面检查。")
claude_lines.append("2. `AGENTS.md` 是唯一 AI 运行时入口；`README.md` 只给人读，不作为执行指令源。")
claude_lines.append("3. 第一次代码编辑前，必须完成 `AGENTS.md` 中要求的 rules / skills 加载，不能靠“之前读过一次”代替。")
claude_lines.append("4. 每次代码编辑后，默认下一步必须进入 `build -> validate -> summary -> receipt`，不能直接回复用户。")
claude_lines.append(f"5. 对 Apple 代码任务，`validate` 阶段至少受 `{testing_rules_rel}` 约束；Bug 修复若已改生产代码，修复后必须立即跑受影响测试。")
claude_lines.append(f"6. 任何执行类任务结束时，必须按 `{execution_receipt_rel}` 在回复末尾输出本次实际调用的 Rules Used / Skills Used；没有则明确写 `none`。")
claude_lines.append("")
claude_lines.append("读完上述文件与执行交接后，严格按照 AGENTS.md 中的上下文加载规则执行任务。")
claude_lines.append("")

if "agents" in selected_outputs:
    (root / "AGENTS.md").write_text("\n".join(agents_lines), encoding="utf-8")
    print(f"Generated {root / 'AGENTS.md'}")
if "readme" in selected_outputs:
    (root / "README.md").write_text("\n".join(readme_lines), encoding="utf-8")
    print(f"Generated {root / 'README.md'}")
if "claude" in selected_outputs:
    (root / "CLAUDE.md").write_text("\n".join(claude_lines), encoding="utf-8")
    print(f"Generated {root / 'CLAUDE.md'}")
print(f"Skills scanned: {len(skill_files)}")
PY
