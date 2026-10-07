#!/usr/bin/env python3
"""
assets/hero-bridge.svg — the signature animated banner.

The thesis of the whole profile in motion: a neural graph on the left and a
silicon die on the right, with packets flowing across the seam between them in
both directions. Pure looping SVG animation — GIF-like, but crisp, tiny, and
theme-aware. No external hosting.

Run:  python tools/gen_hero_anim.py
"""
import math, os

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "assets")
os.makedirs(OUT, exist_ok=True)

W, H = 1400, 300
CX = W / 2
MONO = "Consolas, 'JetBrains Mono', monospace"
SANS = "'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
VI_A, VI_B = "#A78BFA", "#C084FC"
CY_A, CY_B = "#38BDF8", "#22D3EE"
INK, DIM = "#CFE6FF", "#7FA6D4"

p = []

# ── left: neural graph (probabilistic / violet) ───────────────────────────────
import random
rng = random.Random(7)
layers = [(230, 3), (330, 4), (430, 4), (530, 3)]
nodes = []
for lx, n in layers:
    ys = [H/2 + (i - (n-1)/2) * 46 for i in range(n)]
    nodes.append([(lx, y) for y in ys])
# edges
for a, b in zip(nodes, nodes[1:]):
    for (x1, y1) in a:
        for (x2, y2) in b:
            p.append(f'<line x1="{x1}" y1="{y1:.0f}" x2="{x2}" y2="{y2:.0f}" '
                     f'stroke="{VI_A}" stroke-width="0.7" opacity="0.18"/>')
# firing pulses along a few edges
fire = [(nodes[0][0], nodes[1][1]), (nodes[1][2], nodes[2][0]),
        (nodes[2][3], nodes[3][1]), (nodes[1][1], nodes[2][2])]
for i, ((x1, y1), (x2, y2)) in enumerate(fire):
    p.append(f'<circle r="2.6" fill="{VI_B}"><animateMotion dur="2.6s" begin="{i*0.5:.1f}s" '
             f'repeatCount="indefinite" path="M{x1},{y1:.0f} L{x2},{y2:.0f}"/>'
             f'<animate attributeName="opacity" values="0;1;0" dur="2.6s" begin="{i*0.5:.1f}s" '
             f'repeatCount="indefinite"/></circle>')
# nodes
for layer in nodes:
    for (x, y) in layer:
        p.append(f'<circle cx="{x}" cy="{y:.0f}" r="6" fill="#0B1430" stroke="{VI_A}" stroke-width="1.2"/>'
                 f'<circle cx="{x}" cy="{y:.0f}" r="2.4" fill="{VI_B}">'
                 f'<animate attributeName="opacity" values="0.3;1;0.3" dur="{2.2+ (x%5)*0.2:.1f}s" '
                 f'repeatCount="indefinite"/></circle>')
p.append(f'<text x="330" y="236" text-anchor="middle" fill="{VI_A}" font-size="11" '
         f'font-family="{MONO}" letter-spacing="3" opacity="0.8">THE MODEL</text>')

# ── right: silicon die (deterministic / cyan) ─────────────────────────────────
dx0, dy0, dsz = 850, H/2 - 80, 160
p.append(f'<rect x="{dx0}" y="{dy0:.0f}" width="{dsz}" height="{dsz}" rx="10" '
         f'fill="#071A33" stroke="{CY_A}" stroke-width="1.4" opacity="0.9"/>')
# metal routing grid
step = dsz / 8
for i in range(1, 8):
    o = 0.10 + (0.05 if i % 2 else 0)
    p.append(f'<line x1="{dx0+i*step:.0f}" y1="{dy0:.0f}" x2="{dx0+i*step:.0f}" y2="{dy0+dsz:.0f}" '
             f'stroke="{CY_B}" stroke-width="0.7" opacity="{o}"/>')
    p.append(f'<line x1="{dx0:.0f}" y1="{dy0+i*step:.0f}" x2="{dx0+dsz:.0f}" y2="{dy0+i*step:.0f}" '
             f'stroke="{CY_B}" stroke-width="0.7" opacity="{o}"/>')
# core pads
for gx in range(2, 7, 2):
    for gy in range(2, 7, 2):
        p.append(f'<rect x="{dx0+gx*step-5:.0f}" y="{dy0+gy*step-5:.0f}" width="10" height="10" rx="2" '
                 f'fill="{CY_A}" fill-opacity="0.25" stroke="{CY_A}" stroke-width="0.8"/>')
# current flowing along routing tracks
for i, track in enumerate([2, 4, 6]):
    y = dy0 + track*step
    p.append(f'<circle r="2.4" fill="#67E8F9"><animateMotion dur="2.2s" begin="{i*0.4:.1f}s" '
             f'repeatCount="indefinite" path="M{dx0:.0f},{y:.0f} L{dx0+dsz:.0f},{y:.0f}"/>'
             f'<animate attributeName="opacity" values="0;1;1;0" dur="2.2s" begin="{i*0.4:.1f}s" '
             f'repeatCount="indefinite"/></circle>')
