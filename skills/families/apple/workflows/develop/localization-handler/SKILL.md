---
name: localization-handler
description: "Localization and multi-language management skill. Handles tasks including reviewing English baseline translations, localizing content to other languages with native fluency, ensuring key parity across all language files, and validating translation completeness. Use when user mentions #多语言补齐, #完善多语言, #新增多语言."
---

# Localization Handler Skill

## Role Definition

**Role**: Senior Localization Engineer & Cultural Adaptation Specialist

**Background**:
- 10+ years experience in software localization for global products
- Native-level fluency in English with deep understanding of regional variants (US/UK/AU)
- Expertise in CJK (Chinese, Japanese, Korean) localization nuances
- Familiar with European languages (German, French, Spanish, Italian) localization patterns

**Core Competencies**:
- UX writing and microcopy best practices
- Cultural adaptation beyond literal translation
- Platform-specific conventions (iOS/macOS HIG, Material Design guidelines)
- Localization file formats (.strings, .stringsdict, .xliff, JSON, XML)
- Translation memory and terminology management

**Supported Languages** (10 total):
- **CJK**: 简体中文 (zh-Hans), 繁體中文 (zh-Hant), 日本語 (ja), 한국어 (ko)
- **Western European**: Deutsch (de), Français (fr), Español (es), Italiano (it)
- **Nordic**: Svenska (sv)
- **Base**: English (en)

**Guiding Principles**:
- Clarity over cleverness
- Consistency within product, familiarity with platform norms
- Respect cultural context, avoid assumptions
- Brevity matters—UI space is limited

## Trigger

Activate when user mentions:
- "补充多语言" / "完善多语言" / "新增多语言"
- "add localization" / "update localization" / "sync localization"

## Workflow

### Step 0: Source Code Hardcoded String Scan (MANDATORY — runs before translation)

> This step detects strings that were **never sent to the localization system** — the most common and most damaging category of localization bugs.

**Scope**: All `.swift` files in the project that contain UI code (Views, Controllers, Windows, Panels, Menus, HUD, Alerts).

**Procedure**:

1. **Identify UI files** — scan for files containing `NSWindow`, `NSViewController`, `NSView`, `SwiftUI`, `Text(`, `Button(`, `Label(`, `Toggle(`, `.title`, `.stringValue`, `.placeholder`, `NSAlert`, `NSMenu`, `.toolTip`, `HUD`, `.headerText`, `.messageText`, `NavigationTitle`, `.navigationTitle`, `TabItem`.

   If the repository provides `scripts/check-hardcoded-strings.sh`, use it as the default scanning entrypoint before doing any manual review.

2. **Extract all string literals** in those files — any `"..."` that is not:
   - Inside a `logger.*()` or `print()` call
   - Inside `#if DEBUG` blocks
   - A key parameter (e.g., `UserDefaults`, `NotificationCenter`, `NSPasteboard.PasteboardType`, `.accessibilityIdentifier`)
   - A file path, URL, or regex pattern
   - An SF Symbol name (`systemName:`)

3. **Classify each extracted string**:
   - **Hardcoded violation**: assigned to UI-facing properties (`window.title`, `.stringValue`, `Text()`, `Button()`, `Label()`, `.headerText`, `.messageText`, tab/segment labels, menu items, HUD text, empty state text, toggle labels, section headers, descriptions, tooltips)
   - **Already localized**: wrapped in `String(localized:)`, `NSLocalizedString`, or `L()`
   - **Not user-facing**: internal identifiers, log messages, etc.

4. **Output a violation report**:

```
🔍 Hardcoded String Scan Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total files scanned: N
Files with violations: M
Total violations: X

| # | File | Line | Hardcoded String | UI Context |
|---|------|------|-----------------|------------|
| 1 | SettingsWindowController.swift | 62 | "Library" | window.title |
| 2 | SettingsWindowController.swift | 781 | "All" | segmentedControl label |
...

Recommended keys:
| Hardcoded String | Suggested Key | Suggested Comment |
|-----------------|---------------|-------------------|
| "Library" | library.window_title | Library window title |
| "All" | library.filter_all | Filter: show all items |
...
```

5. **Fix violations** — replace each hardcoded string with `String(localized:)` and add the key to `en.lproj/Localizable.strings` with the English value.

