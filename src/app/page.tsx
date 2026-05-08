import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { Solution } from "@/components/sections/Solution";
import { Partners } from "@/components/sections/Partners";
import { Waitlist } from "@/components/sections/Waitlist";
import { SurveyCTA } from "@/components/sections/SurveyCTA";
import { Footer } from "@/components/sections/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Problem />
      <Solution />
      <Partners />
      <SurveyCTA />
      <Waitlist />
      <Footer />
    </main>
  );
}
