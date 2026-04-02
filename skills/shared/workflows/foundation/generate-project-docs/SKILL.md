---
name: generate-project-docs
description: "Generate and fully refresh root AGENTS.md, README.md, and CLAUDE.md by scanning current project structure (skills, rules, references, scripts). Use immediately when the user says 生成 agents.md or 生成 readme.md. Always update all three files together in Chinese."
---

# Generate Project Docs

Run this skill immediately when the user says:
- `生成 agents.md`
- `生成 readme.md`

## Required Workflow

1. Resolve root and script path.
- Resolve repository root:
  `ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"`
- Resolve script path with fallback:
  `SCRIPT="$ROOT_DIR/.agents/scripts/generate_agents_readme.sh"; [ -f "$SCRIPT" ] || SCRIPT="$ROOT_DIR/scripts/generate_agents_readme.sh"`
- If both script paths are missing, stop and report both paths.

### Host Project Bridge Rule

If `.agents/` exists at the repository root, treat this as a host project:

- Default bridge refresh should update only:
  - `AGENTS.md`
  - `CLAUDE.md`
- Do **not** overwrite the host project's root `README.md` during routine harness sync.
- Preferred command for host bridge refresh:
  `bash "$ROOT_DIR/.agents/scripts/update_host_bridge.sh" "$ROOT_DIR"`
- Only regenerate root `README.md` in a host project when the user explicitly asks to rewrite that README.

2. Generate documents.
- Run:
  `bash "$SCRIPT" "$ROOT_DIR"`
- Always regenerate all three files together:
  - `AGENTS.md`
  - `README.md`
  - `CLAUDE.md` (bridge file for Claude Code to auto-load AGENTS.md and rules)
- While generating, auto-read project metadata from PRD/SPEC docs when available:
  - project name
  - one-line introduction
  - target platform
- In `README.md`, include a Skills list sorted by project phase order.
  - Each skill entry must include purpose and trigger keywords.
- In `AGENTS.md`, make `README.md` the runtime Skill index entry and keep `skills/**/SKILL.md` as the detailed truth source.

3. Verification checks.
- Confirm `AGENTS.md`, `README.md`, and `CLAUDE.md` exist at repository root.
- Confirm all files are Chinese and reflect current scanned structure.
- Confirm source layout detection is correct:
  - Prefer `.agents/{skills,rules,references,scripts}` when present
  - Fallback to root `skills/rules/references/scripts`
- Confirm generated `README.md` includes "Skills 清单（按项目阶段顺序）" with:
  - phase order
  - purpose
  - trigger keywords
- Confirm generated `AGENTS.md` clearly distinguishes:
  - AI runtime entrypoint = `AGENTS.md`
  - `README.md` = human-facing document only
  - detailed Skill truth source = `skills/**/SKILL.md`
- Confirm AGENTS/README/CLAUDE are full refresh outputs (not partial patching).
- Confirm `CLAUDE.md` contains:
  - bridge instructions pointing to `AGENTS.md` and core rules
  - a Claude Code execution handoff section
  - reminders that planning does not replace execution-side rule/skill loading
  - a default execution loop (`edit -> build -> validate -> summary -> receipt -> reply`)
  - explicit instruction that `README.md` is not a runtime instruction source
  - a requirement to output `Rules Used / Skills Used` at the end of execution tasks

## Output Rules

- Output language must be Chinese.
- Keep structure concise and execution-oriented.
- In the standalone harness repository, existing root docs may be fully overwritten.
- In a host project with `.agents/`, do not overwrite root `README.md` unless the user explicitly asks for it.
