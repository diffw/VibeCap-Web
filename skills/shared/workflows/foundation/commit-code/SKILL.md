---
name: commit-code
description: Create and execute a clean git commit from all current local changes, including commit type selection (`feat`, `fix`, `refactor`, `docs`, `chore`, `perf`, `test`) and optional footer `Ref #<issue-number>`. Use when the user asks to generate a commit message or run `git commit` for the current workspace changes. Do not use for branch/release strategy design or multi-commit changelog writing.
---

# Commit Code

Keep all commit text in English.

## Required Workflow

1. Stage all local changes.
- Run `git status --short` to check for any local changes (staged or unstaged).
- If there are no changes at all, stop and inform the user there is nothing to commit.
- Run `git add -A` to stage all changes (tracked and untracked).

2. Inspect staged intent.
- Run `git diff --staged --name-only`.
- Run `git diff --staged`.
- Infer behavior-level intent, not file-by-file narration.

3. Select commit type deterministically.
- Use branch prefix when unambiguous:
  - `feature/*` -> `feat`
  - `fix/*` or `bugfix/*` -> `fix`
- Otherwise infer from staged intent:
  - `feat`: new capability
  - `fix`: bug resolution
  - `refactor`: internal restructuring without behavior change
  - `docs`: documentation only
  - `chore`: tooling/config/build maintenance
  - `perf`: measurable performance improvement
  - `test`: test-only changes

4. Parse optional issue number.
- Accept issue number from `$ARGUMENTS[0]` only if positive integer.
- If valid, append footer line `Ref #<issue-number>` at the bottom.
- If invalid or missing, omit footer.

5. Draft the commit message.
- Header format: `<type>: <subject>`.
- Keep header in 80-100 chars.
- Use imperative verb (`Add`, `Fix`, `Refactor`, `Optimize`, `Document`).
- Do not end header with a period.
- Body requirements:
  - Each logical change as a separate `- ` bullet line (one per line, no inline concatenation).
  - Explain intent, not file-by-file narration.
  - Mention motivation only when non-obvious from diff.

6. Execute and verify commit formatting.
- Use HEREDOC to preserve bullet formatting:
  ```
  git commit -m "$(cat <<'EOF'
  <Header>

  - bullet 1
  - bullet 2

  Ref #<issue> (if applicable)
  EOF
  )"
  ```
- Run `git log -1 --pretty=%B`.
- Confirm one blank line between header and body.
- Confirm footer exists only when issue number is valid and appears on last line.

## Quality Gates

- Prefer precise verbs; avoid vague subjects such as `update code` or `cleanup`.
- Keep history readable: intent first, concise, professional.
- Avoid overstating impact; reflect only what staged diff proves.

## Done Criteria

- `git log -1 --pretty=%B` confirms correct commit format

## Error Handling

- If commit hook fails, show hook output and propose a focused fix.
- If commit fails due to formatting, regenerate message and retry once.
- If staged diff mixes unrelated concerns, ask to split into separate commits.
