import type { Icon } from "@/lib/content";
import type { ReactElement } from "react";

const P: Record<Icon, ReactElement> = {
  nodes: <path d="M12 4a2 2 0 100 4 2 2 0 000-4zM5 16a2 2 0 100 4 2 2 0 000-4zM19 16a2 2 0 100 4 2 2 0 000-4zM12 8v4m0 0l-5 4m5-4l5 4" />,
  chat: <path d="M4 5h16v10H9l-4 4V5z" />,
  chip: <path d="M7 7h10v10H7zM9 3v2M15 3v2M9 19v2M15 19v2M3 9h2M3 15h2M19 9h2M19 15h2" />,
  shield: <><path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3z" /><path d="M9 12l2 2 4-4" /></>,
  loop: <path d="M4 9a8 8 0 0114-4m2 2V3m0 4h-4M20 15a8 8 0 01-14 4m-2-2v4m0-4h4" />,
  edge: <><path d="M6 8h12v8H6zM9 11h6v2H9z" /><path d="M12 4v4M12 16v4M4 12h2M18 12h2" /></>,
  wafer: <><circle cx="12" cy="12" r="8" /><path d="M8 8h8v8H8zM4 12h4M16 12h4M12 4v4M12 16v4" /></>,
  infra: <path d="M8 12a4 4 0 108 0 4 4 0 00-8 0zM4 12h4M16 12h4" />,
  atom: <><circle cx="12" cy="12" r="2" /><ellipse cx="12" cy="12" rx="10" ry="4" /><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" /><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" /></>,
};

export function DomainIcon({ name }: { name: Icon }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {P[name]}
    </svg>
  );
}

export function Flow({ text }: { text: string }) {
  const steps = text.split(" → ");
  return (
    <div className="flow">
      {steps.map((seg, i) => (
        <span key={i}>
          {seg.split(" · ").map((x, j) => (
            <span key={j}>
              {j > 0 && <span className="arr">·</span>}
              <b>{x}</b>
            </span>
          ))}
          {i < steps.length - 1 && <span className="arr">→</span>}
        </span>
      ))}
    </div>
  );
}

export function Trophy() {
  return (
    <svg className="tphy" viewBox="0 0 24 24">
      <path d="M7 4h10v4a5 5 0 01-10 0V4z" />
      <path d="M7 5H4v1a3 3 0 003 3M17 5h3v1a3 3 0 01-3 3" />
      <path d="M9.5 16h5M10 19h4M12 13v3" />
    </svg>
  );
}
