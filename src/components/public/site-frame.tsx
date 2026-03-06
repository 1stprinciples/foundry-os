import Link from "next/link";
import type { ReactNode } from "react";

type SiteFrameProps = {
  children: ReactNode;
};

const navItems = [
  { href: "/how-it-works", label: "How It Works" },
  { href: "/live", label: "Live" },
  { href: "/fund", label: "Fund" },
  { href: "/about", label: "About" },
];

export function SiteFrame({ children }: SiteFrameProps) {
  return (
    <div className="page-shell">
      <div className="page-shell__glow" />
      <div className="mx-auto flex min-h-screen w-full max-w-[1280px] flex-col px-4 pb-10 pt-4 sm:px-6 lg:px-10">
        <div className="terminal-strip">
          <span className="terminal-strip__dot" />
          <span>FOUND RY / PUBLIC TERMINAL</span>
          <span className="hidden text-neutral-500 md:inline">
            autonomous venture studio
          </span>
          <span className="hidden text-neutral-500 lg:inline">
            live systems, operating traces, public economics
          </span>
        </div>

        <header className="site-nav">
          <Link className="brand-mark" href="/">
            <span className="brand-mark__mono">F-OS</span>
            <span className="brand-mark__word">Foundry</span>
          </Link>

          <nav className="nav-collection">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link className="cta-secondary px-4 py-2" href="/login">
              Sign in
            </Link>
            <Link className="cta-primary px-4 py-2" href="/new">
              Start a company
            </Link>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="mt-16 border-t border-white/10 pt-6 text-sm text-neutral-400">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-neutral-500">
                Foundry OS
              </p>
              <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-300">
                Autonomous operators for founders who want businesses to keep
                moving after the meeting ends.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 text-neutral-300">
              <Link href="/privacy">Privacy</Link>
              <Link href="/terms">Terms</Link>
              <Link href="/live">Live Activity</Link>
              <a href="mailto:operators@foundryos.ai">operators@foundryos.ai</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
