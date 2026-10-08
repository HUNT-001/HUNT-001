import { DOMAINS, HOT_DOMAINS } from "@/lib/content";

export default function Hero() {
  return (
    <>
      <header className="hero">
        <div className="hero-bg" style={{ backgroundImage: "url(/avatar-hero.jpg)" }} />
        <div className="dotgrid" />
        <div className="hero-veil" />
        <div className="hero-veil2" />
        <div className="container">
          <div className="hero-content">
            <div className="eyebrow">
              Amrita EEE × IIT Madras DS &nbsp;·&nbsp; <span className="accent">Building at the seam</span>
            </div>
            <h1>
              Intelligent systems,
              <br />
              <span className="grad">end to end.</span>
            </h1>
            <p className="sub">
              From <b>world models</b> to the <b>silicon</b> that runs them — RTL, verification, edge AI, and the
              agents that tie them together. I care about the engineering that turns intelligent models into real
              systems.
            </p>
            <div className="status">
              <span className="d" /> Open to AI systems <span className="sep">·</span> Edge AI{" "}
              <span className="sep">·</span> EDA roles
            </div>
            <div className="proof">
              <div className="c"><b>374.5 GOP/s</b> patent-pending BNN accelerator</div>
              <div className="c"><b>sub-100 ms</b> ViT on AMD Versal · ISRO</div>
              <div className="c win"><b>SIH &apos;25 finalist</b> · IEEE GRSS &amp; MunichTech winner</div>
            </div>
          </div>
        </div>
      </header>

      <div className="marquee">
        <div className="track">
          {[0, 1].map((r) =>
            DOMAINS.map((d) => (
              <span key={`${r}-${d}`}>
                <span className={HOT_DOMAINS.has(d) ? "hot" : ""}>{d}</span>
                <span className="s">&nbsp;&nbsp;/&nbsp;&nbsp;</span>
              </span>
            ))
          )}
        </div>
      </div>
    </>
  );
}
