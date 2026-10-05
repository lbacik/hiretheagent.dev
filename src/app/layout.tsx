import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk, Fira_Code } from "next/font/google";
import Script from "next/script";
import { analytics } from "@/config/analytics";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "hiretheagent.dev — Autonomous AI Agent for Software Engineers",
  description:
    "Hire an autonomous AI agent that closes your GitHub Issues in an isolated Docker sandbox with automated tests and verified Pull Requests.",
  keywords: [
    "autonomous agent",
    "AI software engineer",
    "GitHub issues",
    "Docker sandbox",
    "coding agent",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${spaceGrotesk.variable} ${firaCode.variable} scroll-smooth`}
    >
      <body className="bg-blueprint min-h-screen text-slate-800 antialiased selection:bg-blue-600 selection:text-white flex flex-col font-sans">
        {children}
        <Script
          src={analytics.scriptUrl}
          data-website-id={analytics.websiteId}
          data-domains={analytics.domains}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
