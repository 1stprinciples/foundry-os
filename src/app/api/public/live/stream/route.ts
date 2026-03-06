import { buildPublicDashboard } from "@/lib/public";
import { readState } from "@/lib/store";

export const dynamic = "force-dynamic";

function sse(payload: unknown) {
  return `data: ${JSON.stringify(payload)}\n\n`;
}

export async function GET() {
  const encoder = new TextEncoder();
  let interval: ReturnType<typeof setInterval> | undefined;
  let lastSeenIds = new Set<string>();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (payload: unknown) => {
        controller.enqueue(encoder.encode(sse(payload)));
      };
      const push = async () => {
        try {
          const dashboard = buildPublicDashboard(await readState());
          const recentLogs = dashboard.logs.slice(0, 8);
          const unseenLogs = recentLogs
            .filter((log) => !lastSeenIds.has(log.id))
            .reverse();

          unseenLogs.forEach((log) => {
            send({
              type: "execution_log",
              id: log.id,
              companyLabel: log.companyLabel,
              timestamp: log.timestamp,
              stage: log.stage,
              level: log.level,
              agentName: log.agentName,
              message: log.message,
            });
          });

          lastSeenIds = new Set(recentLogs.map((log) => log.id));
          send({
            type: "snapshot",
            stats: dashboard.stats,
            companies: dashboard.companies.slice(0, 4),
            dailyMetrics: dashboard.dailyMetrics,
          });
        } catch {
          send({
            type: "heartbeat",
            status: "stalled",
          });
        }
      };

      send({ type: "connected", brand: "Foundry OS" });
      await push();

      interval = setInterval(() => {
        void push();
      }, 4000);
    },
    cancel() {
      if (interval) {
        clearInterval(interval);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
