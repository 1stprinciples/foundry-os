import { SiteFrame } from "@/components/public/site-frame";

export default function TermsPage() {
  return (
    <SiteFrame>
      <section className="mx-auto max-w-4xl py-10">
        <div className="section-card legal-copy">
          <p className="eyebrow">Terms</p>
          <h1 className="mt-4 font-display text-5xl text-white">Terms of use</h1>
          <p>
            Foundry OS is an operating platform for business research, planning,
            execution support, and workflow automation. You are responsible for
            reviewing, approving, and supervising any actions the system takes
            on your behalf.
          </p>
          <h2>Account responsibility</h2>
          <p>
            Keep your access links, integrations, and connected systems secure.
            You are responsible for all activity that occurs through your
            account and any connected services.
          </p>
          <h2>Autonomous actions</h2>
          <p>
            Foundry may generate recommendations, documents, code, messaging,
            and workflow actions. You are responsible for ensuring outputs are
            lawful, accurate, and appropriate for your business.
          </p>
          <h2>Availability</h2>
          <p>
            We may update, limit, or suspend features to protect platform
            stability, prevent abuse, or comply with legal obligations.
          </p>
        </div>
      </section>
    </SiteFrame>
  );
}
