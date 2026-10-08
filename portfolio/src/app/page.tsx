import Hero from "@/components/sections/Hero";
import Focus from "@/components/sections/Focus";
import Featured from "@/components/sections/Featured";
import Experience from "@/components/sections/Experience";
import Wins from "@/components/sections/Wins";
import Writing from "@/components/sections/Writing";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <main>
      <Hero />
      <Focus />
      <Featured />
      <Experience />
      <Wins />
      <Writing />
      <Contact />
    </main>
  );
}
