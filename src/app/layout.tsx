import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk, Fira_Code } from "next/font/google";
import { connection } from "next/server";
import { umamiTracker } from "@/config/analytics";
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Render per request so UMAMI_* come from the container env, not the
  // image build (which has no build args).
  await connection();
  const umami = umamiTracker();

  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${spaceGrotesk.variable} ${firaCode.variable} scroll-smooth`}
    >
      <head>
        {umami && (
          <script
            defer
            src={umami.scriptUrl}
            data-website-id={umami.websiteId}
            data-domains={umami.domains}
          />
        )}
      </head>
      <body className="bg-blueprint min-h-screen text-slate-800 antialiased selection:bg-blue-600 selection:text-white flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
