#!/usr/bin/env python3
"""Feature SVGs for the HUNT-001 profile README: silicon flow, fab stack,
research radar, showpiece equations, achievements, verification stack, dividers."""
import math, os

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets")
os.makedirs(OUT, exist_ok=True)
W = 1400

CY_A, CY_B, CY_C = "#38BDF8", "#22D3EE", "#60A5FA"
VI_A, VI_B = "#A78BFA", "#C084FC"
INK, DIM = "#C8E0F8", "#7FA6D4"
MONO = "Consolas, 'JetBrains Mono', monospace"
SANS = "'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
SERIF = "'Cambria Math', 'Latin Modern Math', Georgia, serif"


def shell(h, body, defs="", glow="#1D4ED8", rx=18):
    """Standard framed panel with gradient bg + dot grid."""
    return f'''<svg width="{W}" height="{h}" viewBox="0 0 {W} {h}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="{W}" y2="{h}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#030811"/><stop offset="45%" stop-color="#071226"/>
      <stop offset="100%" stop-color="#0C1D3E"/>
    </linearGradient>
    <radialGradient id="amb" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
      gradientTransform="translate({W/2} {h/2}) scale({W*0.45} {h*0.7})">
      <stop offset="0%" stop-color="{glow}" stop-opacity="0.17"/>
      <stop offset="100%" stop-color="{glow}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="dotGrid" width="36" height="36" patternUnits="userSpaceOnUse">
      <circle cx="18" cy="18" r="0.7" fill="#4A90D9" fill-opacity="0.09"/>
    </pattern>
    <filter id="soft" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="0" stdDeviation="5" flood-color="{CY_A}" flood-opacity="0.32"/>
    </filter>
    <filter id="softv" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="{VI_A}" flood-opacity="0.35"/>
    </filter>
    <clipPath id="clip"><rect width="{W}" height="{h}" rx="{rx}"/></clipPath>
{defs}
  </defs>
  <rect width="{W}" height="{h}" rx="{rx}" fill="url(#bg)"/>
  <rect width="{W}" height="{h}" rx="{rx}" fill="url(#amb)"/>
  <g clip-path="url(#clip)">
    <rect width="{W}" height="{h}" fill="url(#dotGrid)"/>
{body}
    <rect x="1" y="1" width="{W-2}" height="{h-2}" rx="{rx-0.5}" fill="none" stroke="#1B3566" stroke-width="1" opacity="0.7"/>
  </g>
</svg>
'''


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


# ─────────────────────────── 1. RTL → GDSII pipeline ───────────────────────────
def silicon_flow():
    h = 300
    stages = [
        ("01", "SPEC",        "arch  ·  budget"),
        ("02", "RTL",         "SystemVerilog"),
        ("03", "LINT / CDC",  "Spyglass  ·  rules"),
        ("04", "VERIFY",      "UVM  ·  cocotb"),
        ("05", "SYNTH",       "gate netlist"),
        ("06", "FLOORPLAN",   "macro  ·  power"),
        ("07", "CTS + P&R",   "clock  ·  route"),
        ("08", "STA / SI",    "timing signoff"),
        ("09", "DRC / LVS",   "physical signoff"),
        ("10", "GDSII",       "tapeout"),
    ]
    n = len(stages)
    m, bw = 30, 118
    gap = (W - 2 * m - n * bw) / (n - 1)
    top, bh = 96, 96
    parts = []

    # header
    parts.append(f'<text x="{W/2}" y="46" text-anchor="middle" fill="{INK}" font-size="21" '
                 f'font-family="{SANS}" font-weight="700" letter-spacing="7" filter="url(#soft)">'
                 f'RTL &#8594; GDSII &#160; &#8212; &#160; THE FLOW I BUILD INSIDE</text>')
    parts.append(f'<text x="{W/2}" y="70" text-anchor="middle" fill="{DIM}" font-size="11.5" '
                 f'font-family="{MONO}" letter-spacing="3.4" opacity="0.75">'
                 f'every stage below is a place where a design can die &#8212; and where verification earns its keep</text>')

    # connector rail
    rail_y = top + bh / 2
    parts.append(f'<rect x="{m}" y="{rail_y-0.5}" width="{W-2*m}" height="1" fill="{CY_C}" opacity="0.20"/>')

    for i, (num, name, tool) in enumerate(stages):
        x = m + i * (bw + gap)
        t = i / (n - 1)
        # hue shift cyan -> violet across the flow
        col = CY_A if i < 5 else (VI_A if i >= 8 else CY_B)
        parts.append(f'''
    <g>
      <rect x="{x:.1f}" y="{top}" width="{bw}" height="{bh}" rx="11" fill="#08152B" fill-opacity="0.92"
            stroke="{col}" stroke-width="1.1" stroke-opacity="0.55"/>
      <rect x="{x:.1f}" y="{top}" width="{bw}" height="3" rx="1.5" fill="{col}" opacity="0.85"/>
      <text x="{x+bw/2:.1f}" y="{top+27}" text-anchor="middle" fill="{col}" font-size="10"
            font-family="{MONO}" letter-spacing="2" opacity="0.8">{num}</text>
      <text x="{x+bw/2:.1f}" y="{top+52}" text-anchor="middle" fill="{INK}" font-size="12.5"
            font-family="{SANS}" font-weight="700" letter-spacing="0.6">{esc(name)}</text>
      <text x="{x+bw/2:.1f}" y="{top+72}" text-anchor="middle" fill="{DIM}" font-size="9.2"
            font-family="{MONO}" opacity="0.8">{esc(tool)}</text>
      <animate attributeName="opacity" values="0.55;1;0.55" dur="6s" begin="{t*3:.2f}s" repeatCount="indefinite"/>
    </g>''')
        if i < n - 1:
            ax = x + bw + gap / 2
            parts.append(f'<path d="M{ax-5:.1f} {rail_y-4} L{ax+3:.1f} {rail_y} L{ax-5:.1f} {rail_y+4} Z" '
                         f'fill="{CY_C}" opacity="0.55"/>')

    # travelling data packet
    parts.append(f'''
    <circle r="4" fill="#67E8F9" filter="url(#soft)">
      <animateMotion dur="9s" repeatCount="indefinite" path="M{m},{rail_y} L{W-m},{rail_y}"/>
      <animate attributeName="opacity" values="0;1;1;0" dur="9s" repeatCount="indefinite"/>
    </circle>''')

    # abstraction ladder underneath
    lanes = [("BEHAVIOURAL", 60), ("STRUCTURAL", 430), ("PHYSICAL", 800), ("SILICON", 1150)]
    ly = 236
    parts.append(f'<rect x="{m}" y="{ly-16}" width="{W-2*m}" height="1" fill="{CY_C}" opacity="0.14"/>')
    for label, lx in lanes:
        parts.append(f'<text x="{lx}" y="{ly+2}" fill="{DIM}" font-size="10" font-family="{MONO}" '
                     f'letter-spacing="4" opacity="0.6">{label}</text>')
    parts.append(f'<text x="{W-m}" y="{ly+30}" text-anchor="end" fill="{DIM}" font-size="10" '
                 f'font-family="{MONO}" opacity="0.5" letter-spacing="2">'
                 f'abstraction descends left &#8594; right; cost of a bug rises with it</text>')
    return shell(h, "\n".join(parts))


