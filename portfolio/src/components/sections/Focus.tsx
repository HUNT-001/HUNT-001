import { CORE_TILES, SUB_TILES, type Tile } from "@/lib/content";
import { DomainIcon, Flow } from "@/components/icons";
import Reveal from "@/components/Reveal";

function TileCard({ t }: { t: Tile }) {
  return (
    <div className={`tile ${t.tier} ${t.color}`}>
      <div className="edge" />
      <div className="ic"><DomainIcon name={t.icon} /></div>
      <h3>
        {t.name}
        {t.pill && <span className="expl">{t.pill}</span>}
      </h3>
      <p>{t.desc}</p>
      {t.flow && <Flow text={t.flow} />}
    </div>
  );
}

const CODE = [
  { t: "logic [63:0] weights;", top: "8%", left: "62%", d: "0s" },
  { t: "assign popcount = ...", top: "20%", left: "74%", d: "2s" },
  { t: "always_ff @(posedge clk)", top: "34%", left: "5%", d: "1s" },
  { t: "agent.run(tool)", top: "62%", left: "6%", d: "3s", vi: true },
  { t: "memory.retrieve()", top: "70%", left: "76%", d: "1.5s", vi: true },
  { t: "coverage += bins_hit;", top: "86%", left: "60%", d: "2.5s" },
  { t: "quantize(INT8)", top: "46%", left: "82%", d: ".5s", vi: true },
  { t: "attention()", top: "90%", left: "40%", d: "3.5s", vi: true },
];

export default function Focus() {
  return (
    <section className="section focus">
      <div className="dotgrid" />
      <div className="backplane">
        <svg className="bp-traces" viewBox="0 0 1440 860" preserveAspectRatio="none">
          <g stroke="#3a6ea5" strokeWidth="1.4" fill="none">
            <path d="M40 130 H470 Q490 130 490 150 V300" />
            <path d="M40 430 H360 Q380 430 380 450 V600 H720" />
            <path d="M1400 190 H1000 Q980 190 980 210 V360 H740" />
            <path d="M1400 660 H1060 Q1040 660 1040 640 V500" />
            <path d="M60 760 H540" />
            <path className="pulse" d="M40 300 H900" />
            <path className="pulse2" d="M1400 480 H540" />
          </g>
          <g fill="#5cc7f7">
            <circle cx="490" cy="300" r="3" /><circle cx="720" cy="600" r="3" /><circle cx="740" cy="360" r="3" />
            <circle cx="1040" cy="500" r="3" /><circle cx="900" cy="300" r="3" /><circle cx="540" cy="480" r="3" />
          </g>
          <g stroke="#3a6ea5" strokeWidth="1.4" fill="none" transform="translate(1130,70)">
            <rect x="0" y="0" width="140" height="96" rx="7" />
            <path d="M24 0 V-13 M60 0 V-13 M96 0 V-13 M24 96 V109 M60 96 V109 M96 96 V109 M0 28 H-13 M0 68 H-13 M140 28 H153 M140 68 H153" />
            <rect x="40" y="32" width="60" height="32" rx="3" />
          </g>
          <path d="M60 800 H150 V772 H230 V800 H310 V772 H380 V800 H470 V772 H560 V800 H650" stroke="#38bdf8" strokeWidth="1.6" fill="none" />
          <circle r="3.5" fill="#67e8f9"><animateMotion dur="6s" repeatCount="indefinite" path="M40 300 H900" /></circle>
        </svg>
        {CODE.map((c, i) => (
          <div key={i} className={`bp-code${c.vi ? " vi" : ""}`} style={{ top: c.top, left: c.left, animationDelay: c.d }}>{c.t}</div>
        ))}
      </div>

      <div className="container">
        <Reveal>
          <div className="sechead">
            <div className="kick">The systems I like to build</div>
            <h2 className="h2">Nine domains. <span className="grad">One stack.</span></h2>
          </div>
        </Reveal>
        <div className="fgrid">
          <div className="tier-core">
            {CORE_TILES.map((t) => <TileCard key={t.name} t={t} />)}
          </div>
          <div className="tier-sub">
            {SUB_TILES.map((t) => <TileCard key={t.name} t={t} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
