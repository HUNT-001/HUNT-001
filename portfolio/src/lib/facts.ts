// Ground truth the AI features may use. Keep in sync with content.ts — the models are told
// never to go beyond these facts.
export const FACTS = `
- Name: Tanush Pavan V. Dual-degree student: B.Tech EEE (Amrita Vishwa Vidyapeetham, 2024–2028) and
  B.S. Data Science (IIT Madras, 2024–2028). Based in India. Email: tanushpavanv@gmail.com.
- Open to roles in AI systems, Edge AI and EDA / hardware verification; internships and full-time.
- Experience:
  * Edge AI Research Intern, ADRIN – NRSC, ISRO (May–Jun 2026): INT8 MobileViTv2-XS vision transformer on
    AMD Versal VCK190 (Vitis AI / HLS / Vivado), sub-100 ms onboard Earth-observation inference; latency/
    throughput/utilization trade-offs across Versal and Zynq.
  * Hardware Research Engineer (Jul 2025–Feb 2026): patent-pending 64x64 systolic-array binary neural
    network accelerator in SystemVerilog — 374.5 GOP/s, 92.8 GOP/s/W, 10.67x speedup; full RTL verification.
  * AI-ML Engineering Intern, Wipro (May–Jul 2025): production spam/ham classifier (TF-IDF → Random Forest
    + logistic-regression meta-classifier); re-architected real-time inference, −13.4% latency.
- Projects:
  * Agentic RISC-V Verification Platform (flagship): AVA, a 12-agent pipeline — semantic RTL analysis,
    testbench generation, run vs a golden ISS, commit-log diffing, coverage analysis, new test generation;
    most agents run with no EDA toolchain. VOE: frozen kernel where a "verified" claim needs a re-checkable
    witness; policies pre-registered in an append-only ledger.
  * Anvil: hardware-aware LLM quantization agent (Arm AI Optimization Challenge); surrogate-guided search
    over 2.7e8 per-layer configs; 1.8x faster time-to-first-token with better perplexity; llama.cpp, KleidiAI.
  * GridSetu: city-grid simulator, −80% evening unserved energy in simulation.
  * DriftSense: SEM-image localization via FFT + line-edge-roughness fingerprinting, 3.3x better than NCC.
  * GeoReach: Sentinel-1 SAR + OpenStreetMap flood-accessibility mapping.
- Recognition: Winner IEEE GRSS hackathon (GeoReach); Winner MunichTech EXPO 2026 (DriftSense); Runner-up
  (2nd) AI Infra Summit Hackathon (lablab.ai, OpenVINO/Intel/NVIDIA); National finalist SIH 2025; finalist
  Analog Circuit Design Challenge (IIT Madras); finalist Mirabilis Design Hacks.
- Skills: SystemVerilog, RTL design, UVM, cocotb, Verilator, coverage-driven verification, HLS; Vivado,
  Vitis AI/HLS, AMD Versal, Kria, Zynq UltraScale+, MATLAB HDL Coder, LTSpice; PyTorch, computer vision,
  vision transformers, INT8/GGUF quantization, llama.cpp, KleidiAI, RAG, time-series; LangChain, LangGraph,
  CrewAI, MCP, A2A; Pandas, NumPy, scikit-learn, Tableau, R; Python, C, C++, SQL, FastAPI, AWS, Docker,
  Linux, Git. Exploring quantum ML (variational circuits).
- Certifications: Microsoft SQL AI Developer Associate (DP-800); Oracle Agentic AI Foundations Associate;
  AWS Certified Data Engineer – Associate (DEA-C01); GitHub Foundations (GH-900); Google Data Analytics
  Professional; Hugging Face AI Agents Course; Hardware Security (University of Maryland); Algorithms
  Specialization (Stanford); VLSI Design (L&T EduTech).
`.trim();
