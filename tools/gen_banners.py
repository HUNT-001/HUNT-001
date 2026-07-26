#!/usr/bin/env python3
"""Generate section banners matching the existing HUNT-001 design language."""
import os

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets")

W, H = 1400, 100
CX = W / 2

# accent palettes
SILICON = dict(a="#38BDF8", b="#22D3EE", c="#60A5FA", glow="#1D4ED8", ring="#162F5C")
QUANTUM = dict(a="#A78BFA", b="#C084FC", c="#818CF8", glow="#6D28D9", ring="#2A2160")
FUSION  = dict(a="#38BDF8", b="#A78BFA", c="#60A5FA", glow="#3730A3", ring="#1E2A5C")


def banner(title, pal, sub=None, motif="brackets"):
    a, b, c, glow, ring = pal["a"], pal["b"], pal["c"], pal["glow"], pal["ring"]
    # rough width of the title so the bracket glyphs sit just outside it
    tw = len(title) * (30 * 0.66 + 10)
    lx, rx = CX - tw / 2 - 32, CX + tw / 2 + 18
    ty = 59.0 if not sub else 52.0

    subtxt = ""
    if sub:
        subtxt = (
            f'<text x="{CX}" y="76" text-anchor="middle" fill="{c}" font-size="11.5" '
            f'font-family="Consolas, monospace" letter-spacing="4.5" opacity="0.62">{sub}</text>'
        )

    # decorative motif behind the title
    if motif == "wafer":
        deco = "".join(
            f'<circle cx="{x}" cy="50" r="{r}" fill="none" stroke="{a}" '
            f'stroke-width="0.8" opacity="{op}"/>'
            for x, r, op in ((150, 30, 0.18), (150, 20, 0.26), (150, 10, 0.34),
                             (1250, 30, 0.18), (1250, 20, 0.26), (1250, 10, 0.34))
        )
    elif motif == "orbital":
        deco = "".join(
            f'<ellipse cx="{x}" cy="50" rx="34" ry="12" fill="none" stroke="{b}" '
            f'stroke-width="0.9" opacity="0.28" transform="rotate({rot} {x} 50)"/>'
            for x in (150, 1250) for rot in (0, 60, 120)
        ) + "".join(
            f'<circle cx="{x}" cy="50" r="3" fill="{b}" opacity="0.75"/>' for x in (150, 1250)
        )
    elif motif == "waveform":
        deco = "".join(
            f'<path d="M{x} 62 L{x+10} 62 L{x+10} 40 L{x+26} 40 L{x+26} 62 '
            f'L{x+42} 62 L{x+42} 40 L{x+56} 40" fill="none" stroke="{a}" '
            f'stroke-width="1.1" opacity="0.30"/>'
            for x in (96, 1248)
        )
    else:  # grid / default
        deco = "".join(
            f'<rect x="{x}" y="{y}" width="11" height="11" fill="none" stroke="{a}" '
            f'stroke-width="0.7" opacity="0.22"/>'
            for x in (120, 135, 150, 165, 1235, 1250, 1265, 1280)
            for y in (36, 51, 66)
        )

    return f'''<svg width="{W}" height="{H}" viewBox="0 0 {W} {H}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="{W}" y2="{H}" gradientUnits="userSpaceOnUse">
      <stop offset="0%"   stop-color="#030811"/>
      <stop offset="45%"  stop-color="#071226"/>
      <stop offset="100%" stop-color="#0C1D3E"/>
    </linearGradient>
    <radialGradient id="glow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
      gradientTransform="translate({CX} 50) scale(420 90)">
      <stop offset="0%"   stop-color="{glow}" stop-opacity="0.20"/>
      <stop offset="100%" stop-color="{glow}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="lineGrad" x1="0" y1="0" x2="{W}" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0%"   stop-color="{c}" stop-opacity="0"/>
      <stop offset="22%"  stop-color="{c}" stop-opacity="0.6"/>
      <stop offset="50%"  stop-color="#E0F2FE" stop-opacity="0.85"/>
      <stop offset="78%"  stop-color="{b}" stop-opacity="0.6"/>
      <stop offset="100%" stop-color="{a}" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="scan" x1="0" y1="0" x2="200" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0%"   stop-color="{a}" stop-opacity="0"/>
      <stop offset="50%"  stop-color="#E0F2FE" stop-opacity="0.30"/>
      <stop offset="100%" stop-color="{a}" stop-opacity="0"/>
    </linearGradient>
    <pattern id="dotGrid" x="0" y="0" width="36" height="36" patternUnits="userSpaceOnUse">
      <circle cx="18" cy="18" r="0.7" fill="#4A90D9" fill-opacity="0.10"/>
    </pattern>
    <filter id="textGlow" x="-20%" y="-60%" width="140%" height="220%">
      <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="{a}" flood-opacity="0.38"/>
    </filter>
    <filter id="cornerGlow" x="-60%" y="-60%" width="280%" height="280%">
      <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="{c}" flood-opacity="0.5"/>
    </filter>
    <clipPath id="clip"><rect width="{W}" height="{H}" rx="16"/></clipPath>
  </defs>

  <rect width="{W}" height="{H}" rx="16" fill="url(#bg)"/>
  <rect width="{W}" height="{H}" rx="16" fill="url(#glow)"/>

  <g clip-path="url(#clip)">
    <rect width="{W}" height="{H}" fill="url(#dotGrid)"/>

    <rect x="0" y="10" width="{W}" height="1" fill="url(#lineGrad)" opacity="0.75"/>
    <rect x="0" y="90" width="{W}" height="1" fill="url(#lineGrad)" opacity="0.55"/>

    {deco}

    <rect x="-200" y="0" width="200" height="{H}" fill="url(#scan)" opacity="0.55">
      <animate attributeName="x" values="-200;{W}" dur="7s" repeatCount="indefinite"/>
    </rect>

    <g filter="url(#cornerGlow)" opacity="0.85">
      <path d="M22 20 L22 40 M22 20 L42 20" stroke="{a}" stroke-width="1.6" stroke-linecap="round"/>
      <circle cx="22" cy="20" r="2" fill="{c}"/>
    </g>
    <g filter="url(#cornerGlow)" opacity="0.85">
      <path d="M1378 20 L1378 40 M1378 20 L1358 20" stroke="{a}" stroke-width="1.6" stroke-linecap="round"/>
      <circle cx="1378" cy="20" r="2" fill="{c}"/>
    </g>
    <g filter="url(#cornerGlow)" opacity="0.85">
      <path d="M22 80 L22 60 M22 80 L42 80" stroke="{b}" stroke-width="1.6" stroke-linecap="round"/>
      <circle cx="22" cy="80" r="2" fill="{b}"/>
    </g>
    <g filter="url(#cornerGlow)" opacity="0.85">
      <path d="M1378 80 L1378 60 M1378 80 L1358 80" stroke="{b}" stroke-width="1.6" stroke-linecap="round"/>
      <circle cx="1378" cy="80" r="2" fill="{b}"/>
    </g>

    <text x="{lx:.1f}" y="{ty:.1f}" fill="{c}" font-size="18" font-family="Consolas, monospace" opacity="0.55">&#8249;</text>
    <text x="{rx:.1f}" y="{ty:.1f}" fill="{c}" font-size="18" font-family="Consolas, monospace" opacity="0.55">&#8250;</text>

    <text x="{CX}" y="{ty:.1f}"
          text-anchor="middle"
          fill="#C8E0F8"
          font-size="30"
          font-family="'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
          font-weight="700"
          letter-spacing="10"
          filter="url(#textGlow)">{title}</text>
    {subtxt}

    <rect x="1" y="1" width="{W-2}" height="{H-2}" rx="15.5" fill="none" stroke="{ring}" stroke-width="1" opacity="0.6"/>
  </g>
</svg>
'''


