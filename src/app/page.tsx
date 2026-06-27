import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { Preview } from "@/components/landing/preview";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Pricing } from "@/components/landing/pricing";
import { FAQ } from "@/components/landing/faq";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-background text-foreground flex flex-col font-sans antialiased">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Preview />
        <Features />
        <HowItWorks />
        <Pricing />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
