#!/usr/bin/env node
import { readHookInput, saveState, statePathFromTranscript } from "./common.mjs";

const input = await readHookInput();
const statePath = statePathFromTranscript(input.transcript_path);

saveState(statePath, {
  version: 1,
  sessionId: input.session_id || null,
  prompt: input.prompt || input.user_prompt || "",
  editedPaths: [],
  flags: {
    editedCode: false,
    editedLocalization: false,
    editedDocs: false,
    buildRan: false,
    testRan: false,
    localizationCheckRan: false
  },
  stopBlocks: 0
});

process.stdout.write(
  "Harness enforcement active: if this turn performs execution, the final reply will be Stop-hook validated for Status, Validation, Testing Summary, Gate Status, Rules Used, and Skills Used.\n"
);
