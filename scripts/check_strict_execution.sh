#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TASK_DIR="${1:-}"
POLICY_FILE="${2:-$SCRIPT_DIR/strict_execution_policy.json}"

if [ -z "$TASK_DIR" ]; then
  echo "Usage: $0 <task-dir> [policy-file]" >&2
  exit 2
fi

if [ ! -d "$TASK_DIR" ]; then
  echo "Error: task directory not found: $TASK_DIR" >&2
  exit 2
fi

if [ ! -f "$POLICY_FILE" ]; then
  echo "Error: policy file not found: $POLICY_FILE" >&2
  exit 2
fi

python3 - "$TASK_DIR" "$POLICY_FILE" <<'PY'
import datetime as dt
import json
import pathlib
import sys


def load_json(path: pathlib.Path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        raise SystemExit(f"missing file: {path}")
    except json.JSONDecodeError as exc:
        raise SystemExit(f"invalid json in {path}: {exc}")


task_dir = pathlib.Path(sys.argv[1])
policy_file = pathlib.Path(sys.argv[2])

task = load_json(task_dir / "task.json")
policy = load_json(policy_file)

task_class = task.get("task_class")
if not task_class:
    raise SystemExit("task.json missing required field: task_class")

classes = policy.get("task_classes", {})
if task_class not in classes:
    raise SystemExit(f"unknown task_class: {task_class}")

required = classes[task_class].get("required_receipts", [])
receipts_dir = task_dir / "receipts"
waivers_dir = task_dir / "waivers"
errors = []
passed_checks = []

for receipt_rule in required:
    name = receipt_rule["name"]
    waiver_allowed = bool(receipt_rule.get("waiver_allowed", False))
    pass_statuses = set(receipt_rule.get("pass_statuses", ["passed", "completed"]))

    receipt_path = receipts_dir / f"{name}.json"
    waiver_path = waivers_dir / f"{name}.json"

    if receipt_path.exists():
        receipt = load_json(receipt_path)
        if receipt.get("type") != name:
            errors.append(f"receipt `{name}` has mismatched type")
            continue
        if receipt.get("status") not in pass_statuses:
            errors.append(
                f"receipt `{name}` has invalid status `{receipt.get('status')}`; expected one of {sorted(pass_statuses)}"
            )
            continue
        passed_checks.append(f"receipt:{name}")
        continue

    if waiver_path.exists():
        waiver = load_json(waiver_path)
        missing_fields = [f for f in ("id", "gate", "reason", "risk", "approved_by", "expires_at") if not waiver.get(f)]
        if missing_fields:
            errors.append(f"waiver `{name}` missing fields: {', '.join(missing_fields)}")
            continue
        if waiver.get("gate") != name:
            errors.append(f"waiver `{name}` gate mismatch")
            continue
        if not waiver_allowed:
            errors.append(f"waiver not allowed for required receipt `{name}`")
            continue
        try:
            expires_at = dt.date.fromisoformat(waiver["expires_at"])
        except ValueError:
            errors.append(f"waiver `{name}` has invalid expires_at")
            continue
        if expires_at < dt.date.today():
            errors.append(f"waiver `{name}` expired on {expires_at.isoformat()}")
            continue
        passed_checks.append(f"waiver:{name}")
        continue

    errors.append(f"missing required receipt `{name}`")

if errors:
    for err in errors:
        print(f"STRICT EXECUTION FAIL: {err}", file=sys.stderr)
    raise SystemExit(1)

print(f"STRICT EXECUTION PASS: task_class={task_class}")
for item in passed_checks:
    print(f"- {item}")
PY
