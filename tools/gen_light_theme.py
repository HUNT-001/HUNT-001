"""
Generate portfolio/src/app/theme-light.css from globals.css.

Every colour declaration in globals.css gets a light-mode twin scoped under
html[data-theme="light"]. Colours are mapped in HLS space:
  * dark surfaces  -> near-white, desaturated
  * light text     -> deep ink
  * mid accents    -> kept in hue, lightness clamped so they read on white
  * black shadows  -> soft slate shadows
"Instrument" panels (lab demos, dream log, Q&A, code blocks) are deliberately
left dark, like terminals on a light page. Hand-tuned rules are appended from
LIGHT_EXTRA at the bottom.

Re-run after editing globals.css:  python tools/gen_light_theme.py
"""
import colorsys, re, pathlib

ROOT = pathlib.Path(__file__).resolve().parents[1] / "portfolio" / "src" / "app"
SRC, OUT = ROOT / "globals.css", ROOT / "theme-light.css"
T = 'html[data-theme="light"]'

KEEP_DARK = re.compile(r"\.(demo|dream|qa|rl-|seg)\b|\.post-body pre|\.caret")
KEEP_COLOR = {"#140a02", "#120a02"}  # dark text on caramel buttons
COLOR_PROPS = re.compile(r"^(--|color$|background|border|box-shadow|fill|stroke|outline|text-shadow|scrollbar-color|accent-color)")
HEX = re.compile(r"#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b")
RGBA = re.compile(r"rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)")

def clamp(x, a, b): return max(a, min(b, x))

def flip(r, g, b):
    h, l, s = colorsys.rgb_to_hls(r / 255, g / 255, b / 255)
    if l < 0.3:                 l2, s2 = 1 - l * 0.85, s * 0.45          # dark surface -> paper
    elif l > 0.85:              l2, s2 = (1 - l) * 1.4 + 0.03, s * 0.75  # pale text -> ink
    elif s > 0.45:              l2, s2 = clamp(1 - l, 0.42, 0.5), s * 0.72  # accent -> readable accent
    else:                       l2, s2 = clamp(1 - l, 0.22, 0.6), s * 0.8  # neutral -> neutral
    r2, g2, b2 = colorsys.hls_to_rgb(h, l2, s2)
    return round(r2 * 255), round(g2 * 255), round(b2 * 255)

def map_value(prop, val):
    shadow = "shadow" in prop
    def rgba(m):
        r, g, b = int(m[1]), int(m[2]), int(m[3])
        a = m[4]
        if r < 12 and g < 12 and b < 16 and shadow:          # black drop shadow
            return f"rgba(30,41,59,{float(a or 1) * 0.35:.3f})"
        r2, g2, b2 = flip(r, g, b)
        return f"rgba({r2},{g2},{b2},{a})" if a is not None else f"rgb({r2},{g2},{b2})"
    def hexm(m):
        h = m[0].lower()
        if h in KEEP_COLOR: return h
        x = m[1]
        if len(x) == 3: x = "".join(c * 2 for c in x)
        r2, g2, b2 = flip(int(x[0:2], 16), int(x[2:4], 16), int(x[4:6], 16))
        return f"#{r2:02x}{g2:02x}{b2:02x}"
    if val.startswith("url(") and "svg" in val: return None
    new = RGBA.sub(rgba, val)
    new = HEX.sub(hexm, new)
    return new if new != val else None

def split_top(s, sep=","):
    out, depth, cur = [], 0, ""
    for ch in s:
        if ch in "([": depth += 1
        elif ch in ")]": depth -= 1
        if ch == sep and depth == 0: out.append(cur); cur = ""
        else: cur += ch
    out.append(cur)
    return [x.strip() for x in out if x.strip()]

def scope(sel):
    if sel.startswith(":root"): return T + sel[5:]
    if sel.startswith("html"):  return T + sel[4:]
    return f"{T} {sel}"

def parse(css):
    """yield (prelude, body) at top level; recurse into @media."""
    i, n = 0, len(css)
    while i < n:
        j = css.find("{", i)
        if j < 0: return
        prelude = css[i:j].strip()
        depth, k = 1, j + 1
        while depth and k < n:
            if css[k] == "{": depth += 1
            elif css[k] == "}": depth -= 1
            k += 1
        yield prelude, css[j + 1:k - 1]
        i = k

