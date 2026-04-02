---
name: systematic-debugging
description: Use when encountering any bug, test failure, or unexpected behavior, before proposing fixes. Use when user mentions "#定位根因", "#根本原因".
---

# Systematic Debugging

## Overview

Random fixes waste time and create new bugs. Quick patches mask underlying issues.

**Core principle:** ALWAYS find root cause before attempting fixes. Symptom fixes are failure.

**Violating the letter of this process is violating the spirit of debugging.**

## The Iron Law

```
NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST
```

If you haven't completed Phase 1, you cannot propose fixes.

## When to Use

Use for ANY technical issue:
- Test failures
- Bugs in production
- Unexpected behavior
- Performance problems
- Build failures
- Integration issues

**Use this ESPECIALLY when:**
- Under time pressure (emergencies make guessing tempting)
- "Just one quick fix" seems obvious
- You've already tried multiple fixes
- Previous fix didn't work
- You don't fully understand the issue

**Don't skip when:**
- Issue seems simple (simple bugs have root causes too)
- You're in a hurry (rushing guarantees rework)
- Manager wants it fixed NOW (systematic is faster than thrashing)

## The Four Phases

You MUST complete each phase before proceeding to the next.

### Phase 1: Root Cause Investigation

**BEFORE attempting ANY fix:**

1. **Read Error Messages Carefully**
   - Don't skip past errors or warnings
   - They often contain the exact solution
   - Read stack traces completely
   - Note line numbers, file paths, error codes

2. **Reproduce Consistently**
   - Can you trigger it reliably?
   - What are the exact steps?
   - Does it happen every time?
   - If not reproducible → gather more data, don't guess

3. **Check Recent Changes**
   - What changed that could cause this?
   - Git diff, recent commits
   - New dependencies, config changes
   - Environmental differences

4. **Gather Evidence in Multi-Component Systems**

   **WHEN system has multiple components (CI → build → signing, API → service → database):**

   **BEFORE proposing fixes, add diagnostic instrumentation:**
   ```
   For EACH component boundary:
     - Log what data enters component
     - Log what data exits component
     - Verify environment/config propagation
     - Check state at each layer

   Run once to gather evidence showing WHERE it breaks
   THEN analyze evidence to identify failing component
   THEN investigate that specific component
   ```

   **Example (multi-layer system):**
   ```bash
   # Layer 1: Workflow
   echo "=== Secrets available in workflow: ==="
   echo "IDENTITY: ${IDENTITY:+SET}${IDENTITY:-UNSET}"

   # Layer 2: Build script
   echo "=== Env vars in build script: ==="
   env | grep IDENTITY || echo "IDENTITY not in environment"

   # Layer 3: Signing script
   echo "=== Keychain state: ==="
   security list-keychains
   security find-identity -v

   # Layer 4: Actual signing
   codesign --sign "$IDENTITY" --verbose=4 "$APP"
   ```

   **This reveals:** Which layer fails (secrets → workflow ✓, workflow → build ✗)

5. **Gather Evidence for UI Rendering Issues**

   **WHEN symptom is "UI element not showing / not covering / visually wrong":**

   You MUST verify from outermost container inward, all the way to the rendering layer:

   | Layer | What to Verify |
   |-------|---------------|
   | **L1: Container boundary** | Is the target canvas (screen / viewport) the expected size and position? |
   | **L2: Window / Document** | Does the window or root document fill the target container? |
   | **L3: Element geometry** | Does the target element's position and size match expectations? |
   | **L4: Actual rendering** | Is the element actually drawing pixels? |

   **Critical rules:**
   - L1-L3 correct does NOT mean the issue is resolved — you MUST verify L4
   - L4 verification MUST use runtime data, not code reading
   - "Geometry is correct" and "pixels are visible" are two independent facts

   **L4 common traps by platform:**

   | Platform | Typical L4 Failures |
   |----------|-------------------|
   | **macOS (AppKit)** | `layer?.property` optional chaining silently skips assignment when layer is nil; `NSVisualEffectView` falls back to opaque when `reduceTransparency` is enabled |
   | **iOS (UIKit)** | `isHidden = true`, `alpha = 0`, `backgroundColor = .clear` with no drawing subviews; parent `clipsToBounds` silently clips children |
   | **Web (CSS/DOM)** | `display: none`, `visibility: hidden`, `opacity: 0`; ancestor `overflow: hidden` clips content; `z-index` stacking context buries element |
   | **Browser Extension** | `content_scripts.matches` doesn't match current URL; host page CSS overrides injected styles; Shadow DOM isolation not applied; `z-index` buried under host page elements |

   **Coordinate system traps (cross-display / cross-frame):**
   - AppKit uses bottom-left origin (Y up); CG Screen Space uses top-left origin (Y down) — never pass AppKit rects directly to CG APIs
   - Web `iframe` elements have their own coordinate space — `getBoundingClientRect()` is relative to the iframe, not the parent document
   - iOS `UIScreen.coordinateSpace` vs `UIWindow.coordinateSpace` — convert explicitly when working across displays

