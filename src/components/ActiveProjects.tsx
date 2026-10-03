import Link from "next/link";
import { ExternalLink, GitBranch, Globe, Sparkles } from "lucide-react";

interface GeneratorOutputs {
  npm: string;
  pypi: string;
}

interface Project {
  name: string;
  repoUrl: string;
  category: string;
  description: string;
  tags: string[];
  liveUrl?: string;
  liveUrlLabel?: string;
  npmUrl?: string;
  generatorOutputs?: GeneratorOutputs;
}

const PROJECTS: Project[] = [
  {
    name: "simple-coding-agent",
    repoUrl: "https://github.com/lbacik/simple-coding-agent",
    category: "Core Agent Engine",
    description:
      "Unattended autonomous coding agent that picks up GitHub issues, executes code in isolated Docker sandboxes, and delivers verified PRs.",
    tags: ["Python", "Docker", "GitHub API"],
  },
  {
    name: "agent-installer",
    repoUrl: "https://github.com/lbacik/agent-installer",
    category: "Agent Tooling",
    npmUrl: "https://www.npmjs.com/package/agent-installer",
    description:
      "Local CLI for installing agent artifacts, system rules, and developer commands directly into Codex and Claude Code environments.",
    tags: ["TypeScript", "Node.js", "CLI", "npm"],
  },
  {
    name: "jsonhub-web-ui",
    repoUrl: "https://github.com/lbacik/jsonhub-web-ui",
    category: "Web Application",
    liveUrl: "https://jsonhub.cloud/",
    liveUrlLabel: "jsonhub.cloud",
    description:
      "Interactive web application and UI for exploring, visualizing, and managing schema-validated JsonHub entities and definitions.",
    tags: ["Next.js", "React", "TypeScript"],
  },
  {
    name: "jsonhub-cli",
    repoUrl: "https://github.com/lbacik/jsonhub-cli",
    category: "Developer CLI",
    description:
      "Command-line client for JsonHub — store JSON documents, validate against schemas, and automate data workflows from the terminal.",
    tags: ["Python", "CLI", "JSON Schema"],
  },
  {
    name: "jsonhub-sdk-generator",
    repoUrl: "https://github.com/lbacik/jsonhub-sdk-generator",
    category: "Code Generation",
    generatorOutputs: {
      npm: "https://www.npmjs.com/package/jsonhub-sdk",
      pypi: "https://pypi.org/project/jsonhub-sdk/",
    },
    description:
      "Automated SDK generator transforming OpenAPI specifications into typed client libraries ready for application consumption.",
    tags: ["JavaScript", "OpenAPI", "SDK Generator"],
  },
  {
    name: "paysubscriptions",
    repoUrl: "https://github.com/lbacik/paysubscriptions",
    category: "Web Application",
    liveUrl: "https://paysubscriptions.com/",
    liveUrlLabel: "paysubscriptions.com",
    description:
      "Web application for tracking recurring personal and household subscription expenses, monthly/yearly spending totals, and renewal reminders.",
    tags: ["PHP 8.4", "Symfony 7.4", "MySQL", "FrankenPHP"],
  },
];

