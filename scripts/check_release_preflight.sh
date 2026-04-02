#!/usr/bin/env bash
set -euo pipefail

PROJECT_ROOT="${1:-$(pwd)}"

if [ ! -d "$PROJECT_ROOT" ]; then
  echo "Error: project root not found: $PROJECT_ROOT" >&2
  exit 2
fi

python3 - "$PROJECT_ROOT" <<'PY'
import json
import pathlib
import sys

project_root = pathlib.Path(sys.argv[1])
fastlane_dir = project_root / "fastlane"
metadata_dir = fastlane_dir / "metadata"
fastfile = fastlane_dir / "Fastfile"
markets_file = project_root / ".agents" / "appstore-markets.json"
reviewed_locales_file = metadata_dir / "reviewed-locales.json"

required_files = [
    "name.txt",
    "subtitle.txt",
    "keywords.txt",
    "description.txt",
    "promotional_text.txt",
    "release_notes.txt",
]

limits = {
    "name.txt": 30,
    "subtitle.txt": 30,
    "keywords.txt": 100,
    "promotional_text.txt": 170,
    "description.txt": 4000,
    "release_notes.txt": 4000,
}


def fail(msg):
    print(f"RELEASE PREFLIGHT FAIL: {msg}", file=sys.stderr)
    raise SystemExit(1)


if not fastfile.exists():
    fail("missing fastlane/Fastfile")

if not metadata_dir.exists():
    fail("missing fastlane/metadata directory")

locale_dirs = sorted([p for p in metadata_dir.iterdir() if p.is_dir()])
if not locale_dirs:
    fail("no locale directories found under fastlane/metadata")

locale_names = [p.name for p in locale_dirs]

for locale_dir in locale_dirs:
    for req in required_files:
        req_path = locale_dir / req
        if not req_path.exists():
            fail(f"missing {req} in locale `{locale_dir.name}`")
        content = req_path.read_text(encoding="utf-8").strip()
        if len(content) > limits[req]:
            fail(f"{locale_dir.name}/{req} exceeds limit {limits[req]}")

if markets_file.exists():
    data = json.loads(markets_file.read_text(encoding="utf-8"))
    if isinstance(data, list):
        expected_locales = data
    elif isinstance(data, dict) and isinstance(data.get("markets"), list):
        expected_locales = []
        for item in data["markets"]:
            if isinstance(item, str):
                expected_locales.append(item)
            elif isinstance(item, dict):
                expected_locales.append(item.get("locale") or item.get("id") or item.get("market"))
    else:
        fail("unsupported .agents/appstore-markets.json format")

    missing_locales = [loc for loc in expected_locales if loc and loc not in locale_names]
    if missing_locales:
        fail(f"metadata locale missing for markets: {', '.join(missing_locales)}")

needs_review = [loc for loc in ("zh-Hans", "zh-Hant") if loc in locale_names]
if needs_review:
    if not reviewed_locales_file.exists():
        fail("missing fastlane/metadata/reviewed-locales.json for Chinese locales")
    reviewed = json.loads(reviewed_locales_file.read_text(encoding="utf-8"))
    if not isinstance(reviewed, list):
        fail("reviewed-locales.json must be a JSON array")
    missing_reviews = [loc for loc in needs_review if loc not in reviewed]
    if missing_reviews:
        fail(f"Chinese locales missing explicit review: {', '.join(missing_reviews)}")

print("RELEASE PREFLIGHT PASS")
print(f"- locales: {', '.join(locale_names)}")
print(f"- markets file: {'present' if markets_file.exists() else 'absent'}")
print(f"- Chinese review: {'required and satisfied' if needs_review else 'not required'}")
PY
