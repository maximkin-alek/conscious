#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const PROJECT_ROOT = process.cwd();
const TEMPLATE = path.join(PROJECT_ROOT, ".env.example");
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
  if (!fileExists(TEMPLATE)) {
    console.error("❌ .env.example не найден.");
    process.exit(1);
  }

  if (fileExists(TARGET)) {
    console.log("✅ .env.local уже существует (ничего не делаю).");
    return;
  }

  fs.copyFileSync(TEMPLATE, TARGET);
  console.log("✅ Создан .env.local из .env.example.");
}

main();
