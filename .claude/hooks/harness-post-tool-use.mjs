#!/usr/bin/env node
import {
  classifyPath,
  collectFilePaths,
  detectCommandSignals,
  loadState,
  readHookInput,
  saveState,
  statePathFromTranscript
} from "./common.mjs";

const input = await readHookInput();
const statePath = statePathFromTranscript(input.transcript_path);
const state = loadState(statePath, {
  sessionId: input.session_id || null
});

state.lastTool = input.tool_name || null;

if (["Edit", "Write", "MultiEdit"].includes(input.tool_name)) {
  const filePaths = collectFilePaths(input.tool_input);
  for (const filePath of filePaths) {
    if (!state.editedPaths.includes(filePath)) {
      state.editedPaths.push(filePath);
    }
    const category = classifyPath(filePath);
    if (category === "code") state.flags.editedCode = true;
    if (category === "localization") state.flags.editedLocalization = true;
    if (category === "doc") state.flags.editedDocs = true;
  }
}

if (input.tool_name === "Bash") {
  const signals = detectCommandSignals(input.tool_input?.command || "");
  state.flags.buildRan = state.flags.buildRan || signals.buildRan;
  state.flags.testRan = state.flags.testRan || signals.testRan;
  state.flags.localizationCheckRan = state.flags.localizationCheckRan || signals.localizationCheckRan;
}

saveState(statePath, state);