def rule_out(prelude, body):
    if prelude.startswith(("@keyframes", "@property", "@tailwind", "@font-face")): return ""
    if prelude.startswith("@media"):
        if "prefers-reduced-motion" in prelude: return ""
        inner = "".join(rule_out(p, b) for p, b in parse(body))
        return f"{prelude} {{\n{inner}}}\n" if inner else ""
    sels = [s for s in split_top(prelude) if not KEEP_DARK.search(s) and not s.startswith("*")]
    if not sels: return ""
    decls = []
    for d in split_top(body, ";"):
        if ":" not in d: continue
        prop, val = d.split(":", 1)
        prop, val = prop.strip(), val.strip()
        if not COLOR_PROPS.match(prop): continue
        nv = map_value(prop, val)
        if nv: decls.append(f"{prop}: {nv}")
    if not decls: return ""
    return f"{', '.join(scope(s) for s in sels)} {{ {'; '.join(decls)}; }}\n"

LIGHT_EXTRA = r'''
/* ---------- hand-tuned light-mode rules ---------- */
html[data-theme="light"] { color-scheme: light; --caramel: #a9672b; --silver: #5d6779; }
html[data-theme="light"] .vignette { background: radial-gradient(120% 90% at 50% 30%, transparent 60%, rgba(180,195,225,.45) 100%); }
html[data-theme="light"] .au1 { opacity: .22; } html[data-theme="light"] .au2 { opacity: .2; } html[data-theme="light"] .au3 { opacity: .14; }
html[data-theme="light"] .grain { opacity: .05; mix-blend-mode: multiply; }
html[data-theme="light"] .cursor-glow { mix-blend-mode: multiply; background: radial-gradient(circle, rgba(56,140,248,.09), transparent 60%); }
html[data-theme="light"] .hero-bg { filter: saturate(.9) brightness(1.04); }
html[data-theme="light"] .hero h1, html[data-theme="light"] .page h1 { color: #0b1220; }
html[data-theme="light"] .nav.scrolled { box-shadow: 0 8px 30px -18px rgba(30,41,59,.35); }
html[data-theme="light"] .nav-links .resume, html[data-theme="light"] .clinks .em, html[data-theme="light"] .cv-dl .pdf { color: #fff; }
html[data-theme="light"] .tile, html[data-theme="light"] .card, html[data-theme="light"] .ach,
html[data-theme="light"] .wrc, html[data-theme="light"] .labcard, html[data-theme="light"] .about-box {
  background: linear-gradient(180deg, rgba(255,255,255,.86), rgba(246,248,253,.9)); box-shadow: 0 10px 30px -18px rgba(30,41,59,.25); }
html[data-theme="light"] .labcard.live {
  background: linear-gradient(180deg, rgba(255,255,255,.92), rgba(246,248,253,.94)) padding-box,
              conic-gradient(from var(--ang), #d9d2f5, #7c3aed 12%, #0284c7 22%, #d9d2f5 34%, #d9d2f5) border-box; }
html[data-theme="light"] :is(.tile, .card, .ach, .wrc, .labcard, .about-box)::before {
  background: radial-gradient(260px circle at var(--mx, 50%) var(--my, 50%), rgba(2,132,199,.55), transparent 42%); }
html[data-theme="light"] :is(.tile, .card, .ach, .wrc, .labcard, .about-box)::after {
  background: radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), rgba(56,140,248,.07), transparent 45%); }
html[data-theme="light"] .wrc:hover, html[data-theme="light"] .labcard:hover, html[data-theme="light"] .ach:hover {
  box-shadow: 0 22px 50px -20px rgba(30,41,59,.35), 0 0 40px -22px rgba(2,132,199,.35); }
html[data-theme="light"] .page::before {
  background: radial-gradient(45% 55% at 25% 45%, rgba(56,189,248,.16), transparent 70%), radial-gradient(40% 50% at 65% 30%, rgba(167,139,250,.16), transparent 70%); }
html[data-theme="light"] .scrollbar { box-shadow: 0 0 10px rgba(2,132,199,.4); }

/* instrument panels stay dark on the light page — like terminals */
html[data-theme="light"] :is(.demo, .dream, .qa, .post-body pre) {
  color: #eaf2ff; --ink: #eaf2ff; --dim: #8da2c0; --cy: #38bdf8; --cy2: #22d3ee; --vi: #a78bfa; --vi2: #c084fc;
  box-shadow: 0 30px 70px -30px rgba(15,23,42,.55); }
html[data-theme="light"] .post-body pre { background: #0a1322; }
'''

def main():
    css = re.sub(r"/\*.*?\*/", "", SRC.read_text(encoding="utf-8"), flags=re.S)
    css = re.sub(r"@tailwind[^;]*;", "", css)
    body = "".join(rule_out(p, b) for p, b in parse(css))
    head = "/* AUTO-GENERATED by tools/gen_light_theme.py from globals.css — do not edit by hand. */\n"
    OUT.write_text(head + body + LIGHT_EXTRA, encoding="utf-8")
    print(f"wrote {OUT} ({body.count(chr(10))} rules)")

if __name__ == "__main__":
    main()
