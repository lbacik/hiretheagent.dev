import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Footer } from "@/components/Footer";
import { Suspense } from "react";
import { VersionBarPrototype } from "@/components/version-bar-prototype/VersionBarPrototype";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {/* PROTOTYPE (issue #9): sticky version bar variants */}
      <Suspense>
        <VersionBarPrototype />
      </Suspense>
      <main className="flex-1 flex flex-col justify-center">
        <Hero />
      </main>
      <Footer />
    </div>
  );
}