function GithubIcon({ className = "w-4 h-4 fill-current" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function NpmIcon({ className = "w-4 h-4 fill-current" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l13.837.019-.009 13.836h-3.464l.01-10.382h-3.456L12.04 19.17H5.113z" />
    </svg>
  );
}

function PypiIcon({ className = "w-4 h-4 fill-current" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M23.922 13.58v3.912L20.55 18.72l-.078.055.052.037 3.45-1.256.026-.036v-3.997l-.053-.036-.025.092z M23.621 5.618l-3.04 1.107v3.912l3.339-1.215V5.509zM23.92 13.457V9.544l-3.336 1.215v3.913zM20.47 14.71V10.8L17.17 12v3.913zM17.034 19.996v-3.912l-3.313 1.206v3.912zM17.17 16.057v3.868l3.314-1.206V14.85l-3.314 1.206zm2.093 1.882c-.367.134-.663-.074-.663-.463s.296-.814.663-.947c.365-.133.662.075.662.464s-.297.814-.662.946z M13.225 9.315l.365-.132-3.285-1.197-3.323 1.21.102.037 3.184 1.16zM20.507 10.664V6.751L17.17 7.965v3.913zM17.058 11.918V8.005l-3.302 1.202v3.912zM13.643 9.246l-3.336 1.215v3.913l3.336-1.215zM6.907 13.165l3.322 1.209v-3.913L6.907 9.252z M10.34 7.873l3.281 1.193V5.198l-3.28-1.193zM20.507 2.715L17.19 3.922v3.913l3.317-1.207zM16.95 3.903L13.724 2.73l-3.269 1.19 3.225 1.174zM15.365 4.606l-1.624.592v3.868l3.317-1.207V3.991l-1.693.615zm-.391 2.778c-.367.134-.662-.074-.662-.464s.295-.813.662-.946c.366-.133.663.074.663.464s-.297.813-.663.946z M10.229 18.41v-3.914l-3.322-1.209V17.2zM13.678 17.182v-3.913l-3.371 1.227v3.913z M13.756 17.154l3.3-1.2V12.04l-3.3 1.2zM13.678 21.217l-3.371 1.227v-3.912h-.078v3.912l-3.322-1.209v-3.913l-.053-.058-.025-.06-3.336-1.21v-3.948l.034.013 3.287 1.196.015-.078-3.261-1.187 3.26-1.187v-.109L3.876 9.62l-.307-.112 3.26-1.188v.877l.079-.055V6.769l3.257 1.185.058-.061L7.084 6.75l-.102-.037 3.24-1.179v-.083L6.854 6.677v.018l-.025.018v1.523L3.44 9.47v.02l-.025.017v4.007l-3.39 1.233v.019L0 14.784v3.995l.025.037 3.4 1.237.008-.006.007.01 3.4 1.238.008-.006.006.01 3.4 1.237.014-.009.012.01 3.45-1.256.026-.037-.078-.027zM3.493 9.563l3.257 1.185-3.257 1.187V9.562zM3.4 19.96L.078 18.752v-3.913l2.361.86.96.349v3.913zm.015-3.99L.335 14.85l-.182-.066 3.262-1.187v2.374zm3.399 5.231l-3.321-1.209v-3.912l3.321 1.209v3.912zM23.791 5.434l-3.21-1.17v2.338zM20.387 2.643l-3.24-1.18-3.27 1.19 3.247 1.182z" />
    </svg>
  );
}

export function ActiveProjects() {
  return (
    <section id="projects" className="mt-20 sm:mt-28 max-w-5xl mx-auto scroll-mt-28 text-left">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono font-medium mb-4 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Active in Production Today
        </div>

        <h2 className="text-2xl sm:text-4xl font-extrabold font-display tracking-tight text-slate-950 leading-tight">
          Projects{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 font-mono">
            simple-coding-agent
          </span>{" "}
          is already working on today!
        </h2>

        <p className="mt-3 text-sm sm:text-base text-slate-600 font-sans leading-relaxed max-w-2xl mx-auto">
          Real-world repositories, production applications, and developer tools where our autonomous agent
          actively resolves issues, runs isolated Docker verification suites, and delivers verified Pull Requests.
        </p>
      </div>

      {/* Grid of Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {PROJECTS.map((project) => (
          <div
            key={project.name}
            className="group relative bg-white/90 hover:bg-white border border-slate-200/90 hover:border-blue-400 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-200 flex flex-col justify-between"
          >
            {/* Top row: Category tag + Direct Link Icons */}
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center gap-1 text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                  {project.category}
                </span>

                <div className="flex items-center gap-1 text-slate-400">
                  {/* npm link for packages */}
                  {project.npmUrl && (
                    <Link
                      href={project.npmUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="npm package"
                      className="p-1 rounded-md text-slate-400 hover:text-[#CB3837] hover:bg-red-50 transition-colors"
                    >
                      <NpmIcon className="w-4 h-4 fill-current" />
                    </Link>
                  )}

                  {/* Generator Outputs in Header */}
                  {project.generatorOutputs && (
                    <div className="flex items-center gap-0.5">
                      <Link
                        href={project.generatorOutputs.npm}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Generator output (npm: jsonhub-sdk)"
                        className="p-1 rounded-md text-slate-400 hover:text-[#CB3837] hover:bg-red-50 transition-colors"
                      >
                        <NpmIcon className="w-4 h-4 fill-current" />
                      </Link>
                      <Link
                        href={project.generatorOutputs.pypi}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Generator output (PyPI: jsonhub-sdk)"
                        className="p-1 rounded-md text-slate-400 hover:text-[#3775A9] hover:bg-sky-50 transition-colors"
                      >
                        <PypiIcon className="w-4 h-4 fill-current" />
                      </Link>
                    </div>
                  )}

                  {/* GitHub Repo Link */}
                  <Link
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="GitHub repository"
                    className="p-1 rounded-md text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  >
                    <GithubIcon className="w-4 h-4 fill-current" />
                  </Link>
                </div>
              </div>

              {/* Repo Title with clickable link */}
              <h3 className="font-mono font-bold text-base text-slate-900 flex items-center gap-1.5">
                <GitBranch className="w-4 h-4 text-slate-400 group-hover:text-blue-500 shrink-0 transition-colors" />
                <Link
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors inline-flex items-center gap-1.5 truncate"
                >
                  <span className="truncate">{project.name}</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-40 hover:opacity-100 shrink-0" />
                </Link>
              </h3>

              {/* Description */}
              <p className="mt-2.5 text-xs sm:text-[13px] text-slate-600 leading-relaxed font-sans">
                {project.description}
              </p>

              {/* Dedicated Live Instance Callout */}
              {project.liveUrl && (
                <div className="mt-3 flex items-center gap-2 text-xs font-mono">
                  <span className="text-slate-400 text-[11px]">Live app:</span>
                  <Link
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-medium text-emerald-800 hover:text-emerald-950 bg-emerald-50/80 hover:bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-200/80 transition-colors"
                  >
                    <Globe className="w-3 h-3 text-emerald-600" />
                    <span>{project.liveUrlLabel}</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                  </Link>
                </div>
              )}

              {/* Dedicated npm Package Callout for agent-installer */}
              {project.npmUrl && (
                <div className="mt-3 flex items-center gap-2 text-xs font-mono">
                  <span className="text-slate-400 text-[11px]">npm registry:</span>
                  <Link
                    href={project.npmUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-medium text-[#CB3837] hover:text-[#9c2726] bg-red-50/70 hover:bg-red-100/70 px-2 py-0.5 rounded-md border border-red-200/70 transition-colors"
                  >
                    <NpmIcon className="w-3 h-3 fill-[#CB3837]" />
                    <span>agent-installer</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                  </Link>
                </div>
              )}

              {/* Dedicated Generator Outputs Callout for jsonhub-sdk-generator */}
              {project.generatorOutputs && (
                <div className="mt-3.5 p-2.5 rounded-xl bg-slate-50/90 border border-slate-200/80">
                  <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-blue-500" />
                    <span>Generator outputs:</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Link
                      href={project.generatorOutputs.npm}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-slate-700 hover:text-[#CB3837] bg-white hover:bg-red-50/60 px-2 py-0.5 rounded border border-slate-200/90 hover:border-red-200 transition-colors shadow-2xs"
                    >
                      <NpmIcon className="w-3 h-3 fill-[#CB3837]" />
                      <span>npm: jsonhub-sdk</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                    </Link>
                    <Link
                      href={project.generatorOutputs.pypi}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-mono font-medium text-slate-700 hover:text-[#3775A9] bg-white hover:bg-sky-50/60 px-2 py-0.5 rounded border border-slate-200/90 hover:border-sky-200 transition-colors shadow-2xs"
                    >
                      <PypiIcon className="w-3 h-3 fill-[#3775A9]" />
                      <span>PyPI: jsonhub-sdk</span>
                      <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom row: Tech tags & agent status badge */}
            <div className="mt-5 pt-3.5 border-t border-slate-100 flex flex-col gap-2.5">
              <div className="flex flex-wrap items-center gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[10px] sm:text-[11px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/70"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono pt-0.5">
                <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/70 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  ready-for-agent
                </span>
                <Link
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-blue-600 font-mono text-[11px] flex items-center gap-1 transition-colors"
                >
                  GitHub <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Hint */}
      <div className="mt-8 text-center">
        <p className="text-xs font-mono text-slate-500 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span>
            Every repository uses isolated Docker sandboxes and verified automated test gates before PR merges.
          </span>
        </p>
      </div>
    </section>
  );
}
