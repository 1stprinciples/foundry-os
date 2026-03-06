# Foundry OS

**Turn a market thesis into a live operating company.**

Foundry OS is a local-first autonomous venture studio prototype built for founders, operators, and product teams who want to spin up businesses quickly and see the full operating system around them. Create a company, generate its agent bench, run execution cycles, and watch the public portfolio, fund view, and live feed update from the same runtime state.

<video src="assets/foundry-os-demo.mp4" controls muted playsinline width="100%"></video>

[Download or open the demo video directly](assets/foundry-os-demo.mp4)

## Why this exists

Most "AI startup studio" demos stop at ideation. They generate a pitch, a landing page, or a fake dashboard, but they do not give you a working environment where a company has operators, tasks, documents, metrics, and a repeatable execution loop.

That gap matters because **the hard part is not naming a startup idea. The hard part is turning an idea into an operating system that can keep moving.**

Foundry OS is built to close that gap. It gives you:

1. A public-facing surface that shows the portfolio, live execution feed, and fund-style company table
2. A private workspace with agents, tasks, documents, analytics, connections, and settings
3. A runtime model that creates companies and advances them through operating cycles
4. A simple foundation you can extend with real deployments, payments, email, analytics, and outbound automation

This repo is the first practical prototype for that system.

## How it works

```text
You create a company
        ↓
The app provisions a company record in the runtime store
        ↓
A coordinated bench of agents is attached:
  • CEO
  • Research
  • Product
  • Engineering
  • Growth
  • Operations
  • Finance
        ↓
An onboarding cycle generates:
  • Tasks
  • Documents
  • Logs
  • Metrics
        ↓
The workspace updates in real time
        ↓
The public portfolio, live feed, and dashboard reflect the same state
```

Everything runs from a lightweight local JSON-backed store so the prototype is easy to inspect, reset, and extend.

## Quickstart

You need **Node.js 18+** and **npm**.

```bash
git clone https://github.com/1stprinciples/foundry-os.git
cd foundry-os
npm install
npm run build
npx next start -p 3000
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000).

## Small test

1. Open `/login`
2. Enter any email and request a magic link
3. Use the dev login link shown on the page
4. Go to `/new`
5. Create a company with a name, thesis, audience, and offer
6. Open the company dashboard
7. Run a cycle
8. Check `/live` and `/fund` to confirm the public state changed

If you want the smallest backend-only validation, hit:

```bash
curl -s http://127.0.0.1:3000/api/public/live/dashboard
```

That should return portfolio stats, companies, tasks, logs, and ARR history as JSON.

## Tech stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 |
| UI | React 19, App Router |
| Styling | Tailwind CSS 4 |
| Runtime state | Local JSON store |
| Live updates | Server-sent events |
| Auth | Passwordless local magic-link flow |

## Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start the app in development mode |
| `npm run build` | Build the production app |
| `npm run start` | Run the production server |
| `npm run lint` | Run lint checks |

## Main routes

- `/` — public landing page
- `/live` — public execution feed
- `/fund` — public portfolio table
- `/login` — local passwordless login
- `/new` — create a company
- `/dashboard` — company command deck
- `/dashboard/[slug]` — company-specific dashboard
- `/agents` — operator bench
- `/tasks` — task ledger and status controls
- `/documents` — generated documents and experiments
- `/analytics` — performance history and feed
- `/connections` — integration surfaces
- `/company-settings` — company configuration

## API

Key endpoints:

- `GET /api/companies` — list companies or fetch one by `companySlug`
- `POST /api/companies` — create a company
- `PATCH /api/companies` — update company settings
- `POST /api/run-cycle` — advance a company through an operating cycle
- `GET /api/agents` — list company agents
- `GET /api/tasks` — list company tasks
- `PATCH /api/tasks` — update task status
- `GET /api/documents` — list company documents
- `GET /api/analytics/latest` — company metrics and history
- `GET /api/public/live/dashboard` — aggregate public portfolio data
- `GET /api/public/live/stream` — public SSE execution stream

## What this prototype does today

- Creates companies with a market thesis, audience, and offer
- Generates a multi-agent operating bench
- Produces tasks, documents, logs, and metrics
- Maintains a public portfolio view and live execution feed
- Preserves company context across the workspace
- Runs fully locally with no external services required

## What to build next

The current repo is a strong local prototype. The next step is connecting it to real-world services:

- GitHub repo creation
- Vercel deployment
- Stripe billing
- outbound email
- analytics providers
- domain provisioning
- approval workflows for spending and risky actions

## Contributing

Contributions are welcome, especially if you want to help turn this into a more realistic autonomous company-building stack.

1. Fork the repo
2. Create a feature branch
3. Run `npm run build` and `npm run lint`
4. Open a PR with a short explanation of what changed
5. Include screenshots, clips, or API examples if your change affects UX or behavior

Good contribution areas:

- better company validation loops
- real external integrations
- safer agent execution workflows
- richer analytics and experiment tracking
- deployment automation
- UX and design improvements

## License

MIT — see [LICENSE](LICENSE).
