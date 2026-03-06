import Link from "next/link";
import { SiteFrame } from "@/components/public/site-frame";

const paths = [
  {
    title: "Create a new company",
    copy:
      "Start with a raw thesis and let Foundry OS frame the market, define the offer, and generate the first operating cycle.",
    href: "/login?intent=new-company",
    note: "Best for zero-to-one launches",
  },
  {
    title: "Grow an existing business",
    copy:
      "Bring a business that already has customers, workflows, or channels and let the agents harden operations and accelerate growth.",
    href: "/login?intent=grow-company",
    note: "Best for active operators",
  },
];

export default function NewPage() {
  return (
    <SiteFrame>
      <section className="mx-auto max-w-5xl space-y-8 py-10">
        <div className="section-card">
          <p className="eyebrow">Quickstart</p>
          <h1 className="mt-4 font-display text-5xl text-white sm:text-6xl">
            Choose how you want Foundry to operate.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-neutral-300">
            Both paths land in the same operating system. The difference is how
            much of the company the agents need to synthesize from scratch.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {paths.map((path) => (
            <article key={path.title} className="section-card flex flex-col justify-between gap-8">
              <div>
                <p className="eyebrow">{path.note}</p>
                <h2 className="mt-4 font-display text-4xl text-white">
                  {path.title}
                </h2>
                <p className="mt-5 text-base leading-8 text-neutral-300">
                  {path.copy}
                </p>
              </div>
              <Link className="cta-primary w-full justify-center px-5 py-4" href={path.href}>
                Continue
              </Link>
            </article>
          ))}
        </div>
      </section>
    </SiteFrame>
  );
}