# ─────────────────────────── 2. Fabrication stack ───────────────────────────
def fab_stack():
    h = 500
    p = []
    p.append(f'<text x="{W/2}" y="44" text-anchor="middle" fill="{INK}" font-size="21" '
             f'font-family="{SANS}" font-weight="700" letter-spacing="7" filter="url(#soft)">'
             f'FROM LAYOUT TO ATOMS</text>')
    p.append(f'<text x="{W/2}" y="68" text-anchor="middle" fill="{DIM}" font-size="11.5" '
             f'font-family="{MONO}" letter-spacing="3" opacity="0.75">'
             f'a die cross-section &#8212; what the GDSII actually becomes</text>')

    # ── left: BEOL/FEOL cross-section
    x0, x1 = 60, 720
    layers = [
        ("PASSIVATION",       88,  22, "#1E3A5F", 0.55),
        ("M9  ·  global",     112, 20, "#2563EB", 0.60),
        ("M6-M8  ·  semi-global", 134, 20, "#1D4ED8", 0.55),
        ("M2-M5  ·  intermediate", 156, 20, "#1E40AF", 0.50),
        ("M1  ·  local",      178, 18, "#3B82F6", 0.55),
        ("CONTACT  ·  MOL",   198, 16, "#0EA5E9", 0.45),
    ]
    for name, y, hh, col, op in layers:
        p.append(f'<rect x="{x0}" y="{y}" width="{x1-x0}" height="{hh}" rx="3" fill="{col}" fill-opacity="{op}" '
                 f'stroke="{CY_A}" stroke-width="0.7" stroke-opacity="0.35"/>')
        p.append(f'<text x="{x0+12}" y="{y+hh/2+3.6}" fill="{INK}" font-size="9.6" font-family="{MONO}" '
                 f'opacity="0.85" letter-spacing="1.2">{esc(name)}</text>')
    # vias stitching the metal stack
    for vx in range(140, 700, 62):
        p.append(f'<rect x="{vx}" y="105" width="4" height="105" fill="{CY_B}" fill-opacity="0.45"/>')

    # FEOL: fins + gate
    p.append(f'<rect x="{x0}" y="214" width="{x1-x0}" height="46" fill="#0B1F3A" stroke="{CY_A}" '
             f'stroke-width="0.7" stroke-opacity="0.35"/>')
    p.append(f'<text x="{x0+12}" y="{240}" fill="{INK}" font-size="9.6" font-family="{MONO}" '
             f'opacity="0.85" letter-spacing="1.2">FEOL  ·  HKMG GATE STACK  /  FinFET &#8594; GAA NANOSHEET</text>')
    for fx in range(468, 700, 42):
        p.append(f'<rect x="{fx}" y="222" width="9" height="30" rx="2" fill="{CY_B}" fill-opacity="0.55"/>')
        p.append(f'<rect x="{fx-6}" y="218" width="21" height="10" rx="2" fill="{VI_A}" fill-opacity="0.45"/>')
    p.append(f'<rect x="{x0}" y="262" width="{x1-x0}" height="34" fill="#050D1C" stroke="{CY_A}" '
             f'stroke-width="0.7" stroke-opacity="0.3"/>')
    p.append(f'<text x="{x0+12}" y="{283}" fill="{DIM}" font-size="9.6" font-family="{MONO}" '
             f'opacity="0.8" letter-spacing="1.2">p-TYPE Si SUBSTRATE  ·  STI ISOLATION  ·  &#10216;100&#10217; WAFER</text>')

    # depth bracket
    p.append(f'<path d="M{x1+14} 88 L{x1+22} 88 L{x1+22} 210 L{x1+14} 210" fill="none" stroke="{CY_C}" '
             f'stroke-width="1" opacity="0.5"/>')
    p.append(f'<text x="{x1+30}" y="152" fill="{CY_C}" font-size="10" font-family="{MONO}" opacity="0.7">BEOL</text>')
    p.append(f'<path d="M{x1+14} 214 L{x1+22} 214 L{x1+22} 296 L{x1+14} 296" fill="none" stroke="{VI_A}" '
             f'stroke-width="1" opacity="0.5"/>')
    p.append(f'<text x="{x1+30}" y="258" fill="{VI_A}" font-size="10" font-family="{MONO}" opacity="0.7">FEOL</text>')

    # ── right: lithography column
    lx = 880
    p.append(f'<text x="{lx}" y="104" fill="{INK}" font-size="12.5" font-family="{SANS}" font-weight="700" '
             f'letter-spacing="4">PATTERNING</text>')
    litho = [
        ("EUV SOURCE", "&#955; = 13.5 nm  ·  Sn plasma"),
        ("RETICLE", "4&#215; reduction photomask"),
        ("PROJECTION OPTICS", "NA 0.33 &#8594; High-NA 0.55"),
        ("RESIST + DEVELOP", "chemically amplified"),
        ("ETCH / DEPOSITION", "RIE  ·  ALD  ·  CMP"),
        ("METROLOGY + YIELD", "overlay  ·  D0 defectivity"),
    ]
    for i, (a, b) in enumerate(litho):
        y = 128 + i * 42
        p.append(f'<rect x="{lx}" y="{y}" width="440" height="32" rx="7" fill="#08152B" fill-opacity="0.85" '
                 f'stroke="{CY_A}" stroke-width="0.9" stroke-opacity="0.4"/>')
        p.append(f'<circle cx="{lx+18}" cy="{y+16}" r="3.4" fill="{CY_B}" opacity="0.9">'
                 f'<animate attributeName="opacity" values="0.25;1;0.25" dur="3.2s" begin="{i*0.45:.2f}s" '
                 f'repeatCount="indefinite"/></circle>')
        p.append(f'<text x="{lx+34}" y="{y+20}" fill="{INK}" font-size="10.6" font-family="{MONO}" '
                 f'letter-spacing="1.4">{a}</text>')
        p.append(f'<text x="{lx+430}" y="{y+20}" text-anchor="end" fill="{DIM}" font-size="9.6" '
                 f'font-family="{MONO}" opacity="0.8">{b}</text>')
        if i < len(litho) - 1:
            p.append(f'<path d="M{lx+18} {y+32} L{lx+18} {y+42}" stroke="{CY_C}" stroke-width="1" opacity="0.35"/>')

    # Rayleigh criterion callout
    p.append(f'<rect x="60" y="392" width="1280" height="76" rx="11" fill="#06101F" fill-opacity="0.7" '
             f'stroke="{VI_A}" stroke-width="0.9" stroke-opacity="0.35"/>')
    p.append(f'<text x="86" y="418" fill="{VI_B}" font-size="10.5" font-family="{MONO}" letter-spacing="3" '
             f'opacity="0.85">RESOLUTION LIMIT &#8212; RAYLEIGH</text>')
    p.append(f'<text x="86" y="452" fill="#E6F1FF" font-size="23" font-family="{SERIF}" font-style="italic" '
             f'filter="url(#softv)">CD = k<tspan font-size="14" dy="5">1</tspan>'
             f'<tspan dy="-5"> &#183; &#955; / NA</tspan></text>')
    p.append(f'<text x="470" y="424" fill="{DIM}" font-size="11" font-family="{MONO}" opacity="0.85">'
             f'&#955; 13.5 nm &#183; NA 0.33 &#8594; ~13 nm half-pitch, single exposure</text>')
    p.append(f'<text x="470" y="448" fill="{DIM}" font-size="11" font-family="{MONO}" opacity="0.85">'
             f'below that: multi-patterning (LELE / SADP / SAQP), or High-NA 0.55</text>')
    p.append(f'<text x="1314" y="424" text-anchor="end" fill="{CY_B}" font-size="10.6" font-family="{MONO}" '
             f'opacity="0.72">physics sets the floor;</text>')
    p.append(f'<text x="1314" y="448" text-anchor="end" fill="{CY_B}" font-size="10.6" font-family="{MONO}" '
             f'opacity="0.72">architecture decides what you do with it</text>')
    return shell(h, "\n".join(p))


