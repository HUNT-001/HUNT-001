#!/usr/bin/env python3
"""
Generates assets/certifications-panel.svg.

  ▸ EDIT THE `CERTS` LIST BELOW, then run:  python tools/gen_certifications.py
  ▸ Each entry is: (title, issuer, code_or_year, domain)
      code_or_year may be "" — the line is simply omitted.
      domain ∈ {"si", "cs", "ml", "cl", "q"}
        si = silicon/hardware   cs = algorithms/theory   ml = AI & agents
        cl = cloud & data       q  = quantum
  ▸ Any number of entries works; the grid reflows to 3 columns.
"""
import os, math

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets")
os.makedirs(OUT, exist_ok=True)

# ─────────────────────────────────────────────────────────────────────────────
# EDIT ME  —  (title, issuer, code/year, domain)
# ─────────────────────────────────────────────────────────────────────────────
CERTS = [
    ("Hardware Security",                    "University of Maryland · Coursera", "",              "si"),
    ("VLSI Design",                          "L&T EduTech",                       "",              "si"),
    ("Algorithms Specialization",            "Stanford University · Coursera",    "4-course track","cs"),

    ("Agentic AI Foundations Associate",     "Oracle",                            "1Z0-1157-26",   "ml"),
    ("AI Agents Course",                     "Hugging Face",                      "",              "ml"),
    ("SQL AI Developer Associate",           "Microsoft",                         "DP-800",        "cl"),

    ("Certified Cloud Practitioner",         "Amazon Web Services",               "CLF-C02",       "cl"),
    ("Data Analytics Professional",          "Google · Coursera",                 "8-course track","cl"),
]
# ─────────────────────────────────────────────────────────────────────────────

W = 1400
MONO = "Consolas, 'JetBrains Mono', monospace"
SANS = "'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
ACCENT = {"si": "#38BDF8", "cs": "#60A5FA", "ml": "#A78BFA", "cl": "#22D3EE", "q": "#C084FC"}
INK, DIM = "#C8E0F8", "#7FA6D4"


def esc(s):
    return str(s).replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def build():
    cols = 3
    rows = max(1, math.ceil(len(CERTS) / cols)) if CERTS else 1
    m, gap = 46, 22
    cw = (W - 2 * m - (cols - 1) * gap) / cols
    ch, top = 92, 96
    h = top + rows * (ch + gap) + 28

    p = []
    p.append(f'<text x="{W/2}" y="46" text-anchor="middle" fill="{INK}" font-size="20" '
             f'font-family="{SANS}" font-weight="700" letter-spacing="7" filter="url(#soft)">'
             f'CERTIFICATIONS &amp; COURSEWORK</text>')
    p.append(f'<text x="{W/2}" y="70" text-anchor="middle" fill="{DIM}" font-size="11" '
             f'font-family="{MONO}" letter-spacing="3" opacity="0.72">'
             f'formal training behind the informal reading</text>')

    if not CERTS:
        p.append(f'<text x="{W/2}" y="{top+52}" text-anchor="middle" fill="{DIM}" font-size="12" '
                 f'font-family="{MONO}" opacity="0.55">populate CERTS in tools/gen_certifications.py '
                 f'and re-run</text>')
    for i, (title, issuer, code, dom) in enumerate(CERTS):
        col, row = i % cols, i // cols
        x = m + col * (cw + gap)
        y = top + row * (ch + gap)
        c = ACCENT.get(dom, "#38BDF8")
        codeline = ""
        if code:
            cwid = len(code) * 5.9 + 18
            codeline = (
                f'<rect x="{x+22:.1f}" y="{y+64}" width="{cwid:.1f}" height="17" rx="4.5" '
                f'fill="{c}" fill-opacity="0.13" stroke="{c}" stroke-width="0.7" stroke-opacity="0.4"/>'
                f'<text x="{x+22+cwid/2:.1f}" y="{y+76}" text-anchor="middle" fill="{c}" font-size="9.2" '
                f'font-family="{MONO}" letter-spacing="1" opacity="0.92">{esc(code)}</text>')
        p.append(f'''
    <g>
      <rect x="{x:.1f}" y="{y}" width="{cw:.1f}" height="{ch}" rx="11" fill="#08152B" fill-opacity="0.9"
            stroke="{c}" stroke-width="1" stroke-opacity="0.45"/>
      <rect x="{x:.1f}" y="{y}" width="3" height="{ch}" rx="1.5" fill="{c}" opacity="0.9"/>
      <text x="{x+22:.1f}" y="{y+32}" fill="#EAF4FF" font-size="13" font-family="{SANS}"
            font-weight="700" letter-spacing="0.3">{esc(title)}</text>
      <text x="{x+22:.1f}" y="{y+52}" fill="{c}" font-size="10.2" font-family="{MONO}"
            letter-spacing="1.3" opacity="0.88">{esc(issuer)}</text>
      {codeline}
      <circle cx="{x+cw-26:.1f}" cy="{y+28}" r="8" fill="none" stroke="{c}" stroke-width="1" opacity="0.5"/>
      <path d="M{x+cw-30:.1f} {y+28} l3 3 l6 -7" fill="none" stroke="{c}" stroke-width="1.6"
            stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>
      <animate attributeName="opacity" values="0.78;1;0.78" dur="5s" begin="{i*0.35:.1f}s" repeatCount="indefinite"/>
    </g>''')

    body = "\n".join(p)
    return f'''<svg width="{W}" height="{h}" viewBox="0 0 {W} {h}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="{W}" y2="{h}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#030811"/><stop offset="45%" stop-color="#071226"/>
      <stop offset="100%" stop-color="#0C1D3E"/>
    </linearGradient>
    <radialGradient id="amb" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
      gradientTransform="translate({W/2} {h/2}) scale({W*0.45} {h*0.7})">
      <stop offset="0%" stop-color="#1D4ED8" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="#1D4ED8" stop-opacity="0"/>
    </radialGradient>
    <pattern id="dotGrid" width="36" height="36" patternUnits="userSpaceOnUse">
      <circle cx="18" cy="18" r="0.7" fill="#4A90D9" fill-opacity="0.09"/>
    </pattern>
    <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="#38BDF8" flood-opacity="0.32"/>
    </filter>
    <clipPath id="clip"><rect width="{W}" height="{h}" rx="18"/></clipPath>
  </defs>
  <rect width="{W}" height="{h}" rx="18" fill="url(#bg)"/>
  <rect width="{W}" height="{h}" rx="18" fill="url(#amb)"/>
  <g clip-path="url(#clip)">
    <rect width="{W}" height="{h}" fill="url(#dotGrid)"/>
{body}
    <rect x="1" y="1" width="{W-2}" height="{h-2}" rx="17.5" fill="none" stroke="#1B3566" stroke-width="1" opacity="0.7"/>
  </g>
</svg>
'''


if __name__ == "__main__":
    path = os.path.join(OUT, "certifications-panel.svg")
    with open(path, "w", encoding="utf-8") as f:
        f.write(build())
    print(f"wrote {path}  ({len(CERTS)} entries)")