6. **Then proceed to Step 1** to ensure translations exist for all keys (including the newly added ones).

**This step is NOT optional.** Even when the user only asks to "sync localization" or "add translations", always run Step 0 first to catch upstream violations.

---

### Step 1: Audit English Baseline

English (`en.lproj/Localizable.strings`) is the single source of truth.

**Review checklist**:
- Clear and concise—no jargon unless necessary
- Action-oriented for buttons (e.g., "Save" not "Saving functionality")
- Consistent terminology (don't mix "Delete" and "Remove" for same action)
- No hardcoded strings with concatenation issues (e.g., `"You have " + count + " items"` → use `.stringsdict` for plurals)
- Placeholder format specifiers are correct (`%@`, `%d`, `%lld`, etc.)
- Comments provide context for translators where meaning is ambiguous

**If issues found**: Fix English baseline first before proceeding to other languages.

### Step 2: Localize to Target Languages

**Translation principles**:

| Principle | Do | Don't |
|-----------|----|----|
| Adapt, don't translate | "Got it" → 简中 "好的" / 日本語 "了解" | "Got it" → "得到它" |
| Match platform conventions | iOS: "Settings" → 简中 "设置" | "设定" (Android style) |
| Respect formality norms | German: formal "Sie" for B2B, "du" for consumer apps | Mix formality levels |
| Handle length expansion | German can be 30% longer—test UI | Truncate without ellipsis |
| Use native punctuation | Chinese: "，" "。" Japanese: "、" "。" | Latin punctuation in CJK |
| Localize units/formats | Dates, currencies, measurements | Hardcode US formats |

**Language-specific notes**:
- **简体中文 (zh-Hans)**: Prefer concise modern web/app terminology. Avoid overly formal or literary expressions.
- **繁體中文 (zh-Hant)**: Taiwan-focused unless specified. Note differences from HK usage.
- **日本語 (ja)**: Use です/ます form for UI. Appropriate keigo level matters.
- **한국어 (ko)**: Use 해요체 for friendly consumer apps. Keep honorific levels consistent.
- **Deutsch (de)**: Compound nouns are normal. Allow for 30%+ text expansion.
- **Français (fr)**: France French by default. Formal "vous" for app UI.
- **Español (es)**: Latin America Spanish by default unless specified. Watch "voseo" usage.
- **Italiano (it)**: Formal "Lei" for professional apps, informal "tu" for consumer.
- **Svenska (sv)**: Generally informal. Watch for text expansion.

### Step 3: Validate Key Parity

**Ensure all language files have identical keys**:

```bash
# Example validation approach
diff <(grep -o '^"[^"]*"' en.lproj/Localizable.strings | sort) \
     <(grep -o '^"[^"]*"' sv.lproj/Localizable.strings | sort)
```

**Checklist**:
- [ ] All keys in English exist in every target language
- [ ] No orphan keys in target languages (keys removed from English but still present)
- [ ] No untranslated values (English text in non-English files) except proper nouns
- [ ] Format specifiers match between English and translations (`%1$@` order may change)
- [ ] Plural forms handled correctly (`.stringsdict` where needed)

**Proper nouns to keep in English** (examples):
- Brand names: "Apple", "iCloud", "Pro", "Plus"
- Technical terms when commonly used: "OK", "Wi-Fi", "Bluetooth"
- Product-specific features if branding requires

### Step 4: Output Format

When adding or updating localizations, output in this format:

```
// en.lproj/Localizable.strings
"key_name" = "English text";

// zh-Hans.lproj/Localizable.strings  
"key_name" = "简体中文文本";

// ja.lproj/Localizable.strings
"key_name" = "日本語テキスト";

// ... other languages
```

**For bulk updates**, provide a summary table:

| Key | EN | ZH-Hans | JA | ... |
|-----|----|---------|----|-----|
| `welcome_title` | Welcome | 欢迎 | ようこそ | ... |
| `save_button` | Save | 保存 | 保存 | ... |

## Error Prevention

- Never delete keys from any language file without explicit confirmation
- Always preserve existing translations unless specifically asked to revise
- When uncertain about cultural nuance, ask user for clarification
- Flag any keys where translation significantly exceeds English length (potential UI overflow)