# ─────────────────────────── 3. Research radar ───────────────────────────
def research_radar():
    h = 490
    cx, cy, R = 350, 278, 148
    axes = [
        ("WORLD MODELS", 0.95), ("MODEL-BASED RL", 0.92), ("AGENTIC AI", 0.88),
        ("GRAPH NEURAL NETS", 0.80), ("QUANTUM ML", 0.66), ("FORMAL VERIF.", 0.74),
        ("RTL / ARCH", 0.86), ("QUANTIZED EDGE ML", 0.90),
    ]
    n = len(axes)
    p = []
    p.append(f'<text x="{W/2}" y="44" text-anchor="middle" fill="{INK}" font-size="21" '
             f'font-family="{SANS}" font-weight="700" letter-spacing="7" filter="url(#softv)">'
             f'RESEARCH SURFACE</text>')
    p.append(f'<text x="{W/2}" y="68" text-anchor="middle" fill="{DIM}" font-size="11.5" '
             f'font-family="{MONO}" letter-spacing="3" opacity="0.75">'
             f'where the reading, the maths, and the silicon actually overlap</text>')

    # rings
    for frac in (0.25, 0.5, 0.75, 1.0):
        pts = " ".join(
            f"{cx + R*frac*math.cos(-math.pi/2 + 2*math.pi*i/n):.1f},"
            f"{cy + R*frac*math.sin(-math.pi/2 + 2*math.pi*i/n):.1f}" for i in range(n))
        p.append(f'<polygon points="{pts}" fill="none" stroke="{CY_C}" stroke-width="0.8" opacity="0.16"/>')
    # spokes + labels
    for i, (label, _) in enumerate(axes):
        ang = -math.pi/2 + 2*math.pi*i/n
        ex, ey = cx + R*math.cos(ang), cy + R*math.sin(ang)
        p.append(f'<line x1="{cx}" y1="{cy}" x2="{ex:.1f}" y2="{ey:.1f}" stroke="{CY_C}" '
                 f'stroke-width="0.7" opacity="0.2"/>')
        lxp, lyp = cx + (R+30)*math.cos(ang), cy + (R+30)*math.sin(ang)
        anchor = "middle"
        if math.cos(ang) > 0.35: anchor = "start"
        elif math.cos(ang) < -0.35: anchor = "end"
        p.append(f'<text x="{lxp:.1f}" y="{lyp+3.5:.1f}" text-anchor="{anchor}" fill="{DIM}" font-size="9.6" '
                 f'font-family="{MONO}" letter-spacing="1.4" opacity="0.9">{label}</text>')
    # value polygon
    pts = " ".join(
        f"{cx + R*v*math.cos(-math.pi/2 + 2*math.pi*i/n):.1f},"
        f"{cy + R*v*math.sin(-math.pi/2 + 2*math.pi*i/n):.1f}" for i, (_, v) in enumerate(axes))
    p.append(f'<polygon points="{pts}" fill="{VI_A}" fill-opacity="0.16" stroke="{VI_B}" stroke-width="1.8" '
             f'filter="url(#softv)"><animate attributeName="fill-opacity" values="0.10;0.24;0.10" dur="5s" '
             f'repeatCount="indefinite"/></polygon>')
    for i, (_, v) in enumerate(axes):
        ang = -math.pi/2 + 2*math.pi*i/n
        p.append(f'<circle cx="{cx + R*v*math.cos(ang):.1f}" cy="{cy + R*v*math.sin(ang):.1f}" r="3.4" '
                 f'fill="#E9D5FF"/>')

    # right panel: research threads
    tx = 700
    threads = [
        ("WORLD MODELS", "latent dynamics you can plan inside", CY_A),
        ("MODEL-BASED RL", "Dreamer-style imagination rollouts", CY_A),
        ("AGENTIC AI", "planner / critic / tool-use loops", VI_A),
        ("GRAPH NEURAL NETS", "netlists and circuits are graphs", CY_B),
        ("QUANTUM", "variational circuits, Hilbert-space intuition", VI_B),
        ("FORMAL VERIFICATION", "proofs where simulation runs out", CY_B),
    ]
    p.append(f'<text x="{tx}" y="112" fill="{INK}" font-size="12.5" font-family="{SANS}" font-weight="700" '
             f'letter-spacing="4">ACTIVE THREADS</text>')
    for i, (a, b, col) in enumerate(threads):
        y = 136 + i * 48
        p.append(f'<rect x="{tx}" y="{y}" width="620" height="38" rx="8" fill="#08152B" fill-opacity="0.8" '
                 f'stroke="{col}" stroke-width="0.9" stroke-opacity="0.38"/>')
        p.append(f'<rect x="{tx}" y="{y}" width="3" height="38" rx="1.5" fill="{col}" opacity="0.9"/>')
        p.append(f'<text x="{tx+18}" y="{y+16}" fill="{INK}" font-size="11" font-family="{MONO}" '
                 f'letter-spacing="1.8">{a}</text>')
        p.append(f'<text x="{tx+18}" y="{y+31}" fill="{DIM}" font-size="10" font-family="{MONO}" '
                 f'opacity="0.8">{b}</text>')
        p.append(f'<circle cx="{tx+600}" cy="{y+19}" r="3" fill="{col}" opacity="0.9">'
                 f'<animate attributeName="r" values="2;4;2" dur="2.6s" begin="{i*0.35:.2f}s" '
                 f'repeatCount="indefinite"/></circle>')
    p.append(f'<text x="1320" y="462" text-anchor="end" fill="{DIM}" font-size="10" font-family="{MONO}" '
             f'opacity="0.5">radar values are self-assessed depth, not credentials</text>')
    return shell(h, "\n".join(p), glow="#4C1D95")


