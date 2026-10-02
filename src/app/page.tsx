import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { InteractiveWorkflow } from "@/components/InteractiveWorkflow";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <AnnouncementBar />
      <Header />
      <main className="flex-1 flex flex-col">
        <Hero />
        <InteractiveWorkflow />
      </main>
      <Footer />
    </div>
  );
}

