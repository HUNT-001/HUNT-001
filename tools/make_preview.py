#!/usr/bin/env python3
"""
Builds preview.html — a standalone local preview of README.md that renders
GitHub-flavoured markdown *and* math (```math fences and $`inline`$) using
KaTeX, the same engine GitHub uses.

  Run:      python tools/make_preview.py
  Then:     double-click preview.html

The README is embedded directly, so it works over file:// with no web server.
If you *are* serving the folder over HTTP, the page fetches the live README
instead of the snapshot, so it stays current while you edit.

Re-run this script after editing README.md to refresh the embedded snapshot.
"""
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
README = os.path.join(ROOT, "README.md")
OUT = os.path.join(ROOT, "preview.html")

with open(README, encoding="utf-8") as f:
    md = f.read()

# Safe to embed inside a <script> block: escape the only sequence that could
# terminate it early, plus line separators that are invalid in JS strings.
embedded = (
    json.dumps(md)
    .replace("</", "<\\/")
    .replace(" ", "\\u2028")
    .replace(" ", "\\u2029")
)

HTML = """<!DOCTYPE html>
<!--
  GENERATED FILE — do not edit by hand.
  Rebuild with:  python tools/make_preview.py

  Local preview of README.md with GitHub-equivalent math rendering.
  Works by double-click (file://) using an embedded snapshot of the README.
  Git-ignored; delete any time.
-->
<html lang="en">
<head>
<meta charset="utf-8" />
<title>README preview &mdash; HUNT-001</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css" />
<script src="https://cdn.jsdelivr.net/npm/marked@12.0.0/marked.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
<style>
  :root { color-scheme: dark; }
  body { margin:0; padding:44px 24px 120px; background:#0d1117; color:#e6edf3;
         font:16px/1.6 -apple-system,"Segoe UI",Helvetica,Arial,sans-serif; }
  #doc { max-width:1012px; margin:0 auto; }
  #bar { max-width:1012px; margin:0 auto 28px; padding:12px 16px; border:1px solid #30363d;
         border-radius:8px; background:#161b22; font:13px/1.6 ui-monospace,Consolas,monospace;
         color:#8b949e; }
  #bar b { color:#58a6ff; }
  #bar .warn { color:#d29922; }
  #bar .bad  { color:#f85149; }
  img { max-width:100%; }
  a { color:#58a6ff; text-decoration:none; } a:hover { text-decoration:underline; }
  code { background:#6e768166; padding:.2em .4em; border-radius:6px;
         font:85% ui-monospace,Consolas,monospace; }
  pre { background:#161b22; padding:16px; border-radius:8px; overflow:auto; }
  pre code { background:none; padding:0; }
  table { border-collapse:collapse; margin:16px 0; display:block; overflow:auto; }
  th, td { border:1px solid #30363d; padding:6px 13px; }
  tr:nth-child(2n) { background:#161b22; }
  details { border:1px solid #30363d; border-radius:8px; padding:10px 16px; margin:12px 0; }
  summary { cursor:pointer; font-weight:600; }
  h1,h2,h3 { border-bottom:1px solid #21262d; padding-bottom:.3em; }
  .katex-display { overflow-x:auto; overflow-y:hidden; padding:4px 0; }
  .matherr { color:#f85149; font-family:ui-monospace,monospace; font-size:13px; }
</style>
</head>
<body>
<div id="bar">Rendering&hellip;</div>
<div id="doc"></div>

<script>
var EMBEDDED_README = __README__;

// Distinctive token: cannot collide with prose such as "roughly 13 nm".
function slotToken(i) { return "@@MATHSLOT" + i + "ENDSLOT@@"; }

function paint(md, source) {
  var slots = [], hadError = false;

  function stash(html) { slots.push(html); return slotToken(slots.length - 1); }
  function tex(src, display) {
    try {
      return katex.renderToString(src, { displayMode: display, throwOnError: true, strict: false });
    } catch (err) {
      hadError = true;
      return '<span class="matherr">[math error] ' + err.message + '</span>';
    }
  }

  // display: $$...$$  (single-line or spanning lines)
  md = md.replace(/\\$\\$([\\s\\S]+?)\\$\\$/g, function (_, s) { return stash(tex(s.trim(), true)); });
  // legacy display fence, in case any survive
  md = md.replace(/```math\\n([\\s\\S]*?)\\n```/g, function (_, s) { return stash(tex(s, true)); });
  // inline: $`...`$
  md = md.replace(/\\$`([^`]+)`\\$/g, function (_, s) { return stash(tex(s, false)); });

  var html = marked.parse(md, { gfm: true, breaks: false });
  html = html.replace(/@@MATHSLOT(\\d+)ENDSLOT@@/g, function (_, i) { return slots[+i]; });
  document.getElementById("doc").innerHTML = html;

  var errs = document.querySelectorAll(".matherr").length;
  document.getElementById("bar").innerHTML =
      'Local preview of <b>README.md</b> &mdash; math rendered with KaTeX, the same engine GitHub uses. '
    + 'If it looks right here, it looks right on GitHub.'
    + '<br><br>Source: ' + source
    + '&nbsp; &middot; &nbsp;Rendered <b>' + slots.length + '</b> math expressions &mdash; '
    + (errs ? '<span class="bad">' + errs + ' failed</span>'
            : '<b>0 errors</b>')
    + '.';
}

// Prefer the live file when served over HTTP; fall back to the embedded snapshot.
(function () {
  if (location.protocol === "file:") {
    paint(EMBEDDED_README, 'embedded snapshot <span class="warn">(re-run '
      + '<code>python tools/make_preview.py</code> after editing)</span>');
    return;
  }
  fetch("README.md")
    .then(function (r) { return r.text(); })
    .then(function (t) { paint(t, "live README.md"); })
    .catch(function () { paint(EMBEDDED_README, "embedded snapshot"); });
})();
</script>
</body>
</html>
"""

with open(OUT, "w", encoding="utf-8", newline="\n") as f:
    f.write(HTML.replace("__README__", embedded))

print(f"wrote {OUT}  ({len(md):,} chars of README embedded)")
