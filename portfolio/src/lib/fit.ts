// Job-fit analysis shared types + an offline matcher used when no AI key is configured.

export interface FitMatch { requirement: string; evidence: string; href?: string; }
export interface FitResult {
  score: number; verdict: string; matches: FitMatch[]; gaps: string[]; pitch: string;
  mode: "ai" | "offline"; provider?: string;
}

export const LINKS: Record<string, string> = {
  "/work/agentic-riscv-verification": "Agentic RISC-V Verification Platform",
  "/work/bnn-accelerator": "BNN Systolic Accelerator",
  "/work/anvil": "Anvil — LLM Quantization Agent",
  "/work/gridsetu": "GridSetu",
  "/work/driftsense": "DriftSense",
  "/work/georeach": "GeoReach",
  "/resume": "Résumé",
};

interface Cap { label: string; re: RegExp; evidence: string; href?: string; weight?: number; }

const CAPS: Cap[] = [
  { label: "RTL design / SystemVerilog", re: /\b(rtl|systemverilog|verilog|vhdl|digital design|asic|micro-?architecture)\b/i,
    evidence: "Designed a patent-pending 64×64 systolic BNN accelerator in SystemVerilog — 374.5 GOP/s, 92.8 GOP/s/W.", href: "/work/bnn-accelerator", weight: 2 },
  { label: "Functional verification (UVM / cocotb)", re: /\b(uvm|cocotb|verification|testbench|coverage|constrained.random|scoreboard|dv)\b/i,
    evidence: "Built AVA, a 12-agent verification pipeline: testbench generation, golden-ISS diffing, coverage-guided test generation.", href: "/work/agentic-riscv-verification", weight: 2 },
  { label: "RISC-V / CPU", re: /\b(risc-?v|cpu|processor|isa)\b/i,
    evidence: "Verifies RISC-V designs against a golden ISS, instruction-by-instruction commit-log comparison.", href: "/work/agentic-riscv-verification" },
  { label: "FPGA / Xilinx-AMD flow", re: /\b(fpga|xilinx|amd|vivado|vitis|versal|zynq|hls|kria)\b/i,
    evidence: "Deployed an INT8 vision transformer on AMD Versal VCK190 with Vitis AI / HLS / Vivado at ISRO — sub-100 ms.", href: "/resume", weight: 2 },
  { label: "Edge / embedded AI inference", re: /\b(edge ai|edge computing|edge devices?|embedded|on-?device|inference|tinyml|npu|hardware accelerat)/i,
    evidence: "Edge AI research intern at ADRIN/ISRO: onboard Earth-observation inference under 100 ms.", href: "/resume", weight: 2 },
  { label: "Model quantization / optimization", re: /\b(quantiz|int8|int4|gguf|pruning|compression|model optimi|tensorrt|openvino|onnx)/i,
    evidence: "Anvil: hardware-aware LLM quantization agent — 1.8× faster time-to-first-token with better perplexity.", href: "/work/anvil", weight: 2 },
  { label: "LLMs / agentic AI", re: /\b(llm|large language|agent|agentic|langchain|langgraph|crewai|rag|mcp|genai|generative)/i,
    evidence: "Built multi-agent systems (12-agent verification pipeline, Anvil) with LangGraph/CrewAI/MCP.", href: "/work/agentic-riscv-verification", weight: 2 },
  { label: "Deep learning / computer vision", re: /\b(pytorch|tensorflow|deep learning|computer vision|cnn|transformer|vision|neural)/i,
    evidence: "Vision transformers on edge silicon; DriftSense SEM localization (3.3× better than NCC).", href: "/work/driftsense" },
  { label: "Python", re: /\bpython\b/i, evidence: "Primary language across agents, ML pipelines and cocotb testbenches." },
  { label: "C / C++", re: /(c\+\+|\bcpp\b|\bC\b(?![#+]))/, evidence: "C/C++ for performance-critical and embedded work." },
  { label: "EDA / design automation", re: /\b(eda|design automation|synthesis|timing|sta|physical design|place and route)\b/i,
    evidence: "Agentic EDA tooling (AVA) and full RTL-to-FPGA flows; hold/setup timing write-ups on the blog.", href: "/work/agentic-riscv-verification" },
  { label: "Production ML / MLOps", re: /\b(mlops|production ml|model deployment|deploy(ing)? models|inference pipeline|real-?time inference)/i,
    evidence: "At Wipro, shipped a production classifier and cut real-time inference latency by 13.4%.", href: "/resume" },
  { label: "Cloud / DevOps", re: /\b(aws|docker|kubernetes|cloud|ci\/cd|devops|linux|fastapi)\b/i,
    evidence: "AWS Certified Data Engineer – Associate; Docker, FastAPI, Linux, Git day to day.", href: "/resume" },
  { label: "Data science / analytics", re: /\b(data science|analytics|pandas|sql|statistics|tableau|forecast)/i,
    evidence: "B.S. Data Science at IIT Madras; Google Data Analytics Professional; GridSetu forecasting/simulation.", href: "/work/gridsetu" },
  { label: "Remote sensing / geospatial", re: /\b(remote sensing|satellite|sar|geospatial|gis|earth observation)/i,
    evidence: "GeoReach (IEEE GRSS winner): Sentinel-1 SAR flood mapping; EO inference at ISRO.", href: "/work/georeach" },
  { label: "Hackathon-speed prototyping", re: /\b(fast-paced|startup|prototype|0 to 1|zero to one|ownership)/i,
    evidence: "Two hackathon wins, a runner-up and three national finals — cold problem to defensible build in 36 hours." },
];

const GAPS: { label: string; re: RegExp }[] = [
  { label: "Multiple years of full-time industry experience (Tanush is a student, graduating 2028)", re: /\b([3-9]|1\d)\+?\s*(years|yrs)\b/i },
  { label: "PhD", re: /\bph\.?d\b/i },
  { label: "Analog / custom layout (Cadence Virtuoso)", re: /\b(virtuoso|analog layout|custom layout|spectre)\b/i },
  { label: "Commercial simulators (Synopsys VCS / Cadence Xcelium) in production", re: /\b(vcs|xcelium|questa)\b/i },
  { label: "Formal verification (JasperGold / SVA proofs)", re: /\b(formal verification|jasper|model checking)\b/i },
  { label: "Kubernetes at scale", re: /\bkubernetes|k8s\b/i },
  { label: "Frontend frameworks (React etc.)", re: /\b(react|angular|vue)\b/i },
  { label: "Java / Go / Rust", re: /\b(java|golang|rust)\b/i },
  { label: "Big-data stack (Spark / Hadoop)", re: /\b(spark|hadoop|scala)\b/i },
  { label: "CUDA kernel development", re: /\bcuda\b/i },
];

export function offlineFit(jd: string): FitResult {
  const matches: FitMatch[] = [];
  let got = 0, total = 0;
  for (const c of CAPS) {
    if (c.re.test(jd)) {
      const w = c.weight ?? 1; got += w; total += w;
      matches.push({ requirement: c.label, evidence: c.evidence, href: c.href });
    }
  }
  const gaps = GAPS.filter((g) => g.re.test(jd)).map((g) => g.label);
  total += gaps.length * 1.5;
  const raw = total ? got / total : 0.4;
  const score = Math.round(Math.max(25, Math.min(94, 30 + raw * 66 + Math.min(matches.length, 6))));
  const verdict = score >= 80 ? "Strong fit" : score >= 62 ? "Good fit" : score >= 45 ? "Partial fit" : "Stretch";
  const top = matches.slice(0, 3).map((m) => m.requirement);
  const pitch = matches.length
    ? `Tanush lines up with this role on ${top.join(", ").replace(/, ([^,]*)$/, " and $1")}. He works across both sides of the hardware/ML seam — from a 374.5 GOP/s RTL accelerator to agentic verification and edge deployment on AMD Versal at ISRO — which is rare at the student level.`
    : "This role sits outside Tanush's core areas (AI systems, Edge AI, EDA/verification). The résumé has the full picture.";
  return { score, verdict, matches: matches.slice(0, 7), gaps, pitch, mode: "offline" };
}
