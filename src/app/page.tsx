// PROTOTYPE: Four variants of the Quick Start section (with agent-forge v0.4.0 Worker Pools),
// switchable via `?variant=A|B|C|D`, on the existing `/` route.

import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import {
  PrototypeSwitcher,
  PrototypeVariantProvider,
} from "@/components/PrototypeSwitcher";

export default function Home() {
  return (
    <PrototypeVariantProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <AnnouncementBar />
        <main className="flex-1 flex flex-col justify-center">
          <Hero />
        </main>
        <Footer />
        <PrototypeSwitcher />
      </div>
    </PrototypeVariantProvider>
  );
}


