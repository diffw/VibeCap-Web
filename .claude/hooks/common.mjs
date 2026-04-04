#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

export async function readHookInput() {
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }
  const text = Buffer.concat(chunks).toString("utf8").trim();
  return text ? JSON.parse(text) : {};
}

export function statePathFromTranscript(transcriptPath) {
  return `${transcriptPath}.harness-state.json`;
}

export function loadState(statePath, seed = {}) {
  try {
    return JSON.parse(fs.readFileSync(statePath, "utf8"));
  } catch {
    return {
      version: 1,
      editedPaths: [],
      flags: {
        editedCode: false,
        editedLocalization: false,
        editedDocs: false,
        buildRan: false,
        testRan: false,
        localizationCheckRan: false
      },
      stopBlocks: 0,
      ...seed
    };
  }
}

export function saveState(statePath, state) {
  fs.mkdirSync(path.dirname(statePath), { recursive: true });
  fs.writeFileSync(statePath, `${JSON.stringify(state, null, 2)}\n`, "utf8");
}

export function collectFilePaths(toolInput) {
  const paths = new Set();
  const candidateKeys = new Set(["file_path", "path", "target_file", "filePath"]);

  function walk(node) {
    if (!node) return;
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (typeof node !== "object") return;
    for (const [key, value] of Object.entries(node)) {
      if (candidateKeys.has(key) && typeof value === "string") {
        paths.add(value);
      } else {
        walk(value);
      }
    }
  }

  walk(toolInput);
  return [...paths];
}

export function classifyPath(filePath) {
  const normalized = String(filePath || "").replace(/\\/g, "/");
  if (!normalized) return "other";
  if (normalized.endsWith(".strings")) return "localization";
  if (
    normalized.endsWith(".md") ||
    normalized.includes("/docs/") ||
    normalized.includes("/.vibe-doc/") ||
    normalized.includes("/.harness-docs/") ||
    /(^|\/)(AGENTS|CLAUDE|README|CHANGELOG)\.md$/i.test(normalized)
  ) {
    return "doc";
  }
  if (
    normalized.includes("/Tests/") ||
    normalized.includes("/tests/") ||
    normalized.includes(".test.") ||
    normalized.includes(".spec.")
  ) {
    return "test";
  }
  return "code";
}

export function detectCommandSignals(command) {
  const text = String(command || "");
  return {
    buildRan: /\b(xcodebuild\s+build|swift\s+build|npm\s+run\s+build|pnpm\s+run\s+build|cargo\s+build)\b/i.test(text),
    testRan: /\b(xcodebuild\s+test|swift\s+test|npm\s+test|pnpm\s+test|pytest|vitest|jest)\b/i.test(text),
    localizationCheckRan: /\b(localization|key parity|missing key|orphan key|stringlint|check-localization)\b/i.test(text)
  };
}

function extractAssistantTextFromNode(node, inheritedRole = null) {
  if (!node) return "";
  if (typeof node === "string") return inheritedRole === "assistant" ? node : "";
  if (Array.isArray(node)) {
    return node
      .map((item) => extractAssistantTextFromNode(item, inheritedRole))
      .filter(Boolean)
      .join("\n");
  }
  if (typeof node !== "object") return "";

  const role =
    typeof node.role === "string"
      ? node.role
      : typeof node.speaker === "string"
        ? node.speaker
        : node.type === "assistant"
          ? "assistant"
          : inheritedRole;

  if (Object.prototype.hasOwnProperty.call(node, "assistant")) {
    const nested = extractAssistantTextFromNode(node.assistant, "assistant");
    if (nested) return nested;
  }

  if (Object.prototype.hasOwnProperty.call(node, "message")) {
    const nested = extractAssistantTextFromNode(node.message, role);
    if (nested) return nested;
  }

  if (role === "assistant") {
    if (typeof node.content === "string") return node.content;
    if (Array.isArray(node.content)) {
      const nested = node.content
        .map((item) => {
          if (item && typeof item === "object" && typeof item.text === "string") {
            return item.text;
          }
          return extractAssistantTextFromNode(item, "assistant");
        })
        .filter(Boolean)
        .join("\n");
      if (nested) return nested;
    }
    if (typeof node.text === "string") return node.text;
  }

  for (const value of Object.values(node)) {
    const nested = extractAssistantTextFromNode(value, role);
    if (nested) return nested;
  }
  return "";
}

export function extractLastAssistantReply(transcriptPath) {
  const text = fs.readFileSync(transcriptPath, "utf8");
  const lines = text.split(/\n+/).filter(Boolean);
  let lastReply = "";
  for (const line of lines) {
    let parsed;
    try {
      parsed = JSON.parse(line);
    } catch {
      continue;
    }
    const candidate = extractAssistantTextFromNode(parsed);
    if (candidate) lastReply = candidate;
  }
  return lastReply;
}
