#!/usr/bin/env node
/* eslint-disable no-console */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getWFHSelection } from "./lib/wfhroulette.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function printHelp() {
  console.log(`WFHroulette CLI\n\n` +
    `Usage: node cli.js [options]\n\n` +
    `Options:\n` +
    `  --seed <value>   Seed used to produce deterministic results (default: "WFHroulette")\n` +
    `  --date <YYYY-MM-DD>  Evaluate a specific date instead of today\n` +
    `  --help           Show this help message\n`);
}

function parseArgs(argv) {
  const args = { seed: "WFHroulette", date: new Date() };
  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--help" || arg === "-h") {
      args.help = true;
    } else if (arg === "--seed") {
      if (i + 1 >= argv.length) {
        throw new Error("--seed expects a value");
      }
      args.seed = argv[++i];
    } else if (arg === "--date") {
      if (i + 1 >= argv.length) {
        throw new Error("--date expects a value");
      }
      const dateValue = new Date(argv[++i]);
      if (Number.isNaN(dateValue.getTime())) {
        throw new Error("Invalid date supplied to --date. Use YYYY-MM-DD.");
      }
      args.date = dateValue;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return args;
}

async function loadReasons() {
  const reasonsPath = path.resolve(__dirname, "reasons.json");
  const contents = await readFile(reasonsPath, "utf8");
  const parsed = JSON.parse(contents);
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("reasons.json must contain a non-empty array");
  }
  return parsed;
}

async function main() {
  let options;
  try {
    options = parseArgs(process.argv);
  } catch (error) {
    console.error(error.message);
    printHelp();
    process.exitCode = 1;
    return;
  }

  if (options.help) {
    printHelp();
    return;
  }

  const reasons = await loadReasons();
  const selection = getWFHSelection({ date: options.date, seed: options.seed, reasons });

  const weekLabel = `${selection.isoYear}-W${String(selection.isoWeek).padStart(2, "0")}`;
  console.log(`WFHroulette for ${weekLabel}`);
  console.log(`Seed: ${options.seed}`);
  console.log(`\n📅 ${selection.weekday} (${selection.dateString})`);
  console.log(`🤷 Reason: ${selection.reason}`);
}

main().catch((error) => {
  console.error("An unexpected error occurred:", error);
  process.exitCode = 1;
});