# ─────────────────────────── 4. Showpiece equations ───────────────────────────
def eq_worldmodel():
    h = 250
    p = []
    p.append(f'<text x="70" y="52" fill="{CY_B}" font-size="11" font-family="{MONO}" letter-spacing="4.5" '
             f'opacity="0.85">RECURRENT STATE-SPACE MODEL &#8212; VARIATIONAL OBJECTIVE</text>')
    p.append(f'<text x="70" y="118" fill="#EAF4FF" font-size="30" font-family="{SERIF}" font-style="italic" '
             f'filter="url(#soft)">'
             f'&#8466; = &#120124;<tspan font-size="17" dy="6">q</tspan>'
             f'<tspan dy="-6"> [ &#8721;</tspan><tspan font-size="17" dy="6">t</tspan>'
             f'<tspan dy="-6"> ( ln p(o</tspan><tspan font-size="17" dy="6">t</tspan>'
             f'<tspan dy="-6"> | h</tspan><tspan font-size="17" dy="6">t</tspan>'
             f'<tspan dy="-6">, z</tspan><tspan font-size="17" dy="6">t</tspan>'
             f'<tspan dy="-6">) + ln p(r</tspan><tspan font-size="17" dy="6">t</tspan>'
             f'<tspan dy="-6"> | h</tspan><tspan font-size="17" dy="6">t</tspan>'
             f'<tspan dy="-6">, z</tspan><tspan font-size="17" dy="6">t</tspan>'
             f'<tspan dy="-6">) &#8722; &#946; D</tspan><tspan font-size="17" dy="6">KL</tspan>'
             f'<tspan dy="-6"> ) ]</tspan></text>')
    p.append(f'<text x="70" y="166" fill="#BCD9F7" font-size="21" font-family="{SERIF}" font-style="italic" '
             f'opacity="0.92">'
             f'D<tspan font-size="13" dy="5">KL</tspan><tspan dy="-5"> = KL[ q(z</tspan>'
             f'<tspan font-size="13" dy="5">t</tspan><tspan dy="-5"> | h</tspan>'
             f'<tspan font-size="13" dy="5">t</tspan><tspan dy="-5">, o</tspan>'
             f'<tspan font-size="13" dy="5">t</tspan><tspan dy="-5">) &#8214; p(z</tspan>'
             f'<tspan font-size="13" dy="5">t</tspan><tspan dy="-5"> | h</tspan>'
             f'<tspan font-size="13" dy="5">t</tspan><tspan dy="-5">) ]'
             f'&#160;&#160;&#160;&#160; h</tspan><tspan font-size="13" dy="5">t</tspan>'
             f'<tspan dy="-5"> = f(h</tspan><tspan font-size="13" dy="5">t&#8722;1</tspan>'
             f'<tspan dy="-5">, z</tspan><tspan font-size="13" dy="5">t&#8722;1</tspan>'
             f'<tspan dy="-5">, a</tspan><tspan font-size="13" dy="5">t&#8722;1</tspan>'
             f'<tspan dy="-5">)</tspan></text>')
    p.append(f'<text x="70" y="206" fill="{DIM}" font-size="11.5" font-family="{MONO}" opacity="0.82">'
             f'reconstruct the world, predict the reward, and pay a KL price for every bit of surprise you smuggle into the latent.</text>')
    p.append(f'<text x="70" y="226" fill="{DIM}" font-size="11.5" font-family="{MONO}" opacity="0.62">'
             f'&#946; is the whole argument: too low and the model memorises, too high and it stops dreaming.</text>')
    # decorative latent chain
    for i in range(6):
        x = 1020 + i * 56
        p.append(f'<circle cx="{x}" cy="70" r="9" fill="none" stroke="{CY_A}" stroke-width="1" opacity="0.45"/>')
        p.append(f'<circle cx="{x}" cy="70" r="3" fill="{CY_B}" opacity="0.8">'
                 f'<animate attributeName="opacity" values="0.2;1;0.2" dur="2.8s" begin="{i*0.3:.1f}s" repeatCount="indefinite"/></circle>')
        if i < 5:
            p.append(f'<line x1="{x+9}" y1="70" x2="{x+47}" y2="70" stroke="{CY_C}" stroke-width="0.9" opacity="0.35"/>')
        p.append(f'<line x1="{x}" y1="79" x2="{x}" y2="104" stroke="{VI_A}" stroke-width="0.9" opacity="0.35"/>')
        p.append(f'<rect x="{x-8}" y="104" width="16" height="12" rx="3" fill="{VI_A}" fill-opacity="0.28" stroke="{VI_A}" stroke-width="0.8" stroke-opacity="0.5"/>')
    p.append(f'<text x="1020" y="140" fill="{DIM}" font-size="9.4" font-family="{MONO}" opacity="0.6" letter-spacing="1.6">deterministic h &#8593;  /  stochastic z &#8595;</text>')
    return shell(h, "\n".join(p))


