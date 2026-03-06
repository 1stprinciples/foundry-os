import Link from "next/link";
import { ReactNode } from "react";

import { buildWorkspaceHref } from "@/components/app/workspace-href";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/agents", label: "Agents" },
  { href: "/tasks", label: "Tasks" },
  { href: "/documents", label: "Documents" },
  { href: "/analytics", label: "Analytics" },
  { href: "/connections", label: "Connections" },
  { href: "/company-settings", label: "Settings" },
];

export function AppShell({
  children,
  activePath,
  companySlug,
  header,
  kicker,
  actions,
}: {
  children: ReactNode;
  activePath: string;
  companySlug?: string;
  header: string;
  kicker?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f4efe7] text-black">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col gap-6 px-5 py-5 lg:flex-row lg:px-8">
        <aside className="rounded-[2rem] border border-black/10 bg-[#16120d] p-6 text-[#f7f2ec] shadow-[0_30px_90px_rgba(0,0,0,0.18)] lg:sticky lg:top-5 lg:h-[calc(100vh-2.5rem)] lg:w-[280px]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.32em] text-[#f7f2ec]/45">
                Foundry OS
              </p>
              <h1 className="mt-2 font-serif text-4xl leading-none">Operate</h1>
            </div>
            <Link
              href="/"
              className="rounded-full border border-white/15 px-3 py-1 text-xs uppercase tracking-[0.2em] text-[#f7f2ec]/70 transition hover:border-white/35 hover:text-white"
            >
              Site
            </Link>
          </div>

          <div className="mt-8 rounded-[1.5rem] border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-[#f7f2ec]/45">
              Control Note
            </p>
            <p className="mt-3 text-sm leading-6 text-[#f7f2ec]/70">
              You are looking at a local-first autonomous venture studio. Every
              panel below reads from the same operating state and can trigger a
              new cycle.
            </p>
          </div>

          <nav className="mt-8 space-y-2">
            {navItems.map((item) => {
              const active =
                activePath === item.href ||
                (item.href !== "/dashboard" && activePath.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={buildWorkspaceHref(item.href, companySlug)}
                  className={[
                    "flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition",
                    active
                      ? "bg-[#ff6a00] text-white"
                      : "text-[#f7f2ec]/70 hover:bg-white/6 hover:text-white",
                  ].join(" ")}
                >
                  <span>{item.label}</span>
                  <span className="text-xs uppercase tracking-[0.2em]">Open</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto hidden lg:block">
            <div className="mt-8 rounded-[1.5rem] border border-white/10 p-4">
              <p className="text-xs uppercase tracking-[0.24em] text-[#f7f2ec]/45">
                Modes
              </p>
              <ul className="mt-4 space-y-2 text-sm text-[#f7f2ec]/70">
                <li>Plan companies</li>
                <li>Ship assets</li>
                <li>Run outreach</li>
                <li>Track ARR</li>
              </ul>
            </div>
          </div>
        </aside>

        <main className="flex-1">
          <div className="rounded-[2rem] border border-black/10 bg-white/65 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.08)] backdrop-blur md:p-8">
            <div className="flex flex-col gap-6 border-b border-black/10 pb-6 md:flex-row md:items-end md:justify-between">
              <div>
                {kicker ? (
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-black/45">
                    {kicker}
                  </p>
                ) : null}
                <h2 className="mt-3 font-serif text-5xl leading-none">{header}</h2>
              </div>
              {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
            </div>

            <div className="mt-8">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}
