"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface Dream {
  n: number;
  date: string;
  source: "inference" | "deterministic";
  lines: string[];
  state: {
    date: string; pushes: number; repos: string[]; threads: string[];
    nocturnal: number; median_hour: number | null; quiet: boolean;
  };
}

const ACCENT: Record<string, string> = {
  quantum: "#c084fc", "world-model": "#a78bfa", rl: "#a78bfa", agentic: "#c084fc",
  silicon: "#38bdf8", verification: "#38bdf8", edge: "#22d3ee", graph: "#c084fc",
};
const accentFor = (d?: Dream) => (d && d.state.threads[0] && ACCENT[d.state.threads[0]]) || "#38bdf8";

function chips(d: Dream): string[] {
  const c: string[] = [];
  if (d.state.pushes) c.push(`${d.state.pushes} pushes`);
  c.push(...d.state.threads.slice(0, 3));
  if (d.state.median_hour != null) c.push(`median ${d.state.median_hour}h IST`);
  if (!c.length) c.push("no observations");
  return c;
}

export default function DreamLog() {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [i, setI] = useState(0);
  const [typed, setTyped] = useState<string[]>(["", "", ""]);
  const [playing, setPlaying] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    fetch("/dream-log.json")
      .then((r) => r.json())
      .then((data: Dream[]) => { setDreams(data); setI(data.length - 1); })
      .catch(() => setDreams([]));
  }, []);

  const d = dreams[i];
  const accent = accentFor(d);

  // type the three lines in sequence whenever the selected dream changes
  useEffect(() => {
    if (!d) return;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setTyped(["", "", ""]);
    let delay = 0;
    d.lines.forEach((line, li) => {
      for (let k = 1; k <= line.length; k++) {
        const t = setTimeout(() => {
          setTyped((prev) => { const n = [...prev]; n[li] = line.slice(0, k); return n; });
        }, delay + k * 11);
        timers.current.push(t);
      }
      delay += line.length * 11 + 320;
    });
    return () => timers.current.forEach(clearTimeout);
  }, [d]);

  const next = useCallback(() => setI((v) => (v + 1) % Math.max(dreams.length, 1)), [dreams.length]);

  useEffect(() => {
    if (!playing || !dreams.length) return;
    const id = setInterval(next, 4200);
    return () => clearInterval(id);
  }, [playing, next, dreams.length]);

  const nodeClass = useMemo(
    () => dreams.map((x) => (["quantum", "world-model", "rl", "agentic"].includes(x.state.threads[0]) ? "q" : "win")),
    [dreams]
  );

  if (!d) {
    return <div className="dream"><div className="dream-body"><p className="dream-line l2">Loading the latent…</p></div></div>;
  }

  return (
    <div className="dream" style={{ boxShadow: `0 0 60px -30px ${accent}` }}>
      <div className="dream-top" style={{ color: accent }}>
        <span>// LATENT ROLLOUT · DREAM {String(d.n).padStart(4, "0")}</span>
        <span style={{ color: "#51607d" }}>· {d.date}</span>
        <span className="src" style={{ color: "#7fa6d4" }}>{d.source}</span>
      </div>

      <div className="dream-body">
        {[0, 1, 2].map((li) => (
          <p key={li} className={`dream-line l${li}`}>
            {typed[li]}
            {typed[li] && typed[li].length < d.lines[li].length && <span className="caret">&nbsp;</span>}
          </p>
        ))}
      </div>

      <div className="dream-chips">
        <span className="cap">STATE VECTOR</span>
        {chips(d).map((c, k) => (
          <span key={k} className="chip" style={{ color: accent, borderColor: accent + "55", background: accent + "14" }}>{c}</span>
        ))}
      </div>

      <div className="dream-ctrl">
        <button className="play" onClick={() => setPlaying((v) => !v)}>{playing ? "❚❚ Pause" : "▶ Play"}</button>
        <div className="dream-scrub" role="slider" aria-label="dream timeline" aria-valuenow={d.n}>
          {dreams.map((_, k) => (
            <div key={k} className={`node ${nodeClass[k]}${k === i ? " active" : ""}`} onClick={() => { setPlaying(false); setI(k); }} title={`Dream ${k + 1}`}>
              <i style={{ color: accentFor(dreams[k]) }} />
            </div>
          ))}
        </div>
        <button onClick={() => { setPlaying(false); next(); }}>Next →</button>
      </div>

      <p className="dream-note" style={{ padding: "0 26px 20px" }}>
        A snapshot of the real nightly rollout. On GitHub a scheduled Action reads the day&apos;s commits, compresses
        them into the state vector above, and dreams one step forward — then commits the result.
      </p>
    </div>
  );
}
