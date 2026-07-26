#!/usr/bin/env python3
"""
Generates assets/signal-constellation.svg — the radial "signal broadcast" panel.

  Run:  python tools/gen_constellation.py

Design rules that keep it readable:
  · nodes sit on an ellipse, offset 22.5° so none lands directly above/below the
    hub — that was the old overlap bug (top label collided with the hub rings,
    bottom label collided with the rotating title)
  · every label gets an opaque backing plate, so text never fights the dot grid
  · the title band is separated by a rule and has its own reserved vertical space
"""
import math
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "assets")
os.makedirs(OUT, exist_ok=True)

W, H = 1400, 462
CX, CY = 700.0, 188.0
RX, RY = 486.0, 132.0            # node orbit
HUB_R = 46                        # solid hub radius
HUB_PULSE_MAX = 84                # outermost pulse ring
NODE_R = 30

SANS = "'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
MONO = "Consolas, 'JetBrains Mono', monospace"

CY_A, CY_B = "#38BDF8", "#22D3EE"
VI_A, VI_B = "#A78BFA", "#C084FC"

# (label, accent) — clockwise from the right.
# These are the same eight axes as the research radar, so the two panels agree.
# Violet = probabilistic / learned, cyan = silicon / deterministic.
NODES = [
    ("Model-Based RL",      VI_A),
    ("World Models",        VI_A),
    ("Agentic AI",          VI_B),
    ("Graph Neural Nets",   VI_B),
    ("Quantum ML",          VI_B),
    ("Quantized Edge ML",   CY_A),
    ("RTL & Architecture",  CY_B),
    ("Formal Verification", CY_B),
]

TITLES = [
    "Building where algorithms meet atoms",
    "World models, and the silicon to run them",
    "Model-based RL · Agentic systems · GNNs",
    "RTL, verification, and AI accelerators",
    "Research-driven, deployment-obsessed",
]

TITLE_Y = 426
RULE_Y = 398
CYCLE = 22.0                      # seconds for one full title rotation


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def label_plate(cx, cy, text, colour):
    """Rounded backing plate + centred label. Width is measured, not guessed."""
    fs = 11.5
    tw = len(text) * (fs * 0.60) + 2.0 * (len(text) - 1)   # glyph + letter-spacing
    pw, ph = tw + 26, 23
    px, py = cx - pw / 2, cy + NODE_R + 12
    return (
        f'<rect x="{px:.1f}" y="{py:.1f}" width="{pw:.1f}" height="{ph}" rx="7" '
        f'fill="#050D1E" fill-opacity="0.94" stroke="{colour}" stroke-width="0.8" stroke-opacity="0.42"/>'
        f'<text x="{cx:.1f}" y="{py + 15.4:.1f}" text-anchor="middle" fill="#DCEBFF" font-size="{fs}" '
        f'font-family="{MONO}" letter-spacing="2">{esc(text)}</text>'
    ), py + ph


