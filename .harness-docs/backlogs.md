# Backlogs

> 规则：
> - 人工维护需求定义与优先级
> - AI 维护执行状态、执行日志、测试与结果
> - 本文件是 backlog 单一真实来源

## 执行规则
- 优先级顺序：P0 > P1 > P2 > P3
- 选择规则：优先 `status=todo` 且 `blocked=no`
- `status` 可留空；空值按 `todo` 处理
- `status=draft` 仅用于想法暂存，不进入执行队列
- WIP：同一时间仅 1 个 `doing`

---

## T-002 拍照功能
- owner: human
- priority: P0
- status: todo
- blocked: no
- type: feature
- area: 相机模块
- description: 用户想拍照的时候，打开这个 App，点击拍照就可以拍照。
- depends_on: []
- acceptance:
  - [ ] 点击拍照后可成功完成拍照
  - [ ] 支持连续拍照
- context_files: []
- runbook: []
- updated_at: 2026-03-11
- assignee: ai

### AI Execution Log
- start:
- finish:
- plan:
- changes:
- tests:
- artifacts:
- outcome:
