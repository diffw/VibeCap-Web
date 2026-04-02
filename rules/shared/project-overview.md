# Project Overview

本文件只说明**当前仓库的真实职责边界**，不再手写维护 Skills 明细索引。

## 当前仓库职责

`harness-coding` 是一个可复用的 AI Agent workflow 仓库，当前主要包含：

- `skills/`：workflow、adapters 与辅助资产
- `rules/`：执行规则、验证约束、范围控制
- `references/`：参考资料，不是规范真相源
- `scripts/`：生成、同步、校验脚本
- `.harness-docs/`：仓库自身的评估、迁移方案、执行计划

## 当前真相源

以下内容应被视为当前真相源：

- Skill 路由：`skills/**/SKILL.md`
- 任务范围控制：`rules/shared/scope-guard.md`
- `.vibe-doc` 保全：`rules/shared/vibe-doc-preservation.md`
- 开发原则：`rules/shared/dev-principles.md`
- 测试规则：`rules/families/apple/swift-testing.mdc`
- 根文档生成：`scripts/generate_agents_readme.sh`
- 宿主项目桥接刷新：`scripts/update_host_bridge.sh`
- 宿主项目自动刷新 hook 安装：`scripts/install_host_bridge_hooks.sh`
- Claude Skill 同步：`scripts/sync_claude_skills.sh`
- Strict execution policy：`scripts/strict_execution_policy.json`
- Strict execution guard：`scripts/check_strict_execution.sh`
- Localization hard gate：`scripts/check-hardcoded-strings.sh`
- Release preflight gate：`scripts/check_release_preflight.sh`
- Structure gate：`scripts/check_harness_structure.sh`
- `.vibe-doc` skill safety gate：`scripts/check_vibe_doc_skill_safety.sh`
- Legacy reference lint：`scripts/lint_harness_references.sh`
- Root docs freshness：`scripts/check_root_docs_freshness.sh`
- Entropy sweep entrypoint：`scripts/run_entropy_sweep.sh`
- Hotspots report：`scripts/report_hotspots.sh`

以下内容**不应**再被视为手工维护的真相源：

- `AGENTS.md` 中的完整 Skill 列表
- 与真实目录不一致的静态结构树

## 当前目录现实

当前仓库正处在“目录重组已开始、引用与兼容层仍在收敛”的阶段：

- `skills/` 已开始采用 `shared / families / platforms`，但仍有部分文档引用旧路径
- `rules/` 和 `references/` 已采用分层目录
- `scripts/` 目前仍位于扁平目录，后续再按检查类型逐步收敛

因此，本文件的目标不是给出未来理想结构，而是提醒：

1. 任何结构判断都要以仓库实际文件为准
2. 任何 Skills 索引都应由脚本扫描生成
3. 未来迁移以 `.harness-docs/harness-engineering-master-review.md` 为实施依据

## 维护约束

- 如果 `skills/`、`rules/`、`references/`、`scripts/` 结构发生变化，优先更新生成脚本和测试
- 若本文件与真实仓库冲突，应先修脚本与生成文档，再修本文件
- 不要在这里重新复制 `AGENTS.md` 或 `README.md` 的生成内容
