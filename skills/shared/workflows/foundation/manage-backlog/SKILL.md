---
name: manage-backlog
description: Add or edit backlog items through a structured interview and write confirmed entries into .vibe-doc/backlogs.md. Use immediately when the user says "新增 Backlog", "添加 Backlog", or "编辑 Backlog". If requirements are unclear, call the requirement-clarification skill before writing.
---

# Manage Backlog

Run this skill immediately when the user says:
- `新增 Backlog`
- `添加 Backlog`
- `编辑 Backlog`

## Required Workflow

## .vibe-doc Preservation Gate

- Read `.agents/rules/shared/vibe-doc-preservation.md` before creating or updating any `.vibe-doc/*` file.
- Never overwrite a non-empty `.vibe-doc` document with a blank file or raw template.
- `.vibe-doc/backlogs.md` may only be initialized from template when it is missing.
- Once `.vibe-doc/backlogs.md` exists, append/update in place; do not recreate it.

1. Resolve project root and backlog path.
- `ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"`
- Backlog file path: `.vibe-doc/backlogs.md`
- Done archive path: `.vibe-doc/backlogs-done.md`
- Image archive path: `.vibe-doc/backlog-images/`

2. First-run initialization.
- If `.vibe-doc/backlogs.md` does not exist:
  - Create `.vibe-doc/` if missing
  - Create `.vibe-doc/backlogs.md` with the template in this file (see "Backlog File Template")
- Do NOT create `.vibe-doc/backlogs-done.md` at init time.
- Create `.vibe-doc/backlogs-done.md` only when the first backlog item is marked complete.
- Create `.vibe-doc/backlog-images/` only when the first image needs to be saved.

3. Structured interview (one-shot form, mandatory).
- Ask ALL required questions in one message (do not ask one-by-one).
- Keep format readable and reply-friendly.
- Infer mode from trigger words:
  - `新增 Backlog` / `添加 Backlog` => 新增
  - `编辑 Backlog` => 编辑
  - Only ask mode if the user intent is truly ambiguous.
- Use the following standard template:

```
[Backlog 信息收集表]

请直接按下面格式回复（只改冒号后的内容）：

1. 标题:
2. 状态(status，可留空；填字母): A/B/C/D/E
   A=draft  B=todo  C=doing  D=done  E=blocked
3. 类型(填字母): A/B/C/D/E/F
   A=feature  B=fix  C=refactor  D=docs  E=chore  F=test
4. 优先级(填字母): A/B/C/D
   A=P0  B=P1  C=P2  D=P3
5. 模块(area，可留空，AI 自动推断):
6. 需求描述(一句话到三句话):
7. 验收标准(可留空，AI 根据描述自动生成):
8. 依赖任务(depends_on，没有填[]):
9. 相关文件(context_files，没有填[]):

如果是”编辑 Backlog”，请额外填写：
10. 目标任务ID或标题:
```

- For choice questions, accept only option letters or predefined values; normalize automatically.
- If the user replies in free text, parse and map to canonical fields.
- New-item default behavior:
  - `status` can be empty
  - If `status` is empty/omitted, set `status: todo`
  - Always set `blocked: no` unless user explicitly says blocked
- Draft mode rule (mandatory):
  - Draft behavior is enabled only when user explicitly sets `status: draft`
  - If `status: draft`, only `title` is required
  - In draft mode, fields 3-9 are all optional and may be empty
  - For empty optional fields, normalize to:
    - `type: feature`
    - `priority: P2`
    - `area: 待补充`
    - `description: 待补充`
    - `acceptance: [ ] 待补充`
    - `depends_on: []`
    - `context_files: []`
- AI auto-infer rules for `area` (question 5):
  - If empty or omitted, AI infers from the description and project directory structure
  - Scan project source directories to find the most relevant module/folder name
  - Present the inferred value in the confirmation gate for user review
- AI auto-generate rules for `acceptance` (question 7):
  - If empty or omitted, AI generates acceptance criteria based on the description and project context
  - For `fix` type: include "问题不再复现" + specific verification point
  - For `feature` type: include functional check + edge case check
  - Present the generated criteria in the confirmation gate for user review and correction
  - If user modifies or corrects any criteria, use the corrected version as final
- `depends_on` and `context_files` (questions 8/9) are optional:
  - If empty or omitted, normalize to `[]`
  - Do NOT ask follow-up confirmation questions only for these two fields

4. Image auto-archive (mandatory when user provides images).
- **Detection**: Check if the user's message contains ANY of:
  - Explicit file paths to images (e.g., `/tmp/screenshot.png`, `~/Desktop/bug.jpg`)
  - Inline/pasted images in the conversation (visible as image content)
