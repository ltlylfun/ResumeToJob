import { Hero } from "home/Hero";
import { Features } from "home/Features";
import { FAQ } from "home/FAQ";
import { CTA } from "home/CTA";
import { Metadata } from "next";
import { LogoFallingAnimation } from "components/animations/LogoFallingAnimation";
import { getMetadata } from "./metadata";

export const metadata: Metadata = getMetadata("zh");

export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* 放在最外层容器中，覆盖整个页面区域 */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <LogoFallingAnimation
          logoCount={36}
          minSize={20}
          maxSize={60}
          minSpeed={0.3}
          maxSpeed={1.2}
          minOpacity={0.3}
          maxOpacity={0.8}
        />
      </div>

      <main className="relative z-10">
        <Hero />
        <Features />
        <FAQ />
        <CTA />
      </main>
    </div>
  );
}
