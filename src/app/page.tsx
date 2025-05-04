import { Hero } from "home/Hero";
import { Steps } from "home/Steps";

export default function Home() {
  return (
    <main className="mx-auto max-w-screen-2xl bg-dot px-8 pb-32 text-gray-900 lg:px-12">
      <Hero />
      <Steps />
    </main>
  );
}
