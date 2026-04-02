#!/usr/bin/env bash
set -euo pipefail

HOST_ROOT="${1:-$(git rev-parse --show-toplevel 2>/dev/null || pwd)}"
AGENTS_DIR="$HOST_ROOT/.agents"
UPDATE_SCRIPT="$AGENTS_DIR/scripts/update_host_bridge.sh"

if [[ ! -d "$HOST_ROOT" ]]; then
  echo "Error: host root not found: $HOST_ROOT" >&2
  exit 1
fi

if [[ ! -d "$AGENTS_DIR" ]]; then
  echo "Error: .agents directory not found under $HOST_ROOT" >&2
  exit 1
fi

if [[ ! -f "$UPDATE_SCRIPT" ]]; then
  echo "Error: update_host_bridge.sh not found under $AGENTS_DIR/scripts" >&2
  exit 1
fi

resolve_hooks_dir() {
  local repo_root="$1"
  local rel
  rel="$(git -C "$repo_root" rev-parse --git-path hooks 2>/dev/null || true)"
  if [[ -z "$rel" ]]; then
    return 1
  fi
  if [[ "$rel" = /* ]]; then
    printf '%s\n' "$rel"
  else
    printf '%s\n' "$repo_root/$rel"
  fi
}

host_hooks_dir="$(resolve_hooks_dir "$HOST_ROOT" || true)"
submodule_hooks_dir="$(resolve_hooks_dir "$AGENTS_DIR" || true)"

if [[ -z "$host_hooks_dir" ]]; then
  echo "Error: could not resolve host git hooks directory for $HOST_ROOT" >&2
  exit 1
fi

if [[ -z "$submodule_hooks_dir" ]]; then
  echo "Error: could not resolve submodule git hooks directory for $AGENTS_DIR" >&2
  exit 1
fi

mkdir -p "$host_hooks_dir" "$submodule_hooks_dir"

insert_managed_hook() {
  local target="$1"
  local block="$2"

  if [[ -f "$target" ]] && ! grep -Fq "BEGIN harness-host-bridge" "$target"; then
    local first_line
    first_line="$(head -n 1 "$target" 2>/dev/null || true)"
    if [[ -n "$first_line" && "$first_line" != "#!/bin/sh" && "$first_line" != "#!/usr/bin/env bash" && "$first_line" != "#!/bin/bash" ]]; then
      echo "Error: existing hook at $target is not a managed shell hook. Refusing to modify it." >&2
      exit 1
    fi
  fi

  if [[ ! -f "$target" ]]; then
    printf '#!/bin/sh\n' >"$target"
  fi

  python3 - <<'PY' "$target" "$block"
import pathlib, re, sys

path = pathlib.Path(sys.argv[1])
block = sys.argv[2]
text = path.read_text(encoding="utf-8")
pattern = re.compile(r"\n?# BEGIN harness-host-bridge\n.*?# END harness-host-bridge\n?", re.S)
replacement = "\n" + block.strip("\n") + "\n"
if pattern.search(text):
    text = pattern.sub(replacement, text)
else:
    if not text.endswith("\n"):
        text += "\n"
    text += replacement
path.write_text(text, encoding="utf-8")
PY

  chmod +x "$target"
}

host_block='
# BEGIN harness-host-bridge
repo_root="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
if [ -f "$repo_root/.agents/scripts/update_host_bridge.sh" ]; then
  bash "$repo_root/.agents/scripts/update_host_bridge.sh" "$repo_root" >/dev/null 2>&1 || true
fi
# END harness-host-bridge
'

submodule_block='
# BEGIN harness-host-bridge
submodule_root="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
host_root="$(cd "$submodule_root/.." && pwd)"
if [ -f "$host_root/.agents/scripts/update_host_bridge.sh" ]; then
  bash "$host_root/.agents/scripts/update_host_bridge.sh" "$host_root" >/dev/null 2>&1 || true
fi
# END harness-host-bridge
'

insert_managed_hook "$host_hooks_dir/post-merge" "$host_block"
insert_managed_hook "$host_hooks_dir/post-checkout" "$host_block"
insert_managed_hook "$submodule_hooks_dir/post-merge" "$submodule_block"
insert_managed_hook "$submodule_hooks_dir/post-checkout" "$submodule_block"

echo "Installed host bridge hooks:"
echo "- $host_hooks_dir/post-merge"
echo "- $host_hooks_dir/post-checkout"
echo "- $submodule_hooks_dir/post-merge"
echo "- $submodule_hooks_dir/post-checkout"
