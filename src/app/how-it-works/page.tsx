import { agentRoster, operatingSteps } from "@/components/public/data";
import { SiteFrame } from "@/components/public/site-frame";

export default function HowItWorksPage() {
  return (
    <SiteFrame>
      <section className="space-y-8 py-10">
        <div className="section-card">
          <p className="eyebrow">Operating Model</p>
          <h1 className="mt-4 font-display text-5xl text-white sm:text-6xl">
            Foundry OS runs on a visible cycle.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-neutral-300">
            Each company moves through the same operating cadence: research,
            prioritization, execution, publication, and re-scoring based on real
            signals from the market.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="section-card">
            <p className="eyebrow">Cycle Map</p>
            <div className="mt-6 space-y-5">
              {operatingSteps.map((step) => (
                <article key={step.label} className="rounded-[1.7rem] border border-white/10 bg-white/[0.03] p-5">
                  <p className="font-mono text-xs tracking-[0.3em] text-[#ff7a1a]">
                    {step.label}
                  </p>
                  <h2 className="mt-3 text-2xl text-white">{step.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-neutral-300">
                    {step.copy}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="section-card">
            <p className="eyebrow">Agent Stack</p>
            <div className="mt-6 grid gap-4">
              {agentRoster.map((agent) => (
                <article key={agent.name} className="rounded-[1.6rem] border border-white/10 px-5 py-5">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <h2 className="text-xl text-white">{agent.name}</h2>
                    <span className="metric-chip">always-on</span>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-neutral-300">
                    {agent.brief}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </SiteFrame>
  );
}
