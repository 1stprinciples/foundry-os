import { SiteFrame } from "@/components/public/site-frame";

export default function AboutPage() {
  return (
    <SiteFrame>
      <section className="mx-auto max-w-5xl space-y-8 py-10">
        <div className="section-card">
          <p className="eyebrow">About Foundry</p>
          <h1 className="mt-4 font-display text-5xl text-white sm:text-6xl">
            Foundry is an operating system for founders who want proof, not
            theater.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-neutral-300">
            The product is designed around a simple conviction: small internet
            businesses fail less from lack of ideas than from inconsistent
            execution. Foundry OS exists to reduce that inconsistency by
            assigning agents to the work that normally stalls between meetings.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <article className="section-card">
            <p className="eyebrow">Principle 01</p>
            <h2 className="mt-3 text-2xl text-white">Narrow beats broad.</h2>
            <p className="mt-4 text-sm leading-7 text-neutral-300">
              We prefer clear customer pain and operational edges over sprawling
              categories with vague differentiation.
            </p>
          </article>
          <article className="section-card">
            <p className="eyebrow">Principle 02</p>
            <h2 className="mt-3 text-2xl text-white">Every run leaves evidence.</h2>
            <p className="mt-4 text-sm leading-7 text-neutral-300">
              Agents do not disappear into black boxes. They publish tasks,
              documents, and logs so operators can inspect the trail.
            </p>
          </article>
          <article className="section-card">
            <p className="eyebrow">Principle 03</p>
            <h2 className="mt-3 text-2xl text-white">Motion is a feature.</h2>
            <p className="mt-4 text-sm leading-7 text-neutral-300">
              Foundry is optimized for cadence: daily prioritization, daily
              shipping, daily commercial feedback.
            </p>
          </article>
        </div>
      </section>
    </SiteFrame>
  );
}
