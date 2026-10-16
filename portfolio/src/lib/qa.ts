// Curated knowledge base for the on-site Q&A widget. Works with zero backend —
// an optional /api/ask route can upgrade this to a live AI answer when a key is set.

export interface QA { k: string[]; a: string }

export const SUGGESTED = [
  "What are you working on?",
  "Tell me about the RISC-V verification platform",
  "What roles are you open to?",
  "What's your strongest hardware project?",
  "How does this site's Dream Log work?",
];

export const KB: QA[] = [
  { k: ["who", "you", "about", "yourself", "intro"],
    a: "I'm Tanush Pavan — a dual-degree student (B.Tech EEE at Amrita, B.S. Data Science at IIT Madras) building efficient intelligent systems at the seam of model and machine: world models, RL and agentic AI on one side, RTL, verification and edge AI on the other." },
  { k: ["working", "now", "currently", "focus", "building"],
    a: "Right now: the agentic RISC-V verification platform (AVA/VOE), and reading into variational quantum algorithms. The RISC-V work is the one I'm most excited about — twelve agents that verify a design and a frozen kernel that refuses to call anything 'verified' without a re-checkable witness." },
  { k: ["riscv", "risc-v", "verification", "ava", "voe", "agent", "agentic", "flagship"],
    a: "AVA is a 12-agent verification pipeline: give it RTL and it runs semantic analysis, generates a testbench, executes against a golden ISS, diffs the two commit logs instruction by instruction, analyses coverage, and writes new tests for what the campaign hasn't reached. Most agents run with no EDA toolchain at all. VOE is the research track underneath — a frozen kernel where a claim can't exist without a witness, every policy pre-registered in an append-only ledger. The interesting failure in verification isn't the crash; it's the green result that means nothing." },
  { k: ["bnn", "accelerator", "silicon", "systolic", "hardware", "strongest", "best", "chip"],
    a: "My strongest hardware result is a patent-pending 64×64 systolic-array binary neural network accelerator in SystemVerilog — 374.5 GOP/s, 92.8 GOP/s/W, a 10.67× speedup over the baseline. A BNN turns a multiply-accumulate into XNOR + popcount, which is a sentence about silicon, not machine learning." },
  { k: ["anvil", "quantization", "llm", "quant", "kleidiai", "arm"],
    a: "Anvil is a hardware-aware LLM quantization agent built for the Arm AI Optimization Challenge. A surrogate-guided planner searches 2.7×10⁸ per-layer configs and matched a greedy search's 60-evaluation result in ~9 on-device evals — 1.8× faster time-to-first-token and better perplexity. It also showed KleidiAI doesn't accelerate Q4_K_M, the most-shipped format." },
  { k: ["edge", "isro", "adrin", "versal", "mobilevit", "transformer", "vision"],
    a: "At ADRIN (ISRO) I deployed an INT8-quantized MobileViTv2-XS vision transformer on the AMD Versal VCK190 for onboard Earth-observation inference — sub-100 ms. A transformer on edge silicon is a memory-hierarchy problem wearing an attention mask; the attention block is the bandwidth problem, everything else is arithmetic you can schedule." },
  { k: ["gridsetu", "driftsense", "georeach", "project", "projects", "built", "other"],
    a: "A few more: GridSetu — a city-grid simulator that cut evening unserved energy 80% in simulation; DriftSense — SEM-image localization via FFT + line-edge-roughness fingerprinting, 3.3× better than classical NCC (MunichTech winner); and GeoReach — Sentinel-1 SAR + OpenStreetMap flood-accessibility mapping (IEEE GRSS winner). The Work page has case studies for each." },
  { k: ["roles", "open", "hiring", "job", "available", "looking", "opportunity", "intern"],
    a: "I'm open to roles in AI systems, Edge AI and EDA — and interesting problems at the hardware/ML boundary. The fastest way to reach me is email (tanushpavanv@gmail.com) or LinkedIn." },
  { k: ["skills", "stack", "tools", "tech", "use", "languages", "know"],
    a: "Hardware & EDA: SystemVerilog, UVM, cocotb, Vivado, Vitis AI/HLS, AMD Versal, Verilator. ML/AI: PyTorch, vision transformers, INT8/GGUF quantization, llama.cpp, KleidiAI, LangGraph/CrewAI/MCP. Cloud/DevOps: Python, C/C++, AWS, Docker, FastAPI, Git. The /uses page has the full list." },
  { k: ["hackathon", "win", "wins", "award", "sih", "finalist", "runner", "competition", "recognition"],
    a: "Two wins, a runner-up and three national finals. Wins: IEEE GRSS (GeoReach) and MunichTech EXPO 2026 (DriftSense). Runner-up (2nd): the AI Infra Summit Hackathon on lablab.ai, built on OpenVINO / Intel / NVIDIA. Finals: Smart India Hackathon 2025, the Analog Circuit Design Challenge at IIT Madras, and Mirabilis Design Hacks. The through-line isn't the subject — it's going from a cold problem statement to a defensible build in 36 hours." },
  { k: ["education", "degree", "college", "study", "amrita", "iit", "madras", "dual"],
    a: "Two degrees, deliberately: a B.Tech in Electrical & Electronics Engineering at Amrita Vishwa Vidyapeetham, and a B.S. in Data Science & Applications at IIT Madras (distance). One taught me to reason about data and uncertainty; the other taught me what happens when electrons have to carry the answer." },
  { k: ["dream", "log", "site", "this", "how", "portfolio", "lab"],
    a: "The Dream Log in the Lab is a world model that dreams about the person building it. Every night a GitHub Action reads what I actually pushed, compresses it into a small state vector, and performs one imagination rollout from that latent — then commits the result. The whole site is Next.js; the hero backdrop and the rest of the aesthetic are hand-built." },
  { k: ["quantum", "exploring", "learning", "next"],
    a: "Quantum is the newest thread — variational circuits and QML, learned in the open. I treat it like the silicon work: both are about extracting useful computation from a physical substrate that doesn't care about your abstractions." },
  { k: ["contact", "reach", "email", "message", "talk", "connect"],
    a: "Email is best: tanushpavanv@gmail.com. I'm also on GitHub (HUNT-001) and LinkedIn, and you can ask in the open on GitHub Discussions — the links are right below." },
  { k: ["resume", "cv", "download"],
    a: "There's a web résumé on the /resume page with a one-click PDF download. It covers experience, the BNN accelerator, projects, skills and certifications." },
];

const STOP = new Set(["the", "a", "an", "is", "are", "do", "you", "your", "what", "how", "about", "tell", "me", "of", "to", "in", "on", "and", "with", "for", "i", "s", "whats", "it"]);

export function answer(query: string): string {
  const words = query.toLowerCase().replace(/[^a-z0-9 -]/g, " ").split(/\s+/).filter((w) => w && !STOP.has(w));
  let best: QA | null = null;
  let bestScore = 0;
  for (const qa of KB) {
    let score = 0;
    for (const w of words) {
      for (const key of qa.k) {
        if (key === w) score += 2;
        else if (w.length > 3 && (key.includes(w) || w.includes(key))) score += 1;
      }
    }
    if (score > bestScore) { bestScore = score; best = qa; }
  }
  if (best && bestScore >= 2) return best.a;
  return "Good question — I don't have a canned answer for that one. The honest move is to ask me directly: email tanushpavanv@gmail.com, or open it on GitHub Discussions (link below) so the answer is public. You can also browse Work, Writing and the Lab for the long version.";
}
