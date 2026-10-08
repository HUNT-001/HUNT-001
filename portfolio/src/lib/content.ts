// Single source of truth for the portfolio's structured content.

export const SITE = {
  name: "Tanush Pavan V",
  email: "tanushpavanv@gmail.com",
  github: "https://github.com/HUNT-001",
  linkedin: "https://www.linkedin.com/in/vakkalagadda-tanush-pavan-a37a20308/",
  resume: "https://drive.google.com/file/d/1ZHIIiWZsbryzjKmy67pWGzHVqAEmm1Qt/view?usp=sharing",
};

export const NAV = [
  { label: "Work", href: "/work" },
  { label: "Writing", href: "/writing" },
  { label: "Lab", href: "/lab" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const DOMAINS = ["AGENTIC AI", "LLMs", "EDA", "VERIFICATION", "RL", "EDGE AI", "SILICON", "DEVOPS", "QUANTUM"];
export const HOT_DOMAINS = new Set(["AGENTIC AI", "QUANTUM"]);

export type Icon = "nodes" | "chat" | "chip" | "shield" | "loop" | "edge" | "wafer" | "infra" | "atom";

export interface Tile {
  tier: "core" | "sub"; color: "cy" | "vi"; icon: Icon; name: string; pill?: string; desc: string; flow?: string;
}

export const CORE_TILES: Tile[] = [
  { tier: "core", color: "vi", icon: "nodes", name: "Agentic AI",
    desc: "Planning, tool use, memory, and multi-agent workflows — systems that reason, act, and adapt.",
    flow: "planner → tool · memory → critic" },
  { tier: "core", color: "cy", icon: "shield", name: "Verification",
    desc: "UVM, cocotb, coverage, and adversarial testing — verification that goes beyond simply turning tests green.",
    flow: "stimulus → DUT → scoreboard → coverage" },
  { tier: "core", color: "cy", icon: "wafer", name: "Silicon / RTL",
    desc: "SystemVerilog, systolic accelerators, and RTL — a patent-pending BNN array, down to tapeout literacy.",
    flow: "RTL → PE array → SRAM → accelerator" },
];

export const SUB_TILES: Tile[] = [
  { tier: "sub", color: "cy", icon: "edge", name: "Edge AI",
    desc: "Hardware-aware vision transformers, quantization, and deployment — sub-100 ms inference on AMD Versal at ISRO.",
    flow: "FP32 → INT8 → NPU → inference" },
  { tier: "sub", color: "cy", icon: "chip", name: "EDA",
    desc: "EDA automation, design flows, and intelligent tooling — pushing hardware development toward autonomous workflows.",
    flow: "RTL → synthesis → P&R → timing" },
  { tier: "sub", color: "vi", icon: "chat", name: "LLMs",
    desc: "On-device inference, quantization, and RAG — making large models fit where they actually have to run." },
  { tier: "sub", color: "vi", icon: "loop", name: "Reinforcement Learning",
    desc: "Model-based RL and world models — planning inside a learned latent instead of the real world." },
  { tier: "sub", color: "cy", icon: "infra", name: "DevOps",
    desc: "Docker, CI/CD, APIs, and deployment — turning research prototypes into reproducible systems." },
  { tier: "sub", color: "vi", icon: "atom", name: "Quantum", pill: "exploring",
    desc: "Variational circuits and QML — the newest thread, learning in the open." },
];

export interface Experience {
  date: string; place: string; role: string; org: string; mono: string; vi?: boolean; desc: string; metric: string;
}
export const EXPERIENCE: Experience[] = [
  { date: "May – Jun 2026", place: "Hyderabad", role: "Edge AI Research Intern", org: "ADRIN — NRSC, ISRO", mono: "ISRO",
    desc: "Deployed an INT8-quantized MobileViTv2-XS vision transformer on the AMD Versal VCK190 (Vitis AI / HLS / Vivado) for onboard Earth-observation inference; ran latency/throughput/utilization trade-offs across Versal and Zynq.",
    metric: "sub-100 ms onboard inference" },
  { date: "Jul 2025 – Feb 2026", place: "Coimbatore", role: "Hardware Research Engineer", org: "BNN Systolic Accelerator · Research", mono: "BNN", vi: true,
    desc: "Designed and verified a patent-pending 64×64 systolic-array binary neural network accelerator in SystemVerilog for energy-efficient edge inference, with full RTL verification and performance analysis.",
    metric: "374.5 GOP/s · 92.8 GOP/s/W · 10.67× speedup" },
  { date: "May – Jul 2025", place: "Bengaluru", role: "AI-ML Engineering Intern", org: "Wipro", mono: "WIP",
    desc: "Built a production spam/ham text classifier (TF-IDF → Random Forest with a logistic-regression meta-classifier) for high-volume enterprise streams, then re-architected the real-time inference pipeline with batching and vectorized preprocessing.",
    metric: "−13.4% processing latency at scale" },
];

export interface Win { kind: "win" | "fin" | "fv"; year: string; result: string; title: string; org: string; tech: string; desc?: string; href?: string; }
export const WINS: Win[] = [
  { kind: "win", year: "2026", result: "Winner", title: "GeoReach", org: "IEEE Hackathon — SAADRI · IEEE · GRSS",
    tech: "Sentinel-1 SAR · OpenStreetMap · Flood mapping", href: "/work/georeach",
    desc: "Fused SAR imagery with road networks to map reachable areas during flooding in Assam. Team Climate Catalyst." },
  { kind: "win", year: "2026", result: "Winner · Industry & Enterprise", title: "DriftSense", org: "MunichTech EXPO 2026",
    tech: "Computer Vision · SEM imaging · FFT + LER fingerprinting", href: "/work/driftsense",
    desc: "Localized a reference patch in 1000×1000 SEM images where classical matching fails — 3.3× better than NCC on the hard tier. Selected for exhibition." },
];
export const FINALS: Win[] = [
  { kind: "fin", year: "2025", result: "◆ National Finalist", title: "Smart India Hackathon", org: "MoE · AICTE · MIC · Team Paradoxx6", tech: "Grand Finale · National" },
  { kind: "fin", year: "2026", result: "◆ National Finalist", title: "Analog Circuit Design Challenge", org: "IIT Madras · Team CircuitBreakers", tech: "Analog · Mixed-signal design" },
  { kind: "fv", year: "—", result: "◆ Finalist", title: "Mirabilis Design Hacks", org: "System-level modelling", tech: "Architecture · Modelling" },
];

export interface StudySection { h: string; p: string; }
export interface Project {
  slug: string; idx: string; title: string; tags: string[]; desc: string;
  metric?: { big: string; lbl: string; color: "cy" | "am" };
  lead?: boolean; featured?: boolean; domain: string; year: string;
  repo?: string; tech?: string; study?: StudySection[];
}

export const PROJECTS: Project[] = [
  {
    slug: "agentic-riscv-verification", idx: "01 — FLAGSHIP", lead: true, featured: true,
    title: "Agentic RISC-V Verification Platform", domain: "Verification", year: "2025 – present",
    tags: ["Verification", "Agentic AI", "RISC-V", "cocotb · UVM"],
    repo: "https://github.com/HUNT-001/ai-chip-design-platform",
    tech: "Python · SystemVerilog · cocotb · UVM · coverage-driven verification",
    desc: "Twelve agents that generate a testbench, run the design against a golden ISS, diff the two commit logs instruction by instruction, analyse coverage, and write new tests aimed at what the campaign hasn't reached. Underneath sits VOE — a frozen kernel where a “verified” claim can't exist without a re-checkable witness, every policy pre-registered in an append-only ledger.",
    metric: { big: "12 agents", lbl: "most run with no EDA toolchain", color: "am" },
    study: [
      { h: "The problem", p: "When an automated agent reports that a design is verified, why should anyone believe it? The interesting failure in verification is not the crash — it is the green result that means nothing." },
      { h: "AVA — the pipeline", p: "Give it RTL and it runs semantic analysis, generates a testbench, executes the design against a golden ISS, compares the two commit logs instruction by instruction, analyses coverage, and generates new tests aimed at what the campaign has not yet reached. Twelve agents, most of which run with no EDA toolchain at all." },
      { h: "VOE — the research track underneath", p: "VOE asks the harder question. It is built on a small frozen kernel in which a claim cannot exist without a witness — a real artifact, produced by a real tool, that can be re-checked later. Every policy change is pre-registered before data is collected and recorded in an append-only ledger, including the ones that failed." },
      { h: "What it buys", p: "Coverage-guided test generation and automated bug-discovery workflows that accelerate validation cycles — and, more importantly, a verification result you can actually trust." },
    ],
  },
  {
    slug: "bnn-accelerator", idx: "02 — RESEARCH", featured: true,
    title: "BNN Systolic Accelerator", domain: "Silicon", year: "2025 – 2026",
    tags: ["Silicon", "SystemVerilog", "Edge AI"],
    tech: "SystemVerilog · RTL verification · systolic array",
    desc: "A patent-pending 64×64 systolic-array binary neural network accelerator, designed and verified in RTL for energy-efficient edge inference.",
    metric: { big: "374.5 GOP/s", lbl: "92.8 GOP/s/W · 10.67× speedup", color: "cy" },
    study: [
      { h: "The problem", p: "Energy-efficient edge AI inference is a hardware problem, not just a quantized-model problem. A binary neural network turns a multiply-accumulate into XNOR + popcount — which is a sentence about silicon, not about machine learning." },
      { h: "The design", p: "A 64×64 systolic-array accelerator in SystemVerilog, with full RTL verification and performance analysis. The array streams binarized weights and activations through processing elements built around XNOR + popcount." },
      { h: "The result", p: "374.5 GOP/s, 92.8 GOP/s/W, a 10.67× speedup over the baseline — and a patent-pending architecture for energy-efficient edge inference." },
    ],
  },
  {
    slug: "anvil", idx: "03 — AGENT", featured: true,
    title: "Anvil — LLM Quantization Agent", domain: "LLMs", year: "2026",
    tags: ["LLMs", "Edge AI", "Arm KleidiAI"],
    tech: "llama.cpp · Arm KleidiAI · Snapdragon 695",
    desc: "Searches 2.7×10⁸ per-layer quant configs with a surrogate-guided planner; matched greedy's 60-evaluation result in ~9 on-device evals. Built for the Arm AI Optimization Challenge.",
    metric: { big: "1.8× faster", lbl: "time-to-first-token · better perplexity", color: "am" },
    study: [
      { h: "The problem", p: "There are 2.7×10⁸ per-layer quantization configurations for Qwen2.5-1.5B. Naive search is expensive, and KleidiAI does not accelerate Q4_K_M — the most-shipped format." },
      { h: "The approach", p: "A surrogate-guided planner over per-layer configs that matched a greedy search's 60-evaluation result in roughly 9 on-device evaluations." },
      { h: "The result", p: "Anvil's config gave 1.8× faster time-to-first-token and better perplexity (9.522 vs 9.605) at +48% size — built for the Arm Create: AI Optimization Challenge 2026." },
    ],
  },
  {
    slug: "gridsetu", idx: "04 — SYSTEMS", domain: "Edge AI", year: "2026",
    title: "GridSetu", tags: ["Energy", "Simulation", "Agentic AI"],
    tech: "PyPSA/Pyomo+HiGHS · pandapower · LightGBM · FastAPI · React 19",
    desc: "A multi-layer city-grid simulator (day-ahead market, AC power flow, frequency dynamics) that turns a shared community battery into a forecast, confidence-scored Reliability Reserve.",
    metric: { big: "−80%", lbl: "evening unserved energy, in simulation", color: "cy" },
    study: [
      { h: "The problem", p: "A shared community battery is only useful if the grid operator can trust what it will deliver. That means a forecast, with confidence, published somewhere real." },
      { h: "The build", p: "A multi-layer simulator — day-ahead market, AC power flow, frequency dynamics — turning the battery into a confidence-scored Reliability Reserve published to a mock Schneider EcoStruxure ADMS endpoint. A tool-calling operator copilot (Anthropic API, streaming) sits on top, where every figure comes from a simulator tool call." },
      { h: "The result", p: "In simulation: cut evening unserved energy 80%, and eliminated critical-load outages and transformer-overload trips." },
    ],
  },
  {
    slug: "driftsense", idx: "05 — CV", domain: "Edge AI", year: "2026",
    title: "DriftSense", tags: ["Computer Vision", "SEM", "No neural nets"],
    tech: "NumPy · SciPy · OpenCV · FFT + LER fingerprinting",
    desc: "Localizes a reference patch in 1000×1000 SEM inspection images where classical template matching fails on repetitive DRAM/FinFET lattices.",
    metric: { big: "3.3×", lbl: "better than classical NCC · MunichTech winner", color: "am" },
    study: [
      { h: "The problem", p: "Classical template matching fails on the repetitive DRAM/FinFET lattices in SEM inspection images — every patch looks like every other patch." },
      { h: "The approach", p: "FFT spectral analysis for candidate recall, then persistent line-edge-roughness (LER) fingerprinting for discrimination. No neural nets — pure signal processing." },
      { h: "The result", p: "57.5% accuracy on the hard tier (±5° rotation, ±7% scale) vs 17.5% for classical NCC — 3.3× better; LER discrimination gave d′ ≈ 4–5 separability. 31 regression tests. MunichTech EXPO 2026 winner." },
    ],
  },
  {
    slug: "georeach", idx: "06 — GEO", domain: "Edge AI", year: "2026",
    title: "GeoReach", tags: ["Remote Sensing", "SAR", "Disaster response"],
    tech: "Sentinel-1 SAR · OpenStreetMap API · React · QGIS",
    desc: "A flood-accessibility platform for communities in Assam, fusing Sentinel-1 SAR imagery with OpenStreetMap road networks to map reachable areas during flooding.",
    metric: { big: "IEEE GRSS", lbl: "hackathon winner", color: "cy" },
    study: [
      { h: "The problem", p: "During a flood, the question that matters isn't where the water is — it's which places can still be reached." },
      { h: "The build", p: "Fused Sentinel-1 SAR imagery (which sees through cloud) with OpenStreetMap road networks to map reachable areas during flooding for communities in Assam." },
      { h: "The result", p: "IEEE GRSS hackathon winner, Team Climate Catalyst." },
    ],
  },
];

export const FEATURED = PROJECTS.filter((p) => p.featured);
