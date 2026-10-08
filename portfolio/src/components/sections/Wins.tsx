import Link from "next/link";
import { WINS, FINALS, type Win } from "@/lib/content";
import { Trophy } from "@/components/icons";
import Reveal from "@/components/Reveal";

function Card({ w }: { w: Win }) {
  return (
    <div className={`ach ${w.kind}`}>
      <span className="yr">{w.year}</span>
      <div className="res">
        {w.kind === "win" ? <Trophy /> : null} {w.result}
      </div>
      <div className="ev">{w.title}</div>
      <div className="org">{w.org}</div>
      <div className="tech">{w.tech}</div>
      {w.desc && <p>{w.desc}</p>}
      {w.href && <Link href={w.href} className="vp" style={{ display: "inline-block" }}>View project →</Link>}
    </div>
  );
}

export default function Wins() {
  return (
    <section className="section featured" style={{ background: "#060a14" }}>
      <div className="dotgrid" />
      <div className="container">
        <Reveal>
          <div className="sechead">
            <div className="kick">Recognition</div>
            <h2 className="h2">Two wins, <span className="grad">three national finals.</span></h2>
          </div>
        </Reveal>
        <Reveal>
          <div className="bigstat">
            <div><div className="n am">2</div><div className="l">hackathon wins</div></div>
            <div><div className="n cy">3</div><div className="l">national finals</div></div>
            <div><div className="n" style={{ color: "#eaf2ff" }}>5+</div><div className="l">domains across teams</div></div>
          </div>
          <div className="axisbar">
            <span className="y">2025</span>
            <div className="ln">
              <i className="nd cy" style={{ left: "22%" }} />
              <i className="nd am" style={{ left: "66%" }} />
              <i className="nd am" style={{ left: "84%" }} />
            </div>
            <span className="y">2026</span>
          </div>
        </Reveal>
        <div className="winrow">
          {WINS.map((w, i) => <Reveal key={w.title} delay={i * 0.08}><Card w={w} /></Reveal>)}
        </div>
        <div className="finrow">
          {FINALS.map((w, i) => <Reveal key={w.title} delay={i * 0.06}><Card w={w} /></Reveal>)}
        </div>
      </div>
    </section>
  );
}