def eq_quantum():
    h = 230
    p = []
    p.append(f'<text x="70" y="52" fill="{VI_B}" font-size="11" font-family="{MONO}" letter-spacing="4.5" '
             f'opacity="0.9">VARIATIONAL QUANTUM EIGENSOLVER &#8212; THE BOUND THAT MAKES IT WORK</text>')
    p.append(f'<text x="70" y="116" fill="#F2ECFF" font-size="30" font-family="{SERIF}" font-style="italic" '
             f'filter="url(#softv)">'
             f'E<tspan font-size="18" dy="6">0</tspan>'
             f'<tspan dy="-6"> &#8804; E(&#952;) = &#10216;&#968;(&#952;)| H&#770; |&#968;(&#952;)&#10217;'
             f'&#160;&#160;&#160; |&#968;(&#952;)&#10217; = U(&#952;) |0&#10217;</tspan>'
             f'<tspan font-size="18" dy="-10">&#8855;n</tspan></text>')
    p.append(f'<text x="70" y="160" fill="#D6C7F5" font-size="20" font-family="{SERIF}" font-style="italic" '
             f'opacity="0.92">'
             f'H&#770; = &#8721;<tspan font-size="13" dy="5">&#945;</tspan><tspan dy="-5"> c</tspan>'
             f'<tspan font-size="13" dy="5">&#945;</tspan><tspan dy="-5"> P</tspan>'
             f'<tspan font-size="13" dy="5">&#945;</tspan><tspan dy="-5">,'
             f'&#160; P</tspan><tspan font-size="13" dy="5">&#945;</tspan>'
             f'<tspan dy="-5"> &#8712; {{ I, X, Y, Z }}<tspan font-size="13" dy="5">&#8855;n</tspan></tspan></text>')
    p.append(f'<text x="70" y="198" fill="{DIM}" font-size="11.5" font-family="{MONO}" opacity="0.8">'
             f'the variational principle guarantees you can never undershoot the ground state &#8212; so optimisation is safe, and only ever unfinished.</text>')
    # Bloch sphere
    bx, by, br = 1180, 112, 62
    p.append(f'<circle cx="{bx}" cy="{by}" r="{br}" fill="none" stroke="{VI_A}" stroke-width="1.1" opacity="0.5"/>')
    p.append(f'<ellipse cx="{bx}" cy="{by}" rx="{br}" ry="{br*0.3}" fill="none" stroke="{VI_B}" stroke-width="0.9" opacity="0.35"/>')
    p.append(f'<ellipse cx="{bx}" cy="{by}" rx="{br*0.3}" ry="{br}" fill="none" stroke="{VI_B}" stroke-width="0.9" opacity="0.28"/>')
    p.append(f'<line x1="{bx}" y1="{by-br-10}" x2="{bx}" y2="{by+br+10}" stroke="{VI_A}" stroke-width="0.7" opacity="0.3"/>')
    p.append(f'<line x1="{bx-br-10}" y1="{by}" x2="{bx+br+10}" y2="{by}" stroke="{VI_A}" stroke-width="0.7" opacity="0.3"/>')
    p.append(f'<g><line x1="{bx}" y1="{by}" x2="{bx+44}" y2="{by-42}" stroke="#F5F3FF" stroke-width="2" '
             f'filter="url(#softv)"/><circle cx="{bx+44}" cy="{by-42}" r="4.5" fill="#F5F3FF"/>'
             f'<animateTransform attributeName="transform" type="rotate" from="0 {bx} {by}" to="360 {bx} {by}" '
             f'dur="12s" repeatCount="indefinite"/></g>')
    p.append(f'<text x="{bx}" y="{by-br-18}" text-anchor="middle" fill="{DIM}" font-size="10" font-family="{MONO}" opacity="0.7">|0&#12297;</text>')
    p.append(f'<text x="{bx}" y="{by+br+28}" text-anchor="middle" fill="{DIM}" font-size="10" font-family="{MONO}" opacity="0.7">|1&#12297;</text>')
    return shell(h, "\n".join(p), glow="#4C1D95")