def build():
    n = len(NODES)
    parts = []
    pos = []

    # offset by half a step so nothing sits at 90° / 270° (directly over the hub)
    for i in range(n):
        ang = (2 * math.pi * i / n) - (math.pi / n)
        pos.append((CX + RX * math.cos(ang), CY - RY * math.sin(ang)))

    # ── spokes + travelling packets
    for i, (nx, ny) in enumerate(pos):
        dx, dy = nx - CX, ny - CY
        d = math.hypot(dx, dy)
        sx, sy = CX + dx / d * (HUB_R + 4), CY + dy / d * (HUB_R + 4)
        ex, ey = nx - dx / d * (NODE_R + 3), ny - dy / d * (NODE_R + 3)
        parts.append(f'<line x1="{sx:.1f}" y1="{sy:.1f}" x2="{ex:.1f}" y2="{ey:.1f}" '
                     f'stroke="#1E3F72" stroke-width="1" opacity="0.6"/>')
        parts.append(
            f'<circle r="2.6" fill="#7DD3FC">'
            f'<animateMotion dur="3.2s" begin="{i*0.4:.2f}s" repeatCount="indefinite" '
            f'path="M{sx:.1f},{sy:.1f} L{ex:.1f},{ey:.1f}"/>'
            f'<animate attributeName="opacity" values="0;1;1;0" dur="3.2s" '
            f'begin="{i*0.4:.2f}s" repeatCount="indefinite"/></circle>')

    # ── nodes
    for i, ((nx, ny), (text, col)) in enumerate(zip(pos, NODES)):
        plate, _ = label_plate(nx, ny, text, col)
        parts.append(f'''
    <g>
      <circle cx="{nx:.1f}" cy="{ny:.1f}" r="{NODE_R}" fill="#060F22" fill-opacity="0.9"
              stroke="{col}" stroke-width="1" stroke-opacity="0.55"/>
      <circle cx="{nx:.1f}" cy="{ny:.1f}" r="{NODE_R}" fill="none" stroke="{col}" stroke-width="1" opacity="0.45">
        <animate attributeName="r" values="{NODE_R};{NODE_R+6};{NODE_R}" dur="3.8s"
                 begin="{i*0.42:.2f}s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.45;0.04;0.45" dur="3.8s"
                 begin="{i*0.42:.2f}s" repeatCount="indefinite"/>
      </circle>
      <circle cx="{nx:.1f}" cy="{ny:.1f}" r="3.4" fill="{col}"/>
      {plate}
    </g>''')

    # ── hub: expanding rings, then the solid core on top
    for j, (col, op, delay) in enumerate([("#1D4ED8", 0.30, 0), ("#22D3EE", 0.24, 1.5), ("#818CF8", 0.20, 3.0)]):
        parts.append(
            f'<circle cx="{CX}" cy="{CY}" r="{HUB_R+8}" fill="none" stroke="{col}" stroke-width="1" opacity="{op}">'
            f'<animate attributeName="r" values="{HUB_R+8};{HUB_PULSE_MAX};{HUB_R+8}" dur="4.5s" '
            f'begin="{delay}s" repeatCount="indefinite"/>'
            f'<animate attributeName="opacity" values="{op};0;{op}" dur="4.5s" '
            f'begin="{delay}s" repeatCount="indefinite"/></circle>')

    parts.append(f'<circle cx="{CX}" cy="{CY}" r="{HUB_R}" fill="#060F22" fill-opacity="0.92" '
                 f'stroke="#3B82F6" stroke-width="1.4"/>')
    parts.append(f'<circle cx="{CX}" cy="{CY}" r="38" fill="none" stroke="#0F2040" stroke-width="3"/>')
    parts.append(
        f'<circle cx="{CX}" cy="{CY}" r="38" fill="none" stroke="#67E8F9" stroke-width="3" '
        f'stroke-dasharray="60 179" stroke-linecap="round" opacity="0.85">'
        f'<animateTransform attributeName="transform" type="rotate" '
        f'values="0 {CX} {CY};360 {CX} {CY}" dur="6s" repeatCount="indefinite"/></circle>')
    parts.append(
        f'<circle cx="{CX}" cy="{CY}" r="38" fill="none" stroke="{VI_A}" stroke-width="2" '
        f'stroke-dasharray="24 215" stroke-linecap="round" opacity="0.7">'
        f'<animateTransform attributeName="transform" type="rotate" '
        f'values="360 {CX} {CY};0 {CX} {CY}" dur="9s" repeatCount="indefinite"/></circle>')
    parts.append(f'<circle cx="{CX}" cy="{CY}" r="5" fill="#E0F2FE">'
                 f'<animate attributeName="opacity" values="1;0.4;1" dur="1.8s" repeatCount="indefinite"/></circle>')

    # ── rotating title band
    parts.append(f'<line x1="0" y1="{RULE_Y}" x2="{W}" y2="{RULE_Y}" stroke="#162F5C" stroke-width="1" opacity="0.55"/>')
    k = len(TITLES)
    seg = 1.0 / k
    for i, t in enumerate(TITLES):
        s = i * seg
        kt = f"0;{s:.4f};{s+0.012:.4f};{s+seg-0.012:.4f};{s+seg:.4f};1"
        parts.append(
            f'<text x="{CX}" y="{TITLE_Y}" text-anchor="middle" fill="#8ED8FB" font-size="19" '
            f'font-family="{SANS}" font-weight="700" letter-spacing="1.2" '
            f'filter="url(#textGlow)" opacity="{1 if i == 0 else 0}">{esc(t)}'
            f'<animate attributeName="opacity" values="0;0;1;1;0;0" keyTimes="{kt}" '
            f'dur="{CYCLE}s" repeatCount="indefinite"/></text>')

    body = "\n    ".join(parts)

    return f'''<svg width="{W}" height="{H}" viewBox="0 0 {W} {H}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="{W}" y2="{H}" gradientUnits="userSpaceOnUse">
      <stop offset="0%"   stop-color="#030811"/>
      <stop offset="50%"  stop-color="#071226"/>
      <stop offset="100%" stop-color="#0C1D3E"/>
    </linearGradient>
    <radialGradient id="amb" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
      gradientTransform="translate({CX} {CY}) scale(560 240)">
      <stop offset="0%"   stop-color="#1D4ED8" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#1D4ED8" stop-opacity="0"/>
    </radialGradient>
    <pattern id="dotGrid" x="0" y="0" width="36" height="36" patternUnits="userSpaceOnUse">
      <circle cx="18" cy="18" r="0.7" fill="#4A90D9" fill-opacity="0.10"/>
    </pattern>
    <filter id="textGlow" x="-30%" y="-100%" width="160%" height="300%">
      <feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="{CY_A}" flood-opacity="0.42"/>
    </filter>
    <filter id="cornerGlow" x="-60%" y="-60%" width="280%" height="280%">
      <feDropShadow dx="0" dy="0" stdDeviation="3" flood-color="#60A5FA" flood-opacity="0.5"/>
    </filter>
    <clipPath id="clip"><rect width="{W}" height="{H}" rx="16"/></clipPath>
  </defs>

  <rect width="{W}" height="{H}" rx="16" fill="url(#bg)"/>
  <rect width="{W}" height="{H}" rx="16" fill="url(#amb)"/>
  <g clip-path="url(#clip)">
    <rect width="{W}" height="{H}" fill="url(#dotGrid)"/>

    <text x="46" y="34" fill="#3B6EA8" font-size="10" font-family="{MONO}" letter-spacing="2.6"
          opacity="0.72">// SIGNAL BROADCAST</text>
    <text x="{W-30}" y="34" text-anchor="end" fill="#3B6EA8" font-size="10" font-family="{MONO}"
          letter-spacing="2.6" opacity="0.6">{len(NODES)} DOMAINS &#183; ONE SUBSTRATE</text>

    {body}

    <g filter="url(#cornerGlow)" opacity="0.8">
      <path d="M22 22 L22 42 M22 22 L42 22" stroke="{CY_A}" stroke-width="1.6" stroke-linecap="round"/>
    </g>
    <g filter="url(#cornerGlow)" opacity="0.8">
      <path d="M{W-22} {H-22} L{W-22} {H-42} M{W-22} {H-22} L{W-42} {H-22}"
            stroke="{CY_B}" stroke-width="1.6" stroke-linecap="round"/>
    </g>

    <rect x="1" y="1" width="{W-2}" height="{H-2}" rx="15.5" fill="none" stroke="#162F5C"
          stroke-width="1" opacity="0.6"/>
  </g>
</svg>
'''


if __name__ == "__main__":
    path = os.path.join(OUT, "signal-constellation.svg")
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(build())
    print(f"wrote {path}  ({len(NODES)} nodes, {len(TITLES)} rotating titles)")
