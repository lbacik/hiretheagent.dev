"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Bot,
  Boxes,
  Compass,
  Mail,
  Menu,
  Workflow,
  X,
  Zap,
} from "lucide-react";

import { getArticles } from "@/lib/articles";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const hasArticles = getArticles().length > 0;

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-close mobile menu when resizing to desktop view
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header
      ref={headerRef}
      className="border-b border-slate-200/90 bg-white/90 backdrop-blur-md sticky top-0 z-30 transition-all"
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/30 group-hover:scale-105 transition-transform duration-200">
            <Bot className="w-5 h-5" />
          </div>
          <div className="flex items-center">
            <span className="font-display font-bold text-lg tracking-tight text-slate-950">
              hiretheagent<span className="text-blue-600">.dev</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation & Actions */}
        <div className="hidden sm:flex items-center gap-4 text-xs font-mono">
          <a
            href="#quick-start"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100/80 border border-blue-200/80 text-blue-700 hover:text-blue-800 font-semibold transition-all shadow-xs"
          >
            <Zap className="w-3.5 h-3.5 text-blue-600 fill-blue-500/20" aria-hidden="true" />
            <span>Quick start</span>
          </a>
          {hasArticles && (
            <a
              href="#articles"
              className="group text-slate-600 hover:text-blue-600 inline-flex items-center gap-1.5 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" aria-hidden="true" />
              <span>Articles</span>
            </a>
          )}
          <a
            href="#workflow"
            className="group text-slate-600 hover:text-blue-600 inline-flex items-center gap-1.5 transition-colors"
          >
            <Workflow className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" aria-hidden="true" />
            <span>Workflow</span>
          </a>
          <a
            href="#projects"
            className="group text-slate-600 hover:text-blue-600 inline-flex items-center gap-1.5 transition-colors"
          >
            <Boxes className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" aria-hidden="true" />
            <span>Projects</span>
          </a>
          <a
            href="#roadmap"
            className="group text-slate-600 hover:text-blue-600 inline-flex items-center gap-1.5 transition-colors"
          >
            <Compass className="w-3.5 h-3.5 text-amber-600" aria-hidden="true" />
            <span>Roadmap</span>
          </a>
          <a
            href="#newsletter"
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold px-4 py-2 rounded-xl transition-all shadow-sm hover:shadow-md hover:shadow-blue-600/20 active:scale-95"
          >
            <Mail className="w-3.5 h-3.5 text-blue-100" aria-hidden="true" />
            <span>Newsletter</span>
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex sm:hidden items-center">
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className="p-2 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-slate-100 active:bg-slate-200 transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {isOpen && (
        <div
          id="mobile-nav"
          className="sm:hidden border-t border-slate-200/90 bg-white/95 backdrop-blur-md px-6 py-4 shadow-xl shadow-slate-900/5 transition-all"
        >
          <nav className="flex flex-col gap-2 font-mono text-xs">
            {/* Highlighted Quick Start Card */}
            <a
              href="#quick-start"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between p-3 rounded-xl bg-blue-50/90 hover:bg-blue-100/90 border border-blue-200/90 text-blue-900 font-semibold transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-sm shadow-blue-600/30 group-hover:scale-105 transition-transform">
                  <Zap className="w-4 h-4 fill-white/20" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-bold text-sm text-blue-950 font-display">
                    Quick start
                  </span>
                  <span className="text-[11px] font-mono font-normal text-blue-700">
                    Docker &amp; agentctl in 5 steps
                  </span>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-blue-600 group-hover:translate-x-0.5 transition-transform" />
            </a>

            {/* Navigation links */}
            <div className="flex flex-col gap-1 py-1">
              {hasArticles && (
                <a
                  href="#articles"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors text-sm font-sans font-medium"
                >
                  <BookOpen className="w-4 h-4 text-slate-400" />
                  <span>Articles</span>
                </a>
              )}
              <a
                href="#workflow"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors text-sm font-sans font-medium"
              >
                <Workflow className="w-4 h-4 text-slate-400" />
                <span>Workflow</span>
              </a>
              <a
                href="#projects"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors text-sm font-sans font-medium"
              >
                <Boxes className="w-4 h-4 text-slate-400" />
                <span>Projects</span>
              </a>
              <a
                href="#roadmap"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors text-sm font-sans font-medium"
              >
                <Compass className="w-4 h-4 text-amber-600" />
                <span>Roadmap</span>
              </a>
            </div>

            {/* Newsletter CTA Button */}
            <div className="pt-2 border-t border-slate-100">
              <a
                href="#newsletter"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-2.5 px-4 rounded-xl shadow-sm hover:shadow-md hover:shadow-blue-600/20 active:scale-[0.98] transition-all text-center"
              >
                <Mail className="w-4 h-4 text-blue-100" />
                <span>Newsletter</span>
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
