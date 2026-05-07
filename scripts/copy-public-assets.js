#!/usr/bin/env node
/**
 * Copy the heavy boundary GeoJSON into demo/public/ so Vite serves it
 * as a static asset (lazy-loaded by the map at runtime, not bundled).
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'src', 'data', 'bangladesh.geojson');
const PUBLIC_DIR = path.join(ROOT, 'demo', 'public');
const DEST = path.join(PUBLIC_DIR, 'bangladesh.geojson');

if (!fs.existsSync(SRC)) {
  console.error(`Source not found: ${SRC}`);
  process.exit(1);
}

fs.mkdirSync(PUBLIC_DIR, { recursive: true });
fs.copyFileSync(SRC, DEST);
console.log(`Copied bangladesh.geojson → ${path.relative(ROOT, DEST)}`);
