## Foundry OS

Foundry OS is a local-first autonomous venture studio prototype. It includes:

- a public site with live portfolio, fund, and execution-feed pages
- an internal workspace for agents, tasks, documents, analytics, and settings
- a lightweight runtime store and API surface for company creation and operating cycles
- a passwordless local auth flow for unlocking the workspace

## Getting Started

Install dependencies and start the app:

```bash
npm install
npm run build
npx next start -p 3000
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000).

## Simple Test

1. Visit `/login`
2. Request a magic link with any email
3. Use the dev link returned on the page
4. Visit `/new`
5. Create a company
6. Open the dashboard and run a cycle
7. Check `/live` and `/fund` to confirm the public state updates

## Main Routes

- `/`
- `/live`
- `/fund`
- `/login`
- `/new`
- `/dashboard`
- `/dashboard/[slug]`
- `/agents`
- `/tasks`
- `/documents`
- `/analytics`
- `/connections`
- `/company-settings`

## Notes

- Runtime data lives in `data/runtime-store.json` locally and is ignored in git.
- The current implementation simulates the venture studio runtime and is ready to be extended with real third-party integrations.

## Stack

- Next.js 16
- React 19
- Tailwind CSS 4
- Local JSON-backed runtime store

## License

MIT