# ─────────────────────────── 5. Achievements ───────────────────────────
def achievements():
    h = 330
    cards = [
        ("SMART INDIA HACKATHON", "2025", "GRAND FINALE", "National-level finals &#8212; Govt. of India", CY_A, "SIH"),
        ("MUMBAI HACKS", "2024", "RUNNER-UP", "Agentic AI for FinTech &#8212; podium finish", VI_A, "2ND"),
        ("ANALOG DESIGN QUEST", "&#8212;", "FINALIST", "Analog / mixed-signal design challenge", CY_B, "ADQ"),
        ("MIRABILIS DESIGN HACKS", "&#8212;", "FINALIST", "System-level modelling &amp; architecture", VI_B, "MDX"),
    ]
    p = []
    p.append(f'<text x="{W/2}" y="46" text-anchor="middle" fill="{INK}" font-size="21" font-family="{SANS}" '
             f'font-weight="700" letter-spacing="7" filter="url(#soft)">COMPETITION RECORD</text>')
    p.append(f'<text x="{W/2}" y="70" text-anchor="middle" fill="{DIM}" font-size="11.5" font-family="{MONO}" '
             f'letter-spacing="3" opacity="0.75">shipped under a clock, judged by people who build for a living</text>')
    m, gap = 48, 24
    cw = (W - 2*m - 3*gap) / 4
    for i, (name, yr, rank, desc, col, tag) in enumerate(cards):
        x = m + i * (cw + gap)
        p.append(f'''
    <g>
      <rect x="{x:.1f}" y="102" width="{cw:.1f}" height="164" rx="13" fill="#08152B" fill-opacity="0.9"
            stroke="{col}" stroke-width="1.1" stroke-opacity="0.5"/>
      <rect x="{x:.1f}" y="102" width="{cw:.1f}" height="3.4" rx="1.7" fill="{col}" opacity="0.9"/>
      <circle cx="{x+cw/2:.1f}" cy="146" r="24" fill="none" stroke="{col}" stroke-width="1.2" opacity="0.55"/>
      <circle cx="{x+cw/2:.1f}" cy="146" r="18" fill="{col}" fill-opacity="0.13"/>
      <text x="{x+cw/2:.1f}" y="151" text-anchor="middle" fill="{col}" font-size="13"
            font-family="{MONO}" font-weight="700" letter-spacing="1.4">{tag}</text>
      <text x="{x+cw/2:.1f}" y="196" text-anchor="middle" fill="#EAF4FF" font-size="12.6"
            font-family="{SANS}" font-weight="700" letter-spacing="1.1">{name}</text>
      <text x="{x+cw/2:.1f}" y="218" text-anchor="middle" fill="{col}" font-size="12"
            font-family="{MONO}" letter-spacing="3">{rank}</text>
      <text x="{x+cw/2:.1f}" y="240" text-anchor="middle" fill="{DIM}" font-size="9.4"
            font-family="{MONO}" opacity="0.85">{desc}</text>
      <text x="{x+cw-14:.1f}" y="{258}" text-anchor="end" fill="{DIM}" font-size="9"
            font-family="{MONO}" opacity="0.55">{yr}</text>
      <animate attributeName="opacity" values="0.7;1;0.7" dur="5.5s" begin="{i*0.6:.1f}s" repeatCount="indefinite"/>
    </g>''')
    p.append(f'<text x="{W/2}" y="300" text-anchor="middle" fill="{DIM}" font-size="10.6" font-family="{MONO}" '
             f'opacity="0.6" letter-spacing="2">4 national-level finals &#183; 1 podium &#183; domains spanning fintech agents, analog design and system modelling</text>')
    return shell(h, "\n".join(p))


