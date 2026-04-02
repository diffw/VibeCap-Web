---
name: merge-readiness
description: Orchestrator Skill that determines whether a branch is safe to merge. Analyzes change scope, assigns risk level, dynamically selects and executes quality gates (Unit → Integration → UI → E2E → Acceptance → Smoke), and produces a structured Merge Readiness Report with a READY_TO_MERGE or NOT_READY verdict. Platform-neutral — uses profile injection for platform-specific checks. Triggered by "#merge检查", "#merge-check", "可以合并吗", "准备合并", "merge readiness".
---

Read `skills/shared/workflows/merge/merge-readiness/SKILL.md` for complete instructions before proceeding.
