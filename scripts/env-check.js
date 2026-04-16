#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const PROJECT_ROOT = process.cwd();
const TARGET = path.join(PROJECT_ROOT, ".env.local");

function fileExists(p) {
  try {
    fs.accessSync(p, fs.constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

function main() {
  if (!fileExists(TARGET)) {
    console.error("❌ .env.local не найден. Запусти: yarn env:init");
    process.exit(1);
  }
  console.log("✅ .env.local найден.");
}

main();
