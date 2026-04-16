#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { getAiReviewEnv } = require("./env");

const PROJECT_ROOT = process.cwd();

function fileExists(absPath) {
  try {
    fs.accessSync(absPath, fs.constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

function loadDotEnvFile(relPath) {
  const absPath = path.join(PROJECT_ROOT, relPath);
  if (!fileExists(absPath)) return;

  const raw = fs.readFileSync(absPath, "utf-8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;

    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();

    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }

    if (key && process.env[key] === undefined) {
      process.env[key] = val;
    }
  }
}

function main() {
  // Priority: existing environment > .env.local > .env
  loadDotEnvFile(".env.local");
  loadDotEnvFile(".env");

  const env = getAiReviewEnv();

  // Для удобства — печатаем только то, что без секретов
  console.log("✅ env валиден (AI review).");
  console.log(`OPENAI_MODEL=${env.OPENAI_MODEL}`);
  console.log(`OPENAI_BASE_URL=${env.OPENAI_BASE_URL}`);
  console.log(`AI_REVIEW_MAX_FILES=${env.AI_REVIEW_MAX_FILES}`);
  console.log(`AI_REVIEW_MAX_FILE_CHARS=${env.AI_REVIEW_MAX_FILE_CHARS}`);
  console.log(`AI_REVIEW_MAX_DIFF_CHARS=${env.AI_REVIEW_MAX_DIFF_CHARS}`);
  console.log(`OPENAI_API_KEY=${env.OPENAI_API_KEY ? "[set]" : "[not set]"}`);
}

main();