# ─────────────────────────── 6. Verification stack ───────────────────────────
def verification():
    h = 410
    p = []
    p.append(f'<text x="{W/2}" y="46" text-anchor="middle" fill="{INK}" font-size="21" font-family="{SANS}" '
             f'font-weight="700" letter-spacing="7" filter="url(#soft)">HOW I CONVINCE MYSELF IT WORKS</text>')
    p.append(f'<text x="{W/2}" y="70" text-anchor="middle" fill="{DIM}" font-size="11.5" font-family="{MONO}" '
             f'letter-spacing="3" opacity="0.75">70% of silicon effort is verification &#8212; so it deserves 70% of the README</text>')
    layers = [
        ("FORMAL / MODEL CHECKING",  "exhaustive over the state space; no stimulus to write", 0.52, VI_A),
        ("ASSERTIONS  ·  SVA",       "properties that fail loudly, close to the bug",          0.64, VI_B),
        ("CONSTRAINED-RANDOM  ·  UVM", "agents, sequencers, scoreboards, functional coverage", 0.76, CY_A),
        ("DIRECTED + PYTHON  ·  cocotb", "fast iteration, real testbench code, CI-friendly",   0.88, CY_B),
        ("LINT  ·  CDC  ·  RDC",     "cheapest bugs to find are the ones found before sim",    1.00, CY_C),
    ]
    top, lh, gap = 100, 44, 11
    for i, (name, desc, wfrac, col) in enumerate(layers):
        bw = 640 * wfrac
        x = 55 + (640 - bw) / 2
        y = top + i * (lh + gap)
        p.append(f'<rect x="{x:.1f}" y="{y}" width="{bw:.1f}" height="{lh}" rx="7" fill="{col}" fill-opacity="0.14" '
                 f'stroke="{col}" stroke-width="1" stroke-opacity="0.55"/>')
        p.append(f'<text x="{x+bw/2:.1f}" y="{y+19}" text-anchor="middle" fill="#EAF4FF" font-size="11.2" '
                 f'font-family="{MONO}" letter-spacing="1.6">{name}</text>')
        p.append(f'<text x="{x+bw/2:.1f}" y="{y+34}" text-anchor="middle" fill="{DIM}" font-size="9" '
                 f'font-family="{MONO}" opacity="0.85">{desc}</text>')
    p.append(f'<text x="375" y="{top + 5*(lh+gap) + 26}" text-anchor="middle" fill="{DIM}" font-size="9.6" '
             f'font-family="{MONO}" opacity="0.6" letter-spacing="2">narrow = strong guarantee, expensive  &#183;  wide = cheap, shallow</text>')

    # coverage meters
    mx = 770
    p.append(f'<text x="{mx}" y="112" fill="{INK}" font-size="12.5" font-family="{SANS}" font-weight="700" '
             f'letter-spacing="4">COVERAGE CLOSURE</text>')
    metrics = [("LINE", 0.97), ("BRANCH", 0.93), ("TOGGLE", 0.88), ("FSM STATE", 0.95), ("FUNCTIONAL", 0.84), ("ASSERTION", 0.91)]
    for i, (name, v) in enumerate(metrics):
        y = 140 + i * 34
        p.append(f'<text x="{mx}" y="{y+11}" fill="{DIM}" font-size="10" font-family="{MONO}" letter-spacing="1.6">{name}</text>')
        p.append(f'<rect x="{mx+120}" y="{y+1}" width="380" height="13" rx="6.5" fill="#0A1830" stroke="{CY_C}" stroke-width="0.7" stroke-opacity="0.3"/>')
        p.append(f'<rect x="{mx+120}" y="{y+1}" width="0" height="13" rx="6.5" fill="{CY_A}" fill-opacity="0.75">'
                 f'<animate attributeName="width" values="0;{380*v:.0f}" dur="1.8s" begin="{i*0.16:.2f}s" fill="freeze"/></rect>')
        p.append(f'<text x="{mx+516}" y="{y+11}" text-anchor="end" fill="{CY_B}" font-size="10" font-family="{MONO}">{v*100:.0f}%</text>')
    p.append(f'<text x="{mx}" y="{140+6*34+22}" fill="{DIM}" font-size="9.6" font-family="{MONO}" opacity="0.55">'
             f'illustrative targets &#8212; the number that matters is the one you had to argue for in review</text>')
    return shell(h, "\n".join(p))


