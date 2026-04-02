---
name: 02-integration-test
description: Defines integration test methodology, standards, and patterns. Applies when multiple modules, services, or components interact with each other. Triggered when a feature is complete, modules are wired up, or 3+ modules are involved in a task. Use when Tier 2 (Integration Test) is triggered per Global Rules.
---

# Integration Test

⚠️ Integration tests verify that modules work TOGETHER correctly. They sit between unit tests (single module) and E2E tests (full user journey).

When executing this skill, you MUST load the current platform adapter:
- Apple projects currently use `.agents/skills/families/apple/adapters/testing/swift-xcode/integration.md`
- If the required adapter is missing, stop and ask whether to generate/add it first.

---

## What Is an Integration Test

An integration test verifies the INTERACTION between two or more modules. It answers: **"When module A talks to module B, does the conversation go correctly?"**

- ✅ Test that Module A calls Module B with correct parameters
- ✅ Test that Module B's response is correctly handled by Module A
- ✅ Test the data flow through a chain of modules (A → B → C)
- ✅ Test that shared state is correctly updated across modules
- ❌ NOT testing a single function in isolation (that's unit test)
- ❌ NOT testing UI rendering (that's UI test)
- ❌ NOT testing full user journey from start to finish (that's E2E test)

---

## Trigger Conditions (Tier 2)

Per Global Rules Tier 2, integration tests are triggered by semantic intent and detectable signals.

Semantic triggers:
1. **Feature completion**: You say "done", "complete", "finished" for a feature
2. **Module wiring**: You ask to "wire up", "connect", or "integrate" modules

Detectable signals:
1. Current change spans 3+ module directories
2. `Service`/`Manager`/`Store` linkage is modified together
3. Cross-module async call chain changes

If trigger certainty is ambiguous, ASK before running:
```
🔗 This task involves [Module A], [Module B], and [Module C] interacting.
   Want me to write and run integration tests for this interaction chain?
```

---

## How Integration Tests Differ from Unit Tests

| Aspect | Unit Test | Integration Test |
|--------|-----------|-----------------|
| Scope | ONE function/class | 2+ modules interacting |
| Dependencies | ALL mocked | Real modules, only EXTERNAL deps mocked |
| Speed | Milliseconds | Seconds |
| What breaks | Logic inside a module | Contracts between modules |
| Example | `formatDate()` returns correct string | `CaptureManager` passes correct data to `ClipboardService` |

**Key principle**: In integration tests, use REAL implementations of the modules being tested. Only mock things that are truly external (network, file system, database, OS APIs).

---

## Integration Test Patterns

### Pattern 1 — Chain Test

Test a sequence of modules that pass data through a pipeline.

```
Module A produces output → Module B transforms it → Module C consumes it
```

Verify:
- Module A's output format matches Module B's expected input
- Module B's output format matches Module C's expected input
- The final result at Module C is correct given the initial input at Module A

**Example**: `ScreenCaptureService` captures image → `AnnotationCanvasView` adds markup → `ClipboardService` copies final image

### Pattern 2 — Event/Notification Test

Test that when Module A fires an event, Module B correctly responds.

Verify:
- The event is sent with correct data
- Module B receives the event
- Module B's state changes correctly in response

**Example**: `PurchaseService` completes purchase → `EntitlementsService` updates Pro status → `CapabilityService` unlocks features

### Pattern 3 — Shared State Test

Test that multiple modules reading/writing shared state stay in sync.

Verify:
- Module A writes state correctly
- Module B reads the updated state
- No race conditions or stale state

**Example**: `SettingsStore` saves hotkey config → `ShortcutManager` reads and registers the new hotkey

### Pattern 4 — Error Propagation Test

Test that when Module B fails, Module A handles the error correctly.

Verify:
- Module B's error is propagated to Module A
- Module A doesn't crash or enter an inconsistent state
- User-facing error handling (if any) is correct

**Example**: `StoreKit` returns purchase failure → `PurchaseService` handles error → `PaywallView` shows correct error message

---

## What to Mock vs What to Keep Real

### Keep REAL (the whole point is testing their interaction):
- The modules being tested
- Their internal logic and state
- Communication between them (delegates, callbacks, notifications, closures)

### Mock these (external to the interaction chain):
- Network calls (API requests, server responses)
- File system operations (reading/writing files)
- Database access
- OS-level APIs (ScreenCaptureKit, CGEventTap, etc.)
- Third-party services (StoreKit, Supabase, Firebase)
- System clock / dates (inject fixed dates)

### Mock Decision Tree (follow this order)

```
Q1: 这个依赖是你（团队）写的代码吗？
  └─ No  → Mock 它（第三方库、外部服务）
  └─ Yes → Q2

Q2: 这个模块是本次测试的交互链路中的一环吗？
  └─ No  → Mock 它（不在被测链路中的内部模块）
  └─ Yes → Q3

Q3: 使用真实实现会导致测试变慢（>5s）或不稳定吗？
  └─ No  → 使用真实实现 ✅
  └─ Yes → Mock 它，但必须记录原因：
           // MOCK REASON: [real impl takes 10s+ due to network call]
```

### Rule of thumb:
> If it's a module YOU wrote and it's part of the interaction being tested → use the REAL implementation.
> If it's external or would make the test slow/flaky → mock it.

---

## Test Naming Convention

Integration test names should describe the INTERACTION, not a single unit.

Swift naming (`test...`) examples:
- `test_captureManager_onCapture_clipboardService_receivesImage`
- `test_purchaseService_onSuccess_entitlementsService_unlocksPro`
- `test_settingsStore_onHotkeyChange_shortcutManager_registersNewKey`
- `test_purchaseService_onFailure_paywallView_showsErrorState`

JS/TS naming (`it/should...`) examples:
- `it("should pass captured image to clipboard service when capture completes", ...)`
- `it("should unlock pro in entitlements when purchase succeeds", ...)`
- `it("should register new hotkey when settings change", ...)`

---

## Test Structure

Integration tests follow an extended AAA pattern:

```
Arrange  → Set up ALL modules in the interaction chain
         → Mock only external dependencies
         → Configure initial state

Act      → Trigger the interaction from the entry point
         → Let the real modules communicate with each other

Assert   → Verify the END STATE of the interaction chain
         → Check intermediate states if the sequence matters
         → Verify no unexpected side effects
```

---

## Coverage Rules

For each module interaction chain, test:

### 1. Happy Path (required)
The normal flow — all modules cooperate successfully.

### 2. Error Propagation (required)
What happens when a module in the chain fails:
- Does the error propagate correctly?
- Do upstream modules handle it gracefully?
- Is shared state left in a consistent state?

### 3. Boundary Handoff (required)
Data format at module boundaries:
- Does Module A's output match Module B's expected input?
- What happens with edge-case data (empty, nil, maximum size)?

### 4. Timing / Order (when applicable)
If the interaction involves async operations or sequenced events:
- Do modules execute in the correct order?
- Are race conditions handled?
- Do callbacks/completions fire at the right time?

---

## Anti-Patterns to Avoid

| ❌ Anti-Pattern | ✅ Correct Approach |
|----------------|-------------------|
| Mock everything including modules under test | Only mock EXTERNAL dependencies |
| Test individual functions (that's a unit test) | Test the interaction between modules |
| Duplicate unit test scenarios | Focus on what ONLY integration can catch: contracts between modules |
| One giant test covering the entire app | Test one interaction chain per test |
| Ignore error propagation | Always test what happens when a module in the chain fails |
| No cleanup between tests | Reset shared state in setUp/tearDown to ensure independence |

---

## Prerequisite Gate (Mandatory)

Integration Tests 的前置条件：**相关 Unit Tests 必须全部通过**。

```
Before running integration tests:
  1. Check if related unit tests exist
  2. Run related unit tests first
  3. If ANY unit test fails → STOP, do NOT proceed to integration tests
  4. Report: "⚠️ Unit tests must pass before running integration tests.
              Failed: [list of failed unit tests]"
```

---

## Test Data & Fixtures Management

Integration tests 涉及多模块交互，测试数据管理规则：

1. **Fixtures 目录**：与 unit test fixtures 分开，放在 `Tests/IntegrationFixtures/` 或对应测试目录下的 `Fixtures/` 子目录
2. **数据隔离**：每个测试用例使用独立的测试数据，禁止多个测试共享可变 fixture
3. **工厂方法**：为常用测试对象创建 `make*()` 工厂方法，避免在每个测试中重复构造
4. **数据清理**：在 `tearDown` 中清理测试生成的所有数据（文件、UserDefaults、缓存等）

---

## Test Execution Workflow (Mandatory Gate)

When Tier 2 (Integration Test) is triggered per Global Rules:

```
Step 1 → Identify the modules involved in the completed feature
Step 2 → Map the interaction chains (A → B → C)
Step 3 → Check if integration test file exists
          - If YES → update existing tests
          - If NO  → create a new test file
Step 4 → Write tests covering happy path, error propagation, and boundary handoff
Step 5 → Execute tests in this strict order:
          5.1 Run affected chain only (smallest scope first)
          5.2 Expand by risk to wider scope (cross-module/async/core path)
Step 6 → Reporting format (fixed):
          🔗 Integration Tests: [X passed] / [Y total] | [modules tested]
          ❌ Failures: [brief description if any]
Step 7 → If any integration test fails:
          - STOP immediately
          - Report failures and suspected root cause
          - WAIT for user confirmation before making fixes
Step 8 → If tests were not executed, task is NOT complete
```

Mandatory rule: You must run integration test commands in terminal. Recommending commands without execution is not acceptable.

---

## File Organization

Integration test files should be clearly separated from unit tests:

- Name files to indicate which modules are being integrated
- Group by feature or interaction chain, not by individual module

Examples:
```
# Swift
CaptureToClipboardIntegrationTests.swift
PurchaseFlowIntegrationTests.swift
SettingsToShortcutIntegrationTests.swift

# TypeScript
capture-clipboard.integration.test.ts
purchase-flow.integration.test.ts
settings-shortcut.integration.test.ts
```

---

## Fixed Report Format

```text
🔗 Integration Tests: [X passed] / [Y total] | [modules tested]
❌ Failures: [brief description if any]
```
