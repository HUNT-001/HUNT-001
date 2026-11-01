"use client";
import { useMemo, useState } from "react";

/* ---- precision presets: bytes stored per weight ---- */
const PRECISIONS: { key: string; bpw: number; color: string }[] = [
  { key: "FP32", bpw: 4, color: "#64748b" },
  { key: "FP16", bpw: 2, color: "#60a5fa" },
  { key: "INT8", bpw: 1, color: "#38bdf8" },
  { key: "INT4", bpw: 0.5, color: "#22d3ee" },
];

/* ---- device presets: HBM/DRAM bandwidth (GB/s) and peak compute (TFLOP/s) ---- */
const DEVICES = [
  { key: "Phone NPU", bw: 60, peak: 20 },
  { key: "Laptop", bw: 200, peak: 30 },
  { key: "Data-center GPU", bw: 3350, peak: 990 },
];

export default function Roofline() {
  const [precIdx, setPrecIdx] = useState(1); // FP16
  const [params, setParams] = useState(7); // billions
  const [devIdx, setDevIdx] = useState(2); // GPU
  const [bw, setBw] = useState(DEVICES[2].bw);

  const dev = DEVICES[devIdx];
  const peak = dev.peak; // TFLOP/s
  const prec = PRECISIONS[precIdx];

  const m = useMemo(() => {
    const bpw = prec.bpw;
    const paramsAbs = params * 1e9;
    // decode is memory-bound: 2 FLOPs per weight per token, bpw bytes read per weight
    const intensity = 2 / bpw; // FLOP/byte
    const bwBytes = bw * 1e9; // bytes/s
    const peakFlops = peak * 1e12; // FLOP/s
    const ridge = peakFlops / bwBytes; // FLOP/byte
    const attainable = Math.min(peakFlops, intensity * bwBytes); // FLOP/s
    const memoryBound = intensity < ridge;
    const tokPerSec = attainable / (2 * paramsAbs);
    const sizeGB = (paramsAbs * bpw) / 1e9;
    return { bpw, intensity, ridge, attainable, memoryBound, tokPerSec, sizeGB };
  }, [prec.bpw, params, bw, peak]);

  /* ---------- chart geometry (log-log roofline) ---------- */
  const W = 660, H = 330, padL = 54, padR = 20, padT = 22, padB = 44;
  const plotW = W - padL - padR, plotH = H - padT - padB;
  const xMin = -2, xMax = 10; // log2(FLOP/byte): 0.25 .. 1024
  const yMaxLog = Math.log10(peak) + 0.2;
  const yMinLog = yMaxLog - 4.2;
  const px = (I: number) => padL + ((Math.log2(I) - xMin) / (xMax - xMin)) * plotW;
  const py = (p: number) => padT + (1 - (Math.log10(p) - yMinLog) / (yMaxLog - yMinLog)) * plotH;
  const clampP = (p: number) => Math.min(Math.pow(10, yMaxLog), Math.max(Math.pow(10, yMinLog), p));

  // roof polyline: perf(I) = min(I*bw/1000, peak)  [TFLOP/s]
  const roof: string = useMemo(() => {
    const pts: string[] = [];
    for (let i = 0; i <= 80; i++) {
      const lx = xMin + ((xMax - xMin) * i) / 80;
      const I = Math.pow(2, lx);
      const perf = Math.min((I * bw) / 1000, peak);
      pts.push(`${px(I).toFixed(1)},${py(clampP(perf)).toFixed(1)}`);
    }
    return pts.join(" ");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bw, peak]);

  const opPerf = m.attainable / 1e12; // TFLOP/s
  const xTicks = [0.25, 1, 4, 16, 64, 256, 1024];
  const yDecades: number[] = [];
  for (let e = Math.ceil(yMinLog); e <= Math.floor(yMaxLog); e++) yDecades.push(e);

  const fmtTok = (t: number) => (t >= 1000 ? `${(t / 1000).toFixed(1)}k` : t >= 100 ? t.toFixed(0) : t.toFixed(1));

  return (
    <div className="demo">
      <div className="demo-top">
        <span>// ROOFLINE · LLM DECODE · ARITHMETIC INTENSITY = 2 / bytes-per-weight</span>
        <span className="src" style={{ color: m.memoryBound ? "#22d3ee" : "#bc7b3a" }}>
          {m.memoryBound ? "memory-bound" : "compute-bound"}
        </span>
      </div>

      <div className="demo-stats">
        <div className="dstat">
          <div className="n" style={{ color: prec.color }}>{fmtTok(m.tokPerSec)}</div>
          <div className="l">tokens / sec</div>
        </div>
        <div className="dstat">
          <div className="n">{m.sizeGB < 1 ? `${(m.sizeGB * 1000).toFixed(0)} MB` : `${m.sizeGB.toFixed(1)} GB`}</div>
          <div className="l">weights in memory</div>
        </div>
        <div className="dstat">
          <div className="n">{m.intensity.toFixed(1)}</div>
          <div className="l">FLOP / byte</div>
        </div>
      </div>

      <div className="demo-chart">
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label="roofline chart">
          {/* y grid + labels */}
          {yDecades.map((e) => (
            <g key={`y${e}`}>
              <line x1={padL} y1={py(Math.pow(10, e))} x2={W - padR} y2={py(Math.pow(10, e))} stroke="#16203a" strokeWidth={1} />
              <text x={padL - 8} y={py(Math.pow(10, e)) + 3.5} textAnchor="end" className="axl">
                {Math.pow(10, e) >= 1 ? `${Math.pow(10, e)}` : Math.pow(10, e).toPrecision(1)}
              </text>
            </g>
          ))}
          {/* x grid + labels */}
          {xTicks.map((t) => (
            <g key={`x${t}`}>
              <line x1={px(t)} y1={padT} x2={px(t)} y2={padT + plotH} stroke="#111a2e" strokeWidth={1} />
              <text x={px(t)} y={padT + plotH + 18} textAnchor="middle" className="axl">{t}</text>
            </g>
          ))}
          <text x={padL - 40} y={padT + plotH / 2} transform={`rotate(-90 ${padL - 40} ${padT + plotH / 2})`} textAnchor="middle" className="axt">attainable TFLOP/s</text>
          <text x={padL + plotW / 2} y={H - 6} textAnchor="middle" className="axt">arithmetic intensity (FLOP / byte)</text>

          {/* ridge line */}
          {m.ridge <= Math.pow(2, xMax) && (
            <line x1={px(m.ridge)} y1={padT} x2={px(m.ridge)} y2={padT + plotH} stroke="#bc7b3a" strokeWidth={1.2} strokeDasharray="4 4" opacity={0.7} />
          )}

          {/* the roof */}
          <polyline points={roof} fill="none" stroke="#2d5a86" strokeWidth={2.5} />

          {/* ghost operating points for each precision */}
          {PRECISIONS.map((p) => {
            const I = 2 / p.bpw;
            const perf = Math.min((I * bw) / 1000, peak);
            const active = p.key === prec.key;
            return (
              <g key={p.key}>
                <circle cx={px(I)} cy={py(clampP(perf))} r={active ? 7 : 4} fill={active ? p.color : "#1b2740"} stroke={p.color} strokeWidth={active ? 2.5 : 1.5} />
                {active && (
                  <>
                    <line x1={px(I)} y1={py(clampP(perf))} x2={px(I)} y2={padT + plotH} stroke={p.color} strokeWidth={1} strokeDasharray="3 3" opacity={0.5} />
                    <text x={px(I) + 11} y={py(clampP(perf)) - 8} className="axl" fill={p.color}>{p.key}</text>
                  </>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="demo-ctrls">
        <div className="demo-row">
          <label>Precision</label>
          <div className="seg">
            {PRECISIONS.map((p, idx) => (
              <button key={p.key} className={idx === precIdx ? "on" : ""} onClick={() => setPrecIdx(idx)}
                style={idx === precIdx ? { borderColor: p.color, color: p.color } : undefined}>{p.key}</button>
            ))}
          </div>
        </div>

        <div className="demo-row">
          <label>Device</label>
          <div className="seg">
            {DEVICES.map((dv, idx) => (
              <button key={dv.key} className={idx === devIdx ? "on" : ""}
                onClick={() => { setDevIdx(idx); setBw(dv.bw); }}>{dv.key}</button>
            ))}
          </div>
        </div>

        <div className="demo-row slide">
          <label>Model size <b>{params}B params</b></label>
          <input type="range" min={0.5} max={13} step={0.5} value={params} onChange={(e) => setParams(+e.target.value)} />
        </div>

        <div className="demo-row slide">
          <label>Memory bandwidth <b>{bw} GB/s</b></label>
          <input type="range" min={20} max={4000} step={10} value={bw} onChange={(e) => setBw(+e.target.value)} />
        </div>
      </div>

      <p className="demo-insight">
        {m.memoryBound ? (
          <>You&apos;re on the <b style={{ color: "#22d3ee" }}>memory-bound slope</b>. Decode reads every weight once per token,
          so throughput is set by bandwidth ÷ model bytes — not by how many FLOPs the chip can do. Drop the precision and the
          weights shrink, the operating point slides <b>right and up</b>, and tokens/sec rise almost 1:1. That is the whole case
          for quantization on the edge.</>
        ) : (
          <>You&apos;ve crossed the <b style={{ color: "#bc7b3a" }}>ridge</b> into the compute-bound regime — the flat roof.
          Here the chip&apos;s peak FLOP/s is the ceiling, so shaving more bits off the weights buys nothing. Most LLM decode
          never gets here, which is exactly why it stays memory-bound.</>
        )}
      </p>
    </div>
  );
}
