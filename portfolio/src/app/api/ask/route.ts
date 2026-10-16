import { NextResponse } from "next/server";
import { answer as kbAnswer } from "@/lib/qa";

// Optional AI-assisted answering. Works only if ANTHROPIC_API_KEY is set in the
// environment (e.g. a Vercel env var). Without it, this route reports that AI is
// unavailable and the client falls back to the curated knowledge base.

const SYSTEM = `You are the Q&A assistant on Tanush Pavan V's portfolio site. Answer visitor
questions about Tanush in a concise, first-person voice ("I..."), grounded ONLY in these facts:

- Dual-degree student: B.Tech EEE (Amrita), B.S. Data Science (IIT Madras). Based in India.
- Open to roles in AI systems, Edge AI and EDA. Email: tanushpavanv@gmail.com.
- Flagship: Agentic RISC-V Verification Platform (AVA = 12-agent pipeline vs a golden ISS; VOE =
  a frozen kernel where a verified claim needs a re-checkable witness, policies pre-registered in
  an append-only ledger). The real failure in verification is the green result that means nothing.
- Patent-pending 64x64 systolic BNN accelerator: 374.5 GOP/s, 92.8 GOP/s/W, 10.67x speedup.
- Anvil: hardware-aware LLM quantization agent (Arm challenge), surrogate-guided search over 2.7e8
  configs, 1.8x faster TTFT.
- Edge AI at ADRIN/ISRO: INT8 MobileViTv2-XS on AMD Versal VCK190, sub-100 ms.
- Wins: IEEE GRSS (GeoReach) and MunichTech EXPO 2026 (DriftSense). Runner-up (2nd): AI Infra
  Summit Hackathon (lablab.ai, on OpenVINO/Intel/NVIDIA). Finals: SIH 2025, Analog Circuit Design
  Challenge (IIT Madras), Mirabilis Design Hacks.
- Other projects: GridSetu (city-grid sim, -80% unserved energy in sim), DriftSense (SEM CV),
  GeoReach (SAR flood mapping).
- Stack: SystemVerilog, UVM, cocotb, Vivado, Vitis AI/HLS; PyTorch, llama.cpp, KleidiAI,
  LangGraph/CrewAI/MCP; AWS, Docker, FastAPI, Git.
- Exploring quantum (variational circuits, QML).

Keep answers to 2-4 sentences. If asked something outside these facts, say you don't have that
detail and point them to email or GitHub Discussions. Never invent facts or figures.`;

export async function POST(req: Request) {
  const key = process.env.ANTHROPIC_API_KEY;
  let question = "";
  try {
    const body = await req.json();
    question = String(body?.question ?? "").slice(0, 500);
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
  if (!question.trim()) return NextResponse.json({ error: "empty" }, { status: 400 });

  // No key configured: tell the client to fall back to the knowledge base.
  if (!key) return NextResponse.json({ answer: null, mode: "kb" }, { status: 200 });

  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5",
        max_tokens: 400,
        system: SYSTEM,
        messages: [{ role: "user", content: question }],
      }),
    });
    if (!r.ok) throw new Error(`anthropic ${r.status}`);
    const data = await r.json();
    const text = Array.isArray(data?.content)
      ? data.content.map((c: { text?: string }) => c.text ?? "").join("").trim()
      : "";
    return NextResponse.json({ answer: text || kbAnswer(question), mode: "ai" });
  } catch {
    // On any upstream failure, degrade gracefully to the curated answer.
    return NextResponse.json({ answer: kbAnswer(question), mode: "kb-fallback" });
  }
}
