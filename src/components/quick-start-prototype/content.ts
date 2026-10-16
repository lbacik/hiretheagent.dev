// PROTOTYPE (issue #3): shared Quick start copy for the throwaway variants.
// Sources: agent-forge README, simple-coding-agent README + operator-onboarding.md.

export const AGENT_FORGE_URL = "https://github.com/lbacik/agent-forge";

export const PREREQUISITES = [
  "Docker with Compose v2.17+",
  "A coding assistant (e.g. Claude Code)",
  "GitHub token: contents, issues, PRs (read/write)",
  "Model API credentials",
];

export const CREATE_PROMPT =
  "Use create-agent to create an agent for https://github.com/owner/repository\nin agent-instances/agent-repository/.";

// Same request, run with Claude Code from the agent-forge checkout (.claude -> .agents exposes the skills).
export const CREATE_CLAUDE =
  'cd agent-forge\nclaude "/create-agent https://<github-project-url>"';

export const DEBUG_PROMPT =
  "Use debug-agent to investigate agent-instances/agent-repository.\nCheck the latest run for issue #42.";

export const DEBUG_CLAUDE = 'claude "/debug-agent <github-project-issue> [context:docker-context]"';

export const CLONE = "git clone https://github.com/lbacik/agent-forge.git\ncd agent-forge";

export const AGENTCTL = "docker compose exec --user agent agent /usr/local/bin/agentctl";

export type Command = { cmd: string; what: string; danger?: boolean };

export const COMPOSE_COMMANDS: Command[] = [
  { cmd: "cd agent-instances/agent-repository", what: "Every Compose command runs from the instance directory." },
  { cmd: "docker compose config -q", what: "Validate the generated configuration." },
  { cmd: "docker compose build", what: "Build the image. Rebuild after profile or Dockerfile changes." },
  { cmd: "docker compose up -d", what: "Start the agent. Run it again after a rebuild to apply the new image." },
  { cmd: "docker compose ps", what: "Check that the container is running." },
  { cmd: "docker compose logs --tail=100 -f", what: "Follow the startup logs." },
  { cmd: "docker compose down", what: "Stop the agent. The agent_data volume is kept." },
  {
    cmd: "docker compose down -v",
    what: "Also deletes agent_data: the repository checkout, state and attempt logs.",
    danger: true,
  },
];

export const AGENTCTL_COMMANDS: Command[] = [
  { cmd: "status", what: "Read-only. The first line names TARGET_REPO; check it before anything else." },
  { cmd: "stop", what: "Stop picking up new issues." },
  { cmd: "resume", what: "Resume issue intake." },
  {
    cmd: "next issue <issue-number>",
    what: "Make this issue the next one the agent claims. It takes the number, not the URL: for <github-issue-url> ending in /issues/42, pass 42.",
  },
  { cmd: "handoff now", what: "Ask the active attempt to hand off to you." },
  { cmd: "command <id>", what: "Look up a submitted request by its ID." },
];

export const AGENTCTL_WARNINGS = [
  "Always use the absolute path /usr/local/bin/agentctl. A bare agentctl may resolve to the target repository's package.",
  "Never issue commands with docker compose run. Only the live agent in its own container accepts them.",
];