6. **Trace Data Flow**

   **WHEN error is deep in call stack:**

   See `.agents/skills/shared/assets/develop/systematic-debugging/root-cause-tracing.md` for the complete backward tracing technique.

   **Quick version:**
   - Where does bad value originate?
   - What called this with bad value?
   - Keep tracing up until you find the source
   - Fix at source, not at symptom

### Phase 2: Pattern Analysis

**Find the pattern before fixing:**

1. **Find Working Examples**
   - Locate similar working code in same codebase
   - What works that's similar to what's broken?

2. **Compare Against References**
   - If implementing pattern, read reference implementation COMPLETELY
   - Don't skim - read every line
   - Understand the pattern fully before applying

3. **Identify Differences**
   - What's different between working and broken?
   - List every difference, however small
   - Don't assume "that can't matter"

4. **Understand Dependencies**
   - What other components does this need?
   - What settings, config, environment?
   - What assumptions does it make?

### Phase 3: Hypothesis and Testing

**Scientific method:**

1. **Form Single Hypothesis**
   - State clearly: "I think X is the root cause because Y"
   - Write it down
   - Be specific, not vague

2. **Test Minimally**
   - Make the SMALLEST possible change to test hypothesis
   - One variable at a time
   - Don't fix multiple things at once

3. **Verify Before Continuing**
   - Did it work? Yes → Phase 4
   - Didn't work? Form NEW hypothesis
   - DON'T add more fixes on top

4. **When You Don't Know**
   - Say "I don't understand X"
   - Don't pretend to know
   - Ask for help
   - Research more

### Hard Gate: Fix #1 Fail Recovery

**If your first fix attempt did NOT resolve the issue, you MUST complete both gates below before attempting Fix #2. No exceptions. Confidence is not evidence.**

```
Fix #1 failed
     │
     ▼
Gate B — Explain: Describe the system in structured form (ASCII / layer diagram / step flow).
     │             Cover EVERY component from input to output.
     │
     ├─ Description is self-consistent → proceed to Gate A with full-scope diagnostics
     │
     └─ Contradiction found ("X should cover everything, but user sees gap")
              │               → the contradiction IS your diagnostic target
              ▼
        Gate A — Measure: Add runtime diagnostics AT the contradiction point.
              │            Run. Read data. Do NOT guess what data will show.
              ▼
        Data reveals root cause → proceed to Fix #2 (evidence-based)
```

**Why this order:**
- Gate B (Explain) produces the **question** — where does your model contradict observed behavior?
- Gate A (Measure) produces the **answer** — runtime data at the contradiction point.
- Without Gate B first, you don't know WHERE to add diagnostics. You'll measure the wrong thing and stay stuck.

**Why this gate exists:**
- A hypothesis that "feels right" triggers the same internal signal as a verified root cause — both say "I know what's wrong."
- The only way to distinguish them is external evidence: runtime data that confirms or refutes.
- This gate forces evidence collection even when you feel confident. Especially when you feel confident.

### Phase 4: Implementation

**Fix the root cause, not the symptom:**

1. **Create Failing Test Case**
   - Simplest possible reproduction
   - Automated test if possible
   - One-off test script if no framework
   - MUST have before fixing
   - Use the `superpowers:test-driven-development` skill for writing proper failing tests

2. **Implement Single Fix**
   - Address the root cause identified
   - ONE change at a time
   - No "while I'm here" improvements
   - No bundled refactoring

   **High-risk change isolation rule:** When a fix touches multiple independent dimensions (e.g., window level + collection behavior + frame constraint override), each dimension MUST be changed and tested separately. Bundling independent changes into one fix means: regression → can't isolate which dimension caused it → forced to revert ALL → lose the dimensions that were actually correct.

3. **Verify Fix**
   - Test passes now?
   - No other tests broken?
   - Issue actually resolved?

4. **If Fix Doesn't Work**
   - STOP
   - Count: How many fixes have you tried?
   - If < 3: Return to Phase 1, re-analyze with new information
   - **If ≥ 3: STOP and question the architecture (step 5 below)**
   - DON'T attempt Fix #4 without architectural discussion