- **If image file path is available**:
  1. Create `.vibe-doc/backlog-images/` if missing: `mkdir -p .vibe-doc/backlog-images`
  2. Determine the target task ID (e.g., `T-003`)
  3. Copy each image: `cp <source> .vibe-doc/backlog-images/{task-id}-{seq}.{ext}`
  4. Add archived paths to the `attachments` field
- **If image is inline/pasted (no file path visible)**:
  1. Ask user for the image file path: "检测到你贴了截图，请提供文件路径以便归档到 .vibe-doc/backlog-images/"
  2. If user provides path, proceed with copy as above
  3. If user declines, set `attachments: []` and add description note: "(截图未归档)"
- **attachments field format**:
  ```
  - attachments:
    - .vibe-doc/backlog-images/T-003-1.png
  ```
- Read the image content to extract relevant information for the description.
- Always copy first, then reference. Never reference the original temp path.
- If the original image path no longer exists, skip copy and note in the entry.
- **This step is NOT optional.** If images are present and this step is skipped, the backlog entry is incomplete.

5. Requirement clarification loop (mandatory when ambiguous).
- If any answer is ambiguous, conflicting, or missing critical detail:
  - Load and run: `.agents/skills/shared/workflows/foundation/requirement-clarification/SKILL.md`
  - Return clarification questions to user
  - Continue only after user clarifies and confirms
- Exception: never trigger clarification only because `depends_on` or `context_files` is empty.
- Exception: in `status: draft`, never trigger clarification for missing fields except `title`.

6. Confirmation gate before write.
- Summarize the final normalized backlog item and ask explicit confirmation:
  - "请确认：是否按以下内容写入 backlogs.md？(yes/no)"
- If user says no, revise and re-confirm.

7. Write and archive rules.
- For `新增 Backlog`: append a new task block at the end.
- For `编辑 Backlog`: find target task by ID/title and update in place.
- Update these execution fields when writing:
  - `status` (supports `draft/todo/doing/done/blocked`; default `todo` for new item if omitted)
  - `blocked` (default `no` for new item; managed by AI when blocked)
  - `updated_at`
  - `assignee` (default `ai` if not specified)
- Completion archive rule (mandatory):
  - If an item is marked complete (`status: done` or `status: completed`):
    1. Ensure `.vibe-doc/backlogs-done.md` exists (create if missing with "Done Backlogs" header)
    2. Remove that item block from `.vibe-doc/backlogs.md`
    3. Append the full item block to `.vibe-doc/backlogs-done.md`
    4. Add `moved_at: <YYYY-MM-DD>` under the moved item

8. Post-write output.
- Report exactly:
  - File path updated
  - Added or edited task ID/title
  - Final `status` and `blocked`
  - If images were archived: list of copied paths
  - If moved to done archive: source path + archive path + moved task ID/title

## Backlog File Template

Use this template when creating `.vibe-doc/backlogs.md` for the first time:

```markdown
# Backlogs

> 规则：
> - 人工维护需求定义与优先级
> - AI 维护执行状态、执行日志、测试与结果
> - 本文件是 backlog 单一真实来源

## 执行规则
- 优先级顺序：P0 > P1 > P2 > P3
- 选择规则：优先 `status=todo` 且 `blocked=no`
- `status=draft` 仅用于想法暂存，不进入执行队列
- WIP：同一时间仅 1 个 `doing`

---

## T-001 <任务标题>
- owner: human
- priority: P1
- status: todo
- blocked: no
- type: feature
- area: <模块/目录>
- description: <需求描述>
- depends_on: []
- acceptance:
  - [ ] <验收条件1>
- context_files: []
- attachments: []
- runbook: []
- updated_at: <YYYY-MM-DD>
- assignee: ai

### AI Execution Log
- start:
- finish:
- plan:
- changes:
- tests:
- artifacts:
- outcome:
```

## Done Backlog File Template

When creating `.vibe-doc/backlogs-done.md` for the first time:

```markdown
# Done Backlogs

> 已完成 backlog 归档。条目从 `backlogs.md` 自动迁移而来。

---

## T-xxx <任务标题>
- owner: human
- priority: P1
- status: done
- blocked: no
- type: feature
- area: <模块/目录>
- description: <需求描述>
- depends_on: []
- acceptance:
  - [x] <验收条件1>
- context_files: []
- attachments: []
- runbook: []
- updated_at: <YYYY-MM-DD>
- assignee: ai
- moved_at: <YYYY-MM-DD>

### AI Execution Log
- start:
- finish:
- plan:
- changes:
- tests:
- artifacts:
- outcome:
```
