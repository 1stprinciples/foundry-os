"use client";

import { useEffect, useState } from "react";

import { formatCurrency, type LiveEvent } from "./data";

type LiveFeedProps = {
  initialEvents: LiveEvent[];
};

type StreamSnapshot = {
  arrUsd: number;
  companies: number;
  activeAgents: number;
};

function formatTimestamp(value: string) {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsed);
}

function formatStage(stage: string) {
  return stage.replaceAll("_", " ");
}

function normalizeStreamEvent(payload: Record<string, unknown>): LiveEvent {
  return {
    id: String(payload.id ?? ""),
    timestamp: formatTimestamp(String(payload.timestamp ?? "")),
    company: String(payload.companyLabel ?? "Foundry"),
    agent: String(payload.agentName ?? "Operator"),
    stage: formatStage(String(payload.stage ?? "execution")),
    headline: String(payload.message ?? "Execution update received."),
    detail: `${String(payload.agentName ?? "Operator")} logged a ${formatStage(
      String(payload.stage ?? "execution"),
    )} update for ${String(payload.companyLabel ?? "Foundry")}.`,
  };
}

export function LiveFeed({ initialEvents }: LiveFeedProps) {
  const [events, setEvents] = useState(initialEvents);
  const [connectionState, setConnectionState] = useState<
    "connecting" | "live" | "recovering"
  >("connecting");
  const [snapshot, setSnapshot] = useState<StreamSnapshot | null>(null);

  useEffect(() => {
    setEvents(initialEvents);
  }, [initialEvents]);

  useEffect(() => {
    const source = new EventSource("/api/public/live/stream");

    source.onopen = () => {
      setConnectionState("live");
    };

    source.onmessage = (event) => {
      const payload = JSON.parse(event.data) as Record<string, unknown>;

      if (payload.type === "execution_log") {
        const nextEvent = normalizeStreamEvent(payload);

        setEvents((current) => {
          if (current.some((item) => item.id && item.id === nextEvent.id)) {
            return current;
          }

          return [nextEvent, ...current].slice(0, 12);
        });
      }

      if (payload.type === "snapshot") {
        const stats =
          payload.stats && typeof payload.stats === "object"
            ? (payload.stats as Record<string, unknown>)
            : null;

        if (stats) {
          setSnapshot({
            arrUsd: Number(stats.arrUsd ?? 0),
            companies: Number(stats.companies ?? 0),
            activeAgents: Number(stats.activeAgents ?? 0),
          });
        }
      }
    };

    source.onerror = () => {
      setConnectionState("recovering");
    };

    return () => {
      source.close();
    };
  }, []);

  const active = events[0];
  const queue = events.slice(0, 8);

  if (!active) {
    return (
      <div className="section-card">
        <p className="eyebrow">Live feed</p>
        <h2 className="mt-3 font-display text-3xl text-white">
          Waiting for the next operating trace.
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-neutral-300">
          The stream endpoint is online, but no public events have been recorded yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.25fr_0.95fr]">
      <section className="section-card min-h-[420px]">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <p className="eyebrow">Current Trace</p>
            <h2 className="mt-3 font-display text-3xl text-white">
              {active.headline}
            </h2>
          </div>
          <div className="metric-chip">
            <span className="pulse-dot" />
            {connectionState === "live"
              ? "Streaming"
              : connectionState === "recovering"
                ? "Reconnecting"
                : "Connecting"}
          </div>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.7fr_1fr]">
          <div className="space-y-5">
            <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-neutral-500">
                Company
              </p>
              <p className="mt-2 text-lg font-medium text-white">
                {active.company}
              </p>
            </div>
            <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-neutral-500">
                Agent
              </p>
              <p className="mt-2 text-lg font-medium text-white">
                {active.agent}
              </p>
            </div>
            <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-neutral-500">
                Stage
              </p>
              <p className="mt-2 text-lg font-medium capitalize text-white">
                {formatStage(active.stage)}
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(140deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
            <div className="scan-sheen" />
            <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-neutral-500">
              Detail / {active.timestamp}
            </p>
            <p className="mt-5 max-w-xl text-lg leading-8 text-neutral-100">
              {active.detail}
            </p>
            <div className="mt-8 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <p className="text-xs uppercase tracking-[0.26em] text-neutral-500">
                  Live companies
                </p>
                <p className="mt-2 text-sm text-neutral-200">
                  {snapshot?.companies ?? "Updating"}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <p className="text-xs uppercase tracking-[0.26em] text-neutral-500">
                  Active agents
                </p>
                <p className="mt-2 text-sm text-neutral-200">
                  {snapshot?.activeAgents ?? "Updating"}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
                <p className="text-xs uppercase tracking-[0.26em] text-neutral-500">
                  Portfolio ARR
                </p>
                <p className="mt-2 text-sm text-neutral-200">
                  {snapshot ? formatCurrency(snapshot.arrUsd) : "Updating"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-card">
        <div className="border-b border-white/10 pb-5">
          <p className="eyebrow">Activity Queue</p>
          <h2 className="mt-3 font-display text-3xl text-white">
            Rolling event log
          </h2>
        </div>
        <div className="mt-6 space-y-3">
          {queue.map((event, index) => (
            <article
              key={event.id ?? `${event.company}-${event.timestamp}`}
              className={`rounded-[1.5rem] border px-4 py-4 transition duration-500 ${
                index === 0
                  ? "border-[#ff7a1a]/60 bg-[#ff7a1a]/10"
                  : "border-white/10 bg-white/[0.03]"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-white">
                    {event.company}
                  </p>
                  <p className="mt-1 text-sm text-neutral-300">
                    {event.headline}
                  </p>
                </div>
                <span className="font-mono text-xs tracking-[0.28em] text-neutral-500">
                  {event.timestamp}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs uppercase tracking-[0.24em] text-neutral-400">
                <span>{event.agent}</span>
                <span>/</span>
                <span>{formatStage(event.stage)}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
