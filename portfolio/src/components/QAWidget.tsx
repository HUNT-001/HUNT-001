"use client";
import { useEffect, useRef, useState } from "react";
import { answer, SUGGESTED } from "@/lib/qa";

interface Msg { role: "user" | "bot"; text: string }

export default function QAWidget() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "bot", text: "Hi — I'm the site's answer engine. Ask me anything about Tanush's work, projects, or what he's open to. Try a suggestion below, or type your own." },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [aiMode, setAiMode] = useState(false);
  const streamRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    streamRef.current?.scrollTo({ top: streamRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, busy]);

  async function resolve(q: string): Promise<string> {
    // Try the optional AI route; fall back to the local knowledge base.
    try {
      const r = await fetch("/api/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      if (r.ok) {
        const data = await r.json();
        if (data?.answer) { setAiMode(true); return data.answer as string; }
      }
    } catch { /* offline / no key — use KB */ }
    return answer(q);
  }

  async function ask(q: string) {
    const question = q.trim();
    if (!question || busy) return;
    setInput("");
    setMsgs((m) => [...m, { role: "user", text: question }]);
    setBusy(true);
    const a = await resolve(question);
    // small delay so the typing indicator reads as "thinking"
    await new Promise((res) => setTimeout(res, 350));
    setBusy(false);
    setMsgs((m) => [...m, { role: "bot", text: a }]);
  }

  return (
    <div className="qa">
      <div className="qa-top">
        <span className="dot" /> ASK ME ANYTHING
        <span className="mode">{aiMode ? "AI-assisted" : "instant"}</span>
      </div>

      <div className="qa-stream" ref={streamRef}>
        {msgs.map((m, i) => (
          <div key={i} className={`qa-msg ${m.role}`}>{m.text}</div>
        ))}
        {busy && (
          <div className="qa-typing"><i /><i /><i /></div>
        )}
      </div>

      <div className="qa-sugg">
        {SUGGESTED.map((s) => (
          <button key={s} onClick={() => ask(s)} disabled={busy}>{s}</button>
        ))}
      </div>

      <form className="qa-input" onSubmit={(e) => { e.preventDefault(); ask(input); }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about a project, the stack, availability…"
          aria-label="Ask a question"
        />
        <button type="submit" disabled={busy || !input.trim()}>Ask →</button>
      </form>

      <p className="qa-note">
        Answers come from a curated knowledge base. Add an ANTHROPIC_API_KEY on deploy and the widget upgrades to live
        AI, grounded on the same facts.
      </p>
    </div>
  );
}
