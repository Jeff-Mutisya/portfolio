// Production build for static hosting: copies the prebuilt Jekyll output
// (_site/, committed to the repo) into dist/ for the hosting builder.
// The Jekyll build itself requires Ruby and is run locally / in CI.
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', '_site');
const DEST = path.join(__dirname, '..', 'dist');

if (!fs.existsSync(SRC)) {
  console.error('_site/ not found. Build the Jekyll site first: jekyll build --source . --destination _site --baseurl \'\'');
  process.exit(1);
}

fs.rmSync(DEST, { recursive: true, force: true });
fs.cpSync(SRC, DEST, { recursive: true });
console.log(`Copied ${SRC} -> ${DEST}`);