5. **If 3+ Fixes Failed: Question Architecture**

   **Pattern indicating architectural problem:**
   - Each fix reveals new shared state/coupling/problem in different place
   - Fixes require "massive refactoring" to implement
   - Each fix creates new symptoms elsewhere

   **STOP and question fundamentals:**
   - Is this pattern fundamentally sound?
   - Are we "sticking with it through sheer inertia"?
   - Should we refactor architecture vs. continue fixing symptoms?

   **Discuss with your human partner before attempting more fixes**

   This is NOT a failed hypothesis - this is a wrong architecture.

## Red Flags - STOP and Follow Process

If you catch yourself thinking:
- "Quick fix for now, investigate later"
- "Just try changing X and see if it works"
- "Add multiple changes, run tests"
- "Skip the test, I'll manually verify"
- "It's probably X, let me fix that"
- "I don't fully understand but this might work"
- "Pattern says X but I'll adapt it differently"
- "Here are the main problems: [lists fixes without investigation]"
- Proposing solutions before tracing data flow
- **"One more fix attempt" (when already tried 2+)**
- **Each fix reveals new problem in different place**

**ALL of these mean: STOP. Return to Phase 1.**

**If 3+ fixes failed:** Question the architecture (see Phase 4.5)

## your human partner's Signals You're Doing It Wrong

**Watch for these redirections:**
- "Is that not happening?" - You assumed without verifying
- "Will it show us...?" - You should have added evidence gathering
- "Stop guessing" - You're proposing fixes without understanding
- "Ultrathink this" - Question fundamentals, not just symptoms
- "We're stuck?" (frustrated) - Your approach isn't working

**When you see these:** STOP. Return to Phase 1.

## Common Rationalizations

| Excuse | Reality |
|--------|---------|
| "Issue is simple, don't need process" | Simple issues have root causes too. Process is fast for simple bugs. |
| "Emergency, no time for process" | Systematic debugging is FASTER than guess-and-check thrashing. |
| "Just try this first, then investigate" | First fix sets the pattern. Do it right from the start. |
| "I'll write test after confirming fix works" | Untested fixes don't stick. Test first proves it. |
| "Multiple fixes at once saves time" | Can't isolate what worked. Causes new bugs. |
| "Reference too long, I'll adapt the pattern" | Partial understanding guarantees bugs. Read it completely. |
| "I see the problem, let me fix it" | Seeing symptoms ≠ understanding root cause. |
| "I read the code and traced the logic — I know the cause" | A hypothesis from code reading is NOT evidence. Runtime data is evidence. Confidence is not proof. |
| "One more fix attempt" (after 2+ failures) | 3+ failures = architectural problem. Question pattern, don't fix again. |

## Quick Reference

| Phase | Key Activities | Success Criteria |
|-------|---------------|------------------|
| **1. Root Cause** | Read errors, reproduce, check changes, gather evidence | Understand WHAT and WHY |
| **2. Pattern** | Find working examples, compare | Identify differences |
| **3. Hypothesis** | Form theory, test minimally | Confirmed or new hypothesis |
| **Hard Gate** | If Fix #1 fails: Explain system (find contradiction) → Measure at contradiction point | Have runtime data disproving or confirming hypothesis |
| **4. Implementation** | Create test, fix, verify | Bug resolved, tests pass |

## When Process Reveals "No Root Cause"

If systematic investigation reveals issue is truly environmental, timing-dependent, or external:

1. You've completed the process
2. Document what you investigated
3. Implement appropriate handling (retry, timeout, error message)
4. Add monitoring/logging for future investigation

**But:** 95% of "no root cause" cases are incomplete investigation.

## Supporting Techniques

These techniques are part of systematic debugging and available in shared assets:

- **`.agents/skills/shared/assets/develop/systematic-debugging/root-cause-tracing.md`** - Trace bugs backward through call stack to find original trigger
- **`.agents/skills/shared/assets/develop/systematic-debugging/defense-in-depth.md`** - Add validation at multiple layers after finding root cause
- **`.agents/skills/shared/assets/develop/systematic-debugging/condition-based-waiting.md`** - Replace arbitrary timeouts with condition polling

**Related skills:**
- **superpowers:test-driven-development** - For creating failing test case (Phase 4, Step 1)
- **superpowers:verification-before-completion** - Verify fix worked before claiming success

## Real-World Impact

From debugging sessions:
- Systematic approach: 15-30 minutes to fix
- Random fixes approach: 2-3 hours of thrashing
- First-time fix rate: 95% vs 40%
- New bugs introduced: Near zero vs common
