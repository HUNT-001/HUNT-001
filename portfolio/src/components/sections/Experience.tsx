import { EXPERIENCE } from "@/lib/content";
import Reveal from "@/components/Reveal";

export default function Experience() {
  return (
    <section className="section">
      <div className="dotgrid" />
      <div className="container">
        <Reveal>
          <div className="sechead">
            <div className="kick">Where I&apos;ve worked</div>
            <h2 className="h2">Internships <span className="grad">&amp; research.</span></h2>
          </div>
        </Reveal>
        <div className="tl">
          <div className="spine" />
          {EXPERIENCE.map((e, i) => (
            <Reveal key={e.role} delay={i * 0.06}>
              <div className={`trow${e.vi ? " vi" : ""}`}>
                <div className="date">{e.date}<br />{e.place}</div>
                <div className="tdot" />
                <div className="tcard">
                  <div className="mk">{e.mono}</div>
                  <div>
                    <h3 className="role">{e.role}</h3>
                    <div className="co">{e.org}</div>
                    <div className="tp">{e.desc}</div>
                    <span className="m">{e.metric}</span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
