const fs = require('fs');
const path = require('path');
const { minify: minifyHtml } = require('html-minifier-terser');
const CleanCSS = require('clean-css');
const { minify: minifyJs } = require('terser');

const SRC_DIR = path.join(__dirname, '..', 'src');
const DIST_DIR = path.join(__dirname, '..', 'dist');

const HTML_MINIFY_OPTIONS = {
  collapseWhitespace: true,
  removeComments: true,
  minifyCSS: true,
  minifyJS: true,
};

function emptyDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

async function buildHtml() {
  const htmlFiles = fs.readdirSync(SRC_DIR).filter((file) => file.endsWith('.html'));
  for (const file of htmlFiles) {
    const input = fs.readFileSync(path.join(SRC_DIR, file), 'utf8');
    const output = await minifyHtml(input, HTML_MINIFY_OPTIONS);
    fs.writeFileSync(path.join(DIST_DIR, file), output);
  }
}

function buildCss() {
  const cssDir = path.join(SRC_DIR, 'assets', 'css');
  const outDir = path.join(DIST_DIR, 'assets', 'css');
  if (!fs.existsSync(cssDir)) return;
  fs.mkdirSync(outDir, { recursive: true });
  for (const file of fs.readdirSync(cssDir).filter((f) => f.endsWith('.css'))) {
    const input = fs.readFileSync(path.join(cssDir, file), 'utf8');
    const output = new CleanCSS({}).minify(input).styles;
    fs.writeFileSync(path.join(outDir, file), output);
  }
}

async function buildJs() {
  const jsDir = path.join(SRC_DIR, 'assets', 'js');
  const outDir = path.join(DIST_DIR, 'assets', 'js');
  if (!fs.existsSync(jsDir)) return;
  fs.mkdirSync(outDir, { recursive: true });
  for (const file of fs.readdirSync(jsDir).filter((f) => f.endsWith('.js'))) {
    const input = fs.readFileSync(path.join(jsDir, file), 'utf8');
    const output = await minifyJs(input);
    fs.writeFileSync(path.join(outDir, file), output.code);
  }
}

async function build() {
  emptyDir(DIST_DIR);
  await buildHtml();
  buildCss();
  await buildJs();
  copyRecursive(path.join(SRC_DIR, 'assets', 'img'), path.join(DIST_DIR, 'assets', 'img'));
  copyRecursive(path.join(SRC_DIR, 'assets', 'files'), path.join(DIST_DIR, 'assets', 'files'));
  copyRecursive(path.join(SRC_DIR, 'favicon.ico'), path.join(DIST_DIR, 'favicon.ico'));
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
