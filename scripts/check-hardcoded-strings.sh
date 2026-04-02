#!/bin/bash
# check-hardcoded-strings.sh
# Scans Swift UI files for hardcoded user-facing strings that bypass localization.
#
# Usage:
#   ./scripts/check-hardcoded-strings.sh [file1.swift file2.swift ...]
#   If no files specified, scans all staged .swift files (pre-commit mode).
#
# Exit codes:
#   0 — no violations found
#   1 — violations found (blocks commit/merge)

set -euo pipefail

RED='\033[0;31m'
YELLOW='\033[0;33m'
GREEN='\033[0;32m'
BOLD='\033[1m'
NC='\033[0m'

# Collect files to scan
if [ $# -gt 0 ]; then
    FILES=("$@")
else
    # Pre-commit mode: scan staged Swift files
    mapfile -t FILES < <(git diff --cached --name-only --diff-filter=ACM -- '*.swift' 2>/dev/null || true)
fi

if [ ${#FILES[@]} -eq 0 ]; then
    echo -e "${GREEN}No Swift files to check.${NC}"
    exit 0
fi

VIOLATIONS=()
VIOLATION_COUNT=0

# Patterns that indicate a string is assigned to a UI-facing property
# Each pattern is: <regex> <description>
UI_PATTERNS=(
    'window\.title\s*=\s*"[^"]+"|Window title'
    '\.stringValue\s*=\s*"[^"]+"|.stringValue assignment'
    '\.placeholderString\s*=\s*"[^"]+"|Placeholder string'
    '\.title\s*=\s*"[^"]+"|.title assignment'
    '\.headerText\s*=\s*"[^"]+"|Alert header text'
    '\.messageText\s*=\s*"[^"]+"|Alert message text'
    '\.informativeText\s*=\s*"[^"]+"|Alert informative text'
    '\.toolTip\s*=\s*"[^"]+"|Tooltip'
    'setLabel\(\s*"[^"]+"|Segment/tab label'
    'addItem\(withTitle:\s*"[^"]+"|Menu item title'
    'NSMenuItem\(title:\s*"[^"]+"|NSMenuItem title'
)

# SwiftUI patterns — string directly inside view initializer
SWIFTUI_PATTERNS=(
    'Text\(\s*"[^"]+"\s*\)|Text with bare string'
    'Button\(\s*"[^"]+"|Button with bare string'
    'Label\(\s*"[^"]+"|Label with bare string'
    'Toggle\(\s*"[^"]+"|Toggle with bare string'
    'NavigationTitle\(\s*"[^"]+"|NavigationTitle with bare string'
    '\.navigationTitle\(\s*"[^"]+"|.navigationTitle with bare string'
    'Section\(\s*"[^"]+"|Section header with bare string'
    '\.confirmationDialog\(\s*"[^"]+"|Confirmation dialog title'
    '\.alert\(\s*"[^"]+"|Alert title'
    'TabItem\(\s*"[^"]+"|Tab item label'
)

# Strings that are OK to hardcode (not violations)
is_excluded() {
    local line="$1"
    # Already localized
    [[ "$line" =~ String\(localized: ]] && return 0
    [[ "$line" =~ NSLocalizedString ]] && return 0
    [[ "$line" =~ L\( ]] && return 0
    # Logger / print
    [[ "$line" =~ logger\. ]] && return 0
    [[ "$line" =~ Logger\. ]] && return 0
    [[ "$line" =~ print\( ]] && return 0
    # Debug
    [[ "$line" =~ \#if\ DEBUG ]] && return 0
    # Identifiers
    [[ "$line" =~ accessibilityIdentifier ]] && return 0
    [[ "$line" =~ UserDefaults ]] && return 0
    [[ "$line" =~ NotificationCenter ]] && return 0
    [[ "$line" =~ systemName: ]] && return 0
    # Comments
    [[ "$line" =~ ^[[:space:]]*//.* ]] && return 0
    return 1
}

for file in "${FILES[@]}"; do
    [ -f "$file" ] || continue

    line_num=0
    while IFS= read -r line; do
        line_num=$((line_num + 1))

        # Skip excluded lines
        if is_excluded "$line"; then
            continue
        fi

        # Check AppKit patterns
        for pattern_pair in "${UI_PATTERNS[@]}"; do
            pattern="${pattern_pair%%|*}"
            desc="${pattern_pair##*|}"
            if echo "$line" | grep -qE "$pattern"; then
                VIOLATIONS+=("${file}:${line_num}|${desc}|$(echo "$line" | sed 's/^[[:space:]]*//')")
                VIOLATION_COUNT=$((VIOLATION_COUNT + 1))
            fi
        done

        # Check SwiftUI patterns
        for pattern_pair in "${SWIFTUI_PATTERNS[@]}"; do
            pattern="${pattern_pair%%|*}"
            desc="${pattern_pair##*|}"
            if echo "$line" | grep -qE "$pattern"; then
                VIOLATIONS+=("${file}:${line_num}|${desc}|$(echo "$line" | sed 's/^[[:space:]]*//')")
                VIOLATION_COUNT=$((VIOLATION_COUNT + 1))
            fi
        done

    done < "$file"
done

# Report
if [ $VIOLATION_COUNT -eq 0 ]; then
    echo -e "${GREEN}${BOLD}✅ No hardcoded UI strings found.${NC} (scanned ${#FILES[@]} files)"
    exit 0
else
    echo ""
    echo -e "${RED}${BOLD}🚫 Found ${VIOLATION_COUNT} hardcoded UI string violation(s):${NC}"
    echo ""
    for v in "${VIOLATIONS[@]}"; do
        location="${v%%|*}"
        rest="${v#*|}"
        desc="${rest%%|*}"
        code="${rest#*|}"
        echo -e "  ${RED}${location}${NC} — ${YELLOW}${desc}${NC}"
        echo -e "    ${code}"
        echo ""
    done
    echo -e "${BOLD}Fix: Wrap each string with String(localized: \"key\", comment: \"context\") and add the key to all .lproj/Localizable.strings files.${NC}"
    echo ""
    exit 1
fi
