// Provider-agnostic LLM client. Uses whichever free key is configured, in order:
//   GROQ_API_KEY  → Groq        (OpenAI-compatible)   model: GROQ_MODEL
//   GEMINI_API_KEY→ Google AI   (OpenAI-compatible)   model: GEMINI_MODEL
//   OPENROUTER_API_KEY → OpenRouter (free models)     model: OPENROUTER_MODEL
//   ANTHROPIC_API_KEY  → Anthropic                    model: ANTHROPIC_MODEL
// If one provider errors or rate-limits, the next is tried. If none are set or all
// fail, callers get `null` and fall back to their offline behaviour.

export interface ChatOpts { maxTokens?: number; temperature?: number; json?: boolean; }
export interface ChatResult { text: string; provider: string; }

interface OAIProvider { name: string; key?: string; url: string; model: string; extraHeaders?: Record<string, string>; }

function providers(): OAIProvider[] {
  const env = process.env;
  return [
    { name: "groq", key: env.GROQ_API_KEY, url: "https://api.groq.com/openai/v1/chat/completions",
      model: env.GROQ_MODEL || "llama-3.3-70b-versatile" },
    { name: "gemini", key: env.GEMINI_API_KEY, url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
      model: env.GEMINI_MODEL || "gemini-2.5-flash" },
    { name: "openrouter", key: env.OPENROUTER_API_KEY, url: "https://openrouter.ai/api/v1/chat/completions",
      model: env.OPENROUTER_MODEL || "meta-llama/llama-3.3-70b-instruct:free",
      extraHeaders: { "HTTP-Referer": "https://tanushpavan.vercel.app", "X-Title": "Tanush Pavan portfolio" } },
  ].filter((p) => !!p.key);
}

export function aiAvailable(): boolean {
  return providers().length > 0 || !!process.env.ANTHROPIC_API_KEY;
}

async function withTimeout<T>(p: (signal: AbortSignal) => Promise<T>, ms: number): Promise<T> {
  const ctl = new AbortController();
  const t = setTimeout(() => ctl.abort(), ms);
  try { return await p(ctl.signal); } finally { clearTimeout(t); }
}

export async function chat(system: string, user: string, opts: ChatOpts = {}): Promise<ChatResult | null> {
  const { maxTokens = 500, temperature = 0.3, json = false } = opts;

  for (const p of providers()) {
    try {
      const text = await withTimeout(async (signal) => {
        const r = await fetch(p.url, {
          method: "POST", signal,
          headers: { "content-type": "application/json", authorization: `Bearer ${p.key}`, ...(p.extraHeaders ?? {}) },
          body: JSON.stringify({
            model: p.model, max_tokens: maxTokens, temperature,
            messages: [{ role: "system", content: system }, { role: "user", content: user }],
            ...(json ? { response_format: { type: "json_object" } } : {}),
          }),
        });
        if (!r.ok) throw new Error(`${p.name} ${r.status}`);
        const data = await r.json();
        return String(data?.choices?.[0]?.message?.content ?? "").trim();
      }, 20000);
      if (text) return { text, provider: p.name };
    } catch { /* try next provider */ }
  }

  const ak = process.env.ANTHROPIC_API_KEY;
  if (ak) {
    try {
      const text = await withTimeout(async (signal) => {
        const r = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST", signal,
          headers: { "content-type": "application/json", "x-api-key": ak, "anthropic-version": "2023-06-01" },
          body: JSON.stringify({ model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5", max_tokens: maxTokens, temperature,
            system, messages: [{ role: "user", content: user }] }),
        });
        if (!r.ok) throw new Error(`anthropic ${r.status}`);
        const data = await r.json();
        return Array.isArray(data?.content) ? data.content.map((c: { text?: string }) => c.text ?? "").join("").trim() : "";
      }, 20000);
      if (text) return { text, provider: "anthropic" };
    } catch { /* fall through */ }
  }
  return null;
}

/** Pull the first JSON object out of a model reply (tolerates code fences / chatter). */
export function extractJson<T>(text: string): T | null {
  const s = text.indexOf("{"), e = text.lastIndexOf("}");
  if (s < 0 || e <= s) return null;
  try { return JSON.parse(text.slice(s, e + 1)) as T; } catch { return null; }
}

/** Best-effort per-IP limiter (per serverless instance) to protect free-tier quotas. */
const hits = new Map<string, number[]>();
export function rateLimited(ip: string, max = 8, windowMs = 60_000): boolean {
  const now = Date.now();
  const arr = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  arr.push(now); hits.set(ip, arr);
  if (hits.size > 5000) hits.clear();
  return arr.length > max;
}
export function clientIp(req: Request): string {
  return (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "anon";
}
