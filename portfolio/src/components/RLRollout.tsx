"use client";
import { useEffect, useMemo, useRef, useState } from "react";

/* deterministic PRNG so the same settings always draw the same rollout */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Pt { x: number; y: number; }

/* true dynamics: a clean orbit around the origin (a stable controlled system) */
function trueStep(p: Pt, theta: number): Pt {
  const c = Math.cos(theta), s = Math.sin(theta);
  return { x: p.x * c - p.y * s, y: p.x * s + p.y * c };
}

const THRESH = 0.5; // distance at which the imagined plan stops being trustworthy
const THETA = 0.42; // true angular velocity (rad/step)

export default function RLRollout() {
  const [horizon, setHorizon] = useState(28);
  const [err, setErr] = useState(4); // model error, percent
  const [step, setStep] = useState(28);
  const [playing, setPlaying] = useState(false);
  const raf = useRef<ReturnType<typeof setInterval> | null>(null);

  /* build the full real + imagined trajectories for the current settings */
  const { real, imag, dist, trust } = useMemo(() => {
    const eps = err / 100;
    const rnd = mulberry32(1337 + Math.round(err * 7));
    const start: Pt = { x: 1.25, y: 0 };
    const real: Pt[] = [start];
    const imag: Pt[] = [start];
    for (let k = 1; k <= horizon; k++) {
      real.push(trueStep(real[k - 1], THETA));
      // the learned model: slightly wrong angle + a little outward bias + per-step noise,
      // applied to its OWN drifting state, so error compounds (the model-based RL failure mode)
      const prev = imag[k - 1];
      let np = trueStep(prev, THETA * (1 + eps * 1.4));
      const grow = 1 + eps * 0.5;
      np = { x: np.x * grow, y: np.y * grow };
      np.x += (rnd() - 0.5) * eps * 2.2;
      np.y += (rnd() - 0.5) * eps * 2.2;
      imag.push(np);
    }
    const dist = real.map((r, k) => Math.hypot(r.x - imag[k].x, r.y - imag[k].y));
    let trust = horizon;
    for (let k = 0; k <= horizon; k++) if (dist[k] > THRESH) { trust = k; break; }
    return { real, imag, dist, trust };
  }, [horizon, err]);

  // keep step within horizon when horizon shrinks
  useEffect(() => { setStep((s) => Math.min(s, horizon)); }, [horizon]);

  useEffect(() => {
    if (!playing) return;
    raf.current = setInterval(() => {
      setStep((s) => {
        if (s >= horizon) { setPlaying(false); return s; }
        return s + 1;
      });
    }, 260);
    return () => { if (raf.current) clearInterval(raf.current); };
  }, [playing, horizon]);

  const play = () => {
    if (step >= horizon) setStep(0);
    setPlaying((p) => !p);
  };

  /* ---------- plane geometry (auto-fit to data extent) ---------- */
  const W = 420, H = 300, pad = 26;
  const ext = useMemo(() => {
    let m = 1.4;
    [...real, ...imag].forEach((p) => { m = Math.max(m, Math.abs(p.x), Math.abs(p.y)); });
    return m * 1.08;
  }, [real, imag]);
  const sx = (x: number) => pad + ((x + ext) / (2 * ext)) * (W - 2 * pad);
  const sy = (y: number) => pad + ((ext - y) / (2 * ext)) * (H - 2 * pad);
  const path = (pts: Pt[], n: number) =>
    pts.slice(0, n + 1).map((p, i) => `${i ? "L" : "M"}${sx(p.x).toFixed(1)} ${sy(p.y).toFixed(1)}`).join(" ");

  /* ---------- error chart geometry ---------- */
  const EW = 420, EH = 150, epL = 34, epB = 26, epT = 14, epR = 10;
  const ePlotW = EW - epL - epR, ePlotH = EH - epT - epB;
  const maxD = Math.max(THRESH * 1.3, ...dist);
  const ex = (k: number) => epL + (k / Math.max(horizon, 1)) * ePlotW;
  const ey = (d: number) => epT + (1 - d / maxD) * ePlotH;
  const errPath = dist.slice(0, step + 1).map((d, k) => `${k ? "L" : "M"}${ex(k).toFixed(1)} ${ey(d).toFixed(1)}`).join(" ");

  const curReal = real[step], curImag = imag[step];
  const curDist = dist[step];
  const diverged = curDist > THRESH;

  return (
    <div className="demo">
      <div className="demo-top">
        <span>// LATENT ROLLOUT · PLAN vs REALITY · STEP {String(step).padStart(2, "0")} / {horizon}</span>
        <span className="src" style={{ color: diverged ? "#f472b6" : "#22d3ee" }}>
          error {curDist.toFixed(2)}
        </span>
      </div>

      <div className="rl-wrap">
        <div className="rl-plane">
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="imagined vs real trajectory">
            {/* axes */}
            <line x1={sx(-ext)} y1={sy(0)} x2={sx(ext)} y2={sy(0)} stroke="#16203a" />
            <line x1={sx(0)} y1={sy(-ext)} x2={sx(0)} y2={sy(ext)} stroke="#16203a" />

            {/* full faint paths */}
            <path d={path(real, horizon)} fill="none" stroke="#1b3a52" strokeWidth={1} />
            <path d={path(imag, horizon)} fill="none" stroke="#3a2a52" strokeWidth={1} />

            {/* revealed paths */}
            <path d={path(real, step)} fill="none" stroke="#38bdf8" strokeWidth={2.4} strokeLinejoin="round" />
            <path d={path(imag, step)} fill="none" stroke="#c084fc" strokeWidth={2.4} strokeLinejoin="round" strokeDasharray="1 0" />

            {/* divergence connector */}
            <line x1={sx(curReal.x)} y1={sy(curReal.y)} x2={sx(curImag.x)} y2={sy(curImag.y)}
              stroke={diverged ? "#f472b6" : "#51607d"} strokeWidth={1.3} strokeDasharray="3 3" />

            {/* heads */}
            <circle cx={sx(curReal.x)} cy={sy(curReal.y)} r={5.5} fill="#38bdf8" />
            <circle cx={sx(curImag.x)} cy={sy(curImag.y)} r={5.5} fill="#c084fc" />
          </svg>
          <div className="rl-key">
            <span><i style={{ background: "#38bdf8" }} /> reality</span>
            <span><i style={{ background: "#c084fc" }} /> imagined plan</span>
          </div>
        </div>

        <div className="rl-err">
          <div className="rl-errhead">prediction error vs step</div>
          <svg viewBox={`0 0 ${EW} ${EH}`} width="100%" role="img" aria-label="error over steps">
            {/* threshold */}
            <line x1={epL} y1={ey(THRESH)} x2={EW - epR} y2={ey(THRESH)} stroke="#bc7b3a" strokeWidth={1} strokeDasharray="4 4" opacity={0.7} />
            <text x={EW - epR} y={ey(THRESH) - 5} textAnchor="end" className="axl" fill="#bc7b3a">trust limit</text>
            {/* axes */}
            <line x1={epL} y1={epT} x2={epL} y2={epT + ePlotH} stroke="#16203a" />
            <line x1={epL} y1={epT + ePlotH} x2={EW - epR} y2={epT + ePlotH} stroke="#16203a" />
            <text x={epL - 7} y={epT + 4} textAnchor="end" className="axl">{maxD.toFixed(1)}</text>
            <text x={epL - 7} y={epT + ePlotH} textAnchor="end" className="axl">0</text>
            <text x={epL + ePlotW / 2} y={EH - 6} textAnchor="middle" className="axt">imagination step</text>
            {/* trust marker */}
            {trust < horizon && (
              <line x1={ex(trust)} y1={epT} x2={ex(trust)} y2={epT + ePlotH} stroke="#f472b6" strokeWidth={1} strokeDasharray="2 3" opacity={0.6} />
            )}
            <path d={errPath} fill="none" stroke="#f472b6" strokeWidth={2.2} />
            {step >= 0 && <circle cx={ex(step)} cy={ey(curDist)} r={4} fill="#f472b6" />}
          </svg>
        </div>
      </div>

      <div className="demo-ctrls">
        <div className="demo-row">
          <button className="play" onClick={play}>{playing ? "❚❚ Pause" : step >= horizon ? "↺ Replay" : "▶ Dream forward"}</button>
          <input type="range" min={0} max={horizon} step={1} value={step} onChange={(e) => { setPlaying(false); setStep(+e.target.value); }} style={{ flex: 1 }} />
        </div>
        <div className="demo-row slide">
          <label>Horizon <b>{horizon} steps</b></label>
          <input type="range" min={6} max={40} step={1} value={horizon} onChange={(e) => setHorizon(+e.target.value)} />
        </div>
        <div className="demo-row slide">
          <label>Model error <b>{err}%</b></label>
          <input type="range" min={0} max={10} step={0.5} value={err} onChange={(e) => setErr(+e.target.value)} />
        </div>
      </div>

      <p className="demo-insight">
        The agent plans by <b style={{ color: "#c084fc" }}>imagining</b> forward inside its learned world model instead of
        touching the real environment. But the model is never exact, and each predicted step is fed back into the next — so a
        tiny per-step error <b>compounds</b>. Reality stays on its orbit; the plan spirals off.
        {" "}
        {trust < horizon
          ? <>Here the plan is reliable for about <b style={{ color: "#f472b6" }}>{trust} steps</b> before error crosses the trust limit.</>
          : <>At this error rate the plan stays trustworthy across the whole horizon — push model error up and watch the horizon collapse.</>}
        {" "}That ceiling is why Dreamer-style agents imagine in <i>short</i> bursts and keep re-grounding in real experience.
      </p>
    </div>
  );
}
