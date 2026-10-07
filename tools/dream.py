#!/usr/bin/env python3
"""
THE DREAM LOG — a nightly latent rollout for the HUNT-001 profile.

Once a night a GitHub Action wakes this script. It reads the real state of the
world (recent public GitHub activity), compresses it into a small state vector,
and asks a model to perform one imagination rollout *from that state* — the way
a world model dreams forward from a latent. The result is typeset into an SVG
panel and committed.

Why nightly-and-committed rather than live-per-view:

  · GitHub proxies every README image through Camo and caches it hard, so a
    "render on each visit" endpoint mostly serves a stale cache anyway.
  · A committed artefact is instant to load, costs ~30 calls a month instead of
    one per visitor, and keeps the API key in GitHub Secrets rather than behind
    a public endpoint.
  · Every dream lands in git history. The log is the point: you can read back
    what the repo was thinking in March.

The panel always renders. If there is no API key, or the call fails, the script
falls back to composing the rollout deterministically from the state vector —
so a bad night degrades the prose, never the README.

Usage
    python tools/dream.py                 # dream, write SVG + log
    python tools/dream.py --dry-run       # render, print, write nothing
    python tools/dream.py --offline       # force the deterministic path
"""

from __future__ import annotations

import argparse
import datetime as dt
import hashlib
import json
import os
import random
import re
import subprocess
import sys
import textwrap
import urllib.error
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ASSETS = os.path.join(ROOT, "assets")
LOG_PATH = os.path.join(ROOT, "dreams", "log.json")
SVG_PATH = os.path.join(ASSETS, "dream-latest.svg")

GH_USER = os.environ.get("DREAM_GH_USER", "HUNT-001")
MODEL = os.environ.get("DREAM_MODEL", "claude-sonnet-5-5")
MAX_LOG = 60

W = 1400          # H is computed per-dream from the wrapped text
MONO = "Consolas, 'JetBrains Mono', monospace"
SANS = "'Segoe UI', 'Helvetica Neue', Arial, sans-serif"
CY_A, CY_B, CY_C = "#38BDF8", "#22D3EE", "#60A5FA"
VI_A, VI_B = "#A78BFA", "#C084FC"
INK, DIM = "#CFE6FF", "#7FA6D4"

# Which research thread a repo/path belongs to — used to colour the rollout.
THREADS = [
    ("world-model", ("dream", "world", "rssm", "latent", "mbrl")),
    ("rl",          ("rl", "agent", "policy", "reward", "gym")),
    ("graph",       ("gnn", "graph", "netlist", "node")),
    ("silicon",     ("rtl", "verilog", "chip", "soc", "fpga", "vlsi", "hls", "asic")),
    ("verification",("cocotb", "uvm", "verif", "test", "sva", "coverage")),
    ("quantum",     ("quantum", "qiskit", "vqe", "qml")),
    ("edge",        ("edge", "quant", "embedded", "tiny", "mobile")),
]


# ───────────────────────────────── state ──────────────────────────────────────
def fetch_activity() -> list[dict]:
    """Recent public events. Returns [] on any failure — never raises."""
    req = urllib.request.Request(
        f"https://api.github.com/users/{GH_USER}/events/public?per_page=100",
        headers={"User-Agent": "hunt-001-dream", "Accept": "application/vnd.github+json"},
    )
    token = os.environ.get("GITHUB_TOKEN")
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    try:
        with urllib.request.urlopen(req, timeout=20) as r:
            return json.load(r)
    except Exception as e:                                    # noqa: BLE001
        print(f"  activity fetch failed ({type(e).__name__}); using local git only",
              file=sys.stderr)
        return []


def local_commits(days: int = 7) -> list[str]:
    try:
        out = subprocess.run(
            ["git", "log", f"--since={days}.days", "--pretty=%s"],
            cwd=ROOT, capture_output=True, text=True, timeout=20,
        )
        return [l for l in out.stdout.splitlines() if l.strip()]
    except Exception:                                         # noqa: BLE001
        return []


