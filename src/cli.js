#!/usr/bin/env node
import fs from 'node:fs';
import { checkFile, runBlocks } from './core.js';

const args = process.argv.slice(2);
const file = args.find(arg => !arg.startsWith('-')) || 'README.md';
if (!fs.existsSync(file)) {
  console.error(`readmeproof: ${file} not found`);
  process.exit(2);
}
const blocks = checkFile(file);
console.log(`\n  readmeproof  ${file}`);
console.log(`  ${'─'.repeat(56)}`);
for (const block of blocks) console.log(`  ${block.valid ? '✓' : '✗'} lines ${String(block.start).padEnd(4)} ${block.runnable ? 'syntax ok · opted in' : 'syntax ok · dry only'}`);
const invalid = blocks.filter(block => !block.valid);
for (const block of invalid) console.log(`    ${block.error}`);
if (args.includes('--run') && !invalid.length) {
  const runs = runBlocks(file, blocks);
  console.log(`\n  Running ${runs.length} opted-in block(s)…`);
  for (const run of runs) console.log(`  ${run.status === 0 ? '✓' : '✗'} lines ${run.start} ${run.status === 0 ? 'passed' : `failed (${run.status})`}`);
  if (runs.some(run => run.status !== 0)) process.exitCode = 1;
}
console.log(`\n  ${blocks.length} shell block(s), ${blocks.filter(x => x.runnable).length} opted in.${args.includes('--run') ? '' : ' Nothing executed.'}\n`);
if (invalid.length) process.exitCode = 1;
