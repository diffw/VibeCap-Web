---
name: sync-claude-skills
description: Sync .claude/skills stubs from .agents/skills by creating .claude and .claude/skills if missing, then rewriting each copied SKILL.md to keep only name and description frontmatter plus a pointer to .agents. Use immediately when the user says "同步 Claude skills", "更新 Claude skills", or asks to update .claude skills.
---

# Sync Claude Skills

Run this skill immediately when the user says:
- `同步 Claude skills`
- `更新 Claude skills`
- `更新 .claude 中的 SKILLS`

## Required Workflow

1. Validate script and source layout.
- Resolve repository root:
  `ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"`
- Resolve script path with fallback:
  `SCRIPT="$ROOT_DIR/.agents/scripts/sync_claude_skills.sh"; [ -f "$SCRIPT" ] || SCRIPT="$ROOT_DIR/scripts/sync_claude_skills.sh"`
- If both script paths are missing, stop and report both paths.

2. Ensure destination directories.
- Create `.claude/`
- Create `.claude/skills/`
- If `.claude/skills` is a symlink, stop immediately and ask the user to remove it first.

3. Sync and rewrite skill files.
- Run:
  `ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"; SCRIPT="$ROOT_DIR/.agents/scripts/sync_claude_skills.sh"; [ -f "$SCRIPT" ] || SCRIPT="$ROOT_DIR/scripts/sync_claude_skills.sh"; bash "$SCRIPT" "$ROOT_DIR"`
- This keeps the same frontmatter style for `name` and `description` as source, removes other meta fields, removes body content, and writes:
  `Read \`<source-prefix>/<relative-skill-path>/SKILL.md\` for complete instructions before proceeding.`
- It scans recursively (supports nested paths like `01-design/01-new-project-prd/SKILL.md`).
- Source layout is auto-detected:
  - Prefer `.agents/skills` (submodule/hosted projects)
  - Fallback to `skills` (standalone harness repository)

4. Verification checks.
- Confirm `.claude/skills/**/SKILL.md` exists for each source skill.
- Confirm each rewritten file only contains frontmatter with `name` and `description`, plus one pointer line.
- Confirm pointer paths are explicit:
  - `.agents/skills/<relative-skill-path>/SKILL.md` when source is `.agents/skills`
  - `skills/<relative-skill-path>/SKILL.md` when source is `skills`

## Sync Policy

- Keep strategy: `B` (do not delete extra existing directories under `.claude/skills`).
- Overwrite strategy: always overwrite target `SKILL.md` for source-matching skill names.
