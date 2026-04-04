#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import {
  extractLastAssistantReply,
  loadState,
  readHookInput,
  saveState,
  statePathFromTranscript
} from "./common.mjs";

const input = await readHookInput();
const statePath = statePathFromTranscript(input.transcript_path);
const state = loadState(statePath, {});
const currentDir = path.dirname(fileURLToPath(import.meta.url));

const checkerPath = path.resolve(currentDir, "../../.agents/scripts/check_execution_receipt.mjs");
const policyPath = path.resolve(currentDir, "../../.agents/scripts/execution_enforcement_policy.json");
const { validateExecutionReceipt } = await import(pathToFileURL(checkerPath).href);
const policy = JSON.parse(fs.readFileSync(policyPath, "utf8"));

const reply = extractLastAssistantReply(input.transcript_path);
if (!reply) {
  process.exit(0);
}

const result = validateExecutionReceipt({ reply, state, policy });
if (result.ok) {
  state.stopBlocks = 0;
  saveState(statePath, state);
  process.exit(0);
}

state.stopBlocks = Number(state.stopBlocks || 0) + 1;
saveState(statePath, state);

if (input.stop_hook_active && state.stopBlocks >= 2) {
  process.exit(0);
}

process.stderr.write(
  [
    "Harness execution receipt check failed.",
    ...result.errors.map((item) => `- ${item}`),
    "Before finishing, add the required receipt sections: Status, Validation, Testing Summary, Gate Status, Rules Used, Skills Used."
  ].join("\n") + "\n"
);
process.exit(2);