# ─────────────────────────── 7. Dividers ───────────────────────────
def divider_waveform():
    h = 34
    seq = [1,0,1,1,0,1,0,0,1,1,0,1,1,0,1,0,1,1,0,0,1,0,1,1,0,1,0,1,1,0]
    step = W / len(seq)
    hi, lo = 9, 25
    d = f"M0 {lo if seq[0]==0 else hi}"
    prev = seq[0]
    for i, b in enumerate(seq):
        x = i * step
        if b != prev:
            d += f" L{x:.1f} {lo if prev==0 else hi} L{x:.1f} {lo if b==0 else hi}"
        d += f" L{(i+1)*step:.1f} {lo if b==0 else hi}"
        prev = b
    return f'''<svg width="{W}" height="{h}" viewBox="0 0 {W} {h}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="wg" x1="0" y1="0" x2="{W}" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="{CY_A}" stop-opacity="0"/>
      <stop offset="18%" stop-color="{CY_C}" stop-opacity="0.75"/>
      <stop offset="50%" stop-color="#E0F2FE" stop-opacity="0.95"/>
      <stop offset="82%" stop-color="{CY_B}" stop-opacity="0.75"/>
      <stop offset="100%" stop-color="{VI_A}" stop-opacity="0"/>
    </linearGradient>
    <filter id="wgl" x="-5%" y="-200%" width="110%" height="500%">
      <feGaussianBlur stdDeviation="2.2"/>
    </filter>
  </defs>
  <path d="{d}" stroke="url(#wg)" stroke-width="2.6" fill="none" filter="url(#wgl)" opacity="0.55"/>
  <path d="{d}" stroke="url(#wg)" stroke-width="1.5" fill="none"/>
  <rect x="-140" y="0" width="140" height="{h}" fill="#67E8F9" opacity="0.10">
    <animate attributeName="x" values="-140;{W}" dur="6s" repeatCount="indefinite"/>
  </rect>
  <text x="10" y="{h-3}" fill="{DIM}" font-size="7.5" font-family="{MONO}" opacity="0.35">clk</text>
</svg>
'''


def divider_quantum():
    h = 34
    pts_a, pts_b = [], []
    for i in range(0, W + 1, 4):
        t = i / W
        env = math.sin(math.pi * t)
        pts_a.append(f"{i},{17 - 9*env*math.sin(t*38):.2f}")
        pts_b.append(f"{i},{17 + 9*env*math.sin(t*38 + 1.1):.2f}")
    return f'''<svg width="{W}" height="{h}" viewBox="0 0 {W} {h}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="qg" x1="0" y1="0" x2="{W}" y2="0" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="{VI_A}" stop-opacity="0"/>
      <stop offset="25%" stop-color="{VI_A}" stop-opacity="0.7"/>
      <stop offset="50%" stop-color="#F5F3FF" stop-opacity="0.95"/>
      <stop offset="75%" stop-color="{CY_A}" stop-opacity="0.7"/>
      <stop offset="100%" stop-color="{CY_B}" stop-opacity="0"/>
    </linearGradient>
    <filter id="qgl" x="-5%" y="-200%" width="110%" height="500%"><feGaussianBlur stdDeviation="2.4"/></filter>
  </defs>
  <polyline points="{' '.join(pts_a)}" stroke="url(#qg)" stroke-width="2.4" fill="none" filter="url(#qgl)" opacity="0.5"/>
  <polyline points="{' '.join(pts_a)}" stroke="url(#qg)" stroke-width="1.2" fill="none"/>
  <polyline points="{' '.join(pts_b)}" stroke="url(#qg)" stroke-width="1" fill="none" opacity="0.45"/>
  <circle r="2.6" fill="#F5F3FF">
    <animateMotion dur="6.5s" repeatCount="indefinite" path="M0,17 L{W},17"/>
    <animate attributeName="opacity" values="0;1;1;0" dur="6.5s" repeatCount="indefinite"/>
  </circle>
</svg>
'''


FILES = {
    "silicon-flow.svg": silicon_flow(),
    "fab-stack.svg": fab_stack(),
    "research-radar.svg": research_radar(),
    "eq-worldmodel.svg": eq_worldmodel(),
    "eq-quantum.svg": eq_quantum(),
    "achievements-wall.svg": achievements(),
    "verification-stack.svg": verification(),
    "divider-waveform.svg": divider_waveform(),
    "divider-quantum.svg": divider_quantum(),
}
for fn, s in FILES.items():
    with open(os.path.join(OUT, fn), "w", encoding="utf-8") as f:
        f.write(s)
    print("wrote", fn)
