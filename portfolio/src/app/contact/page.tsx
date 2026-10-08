import PageShell from "@/components/PageShell";
import { SITE } from "@/lib/content";
export const metadata = { title: "Contact — Tanush Pavan V" };
export default function Page() {
  return (
    <PageShell kick="Contact" title="Let's build at the" grad="seam." soon={false}
      lead="Open to AI systems, Edge AI and EDA roles. A live Q&A widget is coming here.">
      <div className="clinks" style={{ justifyContent: "flex-start", marginTop: 26 }}>
        <a className="em" href={`mailto:${SITE.email}`}>{SITE.email}</a>
        <a className="gh" href={SITE.github}>GitHub</a>
        <a className="gh" href={SITE.linkedin}>LinkedIn</a>
      </div>
    </PageShell>
  );
}