BANNERS = [
    ("banner-projects.svg",       "PROJECTS",      SILICON, "SELECTED  ENGINEERING  WORK",        "grid"),
    ("banner-research.svg",       "RESEARCH",      FUSION,  "WORLD  MODELS  /  RL  /  GNN  /  AGENTIC",  "orbital"),
    ("banner-mathematics.svg",    "MATHEMATICS",   FUSION,  "THE  FORMALISM  UNDERNEATH",        "orbital"),
    ("banner-silicon.svg",        "SILICON",       SILICON, "RTL  →  SYNTHESIS  →  GDSII  →  TAPEOUT", "wafer"),
    ("banner-verification.svg",   "VERIFICATION",  SILICON, "UVM  /  COCOTB  /  FORMAL  /  COVERAGE",  "waveform"),
    ("banner-fabrication.svg",    "FABRICATION",   SILICON, "LITHOGRAPHY  /  FINFET  /  GAA  /  YIELD", "wafer"),
    ("banner-achievements.svg",   "ACHIEVEMENTS",  FUSION,  "NATIONAL  FINALS  &amp;  PODIUMS",  "grid"),
    ("banner-quantum.svg",        "QUANTUM",       QUANTUM, "HILBERT  SPACE  /  VQE  /  QML",    "orbital"),
    ("banner-algorithms.svg",     "ALGORITHMS",    FUSION,  "ORIGINAL  RESEARCH  &amp;  DERIVATIONS", "grid"),
    ("banner-uiux.svg",           "INTERFACE",     FUSION,  "UI  /  UX  /  DESIGN  SYSTEMS",     "grid"),
]

os.makedirs(OUT, exist_ok=True)
for fn, title, pal, sub, motif in BANNERS:
    with open(os.path.join(OUT, fn), "w", encoding="utf-8") as f:
        f.write(banner(title, pal, sub, motif))
    print("wrote", fn)