def classify(text: str) -> str | None:
    t = text.lower()
    for name, keys in THREADS:
        if any(k in t for k in keys):
            return name
    return None


def build_state() -> dict:
    events = fetch_activity()
    now = dt.datetime.now(dt.timezone.utc)

    repos, messages, hours = {}, [], []
    pushes = 0
    for ev in events:
        if ev.get("type") != "PushEvent":
            continue
        pushes += 1
        name = ev.get("repo", {}).get("name", "").split("/")[-1]
        repos[name] = repos.get(name, 0) + 1
        try:
            when = dt.datetime.fromisoformat(ev["created_at"].replace("Z", "+00:00"))
            hours.append((when.hour + 5.5) % 24)              # IST
        except Exception:                                     # noqa: BLE001
            pass
        for c in ev.get("payload", {}).get("commits", []):
            messages.append(c.get("message", "").splitlines()[0])

    messages += local_commits()
    threads = {}
    for text in list(repos) + messages:
        t = classify(text)
        if t:
            threads[t] = threads.get(t, 0) + 1

    nocturnal = sum(1 for h in hours if h >= 22 or h < 5)
    return {
        "date": now.date().isoformat(),
        "pushes": pushes,
        "repos": [r for r, _ in sorted(repos.items(), key=lambda x: -x[1])[:5]],
        "threads": [t for t, _ in sorted(threads.items(), key=lambda x: -x[1])[:4]],
        "commits": messages[:12],
        "nocturnal": nocturnal,
        "median_hour": round(sorted(hours)[len(hours) // 2], 1) if hours else None,
        "quiet": pushes == 0,
    }


# ──────────────────────────────── the dream ───────────────────────────────────
SYSTEM = """You are the latent world model of a GitHub repository belonging to an \
engineer who works on world models, model-based RL, graph neural networks, agentic \
systems, RTL design and hardware verification.

Each night you perform ONE imagination rollout from your current latent state. \
You are not a chatbot and not a motivational poster. You are a learned dynamics \
model describing what it feels like to predict this particular builder's next step.

Write exactly three lines.
  Line 1: an observation about the state you were given. Concrete, not flattering.
  Line 2: the rollout — what you predict unfolds next, in the vocabulary of \
latent dynamics, silicon, or verification.
  Line 3: a short closing clause. Cryptic is fine; mystical is not.

Rules: no emoji. No second person. Never praise the engineer. Under 110 \
characters per line. Plain text only, no markdown, no quotes around lines."""


def dream_via_api(state: dict) -> list[str] | None:
    key = os.environ.get("ANTHROPIC_API_KEY")
    if not key:
        print("  no ANTHROPIC_API_KEY; composing offline", file=sys.stderr)
        return None

    payload = json.dumps({
        "model": MODEL,
        "max_tokens": 300,
        "system": SYSTEM,
        "messages": [{"role": "user", "content":
                      "Current latent state:\n" + json.dumps(state, indent=2)}],
    }).encode()

    req = urllib.request.Request(
        "https://api.anthropic.com/v1/messages",
        data=payload,
        headers={"content-type": "application/json",
                 "x-api-key": key,
                 "anthropic-version": "2023-06-01"},
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            body = json.load(r)
        text = "".join(b.get("text", "") for b in body.get("content", []))
        lines = [l.strip() for l in text.strip().splitlines() if l.strip()][:3]
        return lines if len(lines) == 3 else None
    except Exception as e:                                    # noqa: BLE001
        print(f"  API call failed ({type(e).__name__}); composing offline", file=sys.stderr)
        return None


def dream_offline(state: dict) -> list[str]:
    """Deterministic rollout composed from the state vector. Seeded by date, so
    the same day always yields the same dream — reproducible, not random noise."""
    rng = random.Random(int(hashlib.sha256(state["date"].encode()).hexdigest()[:8], 16))
    th = state["threads"] or ["world-model"]
    lead = th[0]

    if state["quiet"]:
        obs = rng.choice([
            "No pushes in the window. The latent drifts without correction.",
            "Zero observations today; the posterior collapses toward the prior.",
            "Quiet. Prediction error undefined when nothing is observed.",
        ])
    else:
        obs = (f"{state['pushes']} pushes observed across "
               f"{len(state['repos'])} repositories; dominant thread: {lead}.")

    roll = {
        "world-model":  "Rolling forward: the dynamics hold for about three steps, then imagination outruns evidence.",
        "rl":           "Rolling forward: the policy improves where the reward is dense and stalls everywhere else.",
        "graph":        "Rolling forward: messages pass two hops before the neighbourhood stops being informative.",
        "silicon":      "Rolling forward: the datapath closes timing in simulation; the margin is thinner than reported.",
        "verification": "Rolling forward: coverage climbs, then flattens on the corner nobody wrote a test for.",
        "quantum":      "Rolling forward: the ansatz descends until the landscape goes flat and the gradient vanishes.",
        "edge":         "Rolling forward: the model fits in memory; the bandwidth is what it actually costs.",
    }.get(lead, "Rolling forward: the next step is a refactor disguised as a feature.")

    close = rng.choice([
        "Reconstruction error remains the only honest signal.",
        "The map is improving. The territory has not been consulted.",
        "Every latent is a compression of consequence.",
        "Confidence is cheap. Calibration is not.",
        "The bug is already written; it has not been observed yet.",
        "Sleep is a scheduled checkpoint, nothing more.",
    ])
    if state["nocturnal"] >= 3:
        close = "Most observations arrived after midnight. The model notes this without comment."
    return [obs, roll, close]


# ───────────────────────────────── rendering ──────────────────────────────────
def esc(s: str) -> str:
    return (s.replace("&", "&amp;").replace("<", "&lt;")
             .replace(">", "&gt;").replace('"', "&quot;"))


def wrap(line: str, width: int) -> list[str]:
    return textwrap.wrap(line, width=width) or [""]


def render(state: dict, lines: list[str], index: int, source: str) -> str:
    accent = {"quantum": VI_B, "world-model": VI_A, "rl": VI_A,
              "graph": VI_B}.get((state["threads"] or [""])[0], CY_A)

    # Lay the text out first so the panel can be sized to its content rather
    # than leaving a block of dead space under short dreams.
    wrapped = [wrap(l, 96) for l in lines[:3]]
    text_h = sum(len(w) * 26 + 8 for w in wrapped)
    H = max(230, 86 + text_h + 96)

    body = []
    body.append(f'<text x="46" y="38" fill="{DIM}" font-size="10" font-family="{MONO}" '
                f'letter-spacing="2.6" opacity="0.75">// LATENT ROLLOUT &#183; DREAM '
                f'{index:04d} &#183; {state["date"]}</text>')
    body.append(f'<text x="{W-46}" y="38" text-anchor="end" fill="{DIM}" font-size="10" '
                f'font-family="{MONO}" letter-spacing="2.6" opacity="0.6">{source}</text>')

    y = 86
    for i, segs in enumerate(wrapped):
        for seg in segs:
            body.append(
                f'<text x="46" y="{y}" fill="{INK if i < 2 else DIM}" '
                f'font-size="{16.5 if i < 2 else 14}" font-family="{MONO}" '
                f'letter-spacing="0.4" opacity="{1 if i < 2 else 0.85}">{esc(seg)}</text>')
            y += 26
        y += 8

    # the state vector that produced it — so the dream is evidenced, not magic
    chips = []
    if state["pushes"]:
        chips.append(f'{state["pushes"]} pushes')
    chips += list(state["threads"])[:3]
    if state["median_hour"] is not None:
        chips.append(f'median {state["median_hour"]:g}h IST')
    if not chips:
        chips = ["no observations"]

    cx = 46
    cy = H - 46
    body.append(f'<text x="46" y="{cy-22}" fill="{DIM}" font-size="9.4" font-family="{MONO}" '
                f'letter-spacing="2.4" opacity="0.5">STATE VECTOR</text>')
    for c in chips:
        cw = len(c) * 6.0 + 20
        body.append(
            f'<rect x="{cx:.0f}" y="{cy-14}" width="{cw:.0f}" height="20" rx="5" '
            f'fill="{accent}" fill-opacity="0.12" stroke="{accent}" stroke-width="0.7" '
            f'stroke-opacity="0.4"/>'
            f'<text x="{cx+cw/2:.0f}" y="{cy}" text-anchor="middle" fill="{accent}" '
            f'font-size="10" font-family="{MONO}">{esc(c)}</text>')
        cx += cw + 9

    # a slow pulse, so the panel reads as awake
    body.append(f'<circle cx="{W-56}" cy="{H-52}" r="4" fill="{accent}">'
                f'<animate attributeName="opacity" values="1;0.15;1" dur="4s" '
                f'repeatCount="indefinite"/></circle>')

    inner = "\n    ".join(body)
    return f'''<svg width="{W}" height="{H}" viewBox="0 0 {W} {H}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="{W}" y2="{H}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#030811"/><stop offset="50%" stop-color="#071226"/>
      <stop offset="100%" stop-color="#0C1D3E"/>
    </linearGradient>
    <radialGradient id="amb" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
      gradientTransform="translate({W*0.3} {H*0.5}) scale(620 230)">
      <stop offset="0%" stop-color="{accent}" stop-opacity="0.13"/>
      <stop offset="100%" stop-color="{accent}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="dotGrid" width="36" height="36" patternUnits="userSpaceOnUse">
      <circle cx="18" cy="18" r="0.7" fill="#4A90D9" fill-opacity="0.09"/>
    </pattern>
    <clipPath id="clip"><rect width="{W}" height="{H}" rx="16"/></clipPath>
  </defs>
  <rect width="{W}" height="{H}" rx="16" fill="url(#bg)"/>
  <rect width="{W}" height="{H}" rx="16" fill="url(#amb)"/>
  <g clip-path="url(#clip)">
    <rect width="{W}" height="{H}" fill="url(#dotGrid)"/>
    <rect x="0" y="56" width="{W}" height="1" fill="{accent}" opacity="0.18"/>
    <rect x="0" y="{H-80}" width="{W}" height="1" fill="{accent}" opacity="0.14"/>
    {inner}
    <rect x="1" y="1" width="{W-2}" height="{H-2}" rx="15.5" fill="none"
          stroke="#1B3566" stroke-width="1" opacity="0.7"/>
  </g>
</svg>
'''


# ────────────────────────────────── main ──────────────────────────────────────
def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true", help="render and print, write nothing")
    ap.add_argument("--offline", action="store_true", help="skip the API, compose locally")
    args = ap.parse_args()

    state = build_state()
    lines = None if args.offline else dream_via_api(state)
    source = "inference" if lines else "deterministic"
    if lines is None:
        lines = dream_offline(state)

    log = []
    if os.path.isfile(LOG_PATH):
        try:
            log = json.load(open(LOG_PATH, encoding="utf-8"))
        except Exception:                                     # noqa: BLE001
            log = []
    index = len(log) + 1

    svg = render(state, lines, index, source)
    entry = {"n": index, "date": state["date"], "source": source,
             "lines": lines, "state": state}

    if args.dry_run:
        print(json.dumps(entry, indent=2)[:1400])
        print(f"\n[dry-run] SVG {len(svg)} bytes, not written")
        return 0

    os.makedirs(os.path.dirname(LOG_PATH), exist_ok=True)
    log.append(entry)
    with open(LOG_PATH, "w", encoding="utf-8", newline="\n") as f:
        json.dump(log[-MAX_LOG:], f, indent=2, ensure_ascii=False)
        f.write("\n")
    with open(SVG_PATH, "w", encoding="utf-8", newline="\n") as f:
        f.write(svg)

    print(f"dream {index:04d} ({source}) -> assets/dream-latest.svg")
    for l in lines:
        print("   " + l)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
