#!/usr/bin/env node
/**
 * Renders every display equation to SVG and rewrites README.md to reference the
 * images, instead of relying on GitHub's $$...$$ math.
 *
 * WHY: GitHub applies markdown inline-processing inside $$...$$ when the block
 * sits inside an HTML element such as <details>. Backslashes get stripped
 * (\; becomes ;, \, becomes ,) and _..._ pairs are eaten as italics. When the
 * mangled result is still valid TeX it renders with artefacts; when it isn't,
 * MathJax bails and the raw LaTeX is dumped on the page. Images have no such
 * failure mode.
 *
 * Inline math ($`x`$) is left alone — the backtick form is protected and works.
 *
 * Usage:
 *     npm install mathjax-full
 *     node tools/gen_equations.js
 *
 * First run extracts the TeX from README.md into tools/equations.json and
 * rewrites the README. Later runs re-render from equations.json, so you can
 * edit an equation there and re-run without touching the README.
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const README = path.join(ROOT, "README.md");
const EQ_DIR = path.join(ROOT, "assets", "eq");
const MANIFEST = path.join(__dirname, "equations.json");

// Resolve mathjax-full from node_modules, or from MATHJAX_HOME if set.
const MJ = process.env.MATHJAX_HOME || "mathjax-full";
const req = (m) => require(MJ.startsWith("/") ? `${MJ}/${m}` : `${MJ}/${m}`);

const { mathjax } = req("js/mathjax.js");
const { TeX } = req("js/input/tex.js");
const { SVG } = req("js/output/svg.js");
const { liteAdaptor } = req("js/adaptors/liteAdaptor.js");
const { RegisterHTMLHandler } = req("js/handlers/html.js");
const { AllPackages } = req("js/input/tex/AllPackages.js");

const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);
const doc = mathjax.document("", {
  InputJax: new TeX({ packages: AllPackages }),
  OutputJax: new SVG({ fontCache: "local" }),
});

// GitHub's body text colours, so equations sit naturally in either theme.
const THEMES = { light: "#1f2328", dark: "#e6edf3" };
const EX_PX = 9.2;          // 1ex in px — sets the rendered size
const MAX_W = 980;          // GitHub's readable content width

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;")
          .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function renderSVG(tex, colour) {
  const node = doc.convert(tex, { display: true, em: 16, ex: 8, containerWidth: 100000 });
  let svg = adaptor.innerHTML(node);           // strip the mjx-container wrapper

  // MathJax renders unknown macros as an <merror> box rather than throwing.
  // Without this check a broken equation ships as a solid coloured bar.
  const err = /data-mjx-error="([^"]*)"/.exec(svg);
  if (err) throw new Error(`TeX error: ${err[1]}`);
  const wEx = parseFloat(/width="([\d.]+)ex"/.exec(svg)[1]);
  const hEx = parseFloat(/height="([\d.]+)ex"/.exec(svg)[1]);
  const wPx = Math.round(wEx * EX_PX);
  const hPx = Math.round(hEx * EX_PX);

  svg = svg
    .replace(/width="[\d.]+ex"/, `width="${wPx}"`)
    .replace(/height="[\d.]+ex"/, `height="${hPx}"`)
    .replace(/style="vertical-align:[^"]*"/, "")
    .replace(/currentColor/g, colour);

  return { svg, wPx, hPx };
}

// ── collect the equations ────────────────────────────────────────────────────
let md = fs.readFileSync(README, "utf8");
let equations;

if (fs.existsSync(MANIFEST)) {
  equations = JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
  console.log(`reusing ${equations.length} equations from tools/equations.json`);
} else {
  equations = [];
  md.replace(/\$\$([\s\S]+?)\$\$/g, (_, tex) => {
    equations.push({ id: `eq-${String(equations.length + 1).padStart(2, "0")}`, tex: tex.trim() });
    return "";
  });
  fs.writeFileSync(MANIFEST, JSON.stringify(equations, null, 2) + "\n");
  console.log(`extracted ${equations.length} equations -> tools/equations.json`);
}

// ── render ───────────────────────────────────────────────────────────────────
fs.mkdirSync(EQ_DIR, { recursive: true });
const wide = [];
const failed = [];
for (const eq of equations) {
  try {
    for (const [name, colour] of Object.entries(THEMES)) {
      const { svg, wPx, hPx } = renderSVG(eq.tex, colour);
      fs.writeFileSync(path.join(EQ_DIR, `${eq.id}-${name}.svg`),
        `<?xml version="1.0" encoding="UTF-8"?>\n${svg}\n`);
      if (name === "light") { eq.wPx = wPx; eq.hPx = hPx; }
    }
    if (eq.wPx > MAX_W) wide.push(`${eq.id} (${eq.wPx}px)`);
  } catch (e) {
    failed.push(`${eq.id}: ${e.message}`);
  }
}
if (failed.length) {
  console.error(`\n${failed.length} equation(s) FAILED to render:`);
  failed.forEach((f) => console.error("  " + f));
  process.exit(1);
}
console.log(`rendered ${equations.length * 2} SVGs into assets/eq/`);
if (wide.length) console.log(`  note — wider than ${MAX_W}px, will scale down: ${wide.join(", ")}`);

// persist measured dimensions so the manifest stays the source of truth
fs.writeFileSync(MANIFEST, JSON.stringify(equations, null, 2) + "\n");

// ── rewrite the README, if it still holds raw $$ blocks ──────────────────────
if (/\$\$[\s\S]+?\$\$/.test(md)) {
  let i = 0;
  md = md.replace(/\$\$([\s\S]+?)\$\$/g, () => {
    const eq = equations[i++];
    const w = Math.min(eq.wPx, MAX_W);
    return [
      '<p align="center">',
      '  <picture>',
      `    <source media="(prefers-color-scheme: dark)" srcset="assets/eq/${eq.id}-dark.svg">`,
      `    <img alt="${esc(eq.tex)}" src="assets/eq/${eq.id}-light.svg" width="${w}">`,
      '  </picture>',
      '</p>',
    ].join("\n");
  });
  fs.writeFileSync(README, md);
  console.log(`rewrote README.md — ${i} equations now render as images`);
} else {
  // Already converted: re-sync the width attributes to the freshly measured SVGs,
  // so a re-render (or a fixed equation) can't leave a stale size behind.
  let synced = 0;
  for (const eq of equations) {
    const w = Math.min(eq.wPx, MAX_W);
    const re = new RegExp(`(src="assets/eq/${eq.id}-light\\.svg" width=")(\\d+)(")`);
    md = md.replace(re, (m, a, old, c) => {
      if (+old !== w) synced++;
      return a + w + c;
    });
  }
  fs.writeFileSync(README, md);
  console.log(`README.md already uses <picture> blocks — ${synced} width(s) re-synced`);
}
