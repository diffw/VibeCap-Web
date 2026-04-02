---
name: 01-unit-test
description: Defines unit test methodology, standards, and coverage rules. Applies when writing or modifying any function, method, or class. Must be used together with the current platform's testing adapter. Apple projects currently use `.agents/skills/families/apple/adapters/testing/swift-xcode/unit.md`. Use when Tier 1 (Unit Test) is triggered per Global Rules.
---

# Unit Test

 ⚠️ When executing this skill, you MUST also load the current platform's testing adapter. Apple projects currently use `.agents/skills/families/apple/adapters/testing/swift-xcode/unit.md`. If the required adapter does not exist, prompt the user: "No unit test adapter found. Should I run the toolchain generator first?"

---

## What Is a Unit Test

A unit test verifies the SMALLEST testable piece of code in isolation — a single function, method, or class. It answers one question: **"Does this one piece, by itself, do what it's supposed to do?"**

- ✅ Test ONE function's logic
- ✅ Test ONE method's return value
- ✅ Test ONE class's behavior
- ❌ NOT how multiple modules work together (that's integration test)
- ❌ NOT how UI looks or behaves (that's UI test)
- ❌ NOT a full user workflow (that's E2E test)

---

## Test Naming Convention

Swift naming (`test...`) examples:
- `test_cropImage_withValidRect_returnsCorrectSize`
- `test_cropImage_withZeroRect_returnsNil`
- `test_cropImage_withRectExceedingBounds_clampsToImageBounds`
- `test_generateFileName_withCurrentDate_returnsFormattedString`

JS/TS naming (`it/should...`) examples:
- `it("should return correct size when rect is valid", ...)`
- `it("should return null when rect is zero", ...)`
- `it("should clamp to image bounds when rect exceeds bounds", ...)`

---

## Test Coverage Rules (Risk-Driven)

For EVERY function/method, create tests covering these categories:

### 1. Happy Path (required — always write this)
The normal, expected usage. Valid inputs → expected output.

### 2. Edge Cases (required — always write this)
Boundary conditions and special values:
- Empty inputs: `""`, `[]`, `nil`, `null`, `undefined`, `0`
- Boundary values: max int, min int, maximum allowed length
- Single element: array with one item, string with one character
- Exact boundary: if limit is 100, test 99, 100, 101

### 3. Error Cases (required when failure paths exist)
Invalid inputs and failure scenarios:
- Invalid arguments: wrong type, out of range, malformed data
- Missing dependencies: nil/null references, unavailable services
- Expected throws: verify the correct error type is thrown

### 4. State Transitions (required for stateful objects)
If the function changes state:
- Verify state BEFORE the action
- Execute the action
- Verify state AFTER the action
- Verify the transition sequence if order matters

---

## The AAA Pattern

Every test MUST follow this structure:

```
Arrange  → Set up test data, create mocks, configure preconditions
Act      → Execute the ONE function/action being tested
Assert   → Verify the expected outcome
```

Rules:
- ONE act per test. If you need two "Act" steps, split into two tests.
- Arrange can be shared via setUp/beforeEach for common setup.
- Assert should verify ONE logical behavior (multiple related assertions for the same behavior are OK).

---

## Isolation Principles

Unit tests MUST be isolated. The unit under test should NOT depend on:
- Network calls
- File system operations
- Database access
- Other modules' real implementations
- System time / dates
- User defaults / storage

How to isolate: use mocks, stubs, or fakes. The specific mock patterns and syntax are defined in the current platform adapter (Apple today: `.agents/skills/families/apple/adapters/testing/swift-xcode/unit.md`).

### Rule: If you can't isolate it, flag it
If a function is tightly coupled and hard to test in isolation, report:
```
⚠️ [functionName] is tightly coupled to [dependency].
   Recommend: Extract a protocol/interface for [dependency] to enable testability.
   Want me to refactor?
```

---

## Coverage Threshold (Mandatory)

| 指标 | 最低要求 | 核心模块要求 |
|------|---------|------------|
| 行覆盖率 | 80% | 90%+ |
| 分支覆盖率 | 70% | 85%+ |

核心模块定义：涉及收入（IAP/订阅）、数据完整性、安全性的模块。

执行覆盖率检查：
```
Step 1 → 运行测试并生成覆盖率报告（具体命令见 toolchain 配置）
Step 2 → 对比变更前后覆盖率
Step 3 → 如果覆盖率下降，报告：
          ⚠️ Coverage decreased: [module] [before]% → [after]%
          Uncovered lines: [file:line ranges]
          Want me to add tests to restore coverage?
```

---

## What NOT to Unit Test

- **Trivial getters/setters** with no logic
- **Direct UI layout code** (use UI/Snapshot tests instead)
- **Third-party library functions** (trust their own tests; mock them)
- **Declarative UI view bodies** (SwiftUI views, React JSX without logic — test the underlying logic/state instead)
- **Simple type aliases or constants**

When in doubt, ask: **"Can this break in a way that a unit test would catch?"** If no, skip it.

---

## Anti-Patterns to Avoid

| ❌ Anti-Pattern | ✅ Correct Approach |
|----------------|-------------------|
| Test depends on another test's result | Each test is completely independent |
| Test uses real network/file system | Mock all external dependencies |
| Test name is `test1`, `testA`, `testStuff` | Name describes what/when/then |
| One test checks 5 different things | One test = one behavior = one assertion focus |
| Test only checks happy path | Always include edge + error cases |
| Duplicated setup code in every test | Use setUp / beforeEach for shared setup |
| Test mirrors implementation line by line | Test the BEHAVIOR, not the implementation |

---

## Test Data & Fixtures Management

1. **Fixtures 目录**：测试数据文件统一放在测试目录下的 `Fixtures/` 子目录（具体路径见 toolchain 配置）
2. **内联数据优先**：简单测试数据直接在测试代码中构造，不必创建 fixture 文件
3. **工厂方法**：为频繁使用的复杂测试对象创建 `make*()` / `create*()` 工厂方法或 Builder
4. **数据不可变**：fixture 文件应为只读，测试不应修改 fixture 源文件
5. **最小化数据**：每个测试只使用验证该行为所需的最小数据集，避免"万能 fixture"

---

## Test Execution Workflow

When Tier 1 (Unit Test) is triggered per Global Rules:

```
Step 1 → Identify the unit(s) you just created or modified
Step 2 → Check if test file exists for this unit
          - If YES → update existing tests to cover your changes
          - If NO  → create a new test file following platform conventions
                      (see the current platform adapter, e.g. `.agents/skills/families/apple/adapters/testing/swift-xcode/unit.md`)
Step 3 → Write tests covering all 4 categories (happy, edge, error, state)
Step 4 → Run ONLY the relevant unit tests (not the entire suite by default)
Step 5 → If any unit test fails:
          - STOP immediately
          - Report failure details and likely root cause
          - WAIT for user confirmation before fixing
Step 6 → Report results using fixed format:
          ✅ Unit Tests: [X passed] / [Y total] | [module/file name]
          ❌ Failures: [brief description if any]
Step 7 → If tests were not executed, task is NOT complete
```

Mandatory rule: After modifying any function/method/class, you must execute related unit tests in terminal. Recommending commands without execution is not acceptable.