# pulsing core
p.append(f'<rect x="{dx0+dsz/2-16:.0f}" y="{dy0+dsz/2-16:.0f}" width="32" height="32" rx="5" '
         f'fill="{CY_A}" fill-opacity="0.18" stroke="{CY_A}" stroke-width="1.2">'
         f'<animate attributeName="fill-opacity" values="0.1;0.35;0.1" dur="2.4s" repeatCount="indefinite"/></rect>')
p.append(f'<text x="{dx0+dsz/2:.0f}" y="236" text-anchor="middle" fill="{CY_A}" font-size="11" '
         f'font-family="{MONO}" letter-spacing="3" opacity="0.8">THE MACHINE</text>')

# ── the seam: packets crossing both ways ──────────────────────────────────────
lseam, rseam = 560, 845
midy = H/2
p.append(f'<line x1="{lseam}" y1="{midy}" x2="{rseam}" y2="{midy}" stroke="url(#seam)" '
         f'stroke-width="1.4" opacity="0.5"/>')
# violet -> cyan (model compiles down to silicon)
for i in range(3):
    p.append(f'<circle r="3" fill="{VI_B}"><animateMotion dur="3s" begin="{i*1.0:.1f}s" '
             f'repeatCount="indefinite" path="M{lseam},{midy} C {CX-30},{midy-40} {CX+30},{midy-40} {rseam},{midy}"/>'
             f'<animate attributeName="fill" values="{VI_B};{CY_A}" dur="3s" begin="{i*1.0:.1f}s" '
             f'repeatCount="indefinite"/>'
             f'<animate attributeName="opacity" values="0;1;1;0" dur="3s" begin="{i*1.0:.1f}s" '
             f'repeatCount="indefinite"/></circle>')
# cyan -> violet (hardware constraints flow back into the model)
for i in range(3):
    p.append(f'<circle r="3" fill="{CY_B}"><animateMotion dur="3s" begin="{i*1.0+0.5:.1f}s" '
             f'repeatCount="indefinite" path="M{rseam},{midy} C {CX+30},{midy+40} {CX-30},{midy+40} {lseam},{midy}"/>'
             f'<animate attributeName="fill" values="{CY_B};{VI_A}" dur="3s" begin="{i*1.0+0.5:.1f}s" '
             f'repeatCount="indefinite"/>'
             f'<animate attributeName="opacity" values="0;1;1;0" dur="3s" begin="{i*1.0+0.5:.1f}s" '
             f'repeatCount="indefinite"/></circle>')
p.append(f'<text x="{CX:.0f}" y="{midy-54:.0f}" text-anchor="middle" fill="{INK}" font-size="13" '
         f'font-family="{SANS}" font-weight="700" letter-spacing="2">THE SEAM</text>')
p.append(f'<text x="{CX:.0f}" y="{midy+66:.0f}" text-anchor="middle" fill="{DIM}" font-size="10" '
         f'font-family="{MONO}" letter-spacing="1.5" opacity="0.8">where what thinks meets what it thinks on</text>')

body = "\n    ".join(p)
svg = f'''<svg width="{W}" height="{H}" viewBox="0 0 {W} {H}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="{W}" y2="{H}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#030811"/><stop offset="50%" stop-color="#071226"/>
      <stop offset="100%" stop-color="#0C1D3E"/>
    </linearGradient>
    <radialGradient id="ambL" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
      gradientTransform="translate(330 150) scale(360 180)">
      <stop offset="0%" stop-color="{VI_A}" stop-opacity="0.15"/><stop offset="100%" stop-color="{VI_A}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="ambR" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
      gradientTransform="translate(1070 150) scale(360 180)">
      <stop offset="0%" stop-color="{CY_A}" stop-opacity="0.14"/><stop offset="100%" stop-color="{CY_A}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="seam" x1="{lseam}" y1="0" x2="{rseam}" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="{VI_A}"/><stop offset="100%" stop-color="{CY_A}"/>
    </linearGradient>
    <pattern id="dotGrid" width="36" height="36" patternUnits="userSpaceOnUse">
      <circle cx="18" cy="18" r="0.7" fill="#4A90D9" fill-opacity="0.09"/>
    </pattern>
    <clipPath id="clip"><rect width="{W}" height="{H}" rx="16"/></clipPath>
  </defs>
  <rect width="{W}" height="{H}" rx="16" fill="url(#bg)"/>
  <rect width="{W}" height="{H}" rx="16" fill="url(#ambL)"/>
  <rect width="{W}" height="{H}" rx="16" fill="url(#ambR)"/>
  <g clip-path="url(#clip)">
    <rect width="{W}" height="{H}" fill="url(#dotGrid)"/>
    {body}
    <rect x="1" y="1" width="{W-2}" height="{H-2}" rx="15.5" fill="none" stroke="#1B3566" stroke-width="1" opacity="0.7"/>
  </g>
</svg>
'''
with open(os.path.join(OUT, "hero-bridge.svg"), "w", encoding="utf-8", newline="\n") as f:
    f.write(svg)
print("wrote assets/hero-bridge.svg")
